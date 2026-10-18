// Автооновлення з GitHub Releases (electron-updater), як у Mova-Flow:
// перевірка під час запуску й кожні 6 годин; завантаження автоматичне або за кнопкою;
// встановлення — після перезапуску, який обирає гравець, або під час наступного виходу з гри.
// На macOS завантажене оновлення ще має забрати й перевірити системний Squirrel. Робимо це одразу у фоні
// (autoInstallOnAppQuit), а «готово» показуємо лише тоді, коли Squirrel закінчив: інакше «Перезапустити»
// хвилину нічого не робить, поки той розпаковує 130 МБ.
const { app, ipcMain, Notification, dialog, autoUpdater: nativeUpdater } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const CONFIG = () => path.join(app.getPath('userData'), 'updates.json');
const readConfig = () => { try { return { autoUpdate: true, ...JSON.parse(fs.readFileSync(CONFIG(), 'utf8')) }; } catch { return { autoUpdate: true }; } };
const writeConfig = (c) => { try { fs.writeFileSync(CONFIG(), JSON.stringify(c)); } catch { /* немає доступу — не пам'ятаємо */ } };

let state = { stage: 'idle', version: null, error: null, percent: 0, auto: true, supported: false };
/** Мова інтерфейсу гри (приходить з renderer): нею говорять меню, діалоги й сповіщення. */
let uiLang = app.getLocale().startsWith('uk') ? 'uk' : 'en';
const M = (uk, en) => (uiLang === 'uk' ? uk : en);
let onLang = () => {};
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
  const uk = uiLang === 'uk';
  const body = kind === 'available'
    ? (uk ? `Доступна нова версія ${version}. Відкрий Кодеїду, щоб завантажити.` : `Version ${version} is available. Open Kodeida to download it.`)
    : (uk ? `Версія ${version} завантажена. Перезапусти Кодеїду, щоб оновитися.` : `Version ${version} is downloaded. Restart Kodeida to update.`);
  const n = new Notification({ title: uk ? 'Кодеїда' : 'Kodeida', body });
  n.on('click', () => { const w = getWindow(); if (w) { w.show(); w.focus(); } });
  n.show();
}

const busy = () => ['downloading', 'preparing', 'downloaded', 'installing'].includes(state.stage);

/** Перезапустити й оновити — один раз: повторні натискання, поки гра закривається, нічого не роблять. */
function install() {
  if (!autoUpdater || state.stage !== 'downloaded') return;
  setState({ stage: 'installing' });
  autoUpdater.quitAndInstall();
}

function download() {
  if (!autoUpdater || busy()) return;
  setState({ stage: 'downloading', percent: 0, error: null });
  autoUpdater.downloadUpdate().catch((err) => setState({ stage: 'error', error: err.message }));
}

async function check() {
  if (!autoUpdater || busy()) return state;
  try { await autoUpdater.checkForUpdates(); } catch (err) { setState({ stage: 'error', error: err.message }); }
  return state;
}

