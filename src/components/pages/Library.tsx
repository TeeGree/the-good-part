import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Pause, PlayArrow } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { SongInfo } from '../../models/SongInfo';
import { parseNumberAsMinutesText } from '../../utility/StringUtils';
import classes from './Library.module.scss';
import { AppSettings } from '../../models/AppSettings';
import { TooltipOnOverflow } from '../TooltipOnOverflow';
import { getFilenameWithoutExtension } from '../../utility/FilePathUtils';

interface LibraryProps {
    appSettings: AppSettings | undefined;
    playSong: (index: number) => void;
    playingSongId: string | undefined;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
}

export const Library: React.FC<LibraryProps> = (props: LibraryProps) => {
    const getPlaybackIcon = (song: SongInfo, index: number): JSX.Element => {
        const { playingSongId, playSong, isPaused, onResume, onPause } = props;
        // This row's song is not playing.
        if (playingSongId !== song.id) {
            return (
                <IconButton color="inherit" onClick={() => playSong(index)}>
                    <PlayArrow />
                </IconButton>
            );
        }

        // This row's song is playing, but paused.
        if (isPaused) {
            return (
                <IconButton color="inherit" onClick={onResume}>
                    <PlayArrow />
                </IconButton>
            );
        }

        // This row's song is playing and not paused.
        return (
            <IconButton color="inherit" onClick={onPause}>
                <Pause />
            </IconButton>
        );
    };

    const getTitle = (title: string | undefined, filename: string): string => {
        if (title !== undefined) {
            return title;
        }

        return getFilenameWithoutExtension(filename);
    };

    const getRowForSong = (index: number, song: SongInfo): JSX.Element => {
        if (song.metadata === undefined) {
            return <></>;
        }

        const { metadata } = song;
        const commonMetadata = metadata.common;
        const durationText = parseNumberAsMinutesText(metadata.format.duration ?? 0);
        return (
            <TableRow key={index}>
                <TableCell className={classes.tableCell}>
                    <div className={classes.playButtonCell}>{getPlaybackIcon(song, index)}</div>
                </TableCell>
                <TableCell className={classes.tableCell}>
                    <div className={classes.tableCellText}>
                        <TooltipOnOverflow text={getTitle(commonMetadata.title, song.filename)} />
                    </div>
                </TableCell>
                <TableCell className={classes.tableCell}>
                    <div className={classes.tableCellText}>
                        <TooltipOnOverflow text={commonMetadata.artist} />
                    </div>
                </TableCell>
                <TableCell className={classes.tableCell}>
                    <div className={classes.tableCellText}>
                        <TooltipOnOverflow text={commonMetadata.album} />
                    </div>
                </TableCell>
                <TableCell className={classes.tableCell}>
                    <div className={classes.durationCell}>{durationText}</div>
                </TableCell>
            </TableRow>
        );
    };

    const getRowsForSongsInSettings = (): JSX.Element => {
        const { appSettings } = props;
        const songRows = appSettings?.songs.map((song, i) => getRowForSong(i, song));

        return <TableBody>{songRows}</TableBody>;
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCell} />
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
};
