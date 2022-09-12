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
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Playlist } from '../models/Playlist';
import { useAppDispatch, useAppSettingsDispatch } from '../redux/hooks';
import { modalStyle } from '../utility/ModalStyle';
import classes from './pages/Playlists.module.scss';

interface PlaylistTileProps {
    playPlaylist: (playlistId: string) => void;
    playlist: Playlist;
}

export const PlaylistTile: React.FC<PlaylistTileProps> = (props: PlaylistTileProps) => {
    const dispatch = useAppDispatch();
    const appSettingsDispatch = useAppSettingsDispatch(dispatch);
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

    const getSongCountText = (): string => {
        const count = playlist.songIds.length;

        const text = `${playlist.songIds.length} song`;

        if (count === 1) {
            return text;
        }

        return `${text}s`;
    };

    const tryToDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsDeleting(true);
    };

    const onPlay = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        playPlaylist(playlist.id);
    };

    const playButton =
        playlist.songIds.length > 0 ? (
            <IconButton sx={{ color: '#ffffff' }} onClick={onPlay}>
                <PlayArrow />
            </IconButton>
        ) : null;
    return (
        <>
            <Link to={`/playlistSummary/${playlist.id}`}>
                <Card
                    key={playlist.id}
                    className={classes.playlist}
                    sx={{
                        backgroundColor: playlist.color,
                        color: '#ffffff',
                    }}
                >
                    <CardContent>
                        {playlist.name}
                        <Typography variant="body2" color="text.secondary">
                            {getSongCountText()}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {playButton}
                        <Tooltip title="Delete">
                            <IconButton sx={{ color: '#ffffff' }} onClick={tryToDelete}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                </Card>
            </Link>
            <Modal open={isDeleting}>
                <Box sx={modalStyle}>
                    <h2>{`Are you sure you want to delete the "${playlist.name}" playlist?`}</h2>
                    <div className={classes.modalButtonContainer}>
                        <Button onClick={confirmDeletePlaylist}>Delete</Button>
                        <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};
