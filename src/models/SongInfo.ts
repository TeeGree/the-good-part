import { IAudioMetadata } from 'music-metadata';

export interface SongInfo {
    id: string;
    filename: string;
    fullPath: string;
    metadata: IAudioMetadata | undefined;
}

export interface SongInfoFromSettings {
    id: string;
    filename: string;
}
