/**
 * Import des produits WooCommerce vers Sanity.
 *
 * Source : data/wc-product-export-8-6-2026.csv (136 produits dont 88 sacs).
 * Regroupe les produits "simple" (1 couleur chacun) en modeles avec variantes.
 *
 * Usage :
 *   npm run import:dry   -> valide parsing + regroupement, ecrit data/import-preview.json
 *   npm run import:run   -> importe dans Sanity (exige NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_API_TOKEN)
 */

import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'

const RACINE = path.resolve(__dirname, '..')
const CSV = path.join(RACINE, 'data', 'wc-product-export-8-6-2026.csv')
const DOSSIER_PHOTOS = path.join(RACINE, 'public', 'images', 'produits')
const PREVIEW = path.join(RACINE, 'data', 'import-preview.json')

const DRY_RUN = process.argv.includes('--dry-run')

// Modeles qui ont une page Gamme dediee
const PAGES_GAMME = new Set(['rita', 'grazia', 'mina'])

// Types decides a la main quand le CSV ne permet pas de les deduire
const TYPE_PAR_MODELE: Record<string, string> = {
  mina: 'Sac porté épaule',
}

// Sous-categorie Woo -> type de sac (libelles du brief)
const TYPES: Record<string, string> = {
  'Sacs à main': 'Sac à main',
  'Sacs à bandoulière': 'Sac à bandoulière',
  'Sacs à dos': 'Sac à dos',
  'Bananes': 'Banane',
  'Sacoches': 'Sacoche',
  'Sacs sceau': 'Sac sceau',
  'Sacs seau': 'Sac sceau',
  'Sacs multipoche': 'Sac multipoche',
  'Sacs à rabat': 'Sac à rabat',
  'Sacs portés épaule': 'Sac porté épaule',
  'Sacs convertibles': 'Sac convertible',
  'Sacs à franges': 'Sac à franges',
  'Sacs de rentrée': 'Sac de rentrée',
  'Porte-monnaie': 'Porte-monnaie',
}

// ---------------------------------------------------------------------------
// Lecture CSV
// ---------------------------------------------------------------------------

/** Normalise un en-tete : nbsp -> espace, apostrophe courbe -> droite, trim. */
function normaliserCle(k: string): string {
  return k.replace(/ /g, ' ').replace(/’/g, "'").replace(/\s+/g, ' ').trim()
}

type Ligne = Record<string, string>

function lireCsv(): Ligne[] {
  const brut = parse(fs.readFileSync(CSV, 'utf-8'), {
    columns: (header: string[]) => header.map(normaliserCle),
    bom: true,
    skip_empty_lines: true,
    // les exports Woo ont parfois des lignes plus courtes que l'en-tete
    relax_column_count: true,
  }) as Ligne[]
  return brut
}

// ---------------------------------------------------------------------------
// Extraction des champs
// ---------------------------------------------------------------------------

