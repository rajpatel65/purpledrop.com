# purpledrop.com

Consulting site for Purpledrop — currently a single offer page: the **AI Stack Audit** (fixed-price, 2-week diagnostic for go-to-market teams).

## Stack

Plain static files, no build step. Deploys as-is to Cloudflare Pages (or any static host).

- `index.html` — page structure + copy
- `styles.css` — design system (Space Grotesk + Inter, dark 3D hero, light sections)
- `main.js` — Three.js particle-wave hero (ES module via jsDelivr import map), scroll reveals, nav, form scaffold

## Local preview

```bash
cd ~/workspace/purpledrop-site
python3 -m http.server 8080
# open http://localhost:8080
```

(ES modules + import maps require http, not `file://`.)

## Deploy

Cloudflare dashboard → **Workers & Pages** → **Create** → **Upload assets** → upload this folder.
Then **Custom domains** → **Set up a custom domain** → `purpledrop.com`.
Move nameservers to Cloudflare at Namecheap for automatic DNS (Domain List → Manage → Nameservers → Custom DNS).

## Open before launch

- **Contact form backend** — currently shows a "not connected yet" notice. Wire to a Cloudflare Pages Function via Resend (same pattern as getmusehelp) or Formspree, then remove the JS intercept in `main.js` and the HTML comment in `index.html`.
- **Cloudflare Email Routing** — set up `hello@purpledrop.com` → inbox forwarding (free, inside Cloudflare dashboard → Email).
