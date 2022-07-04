import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as fs from 'fs';

let win: BrowserWindow | null = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // Include the .js file, since it will be compiled from .ts by the time it is used by electron
            preload: __dirname + '/preload.js'
        }
    });

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

function openFile() {
    return new Promise((resolve, reject) => {
        fs.readFile("E:\\logs.txt", "utf-8", (error, data) => {
            if (error) {
                console.log('reject: ' + error); // Testing
                reject(error);
            } else {
                console.log('resolve: ' + data); // Testing
                resolve(data)
            }
        });
    });
}

ipcMain.handle('open-file', async (event, message) => {
    return await openFile()
        .then((data) => {
            console.log('handle: ' + data); // Testing
            return data;
        })
        .catch((error) => {
            console.log('handle error: ' + error); // Testing
            return 'Error Loading Log File';
        })
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});