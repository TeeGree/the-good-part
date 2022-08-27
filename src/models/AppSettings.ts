import { Playlist } from './Playlist';
import { SongInfo, SongInfoFromSettings } from './SongInfo';

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
