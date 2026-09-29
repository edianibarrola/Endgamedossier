# Image archive

120 local WebP images populate 70 screen/performer dossier panels and 54 comics
panels. Assets are reused by the rapid-access cards and timeline. Total image
payload is approximately 3.2 MB; individual images are lazy-loaded with explicit
dimensions. No runtime image API or external image server is required.

`data/media.json` is the maintained image registry. Each selected asset records
its source article, file-description page, original URL, artist/credit, original
license label, non-free status, local path, dimensions, caption, and alt text.
`data/images.json` is a generated per-dossier inventory. A null path means no
reliable image was selected; the HTML displays an explicit identity note.

Sources include Wikimedia Commons performer photographs and low-resolution
copyrighted MCU/comic reference images documented on Wikipedia file pages.
These categories are kept distinct: a source site's non-free-use rationale is
not an open license, and attribution does not transfer copyright. Per-image
source and rights information is visible in expandable credits. Freely licensed
photographs retain their original license; resizing/WebP conversion is disclosed.

Do not label a performer portrait or reference from another movie as an Endgame
frame. Shared Thanos/Gamora likenesses, Loki's in-costume event photograph, and
Groot's multi-incarnation reference have specific captions. Composite portraits
mixing Banner/Rhodey performers were excluded. No comic counterpart is invented
for an unverified minor character. No API credentials are used.

After editing the maintained registry, run `python scripts/render_media.py`,
then `python scripts/export_data.py`. Commit registry, local assets, and rendered
HTML together. Keep essential text and credits in HTML, independent of JS.
