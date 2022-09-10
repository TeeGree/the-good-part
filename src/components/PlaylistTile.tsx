import { Delete, PlayArrow } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Modal,
    Tooltip,
} from '@mui/material';
import React, { useState } from 'react';
import { Playlist } from '../models/Playlist';
import { useAppSettingsDispatch } from '../redux/Hooks';
import { modalStyle } from '../utility/ModalStyle';
import classes from './pages/Playlists.module.scss';

interface PlaylistTileProps {
    playPlaylist: (playlistId: string) => void;
    playlist: Playlist;
}

export const PlaylistTile: React.FC<PlaylistTileProps> = (props: PlaylistTileProps) => {
    const appSettingsDispatch = useAppSettingsDispatch();
    const { playPlaylist, playlist } = props;

    const [isDeleting, setIsDeleting] = useState(false);

    const deletePlaylist = async (playlistId: string): Promise<void> => {
        await window.electron.deletePlaylist(playlistId);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
    };

    const confirmDeletePlaylist = (): void => {
        deletePlaylist(playlist.id);
        setIsDeleting(false);
    };

    const playButton =
        playlist.songIds.length > 0 ? (
            <IconButton sx={{ color: '#ffffff' }} onClick={() => playPlaylist(playlist.id)}>
                <PlayArrow />
            </IconButton>
        ) : null;
    return (
        <Card
            key={playlist.id}
            className={classes.playlist}
            sx={{
                backgroundColor: playlist.color,
                color: '#ffffff',
            }}
        >
            <CardContent>{playlist.name}</CardContent>
            <CardActions>
                {playButton}
                <Tooltip title="Delete">
                    <IconButton sx={{ color: '#ffffff' }} onClick={() => setIsDeleting(true)}>
                        <Delete />
                    </IconButton>
                </Tooltip>
            </CardActions>
            <Modal open={isDeleting}>
                <Box sx={modalStyle}>
                    <h2>{`Are you sure you want to delete the "${playlist.name}" playlist?`}</h2>
                    <div className={classes.modalButtonContainer}>
                        <Button onClick={confirmDeletePlaylist}>Delete</Button>
                        <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </Card>
    );
};
