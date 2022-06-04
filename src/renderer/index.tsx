import React from 'react';
import ReactDOM from 'react-dom';
import Home from './home';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

const Root: React.FC = () => (
    <Router>
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
        </Switch>
    </Router>
);

const container = document.getElementById('app');
ReactDOM.render(
    <Root />,
    container,
);