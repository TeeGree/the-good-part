import React from 'react';
import { useParams } from 'react-router-dom';
import { SongInfo } from '../../models/SongInfo';
import { useAppSettingsSelector } from '../../redux/Hooks';
import { SongTable } from '../SongTable';

interface PlaylistSummaryProps {
    playSong: (index: number, playlistId: string) => void;
    playingSongId: string | undefined;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
}

export const PlaylistSummary: React.FC<PlaylistSummaryProps> = (props: PlaylistSummaryProps) => {
    const appSettings = useAppSettingsSelector();
    const { id } = useParams();
    const { playingSongId, playSong, isPaused, onResume, onPause } = props;

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
        <SongTable
            playSong={playSongInPlaylist}
            isPaused={isPaused}
            onPause={onPause}
            onResume={onResume}
            playingSongId={playingSongId}
            songs={getSongs()}
        />
    );
};
