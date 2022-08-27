import { QueueMusic, ViewComfy } from '@mui/icons-material';
import React from 'react';

export const libraryRoute = '/';
export const playlistsRoute = 'playlists';

export type ValidRoute = typeof libraryRoute | typeof playlistsRoute;

export const routes: ValidRoute[] = [libraryRoute, playlistsRoute];

export interface RouteProperty {
    label: string;
    muiIcon: React.ReactNode;
}

export const routeProps = new Map<ValidRoute, RouteProperty>([
    [
        libraryRoute,
        {
            label: 'Library',
            muiIcon: <QueueMusic />,
        },
    ],
    [
        playlistsRoute,
        {
            label: 'Playlists',
            muiIcon: <ViewComfy />,
        },
    ],
]);
