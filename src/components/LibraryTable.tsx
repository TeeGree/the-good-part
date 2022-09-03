import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import classes from './LibraryTable.module.scss';
import { AppSettings } from '../models/AppSettings';
import { LibraryTableRow } from './LibraryTableRow';
import { Playlist } from '../models/Playlist';

interface LibraryTableProps {
    appSettings: AppSettings | undefined;
    playSong: (index: number) => void;
    playingSongId: string | undefined;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
    addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

export const LibraryTable: React.FC<LibraryTableProps> = (props: LibraryTableProps) => {
    const { appSettings, playingSongId, playSong, isPaused, onResume, onPause, addSongToPlaylist } =
        props;

    const getPlaylists = (): Playlist[] => {
        return appSettings?.playlists ?? [];
    };

    const getRowsForSongsInSettings = (): JSX.Element => {
        const songRows = appSettings?.songs.map((song, i) => {
            return (
                <LibraryTableRow
                    key={song.id}
                    song={song}
                    playSong={playSong}
                    playingSongId={playingSongId}
                    isPaused={isPaused}
                    onPause={onPause}
                    onResume={onResume}
                    songIndex={i}
                    playlists={getPlaylists()}
                    addSongToPlaylist={addSongToPlaylist}
                />
            );
        });

        return <TableBody>{songRows}</TableBody>;
    };

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
