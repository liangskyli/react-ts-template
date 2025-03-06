import { BrowserWindow, app } from 'electron';
import path from 'node:path';
import createProtocol from './create-protocol';

export type IContext = {
  /** is allowed quit app */
  allowQuitting: boolean;
  /** main window */
  mainWindow?: BrowserWindow;
};
const isDevelopment = process.env.NODE_ENV === 'development';
const context: IContext = {
  allowQuitting: false,
};

const hideMainWindow = () => {
  if (context.mainWindow && !context.mainWindow.isDestroyed()) {
    context.mainWindow.hide();
  }
};

const showMainWindow = () => {
  if (context.mainWindow && !context.mainWindow.isDestroyed()) {
    context.mainWindow.show();
  }
};

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
    },
  });
  context.mainWindow = mainWindow;
  context.mainWindow.on('close', (event) => {
    if (process.platform !== 'darwin') {
      context.allowQuitting = true;
    }
    if (!context.allowQuitting) {
      event.preventDefault();
      hideMainWindow();
    } else {
      context.mainWindow = undefined;
    }
  });
  if (isDevelopment && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/sub/`);
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://../renderer/index.html#/sub/');
    //mainWindow.loadURL('app://../renderer/index.html#/sub/test/test1');
  }
}

// quit app set allowQuitting to true
app.on('before-quit', () => {
  context.allowQuitting = true;
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (app.isReady()) {
    if (context.mainWindow === undefined) {
      createMainWindow();
    } else {
      showMainWindow();
    }
  }
});

export { createMainWindow };
