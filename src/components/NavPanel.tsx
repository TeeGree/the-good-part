import QueueMusic from '@mui/icons-material/QueueMusic';
import Upload from '@mui/icons-material/Upload';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';
import classes from './NavPanel.module.scss';

export const NavPanel: React.FC<{}> = () => {
    return (
        <Drawer
            className={classes.navDrawer}
            PaperProps={{
                className: classes.drawerPaper
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar />
            <Divider />
            <List>
                <ListItem disablePadding>
                    <Link className={classes.link} to="/">
                        <ListItemButton>
                            <ListItemIcon className={classes.icon}>
                                <QueueMusic />
                            </ListItemIcon>
                            <ListItemText primary="Library" />
                        </ListItemButton>
                    </Link>
                </ListItem>
                <ListItem disablePadding>
                    <Link className={classes.link} to="upload-file">
                        <ListItemButton>
                            <ListItemIcon className={classes.icon}>
                                <Upload />
                            </ListItemIcon>
                            <ListItemText primary="Upload File" />
                        </ListItemButton>
                    </Link>
                </ListItem>
            </List>
            <Divider />
        </Drawer>
    );
}
