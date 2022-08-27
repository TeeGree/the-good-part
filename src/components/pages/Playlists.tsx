import { PlayArrow } from '@mui/icons-material';
import { Card, CardActions, CardContent, IconButton } from '@mui/material';
import React from 'react';
import { AppSettings, Playlist } from '../../models/AppSettings';
import classes from './Playlists.module.scss';

interface PlaylistsProps {
    appSettings: AppSettings | undefined;
    playPlaylist: (playlistId: string) => void;
}

export const Playlists: React.FC<PlaylistsProps> = (props: PlaylistsProps) => {
    const { appSettings, playPlaylist } = props;

    const getPlaylistCards = (): JSX.Element | JSX.Element[] => {
        if (appSettings === undefined) {
            return <></>;
        }

        return appSettings.playlists.map<JSX.Element>((item: Playlist) => {
            return (
                <Card
                    key={item.id}
                    className={classes.playlist}
                    sx={{
                        backgroundColor: item.color,
                        color: '#ffffff',
                    }}
                >
                    <CardContent>{item.name}</CardContent>
                    <CardActions>
                        <IconButton sx={{ color: '#ffffff' }} onClick={() => playPlaylist(item.id)}>
                            <PlayArrow />
                        </IconButton>
                    </CardActions>
                </Card>
            );
        });
    };

    return <div className={classes.playlistsContainer}>{getPlaylistCards()}</div>;
};
