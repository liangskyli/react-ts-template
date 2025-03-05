import { app, protocol } from 'electron';
import { createMainWindow } from './main-window';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
    },
  },
]);

app.whenReady().then(() => {
  createMainWindow();
});
