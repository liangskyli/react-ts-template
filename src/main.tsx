// sort-imports-ignore
import './init.ts';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/less/global.less';
import '@/styles/tailwind.css';
import App from './app.tsx';

function setupApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

setupApp();
