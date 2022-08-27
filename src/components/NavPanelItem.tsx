import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';
import { ValidRoute, routeProps } from '../models/Routes';
import classes from './NavPanelItem.module.scss';

export interface NavPanelItemProps {
    route: ValidRoute;
}

export const NavPanelItem: React.FC<NavPanelItemProps> = (props: NavPanelItemProps) => {
    const { route } = props;

    const routeProp = routeProps.get(route);

    if (routeProp === undefined) {
        throw Error('Invalid route!');
    }

    return (
        <ListItem disablePadding>
            <Link className={classes.link} to={route}>
                <ListItemButton>
                    <ListItemIcon className={classes.icon}>{routeProp.muiIcon}</ListItemIcon>
                    <ListItemText primary={routeProp.label} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
};
