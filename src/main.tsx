import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 公共样式
import '@/styles/less/global.less';
import App from './app.tsx';

function setupApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

setupApp();