/** "Sac à main "Rita" noir en cuir brossé" -> "Rita" (guillemets droits, courbes ou chevrons). */
function extraireModele(nom: string): string | null {
  const m = nom.match(/["“«]\s*([^"“”«»]+?)\s*["”»]/)
  return m ? m[1].trim() : null
}

function nombre(v: string | undefined): number | undefined {
  if (!v) return undefined
  const n = parseFloat(v.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

/** Attributs Woo : colonnes "Nom de l'attribut N" / "Valeur(s) de l'attribut N". */
function extraireAttributs(r: Ligne): { couleur?: string; matiere?: string } {
  const sortie: { couleur?: string; matiere?: string } = {}
  for (let i = 1; i <= 4; i++) {
    const nom = (r[`Nom de l'attribut ${i}`] || '').toLowerCase()
    const valeur = (r[`Valeur(s) de l'attribut ${i}`] || '').trim()
    if (!nom || !valeur) continue
    if (nom.includes('couleur')) sortie.couleur = valeur
    if (nom.includes('mati')) sortie.matiere = valeur
  }
  return sortie
}

/** Fallback : retrouve la couleur dans le nom du produit quand l'attribut Woo manque. */
const COULEURS_CONNUES: Array<[RegExp, string]> = [
  [/bleu marine|marine/i, 'Bleu marine'],
  [/vert sapin/i, 'Vert sapin'],
  [/noir léopard/i, 'Noir léopard'],
  [/léopard/i, 'Léopard'],
  [/bordeaux/i, 'Bordeaux'],
  [/chocolat/i, 'Chocolat'],
  [/turquoise/i, 'Turquoise'],
  [/argenté/i, 'Argenté'],
  [/cognac/i, 'Cognac'],
  [/taupe/i, 'Taupe'],
  [/camel/i, 'Camel'],
  [/beige/i, 'Beige'],
  [/prune/i, 'Prune'],
  [/kaki/i, 'Kaki'],
  [/moka/i, 'Moka'],
  [/doré/i, 'Doré'],
  [/ocre/i, 'Ocre'],
  [/noire?/i, 'Noir'],
]

function couleurDepuisNom(nom: string): string | undefined {
  for (const [re, libelle] of COULEURS_CONNUES) {
    if (re.test(nom)) return libelle
  }
  return undefined
}

/** Type de sac depuis le debut du nom ('Banane double "Lila"...' -> Banane). */
const TYPES_DEPUIS_NOM: Array<[RegExp, string]> = [
  [/^sac à main/i, 'Sac à main'],
  [/^sac à bandoulière/i, 'Sac à bandoulière'],
  [/^sac à dos/i, 'Sac à dos'],
  [/^banane/i, 'Banane'],
  [/^sacoche/i, 'Sacoche'],
  [/^sac s(c)?eau/i, 'Sac sceau'],
  [/^sac multipoche/i, 'Sac multipoche'],
  [/^sac à rabat/i, 'Sac à rabat'],
  [/^sac porté épaule/i, 'Sac porté épaule'],
  [/^sac convertible/i, 'Sac convertible'],
  [/^porte-monnaie/i, 'Porte-monnaie'],
]

function typeDepuisNom(nom: string): string | null {
  for (const [re, libelle] of TYPES_DEPUIS_NOM) {
    if (re.test(nom.trim())) return libelle
  }
  return null
}

function extraireType(categories: string): string | null {
  for (const cat of categories.split(',').map((c) => c.trim())) {
    const segments = cat.split('>').map((s) => s.trim())
    if (segments[0] !== 'Sacs en cuir' || segments.length < 2) continue
    const sous = segments[1]
    if (TYPES[sous]) return TYPES[sous]
  }
  return null
}

/** URLs de la colonne Images -> noms de fichiers locaux existants (sans les renommer). */
function extrairePhotos(images: string, manquantes: string[]): string[] {
  const fichiers: string[] = []
  for (const url of images.split(',').map((u) => u.trim()).filter(Boolean)) {
    const base = decodeURIComponent(url.split('/').pop() || '')
    if (!base) continue
    if (fs.existsSync(path.join(DOSSIER_PHOTOS, base))) fichiers.push(base)
    else manquantes.push(base)
  }
  return fichiers
}

// ---------------------------------------------------------------------------
// HTML WooCommerce -> Portable Text (volontairement minimal : p, br, strong, em, li)
// ---------------------------------------------------------------------------

type Span = { _type: 'span'; text: string; marks: string[] }
type Bloc = { _type: 'block'; _key: string; style: 'normal'; listItem?: 'bullet'; level?: number; markDefs: never[]; children: Span[] }

let compteurCle = 0
function cle(): string {
  compteurCle += 1
  return `k${compteurCle.toString(36).padStart(6, '0')}`
}

function decoderEntites(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
}

/** Decoupe un fragment HTML inline en spans avec marks strong/em. */
function versSpans(html: string): Span[] {
  const spans: Span[] = []
  const re = /<(strong|b|em|i)>([\s\S]*?)<\/\1>|([^<]+)|<[^>]+>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    if (m[1] && m[2] !== undefined) {
      const mark = m[1] === 'strong' || m[1] === 'b' ? 'strong' : 'em'
      const texte = decoderEntites(m[2].replace(/<[^>]+>/g, ''))
      if (texte.trim()) spans.push({ _type: 'span', text: texte, marks: [mark] })
    } else if (m[3]) {
      const texte = decoderEntites(m[3])
      if (texte.trim()) spans.push({ _type: 'span', text: texte, marks: [] })
    }
  }
  return spans
}

function supprimerEmojis(s: string): string {
  // Supplementary Multilingual Plane (emojis, drapeaux, symboles)
  return s
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')
    .replace(/[☀-➿]/g, '')   // misc symbols (✨ etc.)
    .replace(/[︀-﻿]/g, '')   // variation selectors
    .replace(/‍/g, '')            // zero-width joiner
}

export function htmlVersPortableText(html: string): Bloc[] {
  if (!html || !html.trim()) return []
  const blocs: Bloc[] = []
  // Nettoyage : emojis + double sauts de ligne -> balise </p> pour forcer un bloc
  const htmlNettoye = supprimerEmojis(html)
    .replace(/\r/g, '')
    .replace(/\n\n+/g, '</p>')
    .replace(/\n/g, ' ')
  // Les <li> deviennent des blocs liste ; le reste est decoupe sur <p> et <br>
  const morceaux = htmlNettoye
    .split(/<\/p>|<\/li>|<br\s*\/?\s*>/i)
    .map((c) => c.trim())
    .filter(Boolean)
  for (const morceau of morceaux) {
    const estListe = /<li[\s>]/i.test(morceau)
    const inline = morceau.replace(/<(p|li|ul|ol)[^>]*>/gi, '')
    const children = versSpans(inline)
    if (!children.length) continue
    blocs.push({
      _type: 'block',
      _key: cle(),
      style: 'normal',
      ...(estListe ? { listItem: 'bullet' as const, level: 1 } : {}),
      markDefs: [],
      children,
    })
  }
  return blocs
}

// ---------------------------------------------------------------------------
// Regroupement par modele
// ---------------------------------------------------------------------------

interface Variante {
  couleur: string
  description_courte?: string
  matiere?: string
  prix?: number
  promo?: number
  stock: number
  reappro: boolean
  photos: string[]
  sku: string
  poids?: number
  dimensions?: { longueur?: number; largeur?: number; hauteur?: number }
}

interface Modele {
  nom: string
  slug: string
  type: string | null
  description_courte: string
  description_html: string
  variantes: Variante[]
  est_page_gamme: boolean
  gamme?: string
}

function slugifier(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface Anomalies {
  sansModele: string[]
  sansCouleur: string[]
  photosManquantes: string[]
  typesInconnus: string[]
}

function regrouper(lignes: Ligne[]): { modeles: Modele[]; anomalies: Anomalies } {
  const anomalies: Anomalies = { sansModele: [], sansCouleur: [], photosManquantes: [], typesInconnus: [] }
  const sacs = lignes.filter((r) => (r['Catégories'] || '').includes('Sacs en cuir'))
  const parModele = new Map<string, Modele>()

  for (const r of sacs) {
    const nomComplet = (r['Nom'] || '').trim()
    let modele = extraireModele(nomComplet)
    if (!modele) {
      anomalies.sansModele.push(nomComplet)
      modele = nomComplet // produit unique sans guillemets : le nom complet devient le modele
    }

    const attrs = extraireAttributs(r)
    if (!attrs.couleur) {
      attrs.couleur = couleurDepuisNom(nomComplet)
      if (!attrs.couleur) anomalies.sansCouleur.push(nomComplet)
    }

    // Type : override manuel, sinon le debut du nom (fiable), sinon la sous-categorie Woo
    const type = TYPE_PAR_MODELE[slugifier(modele)] ?? typeDepuisNom(nomComplet) ?? extraireType(r['Catégories'] || '')
    if (!type) anomalies.typesInconnus.push(nomComplet)

    const enStock = (r['En stock ?'] || '').trim()
    const variante: Variante = {
      couleur: attrs.couleur || 'Unique',
      description_courte: (r['Description courte'] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || undefined,
      matiere: attrs.matiere,
      prix: nombre(r['Tarif régulier']),
      promo: nombre(r['Tarif promo']),
      stock: enStock === 'backorder' ? 0 : nombre(r['Stock']) ?? (enStock === '1' ? 1 : 0),
      reappro: enStock === 'backorder',
      photos: extrairePhotos(r['Images'] || '', anomalies.photosManquantes),
      sku: (r['UGS'] || '').trim(),
      poids: nombre(r['Poids (kg)']),
      dimensions: {
        longueur: nombre(r['Longueur (cm)']),
        largeur: nombre(r['Largeur (cm)']),
        hauteur: nombre(r['Hauteur (cm)']),
      },
    }

    const slug = slugifier(modele)
    const existant = parModele.get(slug)
    if (existant) {
      existant.variantes.push(variante)
      // garder la description la plus longue du groupe
      if ((r['Description'] || '').length > existant.description_html.length) {
        existant.description_html = r['Description'] || ''
      }
    } else {
      parModele.set(slug, {
        nom: modele,
        slug,
        type,
        description_courte: (r['Description courte'] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        description_html: r['Description'] || '',
        variantes: [variante],
        est_page_gamme: PAGES_GAMME.has(slug),
      })
    }
  }

  return { modeles: [...parModele.values()], anomalies }
}

/**
 * Ajustements de gamme (demande cliente) :
 * - Grazia mele cuir suede et cuir graine -> deux produits distincts au catalogue.
 *   "Grazia" (suede) garde le slug grazia + la page gamme ; "Grazia graine" -> grazia-graine,
 *   rattache a la gamme grazia.
 * - Grazita (petits Grazia en suede) reste un produit a part, rattache a la gamme grazia.
 */
function postTraiterGammes(modeles: Modele[]): Modele[] {
  const grazia = modeles.find((m) => m.slug === 'grazia')
  if (grazia) {
    const estGraine = (v: Variante) => (v.matiere || '').toLowerCase().includes('grain')
    const graine = grazia.variantes.filter(estGraine)
    const suede = grazia.variantes.filter((v) => !estGraine(v))
    if (graine.length && suede.length) {
      grazia.variantes = suede
      modeles.push({
        nom: 'Grazia grainé',
        slug: 'grazia-graine',
        type: grazia.type,
        description_courte: grazia.description_courte,
        description_html: grazia.description_html,
        variantes: graine,
        est_page_gamme: false,
        gamme: 'grazia',
      })
    }
  }
  const grazita = modeles.find((m) => m.slug === 'grazita')
  if (grazita) grazita.gamme = 'grazia'
  return modeles
}

// ---------------------------------------------------------------------------
// Import Sanity (mode reel)
// ---------------------------------------------------------------------------

async function importerDansSanity(modeles: Modele[]) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_TOKEN
  if (!projectId || !token) {
    console.error('NEXT_PUBLIC_SANITY_PROJECT_ID et SANITY_API_TOKEN requis (voir .env.example). Utiliser --dry-run sinon.')
    process.exit(1)
  }
  const { createClient } = await import('next-sanity')
  const client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-06-01',
    token,
    useCdn: false,
  })

  // 1. Types de sac
  const types = [...new Set(modeles.map((m) => m.type).filter(Boolean))] as string[]
  const refTypes = new Map<string, string>()
  for (const t of types) {
    const id = `typeDeSac-${slugifier(t)}`
    await client.createOrReplace({ _id: id, _type: 'typeDeSac', nom: t, slug: { current: slugifier(t) } })
    refTypes.set(t, id)
    console.log(`type: ${t}`)
  }

  // 2. Upload des photos (cache par nom de fichier pour ne jamais uploader 2 fois)
  const assets = new Map<string, string>()
  async function uploader(fichier: string): Promise<string> {
    const connu = assets.get(fichier)
    if (connu) return connu
    // Reutiliser un asset deja present (re-import idempotent : pas de doublons de photos)
    const existant: string | null = await client.fetch(
      '*[_type=="sanity.imageAsset" && originalFilename==$f][0]._id',
      { f: fichier },
    )
    if (existant) {
      assets.set(fichier, existant)
      return existant
    }
    const asset = await client.assets.upload('image', fs.createReadStream(path.join(DOSSIER_PHOTOS, fichier)), {
      filename: fichier,
    })
    assets.set(fichier, asset._id)
    return asset._id
  }

  // 3. Produits
  for (const m of modeles) {
    const variantes = []
    for (const v of m.variantes) {
      const photos = []
      for (const f of v.photos) {
        photos.push({ _type: 'image', _key: cle(), asset: { _type: 'reference', _ref: await uploader(f) } })
      }
      variantes.push({ _type: 'variante', _key: cle(), ...v, photos })
    }
    await client.createOrReplace({
      _id: `produit-${m.slug}`,
      _type: 'produit',
      nom: m.nom,
      slug: { current: m.slug },
      ...(m.type ? { type: { _type: 'reference', _ref: refTypes.get(m.type) } } : {}),
      description_courte: m.description_courte,
      description: htmlVersPortableText(m.description_html),
      variantes,
      est_page_gamme: m.est_page_gamme,
      ...(m.gamme ? { gamme: m.gamme } : {}),
      date_creation: new Date().toISOString(),
    })
    console.log(`produit: ${m.nom} (${m.variantes.length} variante(s))`)
  }
  console.log(`\nImport termine : ${modeles.length} modeles, ${assets.size} photos uploadees.`)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const lignes = lireCsv()
  const { modeles, anomalies } = regrouper(lignes)
  postTraiterGammes(modeles)

  const totalVariantes = modeles.reduce((n, m) => n + m.variantes.length, 0)
  const totalPhotos = modeles.reduce((n, m) => n + m.variantes.reduce((p, v) => p + v.photos.length, 0), 0)

  console.log(`CSV          : ${lignes.length} lignes, ${totalVariantes} sacs retenus`)
  console.log(`Modeles      : ${modeles.length}`)
  console.log(`Photos liees : ${totalPhotos} (manquantes en local : ${anomalies.photosManquantes.length})`)
  console.log(`Pages gamme  : ${modeles.filter((m) => m.est_page_gamme).map((m) => m.nom).join(', ')}`)
  console.log('\nModeles (variantes) :')
  for (const m of [...modeles].sort((a, b) => b.variantes.length - a.variantes.length)) {
    console.log(`  ${m.nom.padEnd(14)} ${String(m.variantes.length).padStart(2)}  ${m.type ?? 'TYPE ?'}  ${m.variantes.map((v) => v.couleur).join(', ')}`)
  }
  if (anomalies.sansModele.length) console.log('\nSans guillemets (traites comme produits uniques) :', anomalies.sansModele)
  if (anomalies.sansCouleur.length) console.log('Sans attribut couleur :', anomalies.sansCouleur)
  if (anomalies.typesInconnus.length) console.log('Categories sans type mappe :', [...new Set(anomalies.typesInconnus)])
  if (anomalies.photosManquantes.length) console.log('Photos manquantes (extraits) :', anomalies.photosManquantes.slice(0, 8))

  if (DRY_RUN) {
    const apercu = modeles.map((m) => ({
      ...m,
      description_html: m.description_html.slice(0, 160),
    }))
    fs.writeFileSync(PREVIEW, JSON.stringify({ resume: { modeles: modeles.length, variantes: totalVariantes, photos: totalPhotos }, anomalies, modeles: apercu }, null, 2))
    console.log(`\nDry-run : apercu ecrit dans ${path.relative(RACINE, PREVIEW)}. Rien n'a ete importe.`)
    return
  }

  await importerDansSanity(modeles)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
