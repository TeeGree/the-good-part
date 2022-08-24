import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { setupIpcHandlers } from '../src/server/IpcHandlers';

let win: BrowserWindow | null = null;

function createWindow(): void {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            // Include the .js file, since it will be compiled from .ts by the time it is used by electron
            preload: path.join(__dirname, '/preload.js'),
        },
    });

    if (isDev) {
        win.loadURL('http://localhost:3000/index.html');
    } else {
        // 'build/index.html'
        const filepath = path.join('file://', __dirname, '/../index.html');
        win.loadURL(filepath);
    }

    win.on('closed', () => {
        win = null;
    });

    // Hot Reloading
    if (isDev) {
        // 'node_modules/.bin/electronPath'
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        const electronReload = require('electron-reload');
        electronReload(__dirname, {
            electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
            forceHardReset: true,
            hardResetMethod: 'exit',
        });
    }

    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS)
        // eslint-disable-next-line no-console
        .then((name) => console.log(`Added Extension:  ${name}`))
        // eslint-disable-next-line no-console
        .catch((err) => console.log('An error occurred: ', err));

    if (isDev) {
        win.webContents.openDevTools();
    }

    setupIpcHandlers();
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
