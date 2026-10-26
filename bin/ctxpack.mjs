#!/usr/bin/env node
// ctxpack — builds a compact map of a project so Claude reads one small file
// instead of exploring the whole codebase. No dependencies.
import {readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {join, relative, extname} from 'node:path';

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) ?? '.';
const out = valueOf('--out') ?? join(root, '.claude', 'CONTEXT.md');
const maxFiles = Number(valueOf('--max-files') ?? 400);
const printOnly = args.includes('--stdout');

function valueOf(flag) {
	const i = args.indexOf(flag);
	return i >= 0 ? args[i + 1] : undefined;
}

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.turbo', '.cache', 'coverage', 'vendor', '__pycache__', '.venv', 'venv', 'target', '.idea', '.vscode']);
const IGNORED_FILES = /\.(lock|min\.js|map|png|jpe?g|gif|webp|avif|ico|svg|mp4|mp3|wav|woff2?|ttf|pdf|zip)$|^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb)$/i;
const CODE = new Set(['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.php', '.rb', '.java', '.cs', '.vue', '.svelte']);

// Lines that describe what a file exposes: exports, functions, classes, routes.
const SIGNATURES = [
	/^export\s+(default\s+)?(async\s+)?(function|class|const|let|interface|type|enum)\s+[\w$]+/,
	/^(async\s+)?function\s+[\w$]+\s*\(/,
	/^class\s+\w+/,
	/^def\s+\w+\s*\(/,
	/^(pub\s+)?(async\s+)?fn\s+\w+/,
	/^func\s+(\(\w+\s+\*?\w+\)\s+)?\w+/,
	/^\s*(app|router|server)\.(get|post|put|patch|delete)\(\s*['"`][^'"`]+/,
];

const gitignore = existsSync(join(root, '.gitignore'))
	? readFileSync(join(root, '.gitignore'), 'utf8').split('\n').map((l) => l.trim().replace(/^\/|\/$/g, '')).filter((l) => l && !l.startsWith('#') && !l.includes('*'))
	: [];

const files = [];
(function walk(dir) {
	for (const name of readdirSync(dir)) {
		const full = join(dir, name);
		const rel = relative(root, full).replace(/\\/g, '/');
		if (IGNORED_DIRS.has(name) || gitignore.includes(name) || gitignore.includes(rel)) continue;
		const st = statSync(full);
		if (st.isDirectory()) walk(full);
		else if (!IGNORED_FILES.test(name) && st.size < 500_000) files.push({rel, full, size: st.size});
		if (files.length >= maxFiles) return;
	}
})(root);

const estimate = (chars) => Math.round(chars / 4); // ~4 characters per token

let totalChars = 0;
const rows = [];
for (const f of files.sort((a, b) => a.rel.localeCompare(b.rel))) {
	const text = readFileSync(f.full, 'utf8');
	totalChars += text.length;
	const lines = text.split('\n');
	const sigs = CODE.has(extname(f.rel))
		? lines.map((l) => l.trimEnd()).filter((l) => SIGNATURES.some((re) => re.test(l))).map((l) => l.replace(/\s*\{\s*$/, '').slice(0, 110)).slice(0, 12)
		: [];
	rows.push({...f, lines: lines.length, tokens: estimate(text.length), sigs});
}

let scripts = '';
if (existsSync(join(root, 'package.json'))) {
	try {
		const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
		scripts = Object.entries(pkg.scripts ?? {}).map(([k, v]) => `- \`npm run ${k}\` → \`${v}\``).join('\n');
	} catch {}
}

const heavy = [...rows].sort((a, b) => b.tokens - a.tokens).slice(0, 8);
const md = [
	'# Carte du projet (générée par ctxpack)',
	'',
	`${rows.length} fichiers · ~${estimate(totalChars).toLocaleString('fr-FR')} tokens si on lisait tout. Lis ce fichier d'abord, puis seulement les fichiers utiles à la tâche.`,
	'',
	scripts && '## Scripts\n\n' + scripts + '\n',
	'## Fichiers les plus lourds (à ne lire qu\'en cas de besoin)',
	'',
	'| Fichier | Lignes | ~Tokens |',
	'|---|--:|--:|',
	...heavy.map((r) => `| \`${r.rel}\` | ${r.lines} | ${r.tokens} |`),
	'',
	'## Fichiers et ce qu\'ils exposent',
	'',
	...rows.flatMap((r) => [`- \`${r.rel}\` (${r.lines} l.)`, ...r.sigs.map((s) => `  - \`${s.trim()}\``)]),
	'',
].filter((l) => typeof l === 'string').join('\n') + '\n';

if (printOnly) {
	process.stdout.write(md);
} else {
	mkdirSync(join(out, '..'), {recursive: true});
	writeFileSync(out, md);
	console.log(`ctxpack : ${rows.length} fichiers résumés dans ${relative(process.cwd(), out)} (~${estimate(md.length)} tokens au lieu de ~${estimate(totalChars)}).`);
}
