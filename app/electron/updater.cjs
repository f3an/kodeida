// Автооновлення з GitHub Releases (electron-updater), як у Mova-Flow:
// перевірка під час запуску й кожні 6 годин; завантаження автоматичне або за кнопкою;
// встановлення — після перезапуску, який обирає гравець.
const { app, ipcMain, Notification } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const CONFIG = () => path.join(app.getPath('userData'), 'updates.json');
const readConfig = () => { try { return { autoUpdate: true, ...JSON.parse(fs.readFileSync(CONFIG(), 'utf8')) }; } catch { return { autoUpdate: true }; } };
const writeConfig = (c) => { try { fs.writeFileSync(CONFIG(), JSON.stringify(c)); } catch { /* немає доступу — не пам'ятаємо */ } };

let state = { stage: 'idle', version: null, error: null, percent: 0, auto: true, supported: false };
let getWindow = () => null;
let autoUpdater = null;

function setState(patch) {
  state = { ...state, ...patch };
  getWindow()?.webContents.send('update:state', state);
}

const notified = new Set();
function notify(kind, version) {
  const key = `${kind}:${version}`;
  const win = getWindow();
  if (notified.has(key) || !Notification.isSupported() || (win && win.isVisible() && win.isFocused())) return;
  notified.add(key);
  const uk = app.getLocale().startsWith('uk');
  const body = kind === 'available'
    ? (uk ? `Доступна нова версія ${version}. Відкрий Кодеїду, щоб завантажити.` : `Version ${version} is available. Open Kodeida to download it.`)
    : (uk ? `Версія ${version} завантажена. Перезапусти Кодеїду, щоб оновитися.` : `Version ${version} is downloaded. Restart Kodeida to update.`);
  const n = new Notification({ title: uk ? 'Кодеїда' : 'Kodeida', body });
  n.on('click', () => { const w = getWindow(); if (w) { w.show(); w.focus(); } });
  n.show();
}

const busy = () => state.stage === 'downloading' || state.stage === 'downloaded';

function download() {
  if (!autoUpdater || busy()) return;
  setState({ stage: 'downloading', percent: 0, error: null });
  autoUpdater.downloadUpdate().catch((err) => setState({ stage: 'error', error: err.message }));
}

function init(windowGetter) {
  getWindow = windowGetter;
  state.auto = readConfig().autoUpdate;

  ipcMain.handle('update:get', () => state);
  ipcMain.handle('update:download', () => { if (state.stage === 'available' || (state.stage === 'error' && state.version)) download(); });
  ipcMain.handle('update:install', () => { if (state.stage === 'downloaded') autoUpdater.quitAndInstall(); });
  ipcMain.handle('update:set-auto', (_e, on) => {
    writeConfig({ ...readConfig(), autoUpdate: !!on });
    setState({ auto: !!on });
    if (on && state.stage === 'available') download();
    return state;
  });
  ipcMain.handle('update:check', async () => {
    if (!autoUpdater) return { ...state, stage: 'not-available' };
    try { await autoUpdater.checkForUpdates(); } catch (err) { setState({ stage: 'error', error: err.message }); }
    return state;
  });

  // electron-updater читає app-update.yml, який є лише в зібраному застосунку.
  if (!app.isPackaged) return;
  ({ autoUpdater } = require('electron-updater'));
  state.supported = true;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('checking-for-update', () => { if (!busy()) setState({ stage: 'checking' }); });
  autoUpdater.on('update-not-available', () => { if (!busy()) setState({ stage: 'not-available' }); });
  autoUpdater.on('error', (err) => { if (state.stage !== 'downloaded') setState({ stage: 'error', error: err.message }); });
  autoUpdater.on('download-progress', (p) => setState({ stage: 'downloading', percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', (info) => { setState({ stage: 'downloaded', version: info.version, percent: 100 }); notify('downloaded', info.version); });
  autoUpdater.on('update-available', (info) => {
    if (busy()) return;
    setState({ stage: 'available', version: info.version, error: null });
    if (readConfig().autoUpdate) download(); else notify('available', info.version);
  });

  const check = () => void autoUpdater.checkForUpdates().catch(() => {});
  check();
  setInterval(check, 6 * 60 * 60 * 1000);
}

module.exports = { init };
