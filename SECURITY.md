# Security policy

## Scope

Today Kodeida is a static website (`site/`) and a set of design documents. The game itself — an offline Electron app that runs code written by the player — is planned but not yet written.

Security reports are in scope for:

- The website: anything that lets third-party content run scripts on the GitHub Pages site, or leaks data from a visitor's browser (the site only stores the chosen theme and language in `localStorage`).
- The repository's automation: GitHub Actions workflows (`.github/workflows/`) and the Pages deployment.
- Once the app exists: the sandbox that runs player code (Web Worker isolation, timeouts, access to the file system or network), the Electron process boundary, and the packaging pipeline.

## Supported versions

Only the current `main` branch and the deployed website are supported.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a security vulnerability.

Instead, report it privately:

- Preferred: [GitHub Security Advisories](https://github.com/f3an/kodeida/security/advisories/new) for this repository.
- Alternative: email **chernyavskiy2019ios@gmail.com** with a description, reproduction steps and impact.

Please include what is affected (page, workflow, commit), steps to reproduce, and what an attacker could actually do with it. We'll acknowledge reports as soon as we can and follow up once a fix is available. Please give us a reasonable window to ship a fix before any public disclosure.
