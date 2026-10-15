// Головний процес Electron: одне вікно, збірка з dist/ через протокол app://, без мережі й Node в інтерфейсі.
const { app, BrowserWindow, Menu, protocol, net, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const updater = require('./updater.cjs');

const DIST = path.join(__dirname, '..', 'dist');
const DEV_URL = process.env.KODEIDA_DEV_URL;
const SMOKE = process.env.KODEIDA_SMOKE === '1';
// KODEIDA_SMOKE=update: перевірити оновлення на GitHub, надрукувати стан і вийти (для зібраного застосунку).
const SMOKE_UPDATE = process.env.KODEIDA_SMOKE === 'update';

// 'unsafe-eval' потрібен пісочниці: код гравця компілюється через eval у Worker'і.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval'",
  "worker-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data:",
  "connect-src 'self'",
].join('; ');

// KODEIDA_USER_DATA=<тека>: окремий профіль (наприклад, щоб пройти гру з нуля).
if (process.env.KODEIDA_USER_DATA) app.setPath('userData', process.env.KODEIDA_USER_DATA);

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

async function serve(req) {
  const { pathname } = new URL(req.url);
  const rel = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
  const file = path.normalize(path.join(DIST, rel));
  if (!file.startsWith(DIST + path.sep)) return new Response('Forbidden', { status: 403 });
  const res = await net.fetch(pathToFileURL(file).toString());
  const headers = new Headers(res.headers);
  headers.set('Content-Security-Policy', CSP);
  return new Response(res.body, { status: res.status, headers });
}

let mainWindow = null;

function createWindow() {
  const win = mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 680,
    backgroundColor: '#141b17',
    title: 'Кодеїда',
    show: !SMOKE,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
      additionalArguments: [`--kodeida-version=${app.getVersion()}`],
    },
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('app://') && !(DEV_URL && url.startsWith(DEV_URL))) e.preventDefault();
  });
  if (SMOKE) smoke(win);
  win.loadURL(DEV_URL || 'app://kodeida/index.html');
}

// KODEIDA_SMOKE=1: завантажити вікно, перевірити, що редактор і світ на місці, і вийти з кодом 0/1.
function smoke(win) {
  const errors = [];
  win.webContents.on('console-message', (e) => { if (e.level === 'error') errors.push(e.message); });
  win.webContents.on('did-finish-load', () => setTimeout(async () => {
    // Суд богів на стартовому коді: пісочниця має виконати код під CSP і винести вердикт.
    const state = await win.webContents.executeJavaScript(`new Promise((done) => {
      localStorage.setItem('kodeida.progress', JSON.stringify({ levels: {}, onboarded: true }));
      localStorage.setItem('kodeida.screen', JSON.stringify({ name: 'level', id: 'carthage.dido' }));
      if (!document.querySelector('.btn.judge')) { location.reload(); return done({ reload: true }); }
      document.querySelector('.btn.judge').click();
      const t0 = Date.now();
      const poll = () => {
        const v = document.querySelector('.ptabs .v');
        if (v || Date.now() - t0 > 8000) done({
          bridge: !!(window.kodeida && window.kodeida.updates),
          editor: !!document.querySelector('.monaco-editor'),
          world: !!document.querySelector('canvas.world'),
          verdict: v ? v.textContent : null,
        });
        else setTimeout(poll, 100);
      };
      poll();
    })`);
    console.log('smoke', JSON.stringify(state), 'errors', JSON.stringify(errors));
    if (state.reload) return; // перший прохід лише виставив прогрес — чекаємо наступного завантаження
    app.exit(state.editor && state.world && state.verdict && state.bridge && errors.length === 0 ? 0 : 1);
  }, 2500));
}

/** Меню застосунку мовою гри: «Перевірити оновлення…», правка (потрібна редактору), вигляд, вікно. */
function buildMenu() {
  const M = updater.M;
  const check = { label: M('Перевірити оновлення…', 'Check for Updates…'), click: () => updater.checkInteractive() };
  const about = { label: M('Про Кодеїду', 'About Kodeida'), click: () => app.showAboutPanel() };
  const site = { label: M('Сайт Кодеїди', 'Kodeida website'), click: () => shell.openExternal('https://f3an.github.io/kodeida/') };
  const issues = { label: M('Повідомити про помилку', 'Report a problem'), click: () => shell.openExternal('https://github.com/f3an/kodeida/issues/new/choose') };
  const mac = process.platform === 'darwin';
  const template = [
    ...(mac ? [{ label: app.name, submenu: [about, check, { type: 'separator' }, { role: 'hide', label: M('Сховати Кодеїду', 'Hide Kodeida') }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit', label: M('Вийти з Кодеїди', 'Quit Kodeida') }] }] : []),
    ...(mac ? [] : [{ label: M('Файл', 'File'), submenu: [{ role: 'quit', label: M('Вийти', 'Exit') }] }]),
    { label: M('Правка', 'Edit'), submenu: [{ role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }] },
    { label: M('Вигляд', 'View'), submenu: [{ role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' }, { type: 'separator' }, { role: 'togglefullscreen' }, ...(app.isPackaged ? [] : [{ role: 'toggleDevTools' }])] },
    { label: M('Вікно', 'Window'), role: 'windowMenu' },
    { label: M('Довідка', 'Help'), role: 'help', submenu: [...(mac ? [] : [check, about, { type: 'separator' }]), site, issues] },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  protocol.handle('app', serve);
  updater.init(() => mainWindow);
  app.setAboutPanelOptions({ applicationName: 'Kodeida', applicationVersion: app.getVersion(), copyright: '© 2026 Ihor Cherniavskyi · Apache-2.0', website: 'https://f3an.github.io/kodeida/' });
  buildMenu();
  updater.onLangChange(buildMenu);
  if (SMOKE_UPDATE) {
    updater.check().then(() => { console.log('update', JSON.stringify(updater.state())); app.exit(0); });
    return;
  }
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
