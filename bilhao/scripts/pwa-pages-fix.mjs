// scripts/pwa-pages-fix.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WWW = path.resolve(__dirname, '..', 'www');
const INDEX = path.join(WWW, 'index.html');
const FOUR_OH_FOUR = path.join(WWW, '404.html');

// 1) Verifica se www/index.html existe
if (!fs.existsSync(INDEX)) {
  console.error('[pwa-pages-fix] ERRO: www/index.html não encontrado. Rode "ionic build" antes.');
  process.exit(1);
}

// 2) Corrige <base href="..."> para /bilhao/
let html = fs.readFileSync(INDEX, 'utf8');
const baseRegex = /<base\s+href=["'][^"']*["']\s*\/?>/i;
const desiredBase = '<base href="/bilhao/">';

if (baseRegex.test(html)) {
  html = html.replace(baseRegex, desiredBase);
} else {
  // Se não houver <base>, insere logo após <head>
  html = html.replace(/<head>/i, `<head>\n  ${desiredBase}`);
}

fs.writeFileSync(INDEX, html, 'utf8');
console.log('[pwa-pages-fix] Base href ajustado para /bilhao/ em www/index.html');

// 3) Gera 404.html (fallback SPA)
fs.copyFileSync(INDEX, FOUR_OH_FOUR);
console.log('[pwa-pages-fix] 404.html criado a partir de index.html');

// 4) Feedback de sucesso
console.log('[pwa-pages-fix] OK: www pronta para GitHub Pages (base + 404).');
