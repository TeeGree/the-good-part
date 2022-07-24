import { contextBridge, ipcRenderer } from 'electron';
import * as mm from 'music-metadata';
import { AppSettings } from '../src/models/AppSettings';

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: (): Promise<mm.IAudioMetadata> => ipcRenderer.invoke('get-file-metadata'),
    getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings')
});