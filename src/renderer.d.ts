import * as mm from 'music-metadata';

export interface IElectronAPI {
    getFileMetadata: (filepath: string) => Promise<mm.IAudioMetadata>,
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