// scripts/pwa-pages-fix.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WWW = path.join(ROOT, 'www');
const INDEX = path.join(WWW, 'index.html');
const FOUR_OH_FOUR = path.join(WWW, '404.html');
const ANGULAR_JSON = path.join(ROOT, 'angular.json');

// 1) Verifica se www/index.html existe
if (!fs.existsSync(INDEX)) {
  console.error('[pwa-pages-fix] ERRO: www/index.html não encontrado. Rode "ionic/ng build" antes.');
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

// 4) Atualiza angular.json → baseHref + serviceWorker no "production"
if (fs.existsSync(ANGULAR_JSON)) {
  try {
    const angular = JSON.parse(fs.readFileSync(ANGULAR_JSON, 'utf8'));

    // nome do projeto esperado: "app"
    const prodNode = angular?.projects?.app?.architect?.build?.configurations?.production;
    if (prodNode) {
      // builder @angular-devkit/build-angular:application usa:
      //   "baseHref": "/bilhao/"
      //   "serviceWorker": "src/ngsw-config.json"
      prodNode.baseHref = '/bilhao/';

      // só sobrescreve se estiver ausente ou diferente
      const desiredSw = 'src/ngsw-config.json';
      if (prodNode.serviceWorker !== desiredSw) {
        prodNode.serviceWorker = desiredSw;
      }

      fs.writeFileSync(ANGULAR_JSON, JSON.stringify(angular, null, 2), 'utf8');
      console.log('[pwa-pages-fix] production.baseHref = "/bilhao/" e production.serviceWorker = "src/ngsw-config.json" ajustados em angular.json.');
    } else {
      console.warn('[pwa-pages-fix] Aviso: nó "projects.app.architect.build.configurations.production" não encontrado em angular.json.');
    }
  } catch (err) {
    console.error('[pwa-pages-fix] Erro ao atualizar angular.json:', err.message);
  }
} else {
  console.warn('[pwa-pages-fix] angular.json não encontrado — pulando ajuste de baseHref/serviceWorker.');
}

// 5) Feedback final
console.log('[pwa-pages-fix] OK: www pronta para GitHub Pages (base + 404) e angular.json ajustado (production).');
