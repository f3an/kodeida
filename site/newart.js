/*
 * Новий арт (PixelLab) поверх сцен, які малює app.js. app.js — джерело sprites.js гри, тож його малювання
 * не чіпаємо: тут лише ховаємо старе полотно і ставимо на його місце картинку з media/art/new.
 * Картинки зроблено з самої гри (той самий фон, герої й колір Микити), тож сайт і гра збігаються.
 */
(function () {
  const BASE = 'media/art/new/';
  const pad = (n) => String(n).padStart(2, '0');
  /** Картинка замість полотна: полотно ховаємо, картинка займає його місце з тими ж класами. */
  function cover(canvas, cls) {
    if (!canvas) return null;
    const img = document.createElement('img');
    img.className = 'na ' + (cls || '');
    img.alt = canvas.getAttribute('aria-label') || '';
    img.decoding = 'async';
    canvas.after(img);
    canvas.classList.add('na-hidden');
    return img;
  }

  /* ---------- обкладинка: Еней, Писанка і Микита ---------- */
  const hero = cover(document.getElementById('hero'), 'na-hero');
  if (hero) { hero.src = BASE + 'hero.png'; hero.width = 720; hero.height = 320; }

  /* ---------- мапа світів: картка світу ---------- */
  const jArt = cover(document.getElementById('j-art'), 'na-world');
  const jCount = document.getElementById('j-count');
  if (jArt && jCount) {
    const sync = () => { const n = parseInt(jCount.textContent, 10); if (!isNaN(n)) jArt.src = `${BASE}world-${pad(n)}.png`; };
    new MutationObserver(sync).observe(jCount, { childList: true, characterData: true, subtree: true });
    sync();
  }

  /* ---------- галерея героїв ---------- */
  const stage = document.getElementById('ch-stage');
  const stageImg = cover(stage, 'na-char');
  /* «Піксельний дощ» між героями, як у старій галереї: пікселі старого спрайта осипаються, нові падають на місце.
     Малюємо на своєму полотні в сітці спрайта; картинка-заглушка лишається для доступності й без JS-анімації. */
  const rain = document.createElement('canvas');
  rain.className = 'na na-char na-rain'; rain.width = 288; rain.height = 320; rain.setAttribute('aria-hidden', 'true');
  if (stageImg) { stageImg.after(rain); stageImg.classList.add('na-sr'); }
  const pix = new Map();
  /** Пікселі картинки: { w, h, p: [[x, y, 'rgba'], …] } (кеш за адресою). */
  function pixels(src) {
    if (pix.has(src)) return Promise.resolve(pix.get(src));
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        const d = g.getImageData(0, 0, im.width, im.height).data, p = [];
        for (let y = 0; y < im.height; y++) for (let x = 0; x < im.width; x++) {
          const i = (y * im.width + x) * 4;
          if (d[i + 3] > 20) p.push([x, y, `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`]);
        }
        const r = { w: im.width, h: im.height, p }; pix.set(src, r); res(r);
      };
      im.onerror = () => res(null);
      im.src = src;
    });
  }
  const hsh = (x, y) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v); };
  const place = (sp) => { const S = Math.max(1, Math.floor(Math.min(270 / sp.w, 312 / sp.h))); return [S, Math.round((288 - sp.w * S) / 2), 316 - sp.h * S]; };
  let shownSp = null, rainId = 0;
  function rainTo(src) {
    const id = ++rainId;
    pixels(src).then((B) => {
      if (id !== rainId || !B) return;
      const A = shownSp; shownSp = B;
      const g = rain.getContext('2d'), t0 = performance.now(), dur = !A || matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650;
      const frame = (now) => {
        if (id !== rainId) return;
        const p = dur ? Math.min(1, (now - t0) / dur) : 1;
        g.clearRect(0, 0, 288, 320);
        if (A && p < 1) {
          const [S, ox, oy] = place(A);
          // кожен піксель спрайта розсипається на дрібні крихти (2×2) зі своєю затримкою
          const k = Math.max(1, S >> 1), q = S / k;
          for (const [x, y, c] of A.p) {
            g.fillStyle = c;
            for (let sy = 0; sy < k; sy++) for (let sx = 0; sx < k; sx++) {
              const fx = x * k + sx, fy = y * k + sy, d = Math.min(1, Math.max(0, (p - hsh(fx, fy) * 0.5) / 0.35));
              if (d >= 1) continue;
              g.globalAlpha = 1 - d * 0.6; g.fillRect(ox + fx * q + (hsh(fy, fx) - 0.5) * d * 24, oy + fy * q + d * d * 64, q, q);
            }
          }
        }
        const [S, ox, oy] = place(B);
        const k = Math.max(1, S >> 1), z = S / k;
        for (const [x, y, c] of B.p) {
          g.fillStyle = c;
          if (p >= 1) { g.globalAlpha = 1; g.fillRect(ox + x * S, oy + y * S, S, S); continue; }
          for (let sy = 0; sy < k; sy++) for (let sx = 0; sx < k; sx++) {
            const fx = x * k + sx, fy = y * k + sy, q = Math.min(1, Math.max(0, (p - 0.18 - hsh(fx + 7, fy + 3) * 0.52) / 0.3));
            if (q <= 0) continue;
            const e = 1 - Math.pow(1 - q, 3);
            g.globalAlpha = 0.35 + 0.65 * e; g.fillRect(ox + fx * z, oy + fy * z - (1 - e) * 72, z, z);
          }
        }
        g.globalAlpha = 1;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    });
  }
  const list = document.getElementById('ch-list'), vars = document.getElementById('ch-vars'), colors = document.getElementById('ch-colors');
  // id персонажа (як у CHARS app.js) → картинка; для варіацій — окремі картинки, решта варіацій лишається старими
  const VARIANTS = { enei: ['enei', 'enei-start', 'enei-coat', 'enei-sabre', 'enei-feast'], fox: [null, 'fox-wild', 'fox-ostromysl', 'fox-13'], wolf: ['wolf', 'wolf-wild', 'wolf-greedy'] };
  const HAS = new Set(['juno', 'turn', 'eol', 'dido', 'lion', 'mitten', 'sotnyk', 'charon', 'anchises', 'molfar', 'sibyl', 'acestes', 'ox', 'mavka', 'kozh', 'vulcan',
    'kolobok', 'ripka', 'horoshko', 'koza', 'bychok', 'kotsky', 'vixen', 'ivasyk']);
  let foxWorld = 3;
  function imageFor(id, v) {
    if (id === 'fox' && v === 0) return `fox-${pad(foxWorld)}`;
    if (VARIANTS[id]) return VARIANTS[id][v] || null;
    return v === 0 && HAS.has(id) ? id : null;
  }
  /** Мініатюри варіацій: новий арт там, де він є (Основний, На старті, У жупані…). */
  function drawVars(id) {
    if (!vars) return;
    vars.querySelectorAll('.var').forEach((btn, k) => {
      const name = imageFor(id, k), cv = btn.querySelector('canvas');
      if (!name || !cv) return;
      const img = new Image();
      img.onload = () => {
        const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, s = Math.min(W / img.width, H / img.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, Math.round((W - img.width * s) / 2), Math.round(H - img.height * s), img.width * s, img.height * s);
      };
      img.src = `${BASE}chars/${name}.png`;
    });
  }
  function syncChar() {
    if (!stageImg || !list) return;
    const on = list.querySelector('.ch-item.on'), id = on && on.dataset.id;
    if (id) drawVars(id);
    const vi = vars ? [...vars.querySelectorAll('.var')].findIndex((b) => b.classList.contains('on')) : 0;
    const name = id && imageFor(id, Math.max(0, vi));
    if (name) {
      const src = `${BASE}chars/${name}.png`;
      if (!stageImg.src.endsWith(src)) { stageImg.src = src; rainTo(src); }
      stageImg.hidden = false; rain.hidden = false; stage.classList.add('na-hidden');
    } else { stageImg.hidden = true; rain.hidden = true; shownSp = null; stage.classList.remove('na-hidden'); }
  }
  // мініатюри у списку: голова й плечі нового арту замість старого спрайта
  const thumbCache = {};
  function thumb(id) {
    const name = imageFor(id, 0);
    if (!name) return null;
    if (!thumbCache[name]) { const i = new Image(); i.src = `${BASE}chars/${name}.png`; thumbCache[name] = i; }
    return thumbCache[name];
  }
  function drawThumbs() {
    if (!list) return;
    list.querySelectorAll('.ch-item').forEach((b) => {
      const img = thumb(b.dataset.id), cv = b.querySelector('canvas');
      if (!img || !cv) return;
      const paint = () => {
        const ctx = cv.getContext('2d'), s = Math.min(cv.width / 36, cv.height / 36) || 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.imageSmoothingEnabled = false;
        const w = Math.min(img.width, 36), sx = Math.max(0, Math.round((img.width - w) / 2));
        ctx.drawImage(img, sx, 0, w, Math.min(img.height, 36), Math.round((36 - w) / 2 * s), 0, w * s, Math.min(img.height, 36) * s);
      };
      img.complete && img.naturalWidth ? paint() : img.addEventListener('load', paint, { once: true });
    });
  }
  if (list) {
    new MutationObserver(() => { drawThumbs(); syncChar(); }).observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    if (vars) new MutationObserver(syncChar).observe(vars, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    if (colors) colors.addEventListener('click', (e) => {
      const b = e.target.closest('.swatch'); if (!b) return;
      const m = /(\d+)/.exec(b.title || ''); if (m) foxWorld = +m[1];
      setTimeout(syncChar, 0);
    });
    drawThumbs(); syncChar();
  }

  /* ---------- артбук: заставки онбордингу ---------- */
  const obC = document.getElementById('ob-canvas'), obTitle = document.getElementById('ob-title');
  const obImg = cover(obC, 'na-ob');
  if (obImg && obTitle) {
    const HAVE = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    const sync = () => {
      const i = parseInt(obTitle.textContent, 10) - 1;
      if (HAVE.has(i)) { obImg.src = `${BASE}cut-${i}.png`; obImg.hidden = false; obC.classList.add('na-hidden'); }
      else { obImg.hidden = true; obC.classList.remove('na-hidden'); }
    };
    new MutationObserver(sync).observe(obTitle, { childList: true, characterData: true, subtree: true });
    sync();
  }

  /* ---------- аркуші «Редизайну»: вкладки, переглядачі, обертовий герой ---------- */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** Чи видно елемент на екрані (анімації крутяться лише тоді). */
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && el.offsetParent !== null; };
  document.querySelectorAll('.rd-tabs').forEach((box) => {
    const btns = [...box.querySelectorAll(':scope > .rd-tabbar > button')], panes = [...box.querySelectorAll(':scope > .rd-pane')];
    btns.forEach((b, i) => b.addEventListener('click', () => {
      btns.forEach((x, k) => x.classList.toggle('on', k === i)); panes.forEach((x, k) => x.classList.toggle('on', k === i));
    }));
  });
  document.querySelectorAll('.rd-view').forEach((box) => {
    const slides = [...box.querySelectorAll('.rd-slide')], rail = [...box.querySelectorAll('.rd-rail > button')];
    let i = 0, user = false, hover = false;
    const show = (k) => {
      i = (k + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('on', n === i)); rail.forEach((b, n) => b.classList.toggle('on', n === i));
      rail[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    rail.forEach((b, k) => b.addEventListener('click', () => { user = true; show(k); }));
    box.addEventListener('mouseenter', () => { hover = true; }); box.addEventListener('mouseleave', () => { hover = false; });
    const auto = +box.dataset.auto || 0;
    if (auto && !reduced) setInterval(() => { if (!user && !hover && visible(box)) show(i + 1); }, auto);
  });
  document.querySelectorAll('.rd-turntable').forEach((box) => {
    const img = box.querySelector('.rd-tt-img'), dots = [...box.querySelectorAll('.rd-tt-dirs i')], heroes = [...box.querySelectorAll('.rd-tt-list button')];
    let frames = heroes[0].dataset.frames.split('|'), d = 0, h = 0, user = false, spins = 0;
    // кадри всіх героїв підвантажуємо наперед, щоб обертання не блимало
    const pre = (b) => b.dataset.frames.split('|').forEach((s) => { new Image().src = s; });
    const pick = (k) => { h = k; frames = heroes[k].dataset.frames.split('|'); d = 0; spins = 0; pre(heroes[k]); heroes.forEach((b, n) => b.classList.toggle('on', n === k)); };
    heroes.forEach((b, k) => b.addEventListener('click', () => { user = true; pick(k); }));
    pick(0);
    const tick = () => {
      if (!visible(box)) return;
      d = (d + 1) % frames.length; if (d === 0) spins++;
      img.src = frames[d]; dots.forEach((x, n) => x.classList.toggle('on', n === d));
      // сам переходить до наступного героя після двох обертів, поки гравець не обрав свого
      if (!user && spins >= 2) pick((h + 1) % heroes.length);
    };
    if (!reduced) setInterval(tick, 320);
  });

  /* повзунки «до/після»: коли вперше з'являються на екрані, ручка ледь гойдається — підказка, що її тягнуть */
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const ba = e.target; io.unobserve(ba);
      if (ba.dataset.touched) return;
      ba.classList.add('ba-nudge');
      ba.addEventListener('animationend', () => ba.classList.remove('ba-nudge'), { once: true });
    }), { threshold: 0.6 });
    document.querySelectorAll('.ba').forEach((ba) => {
      io.observe(ba);
      ba.querySelector('input')?.addEventListener('input', () => { ba.dataset.touched = '1'; ba.classList.remove('ba-nudge'); }, { once: true });
    });
  }

  /* ---------- переклад нового аркуша артбука ---------- */
  const DICT = globalThis.__kodeidaDict, retranslate = globalThis.__kodeidaRetranslate;
  if (DICT) {
    Object.assign(DICT, {
      'Редизайн': 'Redesign',
      'Аркуш 12 · Редизайн 2026': 'Sheet 12 · The 2026 redesign',
      'Нові герої, світи й заставки': 'New heroes, worlds and cutscenes',
      'Персонажів і фони перемалювали в PixelLab: низька роздільність, ×2 у сцені, чіткі обличчя. Нижче — як було і як стало, анімації, заставки і відкинуті варіанти.': 'Characters and backgrounds were redrawn in PixelLab: low resolution, ×2 in the scene, clear faces. Below: before and after, animations, cutscenes and the variants we rejected.',
      'Світи: код → PixelLab': 'Worlds: code → PixelLab',
      'Герої': 'Heroes',
      'Лис Микита в шістнадцяти світах': 'Mykyta the Fox in sixteen worlds',
      'Хутро перефарбовується в коді: тон змінюється, тіні й відблиски лишаються.': 'The fur is recoloured in code: the hue changes, shadows and highlights stay.',
      'Анімації': 'Animations',
      'Хода, стрибок, бенкет богів, Вовк ковтає уламок, жупан у холодних світах.': 'Walking, jumping, the gods’ feast, the Wolf swallowing a shard, the zhupan in cold worlds.',
      'Заставки': 'Cutscenes',
      'Відкинуті варіанти': 'Rejected variants',
      'HD 128 px — надто гладко для піксель-арту гри.': 'HD 128 px: too smooth for the game’s pixel art.',
      'Оселедець-дужка «{» — від ідеї відмовились.': 'The “{” forelock: the idea was dropped.',
      'Пошуки стилю: A — як у Лиса, B, C.': 'Style search: A like the Fox, B, C.',
      'Перемальовані обличчя: було → стало.': 'Redrawn faces: before → after.',
    });
    // підписи аркуша, згенеровані разом із картинками (newart-dict.js)
    Object.assign(DICT, window.NEWART_EN || {}, { 'Усі 16 світів: було → стало': 'All 16 worlds: before → after' });
    Object.assign(DICT, {
      'Еней · хода': 'Aeneas · walk', 'Еней · стрибок': 'Aeneas · jump', 'Микита · хода': 'Mykyta · walk', 'Еней у жупані': 'Aeneas in a zhupan',
      'Воїн': 'Warrior', 'Моряк': 'Sailor', 'Жінка з клунком': 'Woman with a bundle', 'Анхіз': 'Anchises', 'Зевс · тост': 'Zeus · toast',
      'Вакх · виноград': 'Bacchus · grapes', 'Аполлон · ліра': 'Apollo · lyre', 'Вовк ковтає уламок': 'The Wolf swallows a shard',
    });
    // аркуші «Редизайну» (12.1–12.10): app.js уже переклав сторінку без цих підписів — перекладаємо ще раз
    if (typeof retranslate === 'function') document.querySelectorAll('#redesign, [id^="rd-"]').forEach((sec) => retranslate(sec));
  }
})();
