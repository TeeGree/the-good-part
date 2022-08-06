import { ipcMain, app } from 'electron';
import { AppSettings, AppSettingsFromFile } from '../models/AppSettings';
import { getFilenameFromPath } from '../utility/FilePathUtils';
import * as fs from 'fs';
import * as mm from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';

const configFile = './the-good-part.settings.json';

export const setupIpcHandlers = () => {
    ipcMain.handle('get-settings', async (_) => {
        return await getParsedSettings()
            .catch(() => {
                return 'Error reading settings file';
            });
    });

    ipcMain.handle('get-file-metadata', async (_, filepath: string) => {
        return await getFileMetadata(filepath)
            .catch(() => {
                return 'Error getting file metadata';
            });
    });

    ipcMain.handle('upload-file', async (_, filepath: string) => {
        return await copyFileToPublicFolder(filepath)
            .catch(() => {
                return 'Error uploading file';
            });
    });
}

const getParsedSettings = async (): Promise<AppSettings> => {
    const settings = await getSettingsFromFile();
    return await parseAppSettings(settings);
}

const getSettingsFromFile = async (): Promise<AppSettingsFromFile> => {
    try {
        const fileContent = await fs.promises.readFile(configFile, 'utf8');
        const settings: AppSettingsFromFile = JSON.parse(fileContent);
        return settings;
    } catch {
        const defaultSettings: AppSettingsFromFile = {
            songs: []
        };
        await writeSettingsToFile(defaultSettings);
        return defaultSettings;
    }
}

const writeSettingsToFile = async (settings: AppSettingsFromFile): Promise<void> => {
    return await fs.promises.writeFile(configFile, JSON.stringify(settings))
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
                id: song.id,
                filename: song.filename,
                fullPath: getFullPathWithPublicElectronFolder(song.filename),
                metadata: metadataDict.get(song.id)
            };
        })
    };

    return parsedSettings;
}

const getFileMetadata = async (filename: string): Promise<mm.IAudioMetadata> => {
    const fullpath = getFullPathWithPublicElectronFolder(filename);
    return await mm.parseFile(fullpath);
}

const getFullPathWithPublicElectronFolder = (filename: string) => {
    const electronPath = app.getAppPath();
    return `${electronPath}\\public\\${filename}`;
}

const copyFileToPublicFolder = async (filepath: string) => {
    const filename = getFilenameFromPath(filepath);
    const targetPath = getFullPathWithPublicElectronFolder(filename);
    await fs.promises.copyFile(filepath, targetPath);
    await addToAppSettingsFile(filename);
}

const addToAppSettingsFile = async (filename: string) => {
    const settings = await getSettingsFromFile();
    settings.songs.push({
        id: uuidv4(),
        filename: filename
    });
    await writeSettingsToFile(settings);
}