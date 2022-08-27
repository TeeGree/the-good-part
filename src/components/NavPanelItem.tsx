import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';
import classes from './NavPanelItem.module.scss';

export interface NavPanelItemProps {
    route: string;
    label: string;
    muiIcon: React.ReactNode;
}

export const NavPanelItem: React.FC<NavPanelItemProps> = (props: NavPanelItemProps) => {
    const { route, label, muiIcon } = props;

    return (
        <ListItem disablePadding>
            <Link className={classes.link} to={route}>
                <ListItemButton>
                    <ListItemIcon className={classes.icon}>{muiIcon}</ListItemIcon>
                    <ListItemText primary={label} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
};
