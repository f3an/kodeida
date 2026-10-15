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

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
