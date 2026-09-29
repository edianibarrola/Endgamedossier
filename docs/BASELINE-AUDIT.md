# Baseline inspection — 28 September 2026

Original repository commit: `c354f76` (Add files via upload).
Local recovery tag: `baseline-chatgpt-prototype`.
The deployed URL returned HTTP 200 with the original title and all 88 dossiers.

## Confirmed implementation defects

- Eight rapid-access cards had invalid escaped inline JavaScript.
- All dossier elements lacked IDs; portal targets were `dossier-` and disabled.
- Timeline chips had no target IDs and placeholder case numbers.
- Subject Lock depended on `.lockmini` buttons that did not exist.
- Battlefield participants had empty targets; every participant link was disabled.
- The Threat Board contained no entries.
- The battlefield's aspect ratio and minimum height caused page-level mobile overflow.
- Global header spacing leaked into portal headers. A high-specificity stone
  rule reset text to black, making mission descriptions difficult to read.
- Reduced-motion styles omitted SVG animation, the status dot, and pointer effects.
- Navigating to a dossier hidden by an active filter did not reveal it.
- The 20 unresolved total combined 18 unknown records with two branch records.

These implementation defects are addressed in the first refactor. Branch membership
is a separate facet; branch records can overlap alive/dead/unknown categories.

## Research and imagery remain separate work

All 88 original names, Endgame descriptions, and endpoint paragraphs are preserved.
The source export contains 17 distinct links. These links are an inventory, not
proof that the associated paragraph has been independently verified.

One initial source check identified a concrete citation gap: the GamesRadar
[Encore explainer](https://www.gamesradar.com/entertainment/marvel-movies/what-is-avengers-endgame-encore-marvels-new-re-release-explained/)
describes the rerelease and says the precise Doomsday connection was not yet known.
It does not substantiate the detailed Banner outcome attached to it in this
prototype. This does not establish that the outcome is false; replace broad
coverage with scene-specific evidence during the audit.

The full three-pass cast/temporal-identity/endpoint audit remains pending. Check
release dates versus in-universe dates, every Encore addition, ambiguous deaths,
the 2014 and 2018 versions of Thanos, both Loki records, and Gamora's branch.
Existing confidence percentages are inherited labels, not calibrated probabilities.
Do not treat generated JSON verification markers as a completed factual audit.

No new MCU facts or copyrighted image downloads were added. Remote prototype
images still need replacement with approved assets. No comics counterparts have
been invented. Full cinematic redesign, full character route coverage, expanded
battle replay, image import automation, and PWA support remain future work.

## Validation

Automated Edge/Chromium checks cover 320, 375, 390, 430, 768, 1024, and 1440 CSS
pixels, zero page overflow, preserved dossier text, filtering, keyboard activation,
portal navigation, Subject Lock, route geometry, console, replay, reduced motion,
relative `/Endgamedossier/` assets, and archive readability with JS disabled.
Remote media is deliberately blocked in tests to exercise graceful fallbacks.
No script errors or local asset failures were observed.

Screenshots were visually inspected at phone and desktop sizes. Actual iOS/Safari,
screen-reader behavior, full contrast compliance, Core Web Vitals, and real remote
image availability have not been certified. The implementation remains a static
GitHub Pages project; merging into its deployment branch would publish it.
