import * as mm from 'music-metadata';

export interface SongInfo {
    relativePath: string,
    fullPath: string,
    filename: string,
    metadata: mm.IAudioMetadata
}