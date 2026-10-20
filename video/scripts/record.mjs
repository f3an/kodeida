// Записує чисті кадри гри у 2× для трейлера (замість GIF 860×538).
// Потрібен запущений сервер гри: cd app && npx vite --port 5173, або збірка без dev-панелі:
// npx vite build && npx vite preview --port 5174, тоді KODEIDA_URL=http://localhost:5174/
// Запуск: node scripts/record.mjs [play|map|abc|intro|shot] [uk|en]
import { chromium } from 'playwright-core';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const URL = process.env.KODEIDA_URL || 'http://localhost:5173/';
const W = 1280;
const H = 800;

const ALL_SOLVED = (ids) => Object.fromEntries(ids.map((id) => [id, { stars: 3, hintsUsed: 0 }]));
const WORLD_IDS = {
  troy: 'step well far sacks gather walk fire last count total sum',
  sea: 'max swap reverse zeroes sort colors',
  carthage: 'meet mirror palindrome twosum dups dido',
  forest: 'dup most anagram twosum groups topk',
  mitten: 'order parens min rpn temps',
  konotop: 'search insert barrel rotated pies',
  sicily: 'laps boat song fight board',
  chumak: 'walk reverse middle merge cycle',
  hell: 'descent boats subsets perms coins',
};
const ids = (worlds) => worlds.flatMap((w) => WORLD_IDS[w].split(' ').map((l) => `${w}.${l}`));

const DIDO = 'function maxArea(height: number[]): number {\n  let l = 0, r = height.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, (r - l) * Math.min(height[l], height[r]));\n    if (height[l] < height[r]) l++; else r--;\n  }\n  return best;\n}';

async function open(state, ui) {
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await ctx.addInitScript(
    ({ state, ui }) => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.clear();
      const all = { settings: { lang: 'ts', speed: 1, ui }, ...state };
      for (const [k, v] of Object.entries(all)) localStorage.setItem('kodeida.' + k, JSON.stringify(v));
    },
    { state, ui },
  );
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.waitForTimeout(1500);
  return { browser, page, ctx };
}

/** Запис через CDP screencast: кадри з мітками часу → mp4 30 fps без втрат якості. */
async function record(page, name, act) {
  const dir = `out/rec/${name}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, data });
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: W * 2, maxHeight: H * 2 });
  await act();
  await page.waitForTimeout(300);
  await cdp.send('Page.stopScreencast');
  const end = frames.at(-1).t + 0.5;
  let list = '';
  frames.forEach((f, i) => {
    const file = `f${String(i).padStart(5, '0')}.jpg`;
    writeFileSync(`${dir}/${file}`, Buffer.from(f.data, 'base64'));
    const next = i + 1 < frames.length ? frames[i + 1].t : end;
    list += `file '${file}'\nduration ${(next - f.t).toFixed(4)}\n`;
  });
  writeFileSync(`${dir}/list.txt`, list);
  const out = `public/rec-${name}.mp4`;
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', `${dir}/list.txt`, '-vf', `fps=30,scale=${W * 2}:${H * 2}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', out]);
  rmSync(dir, { recursive: true, force: true });
  console.log(`${out}: ${frames.length} кадрів, ${(end - frames[0].t).toFixed(1)} с`);
}

const main = process.argv[1]?.endsWith('record.mjs');
const [what = main ? 'shot' : '', ui = 'uk'] = main ? process.argv.slice(2) : [];
const base = { levels: {}, onboarded: true, toured: true, departed: true, path: 'algo', prologue: true, voyages: [0, 1, 2, 3, 4, 5, 6, 7] };

if (what === 'shot') {
  // пробні скриншоти екранів
  const screens = {
    level: { screen: { name: 'level', id: 'carthage.dido' }, progress: { ...base, levels: ALL_SOLVED(ids(['troy', 'sea'])) } },
    map: { screen: { name: 'map' }, progress: { ...base, levels: ALL_SOLVED(ids(Object.keys(WORLD_IDS))) } },
    abc: { screen: { name: 'abetka', lang: 'py' }, progress: { ...base, path: 'abc' } },
    intro: { screen: { name: 'onboarding', story: 'intro' }, progress: { levels: {}, onboarded: false } },
  };
  mkdirSync('out/shots', { recursive: true });
  for (const [k, st] of Object.entries(screens)) {
    const { browser, page } = await open(st, ui);
    await page.screenshot({ path: `out/shots/${k}.png` });
    await browser.close();
  }
  console.log('shots ok');
}

