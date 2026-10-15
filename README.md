# Kodeida · Кодеїда

[![Deploy GitHub Pages](https://github.com/f3an/kodeida/actions/workflows/pages.yml/badge.svg)](https://github.com/f3an/kodeida/actions/workflows/pages.yml)
[![Code: Apache 2.0](https://img.shields.io/badge/code-Apache%202.0-blue.svg)](LICENSE)
[![Content: CC BY-SA 4.0](https://img.shields.io/badge/content-CC%20BY--SA%204.0-lightgrey.svg)](LICENSE-CONTENT.md)
[![CI](https://github.com/f3an/kodeida/actions/workflows/ci.yml/badge.svg)](https://github.com/f3an/kodeida/actions/workflows/ci.yml)
![Status: pre-alpha](https://img.shields.io/badge/status-pre--alpha-orange.svg)

**A game where your code moves the hero.** Together with Aeneas and Mykyta the Fox you learn the techniques behind LeetCode-style problems — two pointers, hash maps, graphs, dynamic programming — in worlds taken from Ukrainian literature. No AI hints: you write the code, the world runs it step by step.

**[f3an.github.io/kodeida →](https://f3an.github.io/kodeida/)** · [Artbook](https://f3an.github.io/kodeida/artbook.html) · [Українською](README.uk.md)

## Contents

- [The idea](#the-idea)
- [Status](#status)
- [Download](#download)
- [What's in this repository](#whats-in-this-repository)
- [Run the game](#run-the-game)
- [Run the site locally](#run-the-site-locally)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security and accessibility](#security-and-accessibility)
- [Credits](#credits)
- [License](#license)

## The idea

Most coding sites hand you problems. Kodeida teaches you to **recognise the technique inside a problem** and understand why it works.

- **Tricks, not answers.** Each world is one technique. Warm-up exercises lead to a real problem (Container With Most Water, Top K Frequent, Linked List Cycle, …).
- **See your code run.** A VS Code-style editor on the left, a pixel-art world on the right that executes your code line by line.
- **Wolf vs Mykyta.** After every solution you see how many steps brute force (the Greedy Wolf) would take. O(n²) versus O(n) becomes something you can see.
- **Ukrainian classics.** The frame story is Kotliarevsky's *Aeneid*: Juno shattered the Crystal Pysanka, its shards fell into other books, and Aeneas sails from world to world to collect them — Franko's fox, *The Mitten*, Lesya Ukrainka's *Forest Song*, the Carpathians of Kotsiubynsky, Kvitka-Osnovianenko's *Konotop Witch*.

Languages: TypeScript and JavaScript today, then Python, then C#, C++ and Go. The game is an offline desktop app (Electron) for macOS, Windows and Linux, in Ukrainian and English.

## Status

**Pre-alpha.** The design is done: story, 16 worlds mapped to techniques, a 14-scene onboarding, characters and their pixel-art, a UI mock-up, and the website. The game app in `app/` has the MVP content: the onboarding with speaking characters and a guided tour, and worlds 0–2 (16 exercises, from the first `enei.move()` to *Container With Most Water*), each with a sandboxed runner, an animated world, tests and the Wolf comparison — in Ukrainian and English. Installers for macOS, Windows and Linux are built on every release tag, and the installed app updates itself from GitHub Releases. The technical plan is in [docs/MVP.md](docs/MVP.md); see also the [roadmap](#roadmap).

## Download

Installers are on the [Releases page](https://github.com/f3an/kodeida/releases): `.dmg` for macOS, `Kodeida-Setup-….exe` for Windows, `.AppImage` for Linux. The app checks for new versions on start and every 6 hours (also **Kodeida → Check for Updates…** in the menu and **Settings → Updates**), downloads them in the background and installs on restart.

## What's in this repository

```
app/                  the game: Electron + React + TypeScript + Monaco
  electron/           main process: window, app:// protocol, CSP, menu, auto-update
  build/              app icon and macOS entitlements for electron-builder
  scripts/            selftest (engine and every level), sync-sprites (site → game)
  src/engine/         sandbox Worker, runner, judge — no UI
  src/levels/         worlds 0–2 as data, English texts, Book of Tricks
  src/world/          sprites.js (generated from site/app.js) and the in-level scenes
  src/ui/             screens: menu, onboarding, level, map, book, shirt, settings
site/                 the website, deployed to GitHub Pages
  index.html          landing page (UA / EN)
  artbook.html        artbook (UA / EN): animations, progress, screens, UI kit, onboarding, identity
  app.js              shared script: pixel-art renderer, scenes, journey map, i18n — the game imports it
  style.css           shared styles, light and dark themes
docs/
  NOTES.md            the original idea, decisions and plan
  MVP.md              technical plan of the MVP
  BRAND.md            brand book: name, mascot, palette, voice
  LORE.md             world, characters, the Crystal Pysanka, onboarding outline
  STORY.md            the full campaign: 6 songs, 16 worlds, problems per world
  ONBOARDING.md       scene-by-scene script of the intro
```

All characters and scenes are drawn in code (`site/app.js`): small sprites are rasterised from shapes, upscaled with Scale2x and shaded with cel lines. There are no image assets. The game uses the same code: after changing sprites or scenes on the site, run `npm run sync-sprites` in `app/`.

## Run the game

Requires Node.js 22 or newer.

```bash
cd app
npm install
npm run dev            # in the browser: http://localhost:5173
npm start              # build and open the Electron app
npm run selftest       # engine and every level, without a browser
npm run sync-sprites   # copy sprites, scenes and the map from site/app.js
npm run dist           # installers for the current OS into app/release/
```

Useful environment variables: `KODEIDA_USER_DATA=/tmp/kd` starts with a fresh profile (onboarding from scratch), `KODEIDA_SMOKE=1` runs a smoke test and exits, `KODEIDA_SMOKE=update` checks for updates in a packaged build and prints the result.

Releases: bump the version in `app/package.json`, push a `vX.Y.Z` tag — see [CONTRIBUTING.md](CONTRIBUTING.md#releases).

## Run the site locally

No build step. Serve the `site/` folder with any static server:

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

Every push to `main` that touches `site/` redeploys GitHub Pages via [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

## Roadmap

1. ✅ **Technical plan for the MVP** ([docs/MVP.md](docs/MVP.md)) and the first playable level: sandboxed runner in a Web Worker with timeouts, "code → event log → animation", tests and the Wolf comparison.
2. ✅ **MVP** — Electron + React + Monaco; onboarding, worlds 0–2 (Ashes of Troy, Sea of Aeolus, Dido's Carthage); TypeScript and JavaScript; Ukrainian and English; installers, releases and auto-update.
3. **First playtest** with 10–20 people. The metric: can they solve the real *Container With Most Water* afterwards, without the game?
4. **Python** in the app (Pyodide), then **all 16 worlds**, the Book of Tricks and the embroidered-shirt progress.
5. **C#, C++, Go**, then new campaigns: algorithms, data structures, OOP.

## Contributing

Ideas, art, story, translations and accessibility feedback are welcome right now. The app is young and changes fast; for code, open an issue first so we can agree on the approach. Start with [CONTRIBUTING.md](CONTRIBUTING.md). By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

Want to propose a new world? Use the **World idea** issue template: one work of Ukrainian literature in the public domain, one technique.

## Security and accessibility

- Security issues: please report privately — see [SECURITY.md](SECURITY.md).
- Accessibility barriers are bugs — see [ACCESSIBILITY.md](ACCESSIBILITY.md).

## Credits

Characters and settings are based on public-domain texts: Ivan Kotliarevsky (*Eneida*), Ivan Franko (*Mykyta the Fox*, *The Painted Fox*), Lesya Ukrainka (*The Forest Song*), Mykhailo Kotsiubynsky (*Shadows of Forgotten Ancestors*), Hryhorii Kvitka-Osnovianenko (*The Konotop Witch*) and Ukrainian folk tales. All designs are original; nothing is copied from film or cartoon adaptations.

## License

- **Code** (everything in `app/` and `site/`, workflows): [Apache License 2.0](LICENSE).
- **Content** (story, lore, brand and design documents in `docs/`): [CC BY-SA 4.0](LICENSE-CONTENT.md).
