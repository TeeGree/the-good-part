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
import { SelectFile } from './components/pages/SelectFile';
import { NavPanel } from './components/NavPanel';
import { getFilenameFromPath } from './utility/FilePathUtils';

// Needed to polyfill dependencies that have been removed from Node.
window.Buffer = Buffer;
window.process = process;

function App() {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [nameOfFile, setNameOfFile] = useState<string>();
    const [playingSoundMetadata, setPlayingSoundMetadata] = useState<mm.IAudioMetadata>();
    const [playingSongId, setPlayingSongId] = useState<string>();
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
        setPlayingSongId(undefined);
    }
    
    const playSong = (filepath: string, songId?: string, filename?: string) => {
        if (filename === undefined) {
            filename = getFilenameFromPath(filepath);
        }

        const howlerSound = new Howl({ src: [filepath], preload: true });

        howlerSound.once('play', () => {
            setPlayingSound(howlerSound);
            setNameOfFile(filename);
            setTotalDuration(howlerSound.duration());
            if (songId) {
                setPlayingSongId(songId);
            } else {
                setPlayingSongId(undefined);
            }
            
            if (isPaused) {
                setIsPaused(false);
            }
        });

        howlerSound.once('end', () => {
            setPlayingSound(undefined);
        })
        
        if (playingSound) {
            playingSound.stop();
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

    const playFile = async (file: File) => {
        if (playingSound) {
            playingSound.stop();
            clearPlayingSong();
        }
        
        const metadata = await mm.parseBlob(file);
        setPlayingSoundMetadata(metadata);
        const reader = new FileReader();
        reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
            if (event.target !== null) {
                playSong(event.target.result as string);
            }
        });

        reader.readAsDataURL(file);
    }

    const uploadFile = async (file: File) => {
        await window.electron.uploadFile(file.path);
        const settings = await window.electron.getSettings();
        setAppSettings(settings);
    }

    return (
        <div className={classes.app}>
            <div className={classes.appContainer}>
                <div className={classes.mainContent}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Library
                                    appSettings={appSettings}
                                    playSong={playSong}
                                    onPause={pausePlayingSong}
                                    onResume={resumePlayingSong}
                                    isPaused={isPaused}
                                    playingSongId={playingSongId}
                                />
                            }
                        />
                        <Route
                            path="upload-file"
                            element={
                                <SelectFile
                                    onLoadFile={uploadFile}
                                    fileInputLabel="Choose music file to add to library"
                                />
                            }
                        />
                        <Route
                            path="play-file"
                            element={
                                <SelectFile
                                    onLoadFile={playFile}
                                    fileInputLabel="Choose music file to play"
                                />
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
                <NavPanel />
                {getPlayingSongInfo()}
            </div>
        </div>
    );
}

export default App;
