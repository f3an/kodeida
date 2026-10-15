# Contributing to Kodeida

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Accessibility barriers are bugs — see [ACCESSIBILITY.md](ACCESSIBILITY.md).

Kodeida is at the **pre-alpha** stage: the story, worlds, characters and website exist, and the game app has its MVP — the onboarding and worlds 0–2, released for macOS, Windows and Linux. That shapes what kind of help is most useful right now.

## What helps most today

- **World ideas** — a work of Ukrainian literature in the public domain plus one algorithmic technique it can teach. Use the *World idea* issue template.
- **Story and dialogue** — lines for Mykyta, the Sibyl, Juno or the locals, in the tone of the brand book: Kotliarevsky's burlesque and Franko's irony, never mocking the player.
- **Pixel art** — new characters, variants, scene details. Everything is drawn in code, see below.
- **Translations** — the game, the landing page and the artbook are Ukrainian and English; proofreading the English is very welcome.
- **Accessibility and UX feedback** on the game and the website.
- **Playtesting** — install the latest [release](https://github.com/f3an/kodeida/releases/latest), play worlds 0–2 and press **Leave feedback** (main menu, Settings or the Help menu). It opens the *Playtest feedback* form with your version and progress filled in. Bugs go to **Help → Report a problem**. The technical plan is in [docs/MVP.md](docs/MVP.md).

## Project layout

- `app/` — the game (Electron + React + TypeScript + Monaco).
  - `src/engine` runs player code in a Worker and judges it; `src/levels` holds the worlds as data (`troy.ts`, `sea.ts`, `carthage.ts`), their English texts (`en.ts`) and the Book of Tricks.
  - `src/world/sprites.js` is **generated** from `site/app.js` by `npm run sync-sprites` — change sprites, cutscenes and the journey map on the site, then sync. `src/world/scenes.ts` draws the in-level scenes.
  - `src/ui` holds the screens; interface text goes through `L('укр', 'eng')` from `src/i18n.ts`.
  - `electron/` is the main process: window, `app://` protocol with CSP, menu, auto-update (`updater.cjs`).
  - Run `npm run selftest` and `npm run typecheck` before sending changes. A new level needs a fox `solution` (and a `wolf` for levels with a big test); the self-test checks both.
- `site/` — the website (no build step). `app.js` holds the pixel-art renderer, all scenes and the i18n dictionary; `style.css` holds the light and dark themes.
- `docs/` — design documents: `NOTES.md` (idea, decisions, plan), `MVP.md`, `BRAND.md`, `LORE.md`, `STORY.md`, `ONBOARDING.md`. `docs/media/` holds the logo and the README GIFs (see below).

## Writing an exercise

World 0 is for people who are only starting with JavaScript, so it follows one rule: **one new idea per exercise**, and the player first feels why it is needed (fifteen identical lines before a `for` loop, streets of different length before the parameter `n`). Every exercise in `app/src/levels` can have:

- `tool` — the *New tool* card: a name, a plain-words explanation and a small example that is **not** the answer;
- `talk` — a short exchange shown when the exercise opens (speakers: `enei`, `fox`, `sibyl`, `anchises`, `warrior`, `sailor`, `woman`), and `quip` — one line after the first win;
- English versions of all of these in `en.ts` (`tool`, `talk` in the same order, `quip`).

Typical beginner mistakes are explained by `app/src/ui/coach.ts`: when you add an exercise, think about what a newcomer will get wrong and add a rule there.

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
- **Text** is written in Ukrainian in the markup and scripts. English comes from the `DICT` table and the `RULES` patterns in `app.js` (both pages); when you add or change visible text, add its English entry there. Text drawn on a canvas goes through `ST('…')`, so the site and the game translate it the same way.
- **Shared with the game:** everything between the `colour helpers` marker and the cutscenes (`OB`) is copied into the app by `npm run sync-sprites`; keep it free of DOM access.
- Respect `prefers-reduced-motion`: every animation must have a finished resting frame.
- Each section must fit one screen on desktop; check at 1440×860 and at a short window around 930×470.

## README media

The GIFs in `docs/media/` are recorded from the running game (`npm run dev`), in both languages: `intro-*.gif` (the opening cutscenes), `play-*.gif` (Dido's problem: Run, then Judgement), `map-*.gif` (the world map), plus `hero.gif` from the website cover. When the screens change noticeably, re-record them at a 1280×800 window and keep each GIF under about 4 MB (8–12 fps, 720–960 px wide). `icon.png` is `app/build/icon.png` scaled to 256 px.

## Content rules

- **Public domain only.** Base characters on texts whose authors died more than 70 years ago (Ukrainian law), or on folk tales.
- **Original designs.** Do not copy characters from film or cartoon adaptations (e.g. the 1991 *Eneida* cartoon, *Mavka*, Parajanov's film).
- **No war themes**, and avoid shared-Slavic images that are strongly associated with Russian media.
- Keep the game honest about learning: the in-game API must not make the real technique unnecessary.

## Commits and pull requests

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- Keep pull requests scoped to one change and fill in the template.
- For anything security-related, see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## Releases

Releases are built by [`.github/workflows/release.yml`](.github/workflows/release.yml) and published to
[GitHub Releases](https://github.com/f3an/kodeida/releases); the installed app checks them on start and every
6 hours and updates itself (`electron-updater`).

1. Bump `version` in `app/package.json` (the tag must match it).
2. Commit, then tag and push the tag:
   ```bash
   git tag v0.1.2
   git push origin v0.1.2
   ```
3. The workflow builds macOS (`.dmg` + `.zip`, Apple Silicon and Intel), Windows (NSIS `.exe`) and Linux (`.AppImage`) and publishes the
   release with auto-generated notes. Running it manually from the Actions tab builds without publishing.

macOS signing and notarization need these repository secrets (the same ones Mova-Flow uses). Without them the macOS
build is unsigned: Gatekeeper warns on first launch and auto-update does not work on macOS.

| Secret | What it is |
|---|---|
| `CSC_LINK` | Developer ID Application certificate with its private key, exported as `.p12`, **base64-encoded** |
| `CSC_KEY_PASSWORD` | Password of that `.p12` |
| `APPLE_API_KEY_B64` | App Store Connect API key (`AuthKey_XXXXXXXXXX.p8`), **base64-encoded** |
| `APPLE_API_KEY_ID` | Its key ID (the `XXXXXXXXXX` part) |
| `APPLE_API_ISSUER` | Issuer ID from App Store Connect → Users and Access → Integrations |

## Licensing of contributions

Code contributions are accepted under the [Apache License 2.0](LICENSE); story, lore and design-document contributions under [CC BY-SA 4.0](LICENSE-CONTENT.md).