if (what === 'site') {
  // знімок Абетки для лендінгу: Python виводить куплет Колобка, рядки на сувої біля Сивілли (1600×1000)
  const verse = 'def verse():\n    print("Я Колобок, Колобок!")\n    print("Я по засіку метений,")\n    print("Я від баби втік!")\n';
  const { browser, page } = await open({ screen: { name: 'level', id: 'abc.py.kolobok.verse' }, progress: { ...base, path: 'abc', levels: ALL_SOLVED(['abc.py.kolobok.song']) }, 'code.abc.py.kolobok.verse.py': verse }, ui);
  await page.waitForTimeout(2500);
  await page.getByRole('button', { name: ui === 'uk' ? /Запустити/ : /Run/ }).first().click();
  await page.waitForTimeout(4500);
  mkdirSync('out/shots', { recursive: true });
  await page.screenshot({ path: `out/shots/abc-${ui}.png` });
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', `out/shots/abc-${ui}.png`, '-vf', 'scale=1600:1000:flags=lanczos', '-q:v', '3', `../site/media/abc-${ui}.jpg`]);
  await browser.close();
  console.log(`site/media/abc-${ui}.jpg`);
}

const carthageOpen = ids(['troy', 'sea', 'carthage']).filter((id) => id !== 'carthage.dido');
const FLOWS = {
  // Задача Дидони: готове рішення → «Запустити» (вказівники бігають стовпами) → «Суд богів»
  play: async () => {
    const { browser, page } = await open(
      {
        screen: { name: 'level', id: 'carthage.dido' },
        progress: { ...base, levels: ALL_SOLVED(carthageOpen) },
        settings: { lang: 'ts', speed: 2, ui },
        'code.carthage.dido.ts': DIDO,
      },
      ui,
    );
    await page.waitForTimeout(1500);
    await record(page, `play-${ui}`, async () => {
      await page.waitForTimeout(700);
      await page.getByRole('button', { name: ui === 'uk' ? /Запустити/ : /Run/ }).first().click();
      await page.waitForTimeout(7200);
      await page.getByRole('button', { name: ui === 'uk' ? /Суд богів/ : /Judgement/ }).last().click();
      await page.waitForTimeout(3500);
    });
    await browser.close();
  },
  // Мапа світів: стрілкою «→» від світу 0 до 15
  map: async () => {
    const { browser, page } = await open({ screen: { name: 'map' }, progress: { ...base, levels: ALL_SOLVED(ids(Object.keys(WORLD_IDS))) } }, ui);
    const prev = page.getByRole('button', { name: ui === 'uk' ? 'Попередній світ' : 'Previous world' });
    const next = page.getByRole('button', { name: ui === 'uk' ? 'Наступний світ' : 'Next world' });
    // стрілки ходять по колу, а мапа відкривається на останньому відкритому світі (8)
    for (let i = 0; i < 8; i++) await prev.click();
    await page.waitForTimeout(800);
    await record(page, `map-${ui}`, async () => {
      await page.waitForTimeout(500);
      for (let i = 0; i < 15; i++) {
        await next.click();
        await page.waitForTimeout(380);
      }
      await page.waitForTimeout(400);
    });
    await browser.close();
  },
  // Абетка: вибір Python → перша вправа → «Запустити», пісня Колобка на сувої
  abc: async () => {
    const song = 'Я Колобок, Колобок!'; // гра чекає саме цей рядок і в англійській версії
    const { browser, page } = await open(
      { screen: { name: 'abetka', lang: 'py' }, progress: { ...base, path: 'abc' }, 'code.abc.py.kolobok.song.py': `def sing():\n    print("${song}")\n` },
      ui,
    );
    await record(page, `abc-${ui}`, async () => {
      await page.waitForTimeout(1300);
      await page.click('.abc-go .run');
      await page.waitForTimeout(2600);
      await page.click('.btn.run');
      await page.waitForTimeout(4200);
    });
    await browser.close();
  },
  // Інтро: заставки на Олімпі, «Далі →» щопівтори секунди
  intro: async () => {
    const { browser, page } = await open({ screen: { name: 'onboarding', story: 'intro' }, progress: { levels: {}, onboarded: false } }, ui);
    await record(page, `intro-${ui}`, async () => {
      for (let i = 0; i < 7; i++) {
        await page.waitForTimeout(1500);
        await page.click('.btn.run');
      }
      await page.waitForTimeout(1200);
    });
    await browser.close();
  },
};
if (FLOWS[what]) await FLOWS[what]();
if (what === 'all') for (const l of ['uk', 'en']) for (const f of Object.keys(FLOWS)) execFileSync('node', ['scripts/record.mjs', f, l], { stdio: 'inherit' });

export { open, record, DIDO, ALL_SOLVED, ids, WORLD_IDS, base, W, H };
