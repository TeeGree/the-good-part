import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    getFileMetadata: () => ipcRenderer.invoke('get-file-metadata')
});