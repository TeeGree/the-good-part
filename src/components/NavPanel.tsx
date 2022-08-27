import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import classes from './NavPanel.module.scss';
import { NavPanelItem } from './NavPanelItem';
import { routes, ValidRoute } from '../models/Routes';

export const NavPanel: React.FC<{}> = () => {
    const getNavPanelItems = (): JSX.Element[] => {
        return routes.map<JSX.Element>((route: ValidRoute) => (
            <NavPanelItem key={route} route={route} />
        ));
    };

    return (
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
            <List>{getNavPanelItems()}</List>
            <Divider />
        </Drawer>
    );
};
