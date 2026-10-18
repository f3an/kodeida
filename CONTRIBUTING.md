# Contributing to Kodeida

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Accessibility barriers are bugs — see [ACCESSIBILITY.md](ACCESSIBILITY.md).

Kodeida is at the **pre-alpha** stage: the story, worlds, characters and website exist. The latest release (v0.3.1) for macOS, Windows and Linux has the onboarding, worlds 0–8 with cutscenes between them, the three ways in (from scratch, a little, give me problems) and the ABC — a from-scratch track for Python, JavaScript and TypeScript. The release has chapter 1; all eight chapters are in `main`.

## What helps most today

- **World ideas** — a work of Ukrainian literature in the public domain plus one algorithmic technique it can teach. Use the *World idea* issue template.
- **ABC lessons** — the eight chapters are written; extra practice lessons, or new chapters (sets, classes), each built on a Ukrainian folk tale, are welcome. See *Writing an ABC lesson* below.
- **Story and dialogue** — lines for Mykyta, the Sibyl, Juno or the locals, in the tone of the brand book: Kotliarevsky's burlesque and Franko's irony, never mocking the player.
- **Pixel art** — new characters, variants, scene details. Everything is drawn in code, see below.
- **Translations** — the game, the landing page and the artbook are Ukrainian and English; proofreading the English is very welcome.
- **Accessibility and UX feedback** on the game and the website.
- **Playtesting** — install the latest [release](https://github.com/f3an/kodeida/releases/latest), play worlds 0–3 and press **Leave feedback** (main menu, Settings or the Help menu). It opens the *Playtest feedback* form with your version and progress filled in. Bugs go to **Help → Report a problem**. The technical plan is in [docs/MVP.md](docs/MVP.md).

## Project layout

- `app/` — the game (Electron + React + TypeScript + Monaco).
  - `src/engine` runs player code in a Worker and judges it; `src/levels` holds the worlds as data (`troy.ts`, `sea.ts`, `carthage.ts`, `forest.ts`, `mitten.ts`, `konotop.ts`, `sicily.ts`, `chumak.ts`, `hell.ts`), their English texts (`en.ts`), the Book of Tricks, the cutscenes between worlds (`voyages.ts`) and the ABC (`abetka.ts`).
  - `src/world/sprites.js` is **generated** from `site/app.js` by `npm run sync-sprites` — change sprites, cutscenes and the journey map on the site, then sync. `src/world/scenes.ts` draws the in-level scenes.
  - `src/ui` holds the screens; interface text goes through `L('укр', 'eng')` from `src/i18n.ts`. `story.ts` holds the ABC cutscenes (scene numbers 100+, played by the same `Onboarding` component as the intro) and the scene lists for each way in; `Tour.tsx` is the Sibyl's interface tour.
  - Python: `src/levels/python.ts` holds, for every level, the starter body, the solution, the Wolf and the third hint (texts are converted from the JS wording by `pyText`); the engine is `src/engine/py-*.ts` on top of Pyodide, which `npm run dev`/`build` copy into `public/pyodide/` (`scripts/sync-pyodide.mjs`). A new level needs an entry there, or the selftest fails.
  - `electron/` is the main process: window, `app://` protocol with CSP, menu, auto-update (`updater.cjs`).
  - Run `npm run selftest` and `npm run typecheck` before sending changes. A new level needs a fox `solution` (and a `wolf` for levels with a big test); the self-test checks both.
- `site/` — the website (no build step). `app.js` holds the pixel-art renderer, all scenes and the i18n dictionary; `style.css` holds the light and dark themes.
- `docs/` — design documents: `NOTES.md` (idea, decisions, plan), `MVP.md`, `BRAND.md`, `LORE.md`, `STORY.md`, `ONBOARDING.md`. `docs/media/` holds the logo and the README GIFs (see below).
- `video/` — the trailer, the release video and the Reels in Remotion; see [Trailer and videos](#trailer-and-videos).

## Writing an exercise

World 0 is for people who are only starting with JavaScript, so it follows one rule: **one new idea per exercise**, and the player first feels why it is needed (fifteen identical lines before a `for` loop, streets of different length before the parameter `n`). Every exercise in `app/src/levels` can have:

- `tool` — the *New tool* card: a name, a plain-words explanation and a small example that is **not** the answer;
- `talk` — a short exchange shown when the exercise opens (speakers: `enei`, `fox`, `sibyl`, `anchises`, `warrior`, `sailor`, `woman`, `eol`, `dido`, `juno`, `wolf`, `lion`, `mitten`, `sotnyk`, `acestes`, `ox`, `charon`), and `quip` — one line after the first win;
- English versions of all of these in `en.ts` (`tool`, `talk` in the same order, `quip`).

Typical beginner mistakes are explained by `app/src/ui/coach.ts`: when you add an exercise, think about what a newcomer will get wrong and add a rule there.

## Writing an ABC lesson

The ABC (`app/src/levels/abetka.ts`) is for adults who have never written code. It is a separate track per language, so a lesson is described **once** and built three times — Python, JavaScript and TypeScript — each with its own starter code, solution, hints and expected output.

- **A chapter is a folk tale** (`Chapter`: `key`, `name`, `topic`, `host` — the Sibyl's opening line — and `lessons`). Chapters not written yet are listed in `PLANNED` and shown as *soon*.
- **A lesson checks what the program prints.** `out(c, ...args)` returns the expected lines; the judge compares them with the program's output line by line (`print` and `console.log` differ, e.g. `True` / `true`, so `out` gets the language context `c`). Write `tests` as argument lists.
- **Texts take the language context** `c` (`c.name`, `c.say('…')`, `c.py`, `c.ts`) and return `[Ukrainian, English]` pairs; English goes into `LEVELS_EN` automatically.
- **Per-language code** goes through `pick(c, python, javascript, typescript?)`; `full(c, entry, params, ret, body, pre?)` builds a whole solution, and `EMPTY` is the usual starter body. A `pre` helper sits above the main function (the Ivasyk-Telesyk chapter: the player finishes a helper the main function calls). Every `{{here}}` becomes “your code here”.
- **Voices.** The ABC happens the night before Troy falls: the Sibyl teaches and Aeneas learns (`talk` alternates Sibyl → Aeneas). Mykyta has not arrived yet — do not use him here.
- **One new idea per lesson**, as in world 0, and no syntax the player has not met yet.
- `npm run selftest` checks every lesson in all three languages: the solution passes, the starter code compiles and does not pass, an extra printed line fails, and the texts contain no other language's syntax.

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

The GIFs in `docs/media/` are recorded from the running game (`npm run dev`), in both languages: `intro-*.gif` (the opening cutscenes), `play-*.gif` (Dido's problem: Run, then Judgement), `map-*.gif` (the world map), `abc-*.gif` (the menu, the ABC prologue and the Bun's song), plus `hero.gif` from the website cover. When the screens change noticeably, re-record them at a 1280×800 window and keep each GIF under about 4 MB (8–12 fps, 720–960 px wide). `icon.png` is `app/build/icon.png` scaled to 256 px.

## Trailer and videos

The trailer (`site/media/trailer-*.mp4`), the release video and the vertical Reels live in `video/`, a [Remotion](https://www.remotion.dev) project. Characters, worlds and particles come straight from the game's sprite code, so the videos never drift away from the art.

- **Timing.** Everything runs at 150 BPM: a bar is 48 frames at 30 fps. `src/timeline.mjs` (trailer) and `src/launch-timeline.mjs` (release video) lay the sections out in whole bars; scenes and music both read them, so cuts land on the beat. Change a section's length there, not in the scene.
- **Music.** `node scripts/music.mjs` synthesises the trailer's soundtrack into `public/music.wav`, `node scripts/music.mjs launch` the release video's. It is deterministic and original, so there is nothing to license. `npm run sfx` downloads the sound effects from remotion.media; neither the music nor the effects are committed.
- **Game footage.** `node scripts/record.mjs all` records Dido's problem, the world map, the ABC and the intro from the running game (`cd app && npm run dev`) at 2560×1600 into `public/rec-*.mp4`, in both languages. Re-record when those screens change. The recordings are not committed.
- **Text** lives in `src/lib/copy.ts` (trailer) and `src/launch/copy.ts` (release video). Update the list of what's new for each release.
- **Reels** (1080×1920): keep text away from the top 250 px, the bottom 400 px and the right edge, where the app puts its buttons; keep the key content inside the central 3:4, which Instagram shows in the profile grid. The first frame is the cover; `npx remotion still Reels-cover-uk out/cover.png` renders it on its own.

Render and encode the trailer for the site:

```bash
cd video
npx remotion render Trailer-uk out/kodeida-trailer-uk.mp4 --crf=18
ffmpeg -i out/kodeida-trailer-uk.mp4 -c:v libx264 -preset slow -crf 28 -tune animation \
  -c:a aac -b:a 160k -movflags +faststart ../site/media/trailer-uk.mp4
ffmpeg -ss 5.6 -i out/kodeida-trailer-uk.mp4 -frames:v 1 -q:v 3 ../site/media/trailer-uk.jpg
```

Do the same for `en`. At CRF 28 a trailer is about 11 MB and still sharp; keep it under about 15 MB.

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
   git tag v0.3.1
   git push origin v0.3.1
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