/** «Перевірити оновлення…» з меню: перевірка й нативний діалог з результатом і діями. */
async function checkInteractive() {
  const win = getWindow();
  const show = (o) => (win ? dialog.showMessageBox(win, o) : dialog.showMessageBox(o));
  if (!autoUpdater) {
    await show({ type: 'info', message: M('Оновлення працюють у встановленому застосунку', 'Updates work in the installed app'), detail: M('Ця копія запущена з вихідного коду.', 'This copy runs from source.') });
    return;
  }
  if (state.stage === 'downloading') {
    await show({ type: 'info', message: M(`Завантажую версію ${state.version}: ${state.percent}%`, `Downloading version ${state.version}: ${state.percent}%`) });
    return;
  }
  if (state.stage === 'preparing' || state.stage === 'installing') {
    await show({ type: 'info', message: M(`Готую версію ${state.version} до встановлення…`, `Preparing version ${state.version} for install…`), detail: M('Це займе до хвилини. Коли буде готово, з\'явиться кнопка «Перезапустити».', 'This takes up to a minute. A “Restart” button appears when it’s ready.') });
    return;
  }
  if (state.stage !== 'downloaded') await check();
  if (state.stage === 'downloaded') {
    const r = await show({ type: 'info', buttons: [M('Перезапустити й оновити', 'Restart and update'), M('Пізніше', 'Later')], defaultId: 0, cancelId: 1,
      message: M(`Версія ${state.version} готова`, `Version ${state.version} is ready`), detail: M('Перезапусти Кодеїду, щоб оновитися. Прогрес і код збережуться.', 'Restart Kodeida to update. Your progress and code are kept.') });
    if (r.response === 0) install();
  } else if (state.stage === 'available') {
    const r = await show({ type: 'info', buttons: [M('Завантажити', 'Download'), M('Пізніше', 'Later')], defaultId: 0, cancelId: 1,
      message: M(`Доступна версія ${state.version}`, `Version ${state.version} is available`), detail: M(`У тебе ${app.getVersion()}.`, `You have ${app.getVersion()}.`) });
    if (r.response === 0) download();
  } else if (state.stage === 'error') {
    await show({ type: 'warning', message: M('Не вдалося перевірити оновлення', 'Could not check for updates'), detail: state.error || '' });
  } else {
    await show({ type: 'info', message: M('У тебе найновіша версія', 'You have the latest version'), detail: `Kodeida ${app.getVersion()}` });
  }
}

function init(windowGetter) {
  getWindow = windowGetter;
  state.auto = readConfig().autoUpdate;

  ipcMain.handle('update:get', () => state);
  ipcMain.handle('update:download', () => { if (state.stage === 'available' || (state.stage === 'error' && state.version)) download(); });
  ipcMain.handle('update:install', () => install());
  ipcMain.handle('update:set-auto', (_e, on) => {
    writeConfig({ ...readConfig(), autoUpdate: !!on });
    setState({ auto: !!on });
    if (on && state.stage === 'available') download();
    return state;
  });
  ipcMain.handle('update:check', async () => {
    if (!autoUpdater) return state;
    await check();
    return state;
  });
  ipcMain.handle('ui:set-lang', (_e, l) => { uiLang = l === 'en' ? 'en' : 'uk'; onLang(); });

  // electron-updater читає app-update.yml, який є лише в зібраному застосунку.
  if (!app.isPackaged) return;
  ({ autoUpdater } = require('electron-updater'));
  state.supported = true;
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('checking-for-update', () => { if (!busy()) setState({ stage: 'checking' }); });
  autoUpdater.on('update-not-available', () => { if (!busy()) setState({ stage: 'not-available' }); });
  autoUpdater.on('error', (err) => { if (state.stage !== 'downloaded' && state.stage !== 'installing') setState({ stage: 'error', error: err.message }); });
  autoUpdater.on('download-progress', (p) => setState({ stage: 'downloading', percent: Math.round(p.percent) }));
  const ready = (version) => { setState({ stage: 'downloaded', version, percent: 100 }); notify('downloaded', version); };
  autoUpdater.on('update-downloaded', (info) => {
    if (process.platform !== 'darwin') return ready(info.version);
    // macOS: файл є, але Squirrel ще забирає його собі; «Перезапустити» покажемо, коли він закінчить
    setState({ stage: 'preparing', version: info.version, percent: 100 });
    nativeUpdater.once('update-downloaded', () => ready(info.version));
  });
  autoUpdater.on('update-available', (info) => {
    if (busy()) return;
    setState({ stage: 'available', version: info.version, error: null });
    if (readConfig().autoUpdate) download(); else notify('available', info.version);
  });

  const check = () => void autoUpdater.checkForUpdates().catch(() => {});
  check();
  setInterval(check, 6 * 60 * 60 * 1000);
}

module.exports = { init, check, state: () => state, checkInteractive, M: (uk, en) => M(uk, en), onLangChange: (f) => { onLang = f; } };
