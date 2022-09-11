import React from 'react';
import { useAppSettingsSelector } from '../../redux/Hooks';
import { SongTable } from '../SongTable';
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
    const appSettings = useAppSettingsSelector();
    const { playingSongId, playSong, isPaused, onResume, onPause, fileInputLabel } = props;

    return (
        <div className={classes.libraryContainer}>
            <div className={classes.libraryHeaderContainer}>
                <UploadFileButton fileInputLabel={fileInputLabel} />
            </div>
            <div className={classes.libraryTableContainer}>
                <SongTable
                    playSong={playSong}
                    isPaused={isPaused}
                    onPause={onPause}
                    onResume={onResume}
                    playingSongId={playingSongId}
                    songs={appSettings.songs}
                />
            </div>
        </div>
    );
};
