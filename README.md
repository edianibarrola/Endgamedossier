# ENDGAME // TVA Temporal Dossier

A mobile-first TVA archive with 88 inherited character dossiers, Time Heist
operations, portal arrivals, Subject Lock, and a tactical battle replay.
The research is preserved from the prototype; a fresh canon audit is pending.

## Preview

Open `index.html` directly, or run `python -m http.server 8000` from this folder.
Visit `http://localhost:8000`. No application build or server runtime is needed.
Keep the CSS and JS folders beside the HTML when copying the site.

## Architecture

- `index.html`: canonical, readable dossier content, available without JavaScript.
- `css/`: preserved style layers plus accessibility/mobile repairs. Load order matters.
- `js/app.js`: shared navigation, search, filters, and reveal behavior.
- `js/timeline.js`, `subject-lock.js`: single-tap selection and responsive route geometry.
- `js/battlefield.js`, `console.js`, `effects.js`: isolated feature behavior.
- `data/characters.json`, `sources.json`, `images.json`: generated review inventories.
- `scripts/export_data.py`: dependency-free HTML-to-JSON export and consistency check.
- `data/media.json`: maintained image registry with source and rights metadata.
- `scripts/render_media.py`: renders the image registry into static HTML.
- `assets/`: 120 local WebP reference images; see its README.
- `docs/BASELINE-AUDIT.md`: findings, limitations, and remaining work.

Edit dossier content in HTML, then run `python scripts/export_data.py`.
Use `python scripts/export_data.py --check` to reject stale data exports.
Do not edit the generated JSON directly. No runtime fetch is needed to read dossiers.

## Browser checks

Install development dependencies with `npm install`, then install a test browser
with `npx playwright install chromium`. Run `npm test`. On Windows with Edge
already installed, set `BROWSER_CHANNEL=msedge` to use it instead of downloading
Chromium. The test starts its own temporary server, exercises project-subpath
hosting, and writes ignored screenshots to `test-results/`.

The preservation check reads the original Git commit `c354f76`; use a Git clone
with that history when running the browser test. A source ZIP can be previewed,
but needs repository history for this particular preservation assertion.

## GitHub Pages

Keep publication at the repository root. Every local asset URL is relative,
compatible with `https://www.edianibarrola.com/Endgamedossier/`. `.nojekyll` is
included. The refactor does not require changing DNS, Pages settings, or hosting.
Only merge to the configured deployment branch when ready to publish.

## Recovery and scope

Original checkpoint: `c354f76`, locally tagged `baseline-chatgpt-prototype`.
The first extraction commit preserves the exact inline CSS and JavaScript bodies;
navigation/accessibility fixes follow separately. No prototype dossier was removed.

Preserve the amber CRT/aged-paper TVA visual language and ambitious feature set.
Prioritize iPhone usability, reduced motion, static content, and exact temporal
identity. Do not trade research depth for generic dashboard styling.

Remaining: full canon/source audit, additional verified portraits for minor characters,
complete temporal routes, broader battlefield reconstruction, Safari/device QA,
performance/contrast audits, and optional PWA support. The current media pass adds
70 screen/performer panels and 54 comics panels with explicit credits and local
loading. Unmatched records retain text instead of an invented likeness. Prototype routes are
schematic checkpoints, not a complete chronological model. Decorative telemetry
is labeled as simulation. Never embed provider API secrets in public assets.
