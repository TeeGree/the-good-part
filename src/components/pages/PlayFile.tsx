import React from 'react';
import { FileUpload } from '../FileUpload';
import { Howl } from 'howler';
import * as mm from 'music-metadata-browser';

interface PlayFileProps {
    playingSound: Howl | undefined,
    clearPlayingSong: () => void,
    setPlayingSoundMetadata: (metadata: mm.IAudioMetadata) => void,
    playSong: (filepath: string, songId?: string, filename?: string) => void
}

export const PlayFile: React.FC<PlayFileProps> = (props: PlayFileProps) => {
    const openFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            await playFile(file);
        }
    }

    const playFile = async (file: File) => {
        if (props.playingSound) {
            props.playingSound.stop();
            props.clearPlayingSong();
        }
        
        const metadata = await mm.parseBlob(file);
        props.setPlayingSoundMetadata(metadata);
        const reader = new FileReader();
        reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
            if (event.target !== null) {
                props.playSong(event.target.result as string);
            }
        });

        reader.readAsDataURL(file);
    }

    return (
        <FileUpload label="Choose music file to play" onFileSelection={openFile} />
    );
}
