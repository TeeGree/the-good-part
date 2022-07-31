import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';
import * as process from 'process';
import { PlayingSongInfo } from './components/PlayingSongInfo';
import classes from './App.module.scss';
import { AppSettings } from './models/AppSettings';
import { Routes, Route, Navigate } from "react-router-dom";
import { Library } from './components/pages/Library';
import { PlayFile } from './components/pages/PlayFile';
import { NavPanel } from './components/NavPanel';
import { getFilenameFromPath } from './utility/FilePathUtils';

// Needed to polyfill dependencies that have been removed from Node.
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

    return (
        <div className={classes.app}>
            <div className={classes.appContainer}>
                <Routes>
                    <Route
                        path="/"
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
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <NavPanel />
                {getPlayingSongInfo()}
            </div>
        </div>
    );
}

export default App;
