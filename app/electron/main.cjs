// Головний процес Electron: одне вікно, збірка з dist/ через протокол app://, без мережі й Node в інтерфейсі.
const { app, BrowserWindow, protocol, net, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const updater = require('./updater.cjs');

const DIST = path.join(__dirname, '..', 'dist');
const DEV_URL = process.env.KODEIDA_DEV_URL;
const SMOKE = process.env.KODEIDA_SMOKE === '1';

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

app.whenReady().then(() => {
  protocol.handle('app', serve);
  updater.init(() => mainWindow);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
