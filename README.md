# Ubik Landing

Static marketing site for **Ubik** — the AI operator workbench.

Built to satisfy Google OAuth verification requirements:

- Homepage (`/`) explains the purpose of the app.
- Brand name matches the OAuth consent screen (**Ubik**).
- Privacy Policy (`/privacy-policy`) and Terms of Service (`/terms-of-service`) are linked from the homepage.

## Files

```
index.html              Landing page
privacy-policy.html     Privacy policy
terms-of-service.html   Terms of service
styles.css              Shared styles
favicon.svg             Favicon
vercel.json             Clean-URL config (/privacy-policy instead of .html)
```

No build step. Pure HTML/CSS.

## Local preview

```bash
# any static file server works
npx serve .
# or
python3 -m http.server 8080
```

Open http://localhost:8080.

## Deploy

### Vercel
```bash
npx vercel --prod
```
Then set your custom domain (`theubik.com`) in the Vercel dashboard.

### Netlify
Drag-and-drop this folder at https://app.netlify.com/drop — or `netlify deploy --prod --dir .`.

### Cloudflare Pages
Create a Pages project and point it at this folder (no build command, output `/`).

## After deploying

1. Point **theubik.com** DNS at the host you chose.
2. In the Google Cloud Console → **OAuth consent screen**, set:
   - **Application homepage** → `https://theubik.com/`
   - **Application privacy policy link** → `https://theubik.com/privacy-policy`
   - **Application terms of service link** → `https://theubik.com/terms-of-service`
3. Reply to the Google Trust & Safety thread that the issues have been resolved.

## What this fixes on the Google verification page

- ✅ *Your homepage does not explain the purpose of your app* → the hero + "What Ubik does" sections describe the purpose clearly.
- ✅ *App name on OAuth consent screen does not match the app name on your homepage* → the homepage is branded **Ubik** (matching the consent-screen name), hosted at **theubik.com** (matching the app domain).
