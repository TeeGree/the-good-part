import { QueueMusic, Upload, ViewComfy } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import classes from './NavPanel.module.scss';
import { NavPanelItem } from './NavPanelItem';

export const NavPanel: React.FC<{}> = () => (
    <Drawer
        className={classes.navDrawer}
        PaperProps={{
            className: classes.drawerPaper,
        }}
        variant="permanent"
        anchor="left"
    >
        <Toolbar />
        <Divider />
        <List>
            <NavPanelItem route="/" label="Library" muiIcon={<QueueMusic />} />
            <NavPanelItem route="upload-file" label="Upload File" muiIcon={<Upload />} />
            <NavPanelItem route="playlists" label="Playlists" muiIcon={<ViewComfy />} />
        </List>
        <Divider />
    </Drawer>
);
