import React from 'react';
import classes from './styles.scss';

const Home: React.FC = () => (
    <div className={classes.Root}>
        <h1>Welcome to The Good Part!</h1>
        <p>This is going to be a music playing application at some point. Take a look around!</p>
    </div>
);

export default Home;