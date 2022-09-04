import { contextBridge } from 'electron';
import { api } from '../src/server/IpcHandlers';

contextBridge.exposeInMainWorld('electron', api);
