import { Add, Delete, PlayArrow } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Modal,
    TextField,
    Tooltip,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Playlist } from '../../models/Playlist';
import { useAppSettingsDispatch, useAppSettingsSelector } from '../../redux/Hooks';
import { modalStyle } from '../../utility/ModalStyle';
import classes from './Playlists.module.scss';

interface PlaylistsProps {
    playPlaylist: (playlistId: string) => void;
}

export const Playlists: React.FC<PlaylistsProps> = (props: PlaylistsProps) => {
    const elementRef = useRef<HTMLInputElement | null>(null);
    const [numTilesPerRow, setNumTilesPerRow] = useState(3);
    const [playlistBeingDeleted, setPlaylistBeingDeleted] = useState('');

    const getNumTilesPerRow = (): number => {
        const tileWidth = 217;
        const scrollWidth = elementRef?.current?.scrollWidth ?? 0;
        return Math.floor(scrollWidth / tileWidth);
    };

    useEffect(() => {
        const handleResize = (): void => {
            setNumTilesPerRow(getNumTilesPerRow());
        };

        if (elementRef.current != null) {
            setNumTilesPerRow(getNumTilesPerRow());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [elementRef]);

    const appSettingsDispatch = useAppSettingsDispatch();
    const appSettings = useAppSettingsSelector();
    const { playPlaylist } = props;

    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState<string>('');

    const createPlaylist = async (name: string): Promise<void> => {
        await window.electron.createPlaylist(name);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
    };

    const deletePlaylist = async (playlistId: string): Promise<void> => {
        await window.electron.deletePlaylist(playlistId);
        const settings = await window.electron.getSettings();
        appSettingsDispatch(settings);
    };

    const createPlaylistCard = (playlist: Playlist) => {
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
                        <IconButton
                            sx={{ color: '#ffffff' }}
                            onClick={() => setPlaylistBeingDeleted(playlist.id)}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </CardActions>
            </Card>
        );
    };

    const getPlaylistCards = (): JSX.Element | JSX.Element[] => {
        if (appSettings === undefined) {
            return <></>;
        }

        const playlists = appSettings.playlists;
        const playlistCount = playlists.length;
        const rowCount = Math.ceil(playlistCount / numTilesPerRow);
        const results: JSX.Element[] = [];

        for (let i = 0; i < rowCount; i++) {
            const startingIndex = i * numTilesPerRow;
            const playlistsSubset = playlists.slice(startingIndex, startingIndex + numTilesPerRow);
            results.push(
                <div key={`playlistRow${i}`} className={classes.playlistRow}>
                    {playlistsSubset.map(createPlaylistCard)}
                </div>,
            );
        }

        return results;
    };

    const closeCreatePlaylistModal = (): void => {
        setNewPlaylistName('');
        setIsCreatingPlaylist(false);
    };

    const createPlaylistAndCloseModal = async (): Promise<void> => {
        await createPlaylist(newPlaylistName ?? '');
        setIsCreatingPlaylist(false);
    };

    const onNewPlaylistNameChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        setNewPlaylistName(event.target.value);
    };

    const getPlaylistName = (playlistId: string): string => {
        return appSettings.playlistMap.get(playlistId)?.name ?? '';
    };

    const confirmDeletePlaylist = (): void => {
        deletePlaylist(playlistBeingDeleted);
        setPlaylistBeingDeleted('');
    };

    const isCreatePlaylistDisabled = newPlaylistName === undefined || newPlaylistName === '';

    return (
        <div className={classes.playlistsContentContainer} ref={elementRef}>
            <div className={classes.playlistHeaderContainer}>
                <Tooltip title="Create Playlist">
                    <Button
                        sx={{ color: '#ffffff', margin: '5px', backgroundColor: '#36a5ef' }}
                        component="span"
                        variant="contained"
                        onClick={() => setIsCreatingPlaylist(true)}
                    >
                        <Add />
                    </Button>
                </Tooltip>
            </div>
            <div className={classes.playlistsContainer}>
                {getPlaylistCards()}
                <Modal open={isCreatingPlaylist}>
                    <Box sx={modalStyle}>
                        <h2>Create new playlist</h2>
                        <TextField
                            id="new-playlist-name"
                            label="Playlist name"
                            variant="standard"
                            value={newPlaylistName}
                            onChange={onNewPlaylistNameChange}
                        />
                        <div className={classes.modalButtonContainer}>
                            <Button
                                disabled={isCreatePlaylistDisabled}
                                onClick={createPlaylistAndCloseModal}
                            >
                                Create
                            </Button>
                            <Button onClick={closeCreatePlaylistModal}>Cancel</Button>
                        </div>
                    </Box>
                </Modal>
                <Modal open={playlistBeingDeleted !== ''}>
                    <Box sx={modalStyle}>
                        <h2>{`Are you sure you want to delete the "${getPlaylistName(
                            playlistBeingDeleted,
                        )}" playlist?`}</h2>
                        <div className={classes.modalButtonContainer}>
                            <Button onClick={confirmDeletePlaylist}>Delete</Button>
                            <Button onClick={() => setPlaylistBeingDeleted('')}>Cancel</Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};
