import React from 'react';
import { AppSettings } from '../../models/AppSettings';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { SongInfo } from '../../models/SongInfo';
import { parseNumberAsMinutesText } from '../../utility/StringUtils';
import classes from './Library.module.scss';

interface LibraryProps {
    appSettings: AppSettings | undefined,
    playSong: (filepath: string) => void
}

export const Library: React.FC<LibraryProps> = (props: LibraryProps) => {
    const getRowForSong = (index: number, song: SongInfo) => {
        if (song.metadata === undefined) {
            return (<></>);
        }

        const metadata = song.metadata;
        const commonMetadata = metadata.common;
        const durationText = parseNumberAsMinutesText(metadata.format.duration ?? 0)
        return (
            <TableRow key={index}>
                <TableCell className={classes.tableCell}>{commonMetadata.title}</TableCell>
                <TableCell className={classes.tableCell}>{commonMetadata.artist}</TableCell>
                <TableCell className={classes.tableCell}>{commonMetadata.album}</TableCell>
                <TableCell className={classes.tableCell}>{durationText}</TableCell>
            </TableRow>
        );
    }
    
    const getRowsForSongsInSettings = () => {
        const songRows = props.appSettings?.songs.map((song, i) => getRowForSong(i, song));

        return (
            <TableBody>
                {songRows}
            </TableBody>
        );
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCell}>Name</TableCell>
                        <TableCell className={classes.tableCell}>Artist</TableCell>
                        <TableCell className={classes.tableCell}>Album</TableCell>
                        <TableCell className={classes.tableCell}>Duration</TableCell>
                    </TableRow>
                </TableHead>
                {getRowsForSongsInSettings()}
            </Table>
        </TableContainer>
    );
}
