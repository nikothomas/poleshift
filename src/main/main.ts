// src/main/main.ts
/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, safeStorage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import crypto from 'crypto';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

// Import your allowed processors
import * as processors from './utils/processors';

// Create a whitelist of allowed function names
const allowedFunctionNames = Object.keys(processors);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// Initialize electron-store
const store = new Store();

// Hashing function to derive a user-specific key based on user ID
const deriveUserKey = (userId: string): string => {
  // Use a secure hash function like SHA-256 to derive a key
  const hash = crypto.createHash('sha256');
  hash.update(userId);
  return hash.digest('hex'); // Return the key as a hex string
};

// IPC Handler to encrypt and store data for a specific user
ipcMain.handle(
  'encrypt-and-store',
  async (event, userId: string, key: string, value: string) => {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Encryption is not available on this system');
      }

      // Derive a user-specific key
      const userKey = deriveUserKey(userId);

      // Encrypt the value using Electron's safeStorage
      const encryptedValue = safeStorage.encryptString(value);

      // Store the encrypted data in electron-store, using the user-specific key
      store.set(`${userKey}_${key}`, encryptedValue.toString('base64'));

      return { success: true };
    } catch (error: any) {
      console.error('Error encrypting and storing data:', error);
      return { success: false, message: error.message };
    }
  },
);

// IPC Handler to retrieve and decrypt data for a specific user
ipcMain.handle(
  'retrieve-and-decrypt',
  async (event, userId: string, key: string) => {
    try {
      const userKey = deriveUserKey(userId);
      const encryptedValue = store.get(`${userKey}_${key}`);

      if (!encryptedValue) {
        throw new Error('No data found for the given key');
      }

      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error('Encryption is not available on this system');
      }

      // Decode the stored value from base64
      const encryptedBuffer = Buffer.from(encryptedValue as string, 'base64');

      // Decrypt the data
      const decryptedValue = safeStorage.decryptString(encryptedBuffer);

      return { success: true, value: decryptedValue };
    } catch (error: any) {
      console.error('Error retrieving and decrypting data:', error);
      return { success: false, message: error.message };
    }
  },
);

// IPC Example Handler
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// Handler for 'save-file'
ipcMain.handle(
  'save-file',
  async (event, fileBuffer: ArrayBuffer, fileName: string) => {
    try {
      const os = require('os');
      const tempDir = os.tmpdir();
      const filePath = path.join(tempDir, fileName);

      await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));

      return { success: true, filePath };
    } catch (error: any) {
      console.error('Error saving file:', error);
      return { success: false, message: error.message };
    }
  },
);

// IPC Handlers for electron-store

// Handler for 'electron-store-get'
ipcMain.on('electron-store-get', (event, key: string) => {
  try {
    const value = store.get(key);
    event.returnValue = value !== undefined ? value : null;
  } catch (error: any) {
    console.error(`Error getting key "${key}":`, error);
    event.returnValue = null;
  }
});

// Handler for 'electron-store-set'
ipcMain.handle('electron-store-set', async (event, key: string, value: any) => {
  try {
    store.set(key, value);
    return { success: true };
  } catch (error: any) {
    console.error(`Error setting key "${key}":`, error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle(
  'process-function',
  async (
    event,
    functionName: string,
    sampleId: string,
    modalInputs: any,
    files?: any,
  ) => {
    try {
      if (!allowedFunctionNames.includes(functionName)) {
        throw new Error(`Function ${functionName} is not allowed`);
      }
      const result = await processors[functionName](
        sampleId,
        modalInputs,
        files,
      );
      return { success: true, result };
    } catch (error: any) {
      console.error(`Error in ${functionName}:`, error);
      return { success: false, message: error.message };
    }
  },
);


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Adjusted path
      nodeIntegration: false, // Ensure node integration is disabled
      contextIsolation: true, // Ensure context isolation is enabled
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open URLs in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Initialize App Updater
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
