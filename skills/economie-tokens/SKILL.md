---
name: economie-tokens
description: Travailler sur un projet en consommant le moins de tokens possible : lire peu et ciblé, répondre court, éviter les allers-retours inutiles. À utiliser dans toutes les sessions Claude Code sur un projet existant, surtout quand l'utilisateur parle de limite d'usage, de quota, de contexte plein ou de coût, ou quand un fichier .claude/CONTEXT.md existe.
---

# Économie de tokens

Chaque fichier lu, chaque sortie de commande et chaque réponse longue remplit le contexte. Un contexte plein coûte plus cher, ralentit, et fait oublier le début de la conversation. Le but : obtenir le même résultat avec moins de lecture et moins d'écriture.

## Lire

1. **Commence par la carte.** Si `.claude/CONTEXT.md` existe, lis-le en premier et uniquement lui pour t'orienter. Sinon, propose de lancer `npx ctxpack` une fois.
2. **Cherche avant de lire.** Utilise la recherche (Grep/Glob) pour trouver la ligne exacte, puis lis seulement la zone concernée (offset/limit), pas le fichier entier.
3. **Ne relis jamais** un fichier déjà lu dans la session s'il n'a pas changé.
4. **Ne lis pas** les fichiers générés : lockfiles, `dist/`, `build/`, fichiers minifiés, données, images.
5. **Sorties de commandes :** limite-les (`| tail -n 40`, `--silent`, `--reporter=dot`). Un test qui passe n'a pas besoin de 300 lignes de log.

## Écrire

- Modifie avec des remplacements ciblés, jamais en réécrivant un fichier entier pour changer trois lignes.
- Ne recopie pas de code dans la réponse s'il est déjà dans le fichier : donne le chemin et la ligne.
- Réponses courtes : ce qui a changé, ce qui reste à faire. Pas de résumé de ce que l'utilisateur vient de dire.

## Planifier

- Pour une tâche de plus de 3 étapes, écris un plan court d'abord et fais-le valider : ça évite de coder dans la mauvaise direction.
- Regroupe les actions indépendantes dans un même tour (plusieurs recherches à la fois).
- Si la conversation devient longue, propose `/compact` avec un résumé de ce qu'il faut garder, ou une nouvelle session avec un brief de 10 lignes.

## Signaux d'alerte

Arrête-toi et change d'approche si :
- tu as lu plus de 5 fichiers sans avoir encore modifié quoi que ce soit ;
- une commande renvoie plus de 200 lignes ;
- tu t'apprêtes à lire un fichier de plus de 1 000 lignes en entier.
