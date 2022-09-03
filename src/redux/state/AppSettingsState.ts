import { AppSettings } from '../../models/AppSettings';
import { Playlist } from '../../models/Playlist';
import { SongInfo } from '../../models/SongInfo';

export const defaultAppSettings: AppSettings = {
    songs: [],
    songMap: new Map<string, SongInfo>(),
    playlists: [],
    playlistMap: new Map<string, Playlist>(),
};

export interface AppSettingsState {
    appSettings: AppSettings;
}
