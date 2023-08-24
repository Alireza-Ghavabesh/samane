/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// eslint-disable-next-line consistent-return

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
      forceDownload
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
    width: 866,
    height: 550,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  // mainWindow.setResizable(false);
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

  // eslint-disable-next-line consistent-return, @typescript-eslint/no-unused-vars

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// const uuid = crypto.randomUUID();
const db = new sqlite3.Database(`basij.db`);

const p = path.join(__dirname, '../../');
fs.readdir(p, (err, files) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let flag = false;
  files.forEach((file) => {
    if (file.includes('basij')) {
      flag = true;
    }
  });
  if (!flag) {
    // const uuid = crypto.randomUUID();
    db.run(`CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          full_name TEXT NOT NULL,
          national_code TEXT NOT NULL,
          birth_date TEXT NOT NULL,
          address TEXT NOT NULL
        )`);
    db.run(`CREATE TABLE images (
          id INTEGER,
          user_id TEXT NOT NULL,
          full_path TEXT NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id)
              REFERENCES users (id)
                ON DELETE CASCADE
                ON UPDATE NO ACTION
        )`);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let uploadedFiles: string[];
// eslint-disable-next-line consistent-return
ipcMain.handle('register-user-info', async (event, args) => {
  if (args.op_type === 'images') {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['multiSelections'],
    });
    // console.log(filePaths);
    uploadedFiles = filePaths;
    if (!canceled) {
      return filePaths[0];
    }
  } else {
    db.run(
      `
      INSERT INTO users (full_name, national_code, birth_date, address)
      VALUES (?, ?, ?, ?)
      `,
      [
        args.info.fullName,
        args.info.nationalCode,
        `${args.info.year}-${args.info.month}-${args.info.day}`,
        args.info.address,
      ],
      function (err) {
        if (err) {
          console.log(err);
        } else {
          // eslint-disable-next-line camelcase
          uploadedFiles.forEach((file_path) => {
            db.run(
              `
            INSERT INTO images (user_id, full_path)
            VALUES (?, ?)
            `,
              // eslint-disable-next-line camelcase
              [this.lastID, file_path]
            );
          });
        }
      }
    );
  }
});

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
