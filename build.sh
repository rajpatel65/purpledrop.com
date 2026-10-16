#!/bin/bash
# Purpledrop deploy build: copies the site to dist/ with minified CSS/JS.
# Deploy the CONTENTS of dist/ (Cloudflare Pages -> Upload assets).
# Source files stay readable in the repo; dist/ is generated and gitignored.
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist
cp index.html test.html services.html audit.html about.html dist/
npx -y terser main.js -c -m --module -o dist/main.js
python3 - <<'EOF'
import re
css = open('styles.css').read()
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)  # strip comments
css = re.sub(r'\s+', ' ', css)                    # collapse whitespace
css = re.sub(r'\s*([{}:;,>])\s*', r'\1', css)     # tighten around tokens
open('dist/styles.css', 'w').write(css.strip())
EOF
echo "dist/ built:"
du -sh dist
ls dist
