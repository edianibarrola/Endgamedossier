# ENDGAME // TVA Temporal Dossier

Mobile-first interactive archive tracking every identified/credited *Avengers: Endgame* character to the latest verified MCU endpoint.

## Local preview
Open `index.html` directly, or serve the folder with any static web server.

## GitHub Pages
This repository is intentionally static. Publish from the repository root (or GitHub Actions) with `index.html` as the entry point.

## Architecture
- `index.html` — stable bundled build for maximum iOS/offline compatibility
- `data/characters.json` — 88 dossier records
- `data/sources.json` — research-source registry
- `data/images.json` — image provenance/asset manifest
- `assets/` — local MCU/comic/UI media
- `css/`, `js/` — production modularization targets

## Image policy
Remote image URLs are fallbacks only. Production should use approved local assets where licensing permits. Never expose private TMDB/Marvel API credentials in browser code.
