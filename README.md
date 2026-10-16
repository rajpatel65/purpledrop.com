# purpledrop.com

Consulting site for Purpledrop. Offer funnel:

1. **Free AEO/GEO/AIO Visibility Test** (`test.html`) — lead magnet: scores how a company appears when buyers ask ChatGPT, Claude, Gemini, Perplexity. Fulfilled manually (1-page scorecard, 5 business days).
2. **Free mini-audit, pick one** (`audit.html`) — AI spend snapshot, tool adoption snapshot, or AEO action plan.
3. **Advanced Scan, $7,500 fixed** (`audit.html#scan`) — full two-week diagnostic with 2x-savings guarantee.

Pages: `index.html` (home) · `test.html` (free test) · `audit.html` (options + paid scan) · `about.html` (bio + contact).

## Stack

Plain static files, no framework. Shared `styles.css` (editorial paper/ink/solid-purple system) and `main.js` (Three.js droplet, scroll reveals, form scaffolds).

Design rule: must not look AI-built. No decorative gradients, no glows, no glass.

## Protecting the work

- Front-end code cannot be made un-copyable (View Source always exists). `build.sh` minifies CSS/JS for deploy — a speed bump, not a lock.
- The real protection: **methodology stays off the site.** Pages describe outcomes and deliverables, never the prompt lists, scoring rubric, or audit checklists. Those live outside this repo.
- © notice in every footer.

## Local preview

```bash
cd ~/workspace/purpledrop-site
python3 -m http.server 8080
# open http://localhost:8080
```

(ES modules + import maps require http, not `file://`.)

## Deploy

```bash
./build.sh        # produces minified dist/
```

Cloudflare dashboard → **Workers & Pages** → **Create** → **Upload assets** → upload the contents of `dist/`.
Then **Custom domains** → **Set up a custom domain** → `purpledrop.com`.
Move nameservers to Cloudflare at Namecheap for automatic DNS (Domain List → Manage → Nameservers → Custom DNS).

## Open before launch

- **Contact/test form backends** — both forms currently show a "not connected yet" notice. Wire to a Cloudflare Pages Function via Resend (same pattern as getmusehelp) or Formspree, then remove the JS intercept in `main.js`.
- **Cloudflare Email Routing** — set up `hello@purpledrop.com` → inbox forwarding (free, inside Cloudflare dashboard → Email).
- **Repo visibility** — the GitHub repo is currently public; decide private vs public in repo Settings.
