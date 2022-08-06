import { contextBridge, ipcRenderer } from 'electron';
import * as mm from 'music-metadata';
import { AppSettings } from '../src/models/AppSettings';

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: (filepath: string): Promise<mm.IAudioMetadata> => ipcRenderer.invoke('get-file-metadata', filepath),
    getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings'),
    uploadFile: (filepath: string): Promise<void> => ipcRenderer.invoke('upload-file', filepath)
});