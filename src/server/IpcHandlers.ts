import { ipcMain } from 'electron';
import { AppSettings } from '../models/AppSettings';
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

const getSettings = (): Promise<AppSettings> => {
    return new Promise((resolve, reject) => {
        const configFile = './the-good-part.settings.json';
        fs.readFile(configFile, 'utf8', (fileNotFoundError, file) => {
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

const getSongInfo = async (filepath: string): Promise<SongInfo> => {
    const metadata = await mm.parseFile(filepath);

    const filename = getFilenameFromPath(filepath);

    const songInfo: SongInfo = {
        filename: filename,
        fullPath: filepath,
        relativePath: `/${filename}`,
        metadata: metadata
    };

    return songInfo;
}

const getFileMetadata = async (filepath: string): Promise<mm.IAudioMetadata> => {
    return await mm.parseFile(filepath);
}