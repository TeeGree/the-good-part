import * as mm from 'music-metadata';
import { AppSettings } from './models/AppSettings';

export interface IElectronAPI {
    getFileMetadata: (filepath: string) => Promise<mm.IAudioMetadata>,
    getSettings: () => Promise<AppSettings>
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