import { ipcMain, app } from 'electron';
import * as fs from 'fs';
import { parseFile, IAudioMetadata } from 'music-metadata';
import { v4 as uuidv4 } from 'uuid';
import { getFilenameFromPath } from '../utility/FilePathUtils';
import {
    AppSettings,
    AppSettingsFromFile,
    Playlist,
    SongInfoFromSettings,
} from '../models/AppSettings';
import { SongInfo } from '../models/SongInfo';

const configFile = './the-good-part.settings.json';

export const setupIpcHandlers = (): void => {
    ipcMain.handle('get-settings', async (_) =>
        getParsedSettings().catch(() => 'Error reading settings file'),
    );

    ipcMain.handle('get-file-metadata', async (_, filepath: string) =>
        getFileMetadata(filepath).catch(() => 'Error getting file metadata'),
    );

    ipcMain.handle('upload-file', async (_, filepath: string) =>
        copyFileToPublicFolder(filepath).catch(() => 'Error uploading file'),
    );
};

const getParsedSettings = async (): Promise<AppSettings> => {
    const settings = await getSettingsFromFile();
    return parseAppSettings(settings);
};

const getSettingsFromFile = async (): Promise<AppSettingsFromFile> => {
    try {
        const fileContent = await fs.promises.readFile(configFile, 'utf8');
        const settings: AppSettingsFromFile = JSON.parse(fileContent);
        return settings;
    } catch {
        const defaultSettings: AppSettingsFromFile = {
            songs: [],
            playlists: [],
        };
        await writeSettingsToFile(defaultSettings);
        return defaultSettings;
    }
};

const writeSettingsToFile = async (settings: AppSettingsFromFile): Promise<void> =>
    fs.promises.writeFile(configFile, JSON.stringify(settings));

interface SongMetadataMapping {
    id: string;
    metadata: IAudioMetadata;
}

const parseAppSettings = async (appSettings: AppSettingsFromFile): Promise<AppSettings> => {
    const metadataMappings = await Promise.all(
        appSettings.songs.map(async (song) => {
            const metadata = await getFileMetadata(song.filename);
            const metadataMapping: SongMetadataMapping = {
                id: song.id,
                metadata,
            };
            return metadataMapping;
        }),
    );

    const metadataDict = new Map<string, IAudioMetadata>();

    metadataMappings.forEach((metadataMapping) =>
        metadataDict.set(metadataMapping.id, metadataMapping.metadata),
    );

    const songs: SongInfo[] = [];
    const songMap = new Map<string, SongInfo>();
    appSettings.songs.forEach((song: SongInfoFromSettings) => {
        const parsedSong: SongInfo = {
            id: song.id,
            filename: song.filename,
            fullPath: getFullPathWithPublicElectronFolder(song.filename),
            metadata: metadataDict.get(song.id),
        };

        songs.push(parsedSong);

        songMap.set(parsedSong.id, parsedSong);
    });

    const playlistMap = new Map<string, Playlist>();
    appSettings.playlists.forEach((playlist: Playlist) => {
        playlistMap.set(playlist.id, playlist);
    });

    const parsedSettings: AppSettings = {
        songs,
        songMap,
        playlists: appSettings.playlists,
        playlistMap,
    };

    return parsedSettings;
};

const getFileMetadata = async (filename: string): Promise<IAudioMetadata> => {
    const fullpath = getFullPathWithPublicElectronFolder(filename);
    return parseFile(fullpath);
};

const getFullPathWithPublicElectronFolder = (filename: string): string => {
    const electronPath = app.getAppPath();
    return `${electronPath}\\public\\${filename}`;
};

const copyFileToPublicFolder = async (filepath: string): Promise<void> => {
    const filename = getFilenameFromPath(filepath);
    const targetPath = getFullPathWithPublicElectronFolder(filename);
    await fs.promises.copyFile(filepath, targetPath);
    await addToAppSettingsFile(filename);
};

const addToAppSettingsFile = async (filename: string): Promise<void> => {
    const settings = await getSettingsFromFile();
    settings.songs.push({
        id: uuidv4(),
        filename,
    });
    await writeSettingsToFile(settings);
};
