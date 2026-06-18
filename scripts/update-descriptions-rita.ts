/**
 * Met à jour les descriptions_courte des 5 variantes Rita dans Sanity.
 * Usage : npx tsx --env-file=.env.local scripts/update-descriptions-rita.ts
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID ?? 'r949oibi',
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const DESCRIPTIONS: Record<string, string> = {
  'Noir':
    "Le Rita Noir est la version la plus polyvalente de la gamme. Cuir brossé noir intense qui s'accorde à toutes les tenues, du quotidien au soir. La patine qui se développe avec l'usage lui donne un caractère que les sacs synthétiques n'auront jamais.",
  'Camel':
    "Le Rita Camel est la teinte signature de la gamme. Le cuir brossé camel capte la lumière et révèle les nuances chaudes du cuir naturel à chaque utilisation. Une couleur qui vieillit mieux que toutes les autres.",
  'Bleu Marine':
    "Le Rita Bleu Marine est l'alternative au noir pour celles qui cherchent une couleur profonde sans être classique. Sobre en journée, il prend une dimension différente le soir sous la lumière artificielle.",
  'Chocolat':
    "Le Rita Chocolat est la teinte la plus chaleureuse de la gamme. Le brun profond du cuir brossé s'accorde naturellement aux tons neutres et aux matières naturelles. Un choix durable qui ne se démode pas.",
  'Taupe':
    "Le Rita Taupe est la couleur la plus discrète de la gamme, et souvent la plus remarquée. Entre le gris et le beige, le taupe s'accorde à tout sans jamais s'imposer. La teinte des vraies minimalistes.",
}

async function main() {
  const produit = await client.fetch<{
    _id: string
    variantes: Array<{ _key: string; couleur: string }>
  } | null>(`*[_type == "produit" && slug.current == "rita"][0]{ _id, variantes[]{ _key, couleur } }`)

  if (!produit) {
    console.error('Produit rita non trouvé.')
    process.exit(1)
  }

  console.log(`Produit rita trouvé : ${produit._id}`)

  for (const variante of produit.variantes) {
    const description = DESCRIPTIONS[variante.couleur]
    if (!description) {
      console.log(`  ~ ${variante.couleur} : pas de description définie, ignoré`)
      continue
    }
    await client
      .patch(produit._id)
      .set({ [`variantes[_key=="${variante._key}"].description_courte`]: description })
      .commit()
    console.log(`  ✓ ${variante.couleur} : description mise à jour`)
  }

  console.log('\nTerminé.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
