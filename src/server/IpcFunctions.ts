import { IAudioMetadata, parseFile } from 'music-metadata';
import { AppSettings, AppSettingsFromFile } from '../models/AppSettings';
import { SongInfo, SongInfoFromSettings } from '../models/SongInfo';
import * as fs from 'fs';
import { Playlist } from '../models/Playlist';
import { getFilenameFromPath } from '../utility/FilePathUtils';
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';

const configFile = './the-good-part.settings.json';

export const getSettings = async (): Promise<AppSettings> => {
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

export const getFileMetadata = async (filename: string): Promise<IAudioMetadata> => {
    const fullpath = getFullPathWithPublicElectronFolder(filename);
    return parseFile(fullpath);
};

const getFullPathWithPublicElectronFolder = (filename: string): string => {
    const electronPath = app.getAppPath();
    return `${electronPath}\\public\\${filename}`;
};

export const uploadFile = async (filepath: string): Promise<void> => {
    const filename = getFilenameFromPath(filepath);
    const targetPath = getFullPathWithPublicElectronFolder(filename);
    await fs.promises.copyFile(filepath, targetPath);
    await addSongToAppSettingsFile(filename);
};

const addSongToAppSettingsFile = async (filename: string): Promise<void> => {
    const settings = await getSettingsFromFile();
    settings.songs.push({
        id: uuidv4(),
        filename,
    });
    await writeSettingsToFile(settings);
};

export const createPlaylist = async (name: string): Promise<void> => {
    const settings = await getSettingsFromFile();
    settings.playlists.push({
        id: uuidv4(),
        name,
        color: '#483d8b',
        songIds: [],
    });
    await writeSettingsToFile(settings);
};

export const addSongToPlaylist = async (playlistId: string, songId: string): Promise<void> => {
    const settings = await getSettingsFromFile();
    const playlistForSong = settings.playlists.find((playlist: Playlist) => {
        return playlist.id === playlistId;
    });

    if (playlistForSong === undefined) {
        throw Error(`Invalid playlist ID: ${playlistId}`);
    }

    playlistForSong.songIds.push(songId);

    await writeSettingsToFile(settings);
};

export const deleteSong = async (songId: string): Promise<void> => {
    const settings = await getSettingsFromFile();

    // Remove song ID from any playlist containing the song.
    settings.playlists.forEach((playlist: Playlist) => {
        let i = playlist.songIds.length - 1;
        while (i >= 0) {
            if (playlist.songIds[i] === songId) {
                playlist.songIds.splice(i, 1);
            }

            i--;
        }
    });

    // Remove from songs
    let i = settings.songs.length - 1;
    while (i >= 0) {
        if (settings.songs[i].id === songId) {
            settings.songs.splice(i, 1);
        }

        i--;
    }

    await writeSettingsToFile(settings);
};

export const deletePlaylist = async (playlistId: string): Promise<void> => {
    const settings = await getSettingsFromFile();

    let i = settings.playlists.length - 1;
    while (i >= 0) {
        if (settings.playlists[i].id === playlistId) {
            settings.playlists.splice(i, 1);
        }

        i--;
    }

    await writeSettingsToFile(settings);
};
