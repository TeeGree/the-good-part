import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as mm from 'music-metadata';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as fs from 'fs';
import { AppSettings } from '../src/models/AppSettings';

let win: BrowserWindow | null = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // Include the .js file, since it will be compiled from .ts by the time it is used by electron
            preload: __dirname + '/preload.js'
        },
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

    const getSettings = (): Promise<AppSettings> => {
        return new Promise((resolve, reject) => {
            const configFile = './the-good-part.settings.json';
            fs.readFile(configFile, 'utf8', function(fileNotFoundError, file) {
                if (fileNotFoundError) {
                    const defaultSettings: AppSettings = {
                        songs: []
                    };
                    fs.writeFile(configFile, JSON.stringify(defaultSettings), (err) => {
                        if (err) {
                            reject(err);
                        }
                        
                        resolve(defaultSettings);
                    });
                } else {
                    const settings: AppSettings = JSON.parse(file);
                    resolve(settings);
                }
            });
        });
    }

    ipcMain.handle('get-settings', async (event) => {
        return await getSettings()
            .catch((error) => {
                return 'Error reading settings file';
            });
    });

    const getFileMetadata = async (filepath: string): Promise<mm.IAudioMetadata> => {
        return await mm.parseFile(filepath);
    }

    ipcMain.handle('get-file-metadata', async (event, message) => {
        return await getFileMetadata(message as string)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return 'Error getting file metadata';
            });
    });
}

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