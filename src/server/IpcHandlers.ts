import { ipcMain, app } from 'electron';
import { AppSettings, AppSettingsFromFile } from '../models/AppSettings';
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
        fs.readFile(configFile, 'utf8', async (fileNotFoundError, file) => {
            if (fileNotFoundError) {
                const defaultSettings: AppSettingsFromFile = {
                    songs: []
                };
                fs.writeFile(configFile, JSON.stringify(defaultSettings), (err) => {
                    if (err) {
                        reject(err);
                    }
                    
                    resolve(defaultSettings as unknown as AppSettings);
                });
            } else {
                const settings: AppSettingsFromFile = JSON.parse(file);
                const parsedSettings = await parseAppSettings(settings);
                resolve(parsedSettings);
            }
        });
    });
}

interface SongMetadataMapping {
    id: string,
    metadata: mm.IAudioMetadata
}

const parseAppSettings = async (appSettings: AppSettingsFromFile) => {
    const metadataMappings = await Promise.all(
        appSettings.songs.map(async (song) => {
            const metadata = await getFileMetadata(song.filename);
            const metadataMapping: SongMetadataMapping = {
                id: song.id,
                metadata: metadata
            };
            return metadataMapping;
        })
    );

    const metadataDict = new Map<string, mm.IAudioMetadata>();

    metadataMappings.forEach((metadataMapping) =>
        metadataDict.set(metadataMapping.id, metadataMapping.metadata));

    const parsedSettings: AppSettings = {
        songs: appSettings.songs.map((song) => {
            return {
                filename: song.filename,
                fullPath: getFullPath(song.filename),
                metadata: metadataDict.get(song.id)
            };
        })
    };

    return parsedSettings;
}

const getSongInfo = async (filepath: string): Promise<SongInfo> => {
    const metadata = await mm.parseFile(filepath);

    const filename = getFilenameFromPath(filepath);

    const songInfo: SongInfo = {
        filename: filename,
        fullPath: filepath,
        metadata: metadata
    };

    return songInfo;
}

const getFileMetadata = async (filename: string): Promise<mm.IAudioMetadata> => {
    const fullpath = getFullPath(filename);
    return await mm.parseFile(fullpath);
}

const getFullPath = (filename: string) => {
    const electronPath = app.getAppPath();
    return `${electronPath}\\public\\${filename}`;
}