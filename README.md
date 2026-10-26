# claude-token-saver

**Consomme jusqu'à 30× moins de tokens au début de chaque session Claude Code.**

Au lieu de laisser Claude explorer ton projet fichier par fichier, `ctxpack` génère une carte compacte (`.claude/CONTEXT.md`) : la liste des fichiers, ce que chacun exporte, les scripts, et les fichiers lourds à éviter. Claude lit cette carte, puis seulement ce dont il a besoin.

<p>
<img src="https://img.shields.io/badge/node-%3E%3D18-e10600?style=flat-square&labelColor=111111" />
<img src="https://img.shields.io/badge/dépendances-0-e10600?style=flat-square&labelColor=111111" />
<img src="https://img.shields.io/badge/licence-MIT-9a9aa4?style=flat-square&labelColor=111111" />
</p>

## Exemple réel

| | Tokens |
|---|--:|
| Lire tout un petit projet Remotion (11 fichiers) | ~17 200 |
| Lire la carte `.claude/CONTEXT.md` générée par ctxpack | **~520** |

## Ce qu'il y a dans ce repo

| Élément | Rôle |
|---|---|
| [`bin/ctxpack.mjs`](bin/ctxpack.mjs) | Le générateur de carte, sans dépendance |
| [`skills/economie-tokens`](skills/economie-tokens/SKILL.md) | Un skill qui apprend à Claude à lire ciblé, répondre court et planifier |
| [`templates/CLAUDE.md`](templates/CLAUDE.md) | 7 règles à coller dans le `CLAUDE.md` de ton projet |
| [`templates/settings.json`](templates/settings.json) | Bloque la lecture de `node_modules`, `dist`, lockfiles… |

## Installation (2 minutes)

**1. Générer la carte du projet**

```bash
npx github:zrk-lol/claude-token-saver
```

ou, après un `git clone` :

```bash
node chemin/vers/claude-token-saver/bin/ctxpack.mjs .
```

Options : `--out fichier.md`, `--max-files 400`, `--stdout`.

**2. Installer le skill**

```bash
mkdir -p ~/.claude/skills
cp -r skills/economie-tokens ~/.claude/skills/
```

**3. Ajouter les règles et les blocages**

- Colle le contenu de `templates/CLAUDE.md` dans le `CLAUDE.md` à la racine de ton projet.
- Fusionne `templates/settings.json` dans `.claude/settings.json` de ton projet.

## Les habitudes qui font la plus grosse différence

| Habitude | Pourquoi |
|---|---|
| Commencer par `.claude/CONTEXT.md` | Claude s'oriente en lisant un seul petit fichier |
| Chercher (Grep) avant de lire | On lit 20 lignes au lieu de 800 |
| Limiter les sorties (`| tail -n 40`) | Un log de 300 lignes remplit le contexte pour rien |
| Petites modifications ciblées | Réécrire un fichier entier coûte deux fois : lecture et écriture |
| `/compact` quand la session s'allonge | Garde l'essentiel, libère le reste |
| Une nouvelle session par tâche | Le contexte d'une ancienne tâche ne sert à rien à la suivante |

---

Fait par **[Varhex by Ȥrk Team](https://varhex.com)** · [Discord](https://discord.gg/4qRhB4c5me) · [TikTok](https://www.tiktok.com/@vertex.code.zrk)

Voir aussi : [claude-skills-anti-ia](https://github.com/zrk-lol/claude-skills-anti-ia) pour des sites qui ne sentent pas l'IA.
