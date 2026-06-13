/**
 * Couleur (nom FR) -> hex pour les swatches.
 * Les cles sont sans accent ; on teste les libelles composes (ex. "vert sapin",
 * "bleu marine", "leopard") AVANT les couleurs de base pour eviter les faux positifs
 * du type "noir leopard" -> noir.
 */
const PALETTE: Array<[string, string]> = [
  ['bleu marine', '#1f2a44'],
  ['vert sapin', '#1f3d2e'],
  ['leopard', '#b98a3e'],
  ['marine', '#1f2a44'],
  ['bordeaux', '#5e2129'],
  ['chocolat', '#4a3228'],
  ['turquoise', '#1aa5a0'],
  ['cognac', '#9a5b2e'],
  ['argente', '#c0c0c0'],
  ['prune', '#5a2a4a'],
  ['taupe', '#8b8178'],
  ['camel', '#c19a6b'],
  ['beige', '#d8c4a8'],
  ['kaki', '#6b6840'],
  ['moka', '#6f4e37'],
  ['dore', '#c5a253'],
  ['ocre', '#cc7722'],
  ['noir', '#0a0a0a'],
]

export function hexCouleur(nom: string): string {
  const n = nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
  for (const [cle, hex] of PALETTE) {
    if (n.includes(cle)) return hex
  }
  return '#cccccc'
}
