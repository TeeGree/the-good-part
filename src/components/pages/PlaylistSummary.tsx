import React from 'react';
import { useParams } from 'react-router-dom';
import { SongInfo } from '../../models/SongInfo';
import { useAppSettingsSelector } from '../../redux/hooks';
import { SongTable } from '../SongTable';
import classes from './PlaylistSummary.module.scss';

interface PlaylistSummaryProps {
    playSong: (index: number, playlistId: string) => void;
    playingSongId: string | undefined;
    onPause: () => void;
    onResume: () => void;
}

export const PlaylistSummary: React.FC<PlaylistSummaryProps> = (props: PlaylistSummaryProps) => {
    const appSettings = useAppSettingsSelector();
    const { id } = useParams();
    const { playingSongId, playSong, onResume, onPause } = props;

    if (id === undefined) {
        throw Error('No playlist ID was supplied!');
    }

    const playlist = appSettings.playlistMap.get(id);

    if (playlist === undefined) {
        throw Error('Invalid playlist ID!');
    }

    const getSongs = (): SongInfo[] => {
        return playlist.songIds.map((songId: string) => {
            const song = appSettings.songMap.get(songId);
            if (song === undefined) {
                throw Error(`Song ID ${songId} is not in the app settings!`);
            }
            return song;
        });
    };

    const playSongInPlaylist = (index: number): void => {
        playSong(index, id);
    };

    return (
        <div className={classes.page}>
            <div className={classes.HeaderContainer}>{playlist.name}</div>
            <div className={classes.songTableContainer}>
                <SongTable
                    playSong={playSongInPlaylist}
                    onPause={onPause}
                    onResume={onResume}
                    playingSongId={playingSongId}
                    songs={getSongs()}
                />
            </div>
        </div>
    );
};
