import * as mm from 'music-metadata';

export interface SongInfo {
    id: string,
    filename: string,
    fullPath: string,
    metadata: mm.IAudioMetadata | undefined
}