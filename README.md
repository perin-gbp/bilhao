# 1 Bilhão de Segundos ⏳

Descubra quando você completa **1 bilhão de segundos de vida** e acompanhe, em **tempo real**, quantos segundos já viveu.

<p align="center">
  <img src="assets/icons/icon-192x192.png" width="96" height="96" alt="ícone do app" />
</p>

## Tecnologias

- **Angular 20** + **Ionic 8** (standalone, SSR disabled)
- **PWA** (Service Worker do Angular) – instalável no Android/Chrome e iOS/Safari (Add to Home Screen)
- **GitHub Pages** para hosting (`/bilhao/`)
- (Opcional) **Capacitor Android** para gerar APK

---

## Demo / Instalação Rápida

### Web / PWA
**Acesse:** https://perin-gbp.github.io/bilhao/

**Android/Chrome:** Menu ⋮ → **Instalar app**  
**iOS/Safari:** Compartilhar → **Adicionar à Tela de Início**

<p align="center">
  <img alt="QR para o site" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fperin-gbp.github.io%2Fbilhao%2F" />
  <br/><sub>Escaneie para abrir o app</sub>
</p>

###  Android (APK)
- **Download direto:**  **troque pelo link real do Release**
  - `https://github.com/perin-gbp/bilhao/releases/latest/download/bilhao.apk`
- **QR do APK:** (atualize depois do release)
  ```
  https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://github.com/perin-gbp/bilhao/releases/latest/download/bilhao.apk
  ```

>  Publique o APK em **Releases** e mantenha o nome do arquivo como `bilhao.apk` para o link acima funcionar.

---

##  Como rodar localmente

```bash
npm i
npm start
# abre em http://localhost:4200
```

---

##  Build & Deploy (GitHub Pages)

> O projeto já está configurado para gerar em **`www/`** e servir em `/bilhao/`.

1. **Confirme o `<base>`** em `src/index.html`:
   ```html
   <base href="/bilhao/">
   ```
2. **Build de produção:**
   ```bash
   npm run build
   ```
   > Saída: `www/`
3. **Fallback SPA (404.html)**:
   ```bash
   cp www/index.html www/404.html
   ```
4. **Deploy no GitHub Pages:**
   ```bash
   npx angular-cli-ghpages --dir=www --base-href=/bilhao/ --no-silent
   ```

---

##  PWA (checagem rápida)

- `src/manifest.webmanifest` presente e linkado no `index.html`:
  ```html
  <link rel="manifest" href="manifest.webmanifest" />
  <meta name="theme-color" content="#c9a73f">
  <!-- iOS -->
  <link rel="apple-touch-icon" href="assets/icons/icon-180x180.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  ```
- `src/ngsw-config.json` configurado e **referenciado no `angular.json`** (builder `application`):
  ```json
  "serviceWorker": "src/ngsw-config.json"
  ```
- **Ícones** em `src/assets/icons/` (72, 96, 128, 192, 256, 384, 512).
- No celular: se algo não atualizar, remova o app instalado e limpe os dados do site (SW).

---

##  Estrutura

```
src/
  app/
    contador/            # tela principal (contador + datetime)
    agradecimento/       # página "Obrigado"
  assets/
    icons/               # ícones do PWA
  index.html
  manifest.webmanifest
  ngsw-config.json
  main.ts
www/                     # saída do build (gerada)
```

---

##  Capacitor (APK “nativo”)

Se quiser gerar um APK rapidamente:

```bash
npm i -D @capacitor/core @capacitor/cli
npx cap init "Bilhao" "dev.perin.bilhao" --web-dir=www
npm i -D @capacitor/android
npm run build
npx cap sync android
npx cap open android
```

No Android Studio: **Build → Build APK(s)**.  
Depois, crie um **Release** no GitHub e **anexe o `bilhao.apk`**.

---

##  Notas importantes

- **Base Href:** GitHub Pages exige `<base href="/bilhao/">`.  
- **MIME de JS inválido:** Se ver erro “MIME text/html para main-*.js”, é base href errado ou publicar fora de `/bilhao/`.  
- **SW/Cache:** Mudou `manifest`/`base`/`icons`? Limpe o cache, reinstale o PWA, ou teste em aba anônima.
- **iOS:** não tem “prompt”; sempre **Adicionar à Tela de Início** manualmente.

---
