import React from 'react';
import ReactDOM from 'react-dom';
import classes from './styles.scss';

const Root: React.FC = () => (
    <div className={classes.Root}>
        <h1>Welcome to The Good Part!</h1>
        <p>This is going to be a music playing application at some point. Take a look around!</p>
    </div>
);

const container = document.getElementById('app');
ReactDOM.render(
    <Root />,
    container,
);