# Contributing to Kodeida

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Accessibility barriers are bugs — see [ACCESSIBILITY.md](ACCESSIBILITY.md).

Kodeida is at the **pre-alpha** stage: the story, worlds, characters and website exist, and the game app has its first playable level. That shapes what kind of help is most useful right now.

## What helps most today

- **World ideas** — a work of Ukrainian literature in the public domain plus one algorithmic technique it can teach. Use the *World idea* issue template.
- **Story and dialogue** — lines for Mykyta, the Sibyl, Juno or the locals, in the tone of the brand book: Kotliarevsky's burlesque and Franko's irony, never mocking the player.
- **Pixel art** — new characters, variants, scene details. Everything is drawn in code, see below.
- **Translations** — the landing page is Ukrainian and English; the artbook is Ukrainian only for now.
- **Accessibility and UX feedback** on the website.
- **Feedback on the first level** — play *Dido's Task* in `app/` and tell us where you got stuck. The technical plan is in [docs/MVP.md](docs/MVP.md).

## Project layout

- `app/` — the game (Electron + React + TypeScript + Monaco). `src/engine` runs player code in a Worker and judges it, `src/levels` holds levels as data, `src/world` draws the worlds. Run `npm run selftest` and `npm run typecheck` before sending changes.
- `site/` — the website (no build step). `app.js` holds the pixel-art renderer, all scenes and the i18n dictionary; `style.css` holds the light and dark themes.
- `docs/` — design documents: `NOTES.md` (idea, decisions, plan), `BRAND.md`, `LORE.md`, `STORY.md`, `ONBOARDING.md`.

## Running the site

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000 and http://localhost:8000/artbook.html
```

Every push to `main` that touches `site/` redeploys GitHub Pages.

## Working on the site

- **Characters** are functions like `makeEnei()` or `makeFox()` in `site/app.js` that draw a small sprite from shapes (`ell`, `rect`, `poly`, `line`). When drawn at an even scale they are upscaled automatically (Scale2x, light and shade, cel lines). Hand-tuned details live in `hdDetails()`.
- **Worlds** live in `WORLD_SCENES` (background and local character) and `WORLD_FX` (particles, light, vignette).
- **Text** is written in Ukrainian in the markup and scripts. English comes from the `DICT` table and the `RULES` patterns in `app.js`; when you add or change visible text on the landing page, add its English entry there.
- Respect `prefers-reduced-motion`: every animation must have a finished resting frame.
- Each section must fit one screen on desktop; check at 1440×860 and at a short window around 930×470.

## Content rules

- **Public domain only.** Base characters on texts whose authors died more than 70 years ago (Ukrainian law), or on folk tales.
- **Original designs.** Do not copy characters from film or cartoon adaptations (e.g. the 1991 *Eneida* cartoon, *Mavka*, Parajanov's film).
- **No war themes**, and avoid shared-Slavic images that are strongly associated with Russian media.
- Keep the game honest about learning: the in-game API must not make the real technique unnecessary.

## Commits and pull requests

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- Keep pull requests scoped to one change and fill in the template.
- For anything security-related, see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Licensing of contributions

Code contributions are accepted under the [Apache License 2.0](LICENSE); story, lore and design-document contributions under [CC BY-SA 4.0](LICENSE-CONTENT.md).
