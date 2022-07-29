export interface SongInfoFromSettings {
    id: string,
    relativePath: string,
    fullPath: string
}

export interface AppSettings {
    songs: SongInfoFromSettings[]
}

export interface AppSettingsFromFile {
    songs: SongInfoFromSettings[]
}