import { SongInfo } from './SongInfo';

export interface SongInfoFromSettings {
    id: string;
    filename: string;
}

export interface AppSettings {
    songs: SongInfo[];
    songMap: Map<string, SongInfo>;
}

export interface AppSettingsFromFile {
    songs: SongInfoFromSettings[];
}
