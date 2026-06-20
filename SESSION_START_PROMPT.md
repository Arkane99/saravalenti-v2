# Session Start — Sara Valenti V2

Tu démarres une session de travail sur **Sara Valenti V2** (`~/Documents/saravalenti-v2`).
Avant toute réponse, toute question, tout code : lis les fichiers ci-dessous dans l'ordre.

---

## ÉTAPE 1 — Lecture obligatoire (toujours)

Lis ces deux fichiers maintenant, dans cet ordre :

1. `CLAUDE.md` — résumé opérationnel du projet, stack, routes, règles non négociables
2. `docs/ETAT.md` — état d'avancement inter-sessions (fait / en cours / blocages)

## ÉTAPE 2 — Lecture conditionnelle selon la tâche

Après avoir compris la tâche de la session, lis les fichiers correspondants :

| Si la tâche concerne… | Lis avant de commencer |
|-----------------------|------------------------|
| UI / composant / section visuelle | `DESIGN_RULES.md` + `SARA_VALENTI_DESIGN.md` |
| Texte / contenu / copywriting | `COPYWRITING_RULES.md` + `BRAND_VOICE.md` |
| SEO / balises meta / schema.org | `SEARCH_RULES.md` |
| Auth / API / webhook / sécurité | `SECURITY_RULES.md` |
| E-commerce / conversion / pricing / emails | `ECOMMERCE_STRATEGY.md` |
| Nouveau composant React | `COMPONENT_LIBRARY.md` |
| Tout commit / mise en prod | `END_OF_SESSION_CHECKLIST.md` |

---

## ÉTAPE 3 — Annonce obligatoire

Après les lectures, réponds avec ce bloc exact (complété) :

```
J'ai lu : [liste des fichiers lus]

État du projet :
[2-4 lignes résumant ce que tu as compris de docs/ETAT.md —
 ce qui est fait, ce qui est en cours, les blocages éventuels]

Plan de la session :
1. [première action]
2. [deuxième action]
...

Risques identifiés :
- [risque 1 ou "Aucun risque identifié"]
```

---

## RÈGLES ABSOLUES (rappel — toujours actives)

Ces règles s'appliquent sans exception, quelle que soit la tâche :

- **Jamais de tiret cadratin** (`—`) dans le code ou les contenus texte du site. Utiliser `-` ou `,`.
- **Jamais de secret en `NEXT_PUBLIC_`** — les variables d'environnement sensibles restent côté serveur.
- **Build vert avant chaque commit** — `npm run build` doit passer sans erreur.
- **Commit atomique par feature** — un commit = une chose. Pas de "fix divers".
- **Jamais toucher au repo V1** — `~/saravalenti` (WooCommerce live) est en lecture seule. Ne pas modifier, ne pas déployer.
- **Vérifier le répertoire de travail** — toujours confirmer qu'on est dans `~/Documents/saravalenti-v2` avant tout `git` ou `npm`.
- **RLS Supabase sur toutes les tables sensibles** — vérifier avant tout ajout de table.
- **Ne jamais mentionner "cuir pleine fleur"** dans les contenus.
- **Ne pas renommer les photos** dans `/public/images/produits/`.

---

## ÉTAPE 4 — Question

Une fois les lectures faites et l'annonce écrite :

> **Quelle est la tâche de cette session ?**
