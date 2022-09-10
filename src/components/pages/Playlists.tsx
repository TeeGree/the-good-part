import { Add } from '@mui/icons-material';
import { Box, Button, Modal, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Playlist } from '../../models/Playlist';
import { useAppSettingsDispatch, useAppSettingsSelector } from '../../redux/Hooks';
import { modalStyle } from '../../utility/ModalStyle';
import { PlaylistTile } from '../PlaylistTile';
import classes from './Playlists.module.scss';

interface PlaylistsProps {
    playPlaylist: (playlistId: string) => void;
}

export const Playlists: React.FC<PlaylistsProps> = (props: PlaylistsProps) => {
    const elementRef = useRef<HTMLInputElement | null>(null);
    const [numTilesPerRow, setNumTilesPerRow] = useState(3);

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
                    {playlistsSubset.map((playlist: Playlist) => {
                        return (
                            <PlaylistTile
                                key={playlist.id}
                                playPlaylist={playPlaylist}
                                playlist={playlist}
                            />
                        );
                    })}
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
            </div>
        </div>
    );
};
