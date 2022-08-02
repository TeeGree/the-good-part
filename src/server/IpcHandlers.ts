import { ipcMain, app } from 'electron';
import { AppSettingsFromFile } from '../models/AppSettings';
import { getFilenameFromPath } from '../utility/FilePathUtils';
import * as fs from 'fs';
import * as mm from 'music-metadata';
import { SongInfo } from '../models/SongInfo';

export const setupIpcHandlers = () => {
    ipcMain.handle('get-settings', async (_) => {
        return await getSettings()
            .catch(() => {
                return 'Error reading settings file';
            });
    });

    ipcMain.handle('get-song-info', async (_, filepath: string) => {
        return await getSongInfo(filepath)
            .catch(() => {
                return 'Error getting song info';
            });
    });

    ipcMain.handle('get-file-metadata', async (_, filepath: string) => {
        return await getFileMetadata(filepath)
            .catch(() => {
                return 'Error getting file metadata';
            });
    });
}

const getSettings = (): Promise<AppSettingsFromFile> => {
    return new Promise((resolve, reject) => {
        const configFile = './the-good-part.settings.json';
        fs.readFile(configFile, 'utf8', (fileNotFoundError, file) => {
            if (fileNotFoundError) {
                const defaultSettings: AppSettingsFromFile = {
                    songs: []
                };
                fs.writeFile(configFile, JSON.stringify(defaultSettings), (err) => {
                    if (err) {
                        reject(err);
                    }
                    
                    resolve(defaultSettings);
                });
            } else {
                const settings: AppSettingsFromFile = JSON.parse(file);
                resolve(settings);
            }
        });
    });
}

const getSongInfo = async (filepath: string): Promise<SongInfo> => {
    const metadata = await mm.parseFile(filepath);

    const filename = getFilenameFromPath(filepath);

    const songInfo: SongInfo = {
        filename: filename,
        metadata: metadata
    };

    return songInfo;
}

const getFileMetadata = async (filename: string): Promise<mm.IAudioMetadata> => {
    const electronPath = app.getAppPath();
    return await mm.parseFile(`${electronPath}\\public\\${filename}`);
}