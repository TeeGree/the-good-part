import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import classes from './SongTable.module.scss';
import { SongTableRow } from './SongTableRow';
import { Playlist } from '../models/Playlist';
import { useAppSettingsSelector } from '../redux/hooks';
import { SongInfo } from '../models/SongInfo';

interface SongTableProps {
    playSong: (index: number) => void;
    playingSongId: string | undefined;
    onPause: () => void;
    onResume: () => void;
    songs: SongInfo[];
}

export const SongTable: React.FC<SongTableProps> = (props: SongTableProps) => {
    const appSettings = useAppSettingsSelector();
    const { playingSongId, playSong, onResume, onPause, songs } = props;

    const getPlaylists = (): Playlist[] => {
        return appSettings?.playlists ?? [];
    };

    const getRowsForSongsInSettings = (): JSX.Element => {
        const songRows = songs.map((song, i) => {
            const key = song + i.toString();
            return (
                <SongTableRow
                    key={key}
                    song={song}
                    playSong={playSong}
                    playingSongId={playingSongId}
                    onPause={onPause}
                    onResume={onResume}
                    songIndex={i}
                    playlists={getPlaylists()}
                />
            );
        });

        return <TableBody>{songRows}</TableBody>;
    };

    if (songs.length === 0) {
        return <div>No songs available</div>;
    }

    return (
        <TableContainer className={classes.tableContainer}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCell} />
                        <TableCell className={classes.tableCell}>Name</TableCell>
                        <TableCell className={classes.tableCell}>Artist</TableCell>
                        <TableCell className={classes.tableCell}>Album</TableCell>
                        <TableCell className={classes.tableCell}>Duration</TableCell>
                        <TableCell className={classes.tableCell} />
                    </TableRow>
                </TableHead>
                {getRowsForSongsInSettings()}
            </Table>
        </TableContainer>
    );
};
