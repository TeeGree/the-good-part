import React from 'react';
import { LibraryTable } from '../LibraryTable';
import { UploadFileButton } from '../UploadFileButton';
import classes from './Library.module.scss';

interface LibraryProps {
    playSong: (index: number) => void;
    playingSongId: string | undefined;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
    fileInputLabel: string;
}

export const Library: React.FC<LibraryProps> = (props: LibraryProps) => {
    const { playingSongId, playSong, isPaused, onResume, onPause, fileInputLabel } = props;

    return (
        <div className={classes.libraryContainer}>
            <div className={classes.libraryHeaderContainer}>
                <UploadFileButton fileInputLabel={fileInputLabel} />
            </div>
            <div className={classes.libraryTableContainer}>
                <LibraryTable
                    playSong={playSong}
                    isPaused={isPaused}
                    onPause={onPause}
                    onResume={onResume}
                    playingSongId={playingSongId}
                />
            </div>
        </div>
    );
};
