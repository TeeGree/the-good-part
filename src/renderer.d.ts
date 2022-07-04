export interface IElectronAPI {
    openFile: () => Promise<void>,
}

declare global {
    interface Window {
        electron: IElectronAPI
    }
}