/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path, { basename, extname } from "path";
import fs from "fs";
import { BrowserWindow, shell, ipcMain, dialog } from "electron";
const { app, net, protocol } = require("electron");
const { join } = require("node:path");
const url = require("url");

// import { autoUpdater } from 'electron-updater';
// import log from 'electron-log';

import { resolveHtmlPath } from "./util";
// import MenuBuilder from "./menu";

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

function createPicturesDirIfNotExist() {
  if (!fs.existsSync(`./AppPictures`)) {
    fs.mkdirSync(`./AppPictures`, { recursive: true });
  }
}

// createPicturesDirIfNotExist();

async function copyFileFromDatabase(FILEPATH: string, DEST: string) {
  // eslint-disable-next-line compat/compat, func-names
  const promise = new Promise(function (resolve, reject) {
    const src = FILEPATH;
    const dest = `${DEST}/${basename(src)}`;
    if (!fs.existsSync(`${DEST}`)) {
      fs.mkdirSync(`${DEST}`, { recursive: true });
    }

    fs.copyFile(src, dest, (err) => {
      if (err) {
        reject(new Error(`error: ${err}`)); // ignored
      }
      resolve("done");
    });
  });

  return promise;
}

// 1. solve pictures path for production and Development
// 2. add full path for each image
// 3. enjoy from program :D

let picturesPath;

function getPicturesPathDevelopment() {
  return path.resolve(__dirname, "../../pictures").replaceAll("\\", "/");
}

function getPicturesPathProduction() {
  return path.resolve(__dirname, "../../../../pictures").replaceAll("\\", "/");
}

if (process.env.NODE_ENV === "development") {
  picturesPath = getPicturesPathDevelopment();
} else if (process.env.NODE_ENV === "production") {
  picturesPath = getPicturesPathProduction();
}

let mainWindow: BrowserWindow;

ipcMain.on("ipc-example", async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply("ipc-example", msgTemplate("pong"));
});

// eslint-disable-next-line consistent-return

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";

if (isDebug) {
  require("electron-debug")();
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

protocol.registerSchemesAsPrivileged([
  {
    scheme: "ghavabesh",
    privileges: {
      bypassCSP: true,
      standard: true,
    },
  },
]);

console.log(path.join(__dirname));

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(__dirname, "../../assets");

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  protocol.registerFileProtocol("ghavabesh", (request, callback) => {
    console.log(`request.url: ${request.url}`);
    let filePath = request.url.substring(14);
    let filePathWithDrive = request.url.substring(12);
    let DriveName = filePathWithDrive[0].toUpperCase();
    console.log(`filePath: ${filePath}`);
    console.log(`DriveName:${DriveName}`);
    let resolvedFilePath = `${DriveName}://${filePath}`;
    console.log(`resolvedFilePath: ${resolvedFilePath}`);
    callback({
      path: resolvedFilePath,
    });
  });

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    icon: getAssetPath("soleimani.jpg"),
    webPreferences: {
      webSecurity: true,
      preload: app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../.erb/dll/preload.js"),
    },
  });

  // mainWindow.webContents.openDevTools();

  mainWindow.removeMenu();

  // eslint-disable-next-line promise/catch-or-return

  // mainWindow.setResizable(false);

  mainWindow.loadURL(resolveHtmlPath("index.html"));

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow.destroy();
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: "deny" };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("basij.db");

db.run(`CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  full_name TEXT,
  national_code TEXT,
  birth_date TEXT,
  address TEXT,
  mobile TEXT,
  UNIQUE(national_code)
)`);
db.run(`CREATE TABLE IF NOT EXISTS images (
  image_id INTEGER,
  user_id INTEGER,
  full_path_src TEXT,
  original TEXT,
  thumbnail TEXT,
  national_code TEXT,
  PRIMARY KEY (image_id),
  FOREIGN KEY (user_id)
      REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
  UNIQUE(full_path_src, thumbnail, original)
)`);

