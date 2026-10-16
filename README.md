# purpledrop.com

Consulting site for Purpledrop. Offer:

1. **Free AI Visibility Test** (`test.html`) — lead magnet: what ChatGPT, Claude, Gemini, Perplexity say about your company. Fulfilled manually (1-page scorecard, 5 business days).
2. **Three paid services** (`services.html`):
   - **AI Audit Consulting — $2,500 fixed.** 4 hours with the client: evaluate what they want to use AI for, advise them. Written action plan included.
   - **Website Update — from $1,500.** Refresh key pages, modernize, make content AI-readable. (~2 weeks)
   - **Full Website Redesign — from $5,000.** Complete rebuild. (4–6 weeks)

Pages: `index.html` (home) · `test.html` (free test) · `services.html` (services & prices) · `about.html` (bio + contact). (`audit.html` redirects to `services.html` — legacy page.)

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
