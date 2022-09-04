import { IAudioMetadata } from 'music-metadata';
import { AppSettings } from './models/AppSettings';

export interface IElectronAPI {
    getFileMetadata: (filepath: string) => Promise<IAudioMetadata>;
    getSettings: () => Promise<AppSettings>;
    uploadFile: (filepath: string) => Promise<void>;
    createPlaylist: (name: string) => Promise<void>;
    addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
    deleteSong: (songId: string) => Promise<void>;
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}

declare module '*.scss' {
    const classes: {
        [k: string]: string;
    };
    export = classes;
}
