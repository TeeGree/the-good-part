import React from 'react';
import { useAppSettingsSelector } from '../../redux/hooks';
import { SongTable } from '../SongTable';
import { UploadFileButton } from '../UploadFileButton';
import classes from './Library.module.scss';

interface LibraryProps {
    playSong: (index: number) => void;
    playingSongId: string | undefined;
    onPause: () => void;
    onResume: () => void;
    fileInputLabel: string;
}

export const Library: React.FC<LibraryProps> = (props: LibraryProps) => {
    const appSettings = useAppSettingsSelector();
    const { playingSongId, playSong, onResume, onPause, fileInputLabel } = props;

    return (
        <div className={classes.page}>
            <div className={classes.HeaderContainer}>
                <UploadFileButton fileInputLabel={fileInputLabel} />
            </div>
            <div className={classes.songTableContainer}>
                <SongTable
                    playSong={playSong}
                    onPause={onPause}
                    onResume={onResume}
                    playingSongId={playingSongId}
                    songs={appSettings.songs}
                />
            </div>
        </div>
    );
};
