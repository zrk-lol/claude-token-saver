# Règles pour économiser les tokens

- Lis `.claude/CONTEXT.md` avant d'explorer le projet. Régénère-le avec `npx ctxpack` si la structure a changé.
- Cherche (Grep/Glob) avant de lire. Lis seulement les lignes utiles.
- Ne lis jamais : `node_modules/`, `dist/`, `build/`, lockfiles, fichiers minifiés, images.
- Limite les sorties de commandes : `| tail -n 40`, tests en mode silencieux.
- Modifie par petits remplacements, pas en réécrivant les fichiers.
- Réponses courtes : ce qui a changé et ce qui reste. Pas de code recopié inutilement.
- Plan court validé avant toute tâche de plus de 3 étapes.
