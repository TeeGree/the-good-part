import React, { useState } from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MoreVert, Pause, PlayArrow } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { SongInfo } from '../models/SongInfo';
import { parseNumberAsMinutesText } from '../utility/StringUtils';
import classes from './SongTable.module.scss';
import { TooltipOnOverflow } from './TooltipOnOverflow';
import { getFilenameWithoutExtension } from '../utility/FilePathUtils';
import { modalStyle } from '../utility/ModalStyle';
import { Playlist } from '../models/Playlist';
import { useAppSettingsDispatch } from '../redux/hooks';

interface SongTableRowProps {
    song: SongInfo;
    songIndex: number;
    playingSongId: string | undefined;
    playSong: (index: number) => void;
    onPause: () => void;
    onResume: () => void;
    isPaused: boolean;
    playlists: Playlist[];
}

export const SongTableRow: React.FC<SongTableRowProps> = (props: SongTableRowProps) => {
    const appSettingsDispatch = useAppSettingsDispatch();
    const { song, songIndex, playingSongId, playSong, onPause, onResume, isPaused, playlists } =
        props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
    const open = Boolean(anchorEl);

    const getDefaultPlaylistId = (): string => {
        return playlists.length > 0 ? playlists[0].id : '';
    };

    const [playlistIdToAddSongTo, setPlaylistIdToAddSongTo] = React.useState(
        getDefaultPlaylistId(),
    );

    const handleChange = (event: SelectChangeEvent) => {
        setPlaylistIdToAddSongTo(event.target.value);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const closeModal = () => {
        handleClose();
        setIsAddingToPlaylist(false);
        setPlaylistIdToAddSongTo(getDefaultPlaylistId());
    };

    const addSongToPlaylist = async (playlistId: string, songId: string): Promise<void> => {
        await window.electron.addSongToPlaylist(playlistId, songId);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
    };

    const addSongForRowToPlaylist = async () => {
        await addSongToPlaylist(playlistIdToAddSongTo, song.id);
        closeModal();
    };

    const getPlaybackIcon = (): JSX.Element => {
        // This row's song is not playing.
        if (playingSongId !== song.id) {
            return (
                <IconButton color="inherit" onClick={() => playSong(songIndex)}>
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

    const deleteSong = async (): Promise<void> => {
        await window.electron.deleteSong(song.id);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
    };

    const getPlaylistMenuItems = (): JSX.Element[] => {
        return playlists.map((playlist: Playlist) => (
            <MenuItem key={playlist.id} value={playlist.id}>
                {playlist.name}
            </MenuItem>
        ));
    };

    const { metadata } = song;

    if (metadata === undefined) {
        return <></>;
    }

    const commonMetadata = metadata.common;
    const durationText = parseNumberAsMinutesText(metadata.format.duration ?? 0);
    const rowClass: string = song.id === playingSongId ? classes.playingRow : '';

    return (
        <TableRow className={rowClass}>
            <TableCell className={classes.tableCell}>
                <div className={classes.playButtonCell}>{getPlaybackIcon()}</div>
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
            <TableCell className={classes.tableCell}>
                <IconButton onClick={handleMenuClick}>
                    <MoreVert />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem
                        disabled={playlists.length === 0}
                        onClick={() => setIsAddingToPlaylist(true)}
                    >
                        Add to playlist
                    </MenuItem>
                    <MenuItem onClick={deleteSong}>Delete</MenuItem>
                </Menu>
            </TableCell>
            <Modal open={isAddingToPlaylist}>
                <Box sx={modalStyle}>
                    <h2>Add to playlist</h2>
                    <FormControl fullWidth>
                        <InputLabel id="select-playlist-label">Playlist</InputLabel>
                        <Select
                            labelId="select-playlist-label"
                            id="select-playlist"
                            value={playlistIdToAddSongTo}
                            label="Playlist"
                            onChange={handleChange}
                        >
                            {getPlaylistMenuItems()}
                        </Select>
                    </FormControl>
                    <div className={classes.modalButtonContainer}>
                        <Button onClick={addSongForRowToPlaylist}>Add</Button>
                        <Button onClick={closeModal}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </TableRow>
    );
};
