import * as mm from 'music-metadata';

export interface SongInfo {
    filename: string,
    metadata: mm.IAudioMetadata | undefined
}