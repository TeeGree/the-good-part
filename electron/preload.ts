import { contextBridge, ipcRenderer } from 'electron';
import * as mm from 'music-metadata';
import { AppSettings } from '../src/models/AppSettings';
import { SongInfo } from '../src/models/SongInfo'

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: (filepath: string): Promise<mm.IAudioMetadata> => ipcRenderer.invoke('get-file-metadata', filepath),
    getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings')
});