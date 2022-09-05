import { ipcMain, ipcRenderer } from 'electron';
import { IAudioMetadata } from 'music-metadata';
import { AppSettings } from '../models/AppSettings';
import {
    ADD_SONG_TO_PLAYLIST,
    CREATE_PLAYLIST,
    DELETE_PLAYLIST,
    DELETE_SONG,
    GET_FILE_METADATA,
    GET_SETTINGS,
    UPLOAD_FILE,
} from './IpcFunctionChannels';
import {
    createPlaylist,
    addSongToPlaylist,
    uploadFile,
    deleteSong,
    getFileMetadata,
    getSettings,
    deletePlaylist,
} from './IpcFunctions';

export const setupIpcHandlers = (): void => {
    ipcMain.handle(GET_SETTINGS, async (_) =>
        getSettings().catch(() => 'Error reading settings file'),
    );

    ipcMain.handle(GET_FILE_METADATA, async (_, filepath: string) =>
        getFileMetadata(filepath).catch(() => 'Error getting file metadata'),
    );

    ipcMain.handle(UPLOAD_FILE, async (_, filepath: string) =>
        uploadFile(filepath).catch(() => 'Error uploading file'),
    );

    ipcMain.handle(CREATE_PLAYLIST, async (_, name: string) =>
        createPlaylist(name).catch(() => 'Error creating playlist'),
    );

    ipcMain.handle(ADD_SONG_TO_PLAYLIST, async (_, playlistId: string, songId: string) =>
        addSongToPlaylist(playlistId, songId).catch(() => 'Error adding song to playlist'),
    );

    ipcMain.handle(DELETE_SONG, async (_, songId: string) =>
        deleteSong(songId).catch(() => 'Error deleting song'),
    );

    ipcMain.handle(DELETE_PLAYLIST, async (_, playlistId: string) =>
        deletePlaylist(playlistId).catch(() => 'Error deleting playlist'),
    );
};

export const api = {
    getFileMetadata: (filepath: string): Promise<IAudioMetadata> =>
        ipcRenderer.invoke(GET_FILE_METADATA, filepath),
    getSettings: (): Promise<AppSettings> => ipcRenderer.invoke(GET_SETTINGS),
    uploadFile: (filepath: string): Promise<void> => ipcRenderer.invoke(UPLOAD_FILE, filepath),
    createPlaylist: (name: string): Promise<void> => ipcRenderer.invoke(CREATE_PLAYLIST, name),
    addSongToPlaylist: (playlistId: string, songId: string): Promise<void> =>
        ipcRenderer.invoke(ADD_SONG_TO_PLAYLIST, playlistId, songId),
    deleteSong: (songId: string): Promise<void> => ipcRenderer.invoke(DELETE_SONG, songId),
    deletePlaylist: (playlistId: string): Promise<void> =>
        ipcRenderer.invoke(DELETE_PLAYLIST, playlistId),
};
