import { contextBridge, ipcRenderer } from 'electron';
import { IAudioMetadata } from 'music-metadata';
import { AppSettings } from '../src/models/AppSettings';

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: (filepath: string): Promise<IAudioMetadata> =>
        ipcRenderer.invoke('get-file-metadata', filepath),
    getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings'),
    uploadFile: (filepath: string): Promise<void> => ipcRenderer.invoke('upload-file', filepath),
    createPlaylist: (name: string): Promise<void> => ipcRenderer.invoke('create-playlist', name),
    addSongToPlaylist: (playlistId: string, songId: string): Promise<void> =>
        ipcRenderer.invoke('add-song-to-playlist', playlistId, songId),
});
