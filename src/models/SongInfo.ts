import * as mm from 'music-metadata';

export interface SongInfo {
    filename: string,
    fullPath: string,
    metadata: mm.IAudioMetadata | undefined
}