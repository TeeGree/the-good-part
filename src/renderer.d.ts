import { api } from './server/IpcHandlers';

export type ElectronAPI = typeof api;

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}

declare module '*.scss' {
    const classes: {
        [k: string]: string;
    };
    export = classes;
}
