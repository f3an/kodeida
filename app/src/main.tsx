import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/fira-code/400.css';
import '@fontsource/fira-code/600.css';
import '@fontsource/unbounded/700.css';
import './ui/styles.css';
import { App } from './ui/App.tsx';
import { preloadArt } from './world/art.ts';

// новий арт вантажиться до першого кадру; якщо щось не встигло — сцени малюють старі спрайти
preloadArt().finally(() => createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>));
