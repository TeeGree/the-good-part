import { Add, PlayArrow } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    IconButton,
    Modal,
    TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { Playlist } from '../../models/Playlist';
import { useAppSettingsDispatch, useAppSettingsSelector } from '../../redux/Hooks';
import { modalStyle } from '../../utility/ModalStyle';
import classes from './Playlists.module.scss';

interface PlaylistsProps {
    playPlaylist: (playlistId: string) => void;
}

export const Playlists: React.FC<PlaylistsProps> = (props: PlaylistsProps) => {
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

    const createCard = (
        label: string,
        color: string,
        onClick: () => void,
        muiIcon: React.ReactNode | null,
        key?: string,
    ) => {
        const iconButton =
            muiIcon === null ? (
                <></>
            ) : (
                <IconButton sx={{ color: '#ffffff' }} onClick={onClick}>
                    {muiIcon}
                </IconButton>
            );
        return (
            <Card
                key={key}
                className={classes.playlist}
                sx={{
                    backgroundColor: color,
                    color: '#ffffff',
                }}
            >
                <CardContent>{label}</CardContent>
                <CardActions>{iconButton}</CardActions>
            </Card>
        );
    };

    const getPlaylistCards = (): JSX.Element | JSX.Element[] => {
        if (appSettings === undefined) {
            return <></>;
        }

        return appSettings.playlists.map<JSX.Element>((item: Playlist) => {
            const icon = item.songIds.length > 0 ? <PlayArrow /> : null;
            return createCard(item.name, item.color, () => playPlaylist(item.id), icon, item.id);
        });
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
        <div className={classes.playlistsContainer}>
            {getPlaylistCards()}
            {createCard(
                'Create new playlist',
                '#483d8b',
                () => setIsCreatingPlaylist(true),
                <Add />,
            )}
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
    );
};
