import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';
import * as process from 'process';
import { PlayingSongInfo } from './components/PlayingSongInfo';
import classes from './App.module.scss';
import { AppSettings } from './models/AppSettings';
import { Routes, Route, Link } from "react-router-dom";
import { Library } from './components/pages/Library';
import { PlayFile } from './components/pages/PlayFile';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { FileUpload, QueueMusic } from '@mui/icons-material';

window.Buffer = Buffer;
window.process = process;

function App() {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [nameOfFile, setNameOfFile] = useState<string>();
    const [playingSoundMetadata, setPlayingSoundMetadata] = useState<mm.IAudioMetadata>();
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number | null>(null);
    const [totalDuration, setTotalDuration] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [appSettings, setAppSettings] = useState<AppSettings>();

    useEffect(() => {
        window.electron.getSettings().then((settings) => {
            setAppSettings(settings);
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playingSound && playingSound && playingSound.playing()) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                if (duration === playbackPosition) {
                    clearPlayingSong();
                } else {
                    setCurrentPlaybackTime(playbackPosition);
                    setTotalDuration(duration);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [playingSound]);

    useEffect(() => {
        if (playingSound === undefined) {
            return;
        }
        if (isPaused) {
            playingSound?.pause();
        } else {
            playingSound?.play();
        }
    }, [isPaused]);

    const clearPlayingSong = () => {
        setPlayingSound(undefined);
        setCurrentPlaybackTime(null);
        setTotalDuration(null);
    }

    const getFilenameFromPath = (filepath: string) => {
        const filepathParts = filepath.split('\\');
        const lastFilePart = filepathParts[filepathParts.length - 1];
        return lastFilePart;
    }
    
    const playSong = (filepath: string) => {
        const filename = getFilenameFromPath(filepath);
        const howlerSound = new Howl({ src: [filepath], preload: true });

        howlerSound.once('play', () => {
            setPlayingSound(howlerSound);
            setNameOfFile(filename);
            setTotalDuration(howlerSound.duration());
        });

        howlerSound.once('end', () => {
            setPlayingSound(undefined);
        })
        
        if (playingSound) {
            playingSound.stop();
        }

        if (isPaused) {
            setIsPaused(false);
        }

        howlerSound.play();
    }

    const pausePlayingSong = () => {
        setIsPaused(true);
    }

    const resumePlayingSong = () => {
        setIsPaused(false);
    }

    const getPlayingSongInfo = (): JSX.Element => {
        if (playingSound) {
            return (
                <div className={classes.playingSongInfo}>
                    <PlayingSongInfo
                        nameOfFile={nameOfFile}
                        fileMetadata={playingSoundMetadata}
                        playingSound={playingSound}
                        onPause={pausePlayingSong}
                        onPlay={resumePlayingSong}
                        isPaused={isPaused}
                        currentPlaybackTime={currentPlaybackTime}
                        totalDuration={totalDuration}
                    />
                </div>
            );
        }
        
        return (<></>);
    }

    const theme = createTheme({
        palette: {
            mode: "dark"
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.app}>
                <div className={classes.appContainer}>
                    <Routes>
                        <Route
                            index
                            element={
                                <Library appSettings={appSettings} playSong={playSong} />
                            }
                        />
                        <Route
                            path="play-file"
                            element={
                                <PlayFile
                                    playingSound={playingSound}
                                    clearPlayingSong={clearPlayingSong}
                                    setPlayingSoundMetadata={setPlayingSoundMetadata}
                                    playSong={playSong}
                                />
                            }
                        />
                    </Routes>
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
                                        <ListItemIcon>
                                            <QueueMusic />
                                        </ListItemIcon>
                                        <ListItemText primary="Library" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem disablePadding>
                                <Link className={classes.link} to="play-file">
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <FileUpload />
                                        </ListItemIcon>
                                        <ListItemText primary="Play File" />
                                    </ListItemButton>
                                </Link>
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                    {getPlayingSongInfo()}
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
