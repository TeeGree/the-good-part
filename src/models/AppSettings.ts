import { SongInfo } from './SongInfo';

export interface SongInfoFromSettings {
    id: string;
    filename: string;
}

export interface AppSettings {
    songs: SongInfo[];
    songMap: Map<string, SongInfo>;
    playlists: Playlist[];
    playlistMap: Map<string, Playlist>;
}

export interface AppSettingsFromFile {
    songs: SongInfoFromSettings[];
    playlists: Playlist[];
}

export interface Playlist {
    id: string;
    name: string;
    songIds: string[];
    color: string;
}
