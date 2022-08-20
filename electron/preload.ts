import { contextBridge, ipcRenderer } from 'electron';
import { IAudioMetadata } from 'music-metadata';
import { AppSettings } from '../src/models/AppSettings';

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: async (filepath: string): Promise<IAudioMetadata> =>
        await ipcRenderer.invoke('get-file-metadata', filepath),
    getSettings: async (): Promise<AppSettings> =>
        await ipcRenderer.invoke('get-settings'),
    uploadFile: async (filepath: string): Promise<void> =>
        await ipcRenderer.invoke('upload-file', filepath)
});