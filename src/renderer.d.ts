export interface IElectronAPI {
    openFile: () => Promise<string>,
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