ipcMain.handle("invokeNewUserImages", async (event, args) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["multiSelections"],
    filters: [{ name: "Images", extensions: ["jpg", "png"] }],
  });
  if (canceled) {
    console.log(canceled);
    mainWindow.webContents.send("onResultNewUserImages", {
      status: "canceled",
    });
  } else {
    // do save
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-lonely-if
    if (filePaths.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const filePath of filePaths) {
        // copy file in images folder
        filePath.replaceAll("\\", "/");

        db.run(
          `
          INSERT INTO images (user_id, original, thumbnail, full_path_src, national_code)
          VALUES (?, ?, ?, ?, ?)
          `,
          // eslint-disable-next-line camelcase
          [
            args.user_id,
            `${picturesPath}/${args.nationalCode}/${basename(filePath)}`,
            `${picturesPath}/${args.nationalCode}/${basename(filePath)}`,
            // eslint-disable-next-line camelcase
            filePath,
            args.nationalCode,
          ],
          function (err) {
            if (err) {
              mainWindow.webContents.send("onResultNewUserImages", {
                status: "ErrorInsert",
                error: JSON.stringify(err),
              });
            } else {
              copyFileFromDatabase(filePath, `pictures/${args.nationalCode}`)
                // eslint-disable-next-line consistent-return, no-loop-func
                .then(() => {
                  mainWindow.webContents.send("onResultNewUserImages", {
                    status: "OkInsert",
                    num: filePaths.length,
                    newImagePath: `${picturesPath}/${
                      args.nationalCode
                    }/${basename(filePath)}`,
                    user_id: args.user_id,
                    image_id: this.lastID,
                  });
                })
                // eslint-disable-next-line no-loop-func
                .catch(() => {
                  // send message NO
                  mainWindow.webContents.send("onResultNewUserImages", {
                    status: "ErrorCopy",
                    num: filePaths.length,
                  });
                });
            }
          }
        );
      }
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let uploadedFiles: string[];
// eslint-disable-next-line consistent-return
ipcMain.handle("invokeRegisterUserInfo", async (event, args) => {
  if (args.op_type === "images") {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "png"] }],
    });
    // console.log(filePaths);
    uploadedFiles = filePaths;
    if (!canceled) {
      return filePaths[0];
    }
  } else {
    db.run(
      `
      INSERT INTO users (full_name, national_code, birth_date, address, mobile)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        args.info.fullName,
        args.info.nationalCode,
        `${args.info.year}-${args.info.month}-${args.info.day}`,
        args.info.address,
        args.info.mobile,
      ],
      function (err) {
        let OK = true;
        if (err) {
          console.log(`userInsertError: ${err}`);
          mainWindow.webContents.send("onResultRegister", {
            status: "ErrorInsertUser",
            error: JSON.stringify(err),
          });
        } else {
          if (uploadedFiles === undefined) {
            uploadedFiles = [];
          }
          if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((filePath) => {
              filePath.replaceAll("\\", "/");
              db.run(
                `
              INSERT INTO images (user_id, original, thumbnail, full_path_src, national_code)
              VALUES (?, ?, ?, ?, ?)
              `,
                // eslint-disable-next-line camelcase
                [
                  this.lastID,
                  `${picturesPath}/${args.info.nationalCode}/${basename(
                    filePath
                  )}`,
                  `${picturesPath}/${args.info.nationalCode}/${basename(
                    filePath
                  )}`,
                  // eslint-disable-next-line camelcase
                  filePath,
                  args.info.nationalCode,
                ],
                function (errr: any) {
                  if (errr) {
                  } else {
                    copyFileFromDatabase(
                      filePath,
                      `pictures/${args.info.nationalCode}`
                    )
                      .then(() => {
                        mainWindow.webContents.send("onResultRegister", {
                          status: "OkInsert",
                        });
                      })
                      .catch(() => {
                        mainWindow.webContents.send("onResultRegister", {
                          status: "ErrorCopy",
                        });
                      });
                  }
                }
              );
            });
            uploadedFiles = [];
          } else {
            mainWindow.webContents.send("onResultRegister", {
              status: "OkInsert",
            });
          }
        }
      }
    );
  }
});

ipcMain.handle("invokeGetUsers", async (event, args) => {
  console.log(args.term);
  if (args.term === "") {
    db.all(
      `
    SELECT json_object(
      'user_id', user_id,
      'full_name', full_name,
      'national_code', national_code,
      'mobile', mobile,
      'address', address,
      'birth_date', birth_date,
      'images'
      , (SELECT json_group_array(json_object('image_id', imgs.image_id,
      'full_path_src', imgs.full_path_src,
      'original', imgs.original,
      'thumbnail', imgs.thumbnail,
      'national_code', imgs.national_code
      )) FROM images AS imgs
        WHERE imgs.user_id = usrs.user_id)) AS record
      FROM users AS usrs;
    `,
      [],
      (err: any, rows: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log(rows);
          mainWindow.webContents.send("onGetUsers", { users: rows });
        }
      }
    );
  } else {
    db.all(
      `
      SELECT json_object(
      'user_id', user_id,
      'full_name', full_name,
      'national_code', national_code,
      'mobile', mobile,
      'address', address,
      'birth_date', birth_date,
      'images'
      , (SELECT json_group_array(json_object('image_id', imgs.image_id,
      'full_path_src', imgs.full_path_src,
      'original', imgs.original,
      'thumbnail', imgs.thumbnail,
      'national_code', imgs.national_code
      ))
        FROM images AS imgs
        WHERE imgs.user_id = usrs.user_id)) AS record
      FROM users AS usrs
      where
      usrs.full_name like '%${args.term}%'
      or usrs.national_code like '%${args.term}%'
      or usrs.birth_date like '%${args.term}%'
      or usrs.address like '%${args.term}%'
      or usrs.mobile like '%${args.term}%'
      ;
      `,
      [],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          console.log(rows);

          mainWindow.webContents.send("onGetUsers", {
            users: rows,
          });
        }
      }
    );
  }
});

// select * from users where users.full_name like '%${args.term}%'
// or users.national_code like '%${args.term}%'
// or users.birth_date like '%${args.term}%'
// or users.address like '%${args.term}%'
// or users.mobile like '%${args.term}%'

ipcMain.handle("invokeUpdateUser", async (event, args) => {
  // args
  const sql = `
    UPDATE users SET full_name = ? ,
    national_code = ? ,
    birth_date = ? ,
    address = ? ,
    mobile = ?
    WHERE user_id = ?
  `;
  const data = [
    args.fullName,
    args.nationalCode,
    args.birthDate,
    args.address,
    args.mobile,
    args.user_id,
  ];
  db.run(sql, data, function (err: any) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated: ${this.changes}`);
    mainWindow.webContents.send("onResultUpdateUser", { status: "OK" });
  });
});

ipcMain.handle("invokeDeleteUserImage", async (event, args) => {
  // args
  const sql = `
    DELETE FROM images
    WHERE user_id = ? and image_id = ?
  `;
  const data = [args.user_id, args.image_id];
  db.run(sql, data, function (err: any) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) deleted: ${this.changes}`);
    fs.unlink(args.image_path, (err) => {
      if (err) throw err;
      console.log("path/file.txt was deleted");
      mainWindow.webContents.send("onResultDeleteUserImage", { status: "OK" });
    });
  });
});

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    // console.log(`default client: ${app.isDefaultProtocolClient("app")}`);
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
