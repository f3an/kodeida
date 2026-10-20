# Кодеїда · ролики

Трейлер, ролик до релізу й вертикальні Reels на [Remotion](https://www.remotion.dev). Герої й світи — новий арт гри (`npm run art` копіює PNG з `app/src/assets/art` і рендери сайту в `public/art`), музику синтезує `scripts/music.mjs`.

```bash
npm install
npm run sfx        # звукові ефекти з remotion.media → public/
npm run music      # музика трейлера й ролика до релізу → public/
npm run art        # новий арт гри й рендери сайту → public/art
npm run record     # кадри гри у 2560×1600 → public/ (сервер гри: див. CONTRIBUTING, KODEIDA_URL)
npm run dev        # Remotion Studio
npx remotion render Trailer-uk out/kodeida-trailer-uk.mp4
```

Композиції: `Trailer-uk/en`, `Launch-uk/en`, `Reels-uk/en`, `Reels-cover-uk/en` і окремі сцени в папці Scenes.
Як стиснути трейлер для сайту — у [CONTRIBUTING.md](../CONTRIBUTING.md#trailer-and-videos).
