// Міст між інтерфейсом і головним процесом: лише версія й оновлення, без доступу до Node.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('kodeida', {
  version: process.argv.find((a) => a.startsWith('--kodeida-version='))?.split('=')[1] ?? '',
  platform: process.platform,
  updates: {
    get: () => ipcRenderer.invoke('update:get'),
    check: () => ipcRenderer.invoke('update:check'),
    download: () => ipcRenderer.invoke('update:download'),
    install: () => ipcRenderer.invoke('update:install'),
    setAuto: (on) => ipcRenderer.invoke('update:set-auto', !!on),
    onState: (cb) => {
      const h = (_e, s) => cb(s);
      ipcRenderer.on('update:state', h);
      return () => ipcRenderer.removeListener('update:state', h);
    },
  },
});
