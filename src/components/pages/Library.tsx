import React from 'react';
import { AppSettings } from '../../models/AppSettings';
import { LibraryTable } from '../LibraryTable';
import { UploadFileButton } from '../UploadFileButton';
import classes from './Library.module.scss';

interface LibraryProps {
    appSettings: AppSettings | undefined;
    playSong: (index: number) => void;
    playingSongId: string | undefined;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
    onLoadFile: (file: File) => Promise<void>;
    fileInputLabel: string;
}

export const Library: React.FC<LibraryProps> = (props: LibraryProps) => {
    const {
        appSettings,
        playingSongId,
        playSong,
        isPaused,
        onResume,
        onPause,
        onLoadFile,
        fileInputLabel,
    } = props;

    return (
        <div className={classes.libraryContainer}>
            <div className={classes.libraryHeaderContainer}>
                <UploadFileButton onLoadFile={onLoadFile} fileInputLabel={fileInputLabel} />
            </div>
            <div className={classes.libraryTableContainer}>
                <LibraryTable
                    appSettings={appSettings}
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
