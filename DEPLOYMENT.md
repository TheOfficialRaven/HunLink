# HunLink Deployment Guide

## Netlify Deployment

### Előfeltételek
- Node.js 18+ telepítve
- Git repository beállítva

### Deployment lépések

1. **Repository összekapcsolása Netlify-val**
   - Menj a [Netlify Dashboard](https://app.netlify.com/)
   - Kattints "New site from Git"
   - Válaszd ki a Git provider-t (GitHub, GitLab, Bitbucket)
   - Válaszd ki a HunLink repository-t

2. **Build beállítások**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 (vagy újabb)

3. **Environment változók** (ha szükséges)
   - `NODE_ENV=production`

4. **Deploy**
   - Kattints "Deploy site"
   - A build automatikusan elindul

### Konfigurációs fájlok

A projekt tartalmazza a következő Netlify konfigurációs fájlokat:
- `netlify.toml` - Build beállítások
- `public/_redirects` - React Router útvonalak kezelése

### Hibaelhárítás

Ha a deployment sikertelen:

1. **Lokális build tesztelése**:
   ```bash
   npm install
   npm run build
   ```

2. **Node.js verzió ellenőrzése**:
   ```bash
   node --version
   ```

3. **Dependencies frissítése**:
   ```bash
   npm install
   ```

4. **Cache törlése**:
   ```bash
   npm run build -- --force
   ```

### Firebase konfiguráció

A Firebase Analytics automatikusan kezeli a server-side rendering problémákat. A `firebaseConfig.js` fájlban a `getAnalytics()` függvény csak böngésző környezetben fut.

### Útvonalak kezelése

A React Router útvonalak automatikusan működnek a `_redirects` fájl és a `netlify.toml` konfiguráció miatt. 