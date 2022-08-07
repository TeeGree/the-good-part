import { IAudioMetadata } from 'music-metadata';
import { AppSettings, AppSettingsFromFile } from './models/AppSettings';
import { SongInfo } from './models/SongInfo';

export interface IElectronAPI {
    getFileMetadata: (filepath: string) => Promise<IAudioMetadata>,
    getSettings: () => Promise<AppSettings>,
    uploadFile: (filepath: string) => Promise<void>
}

declare global {
    interface Window {
        electron: IElectronAPI
    }
}

declare module '*.scss' {
    const classes: {
        [k: string]: string,
    }
    export = classes;
}