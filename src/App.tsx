import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { Buffer } from 'buffer';
import * as process from 'process';
import { PlayingSongInfo } from './components/PlayingSongInfo';
import classes from './App.module.scss';
import { AppSettings } from './models/AppSettings';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Library } from './components/pages/Library';
import { UploadFile } from './components/pages/UploadFile';
import { NavPanel } from './components/NavPanel';
import { getFilenameFromPath } from './utility/FilePathUtils';
import { SongInfo } from './models/SongInfo';

// Needed to polyfill dependencies that have been removed from Node.
window.Buffer = Buffer;
window.process = process;

const defaultVolume = 0.5;

Howler.volume(defaultVolume);

const App: React.FC = () => {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [playingSong, setPlayingSong] = useState<SongInfo>();
    const [nameOfFile, setNameOfFile] = useState<string>();
    const [playingSongId, setPlayingSongId] = useState<string>();
    const [playingSongIndex, setPlayingSongIndex] = useState<number>();
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number | null>(null);
    const [totalDuration, setTotalDuration] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [appSettings, setAppSettings] = useState<AppSettings>();
    const [volume, setVolume] = useState<number>(defaultVolume);

    useEffect(() => {
        void window.electron.getSettings().then((settings) => {
            setAppSettings(settings);
        });
    }, []);

    useEffect(() => {
        Howler.volume(volume);
    }, [volume]);

    useEffect(() => {
        const interval = setInterval(() => {
            if ((playingSound?.playing()) === true) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                if (duration === playbackPosition) {
                    clearPlayingSong();
                } else {
                    setCurrentPlaybackTime(playbackPosition);
                    setTotalDuration(duration);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [playingSound]);

    const clearPlayingSong = (): void => {
        setPlayingSound(undefined);
        setCurrentPlaybackTime(null);
        setTotalDuration(null);
        setPlayingSongId(undefined);
        setPlayingSong(undefined);
    };

    const playSong = (index: number): void => {
        const songId = appSettings?.songs[index].id;

        if (songId === undefined) {
            throw Error('Song index is invalid!');
        }

        const song = appSettings?.songMap.get(songId);

        if (song === undefined) {
            throw Error('Song ID is invalid!');
        }

        const filepath = `.\\${song.filename}`;
        const filename = getFilenameFromPath(filepath);

        const howlerSound = new Howl({
            src: [filepath],
            preload: true
        });

        howlerSound.once('play', () => {
            setPlayingSong(song);
            setPlayingSound(howlerSound);
            setNameOfFile(filename);
            setTotalDuration(howlerSound.duration());
            if (songId !== undefined) {
                setPlayingSongId(songId);
                setPlayingSongIndex(index);
                setHowlerEndCallback(howlerSound, index);
            }

            if (isPaused) {
                setIsPaused(false);
            }
        });

        if (playingSound != null) {
            playingSound.stop();
        }

        howlerSound.play();
    };

    const setHowlerEndCallback = (sound: Howl | undefined, index: number): void => {
        if (sound === undefined) {
            return;
        }
        sound.off('end');
        sound.once('end', () => {
            if (
                index !== undefined &&
                appSettings?.songs != null &&
                appSettings.songs.length > index + 1
            ) {
                playSong(index + 1);
            } else {
                setPlayingSound(undefined);
                setPlayingSong(undefined);
                setPlayingSongId(undefined);
            }
        });
    };

    const pausePlayingSong = (): void => {
        playingSound?.pause();
        setIsPaused(true);
    };

    const resumePlayingSong = (): void => {
        playingSound?.play();
        setIsPaused(false);
    };

    const changeVolume = (value: number): void => {
        setVolume(value);
    };

    const getPlayingSongInfo = (): JSX.Element => {
        if (playingSound != null) {
            return (
                <div className={classes.playingSongInfo}>
                    <PlayingSongInfo
                        nameOfFile={nameOfFile}
                        fileMetadata={playingSong?.metadata}
                        playingSound={playingSound}
                        onPause={pausePlayingSong}
                        onPlay={resumePlayingSong}
                        isPaused={isPaused}
                        currentPlaybackTime={currentPlaybackTime}
                        totalDuration={totalDuration}
                        volume={volume}
                        changeVolume={changeVolume}
                        playNextSong={playNextSong}
                        playPreviousSong={playPreviousSong}
                        canPlayNextSong={canPlayNextSong()}
                        canPlayPreviousSong={canPlayPreviousSong()}
                    />
                </div>
            );
        }

        return <></>;
    };

    const uploadFile = async (file: File): Promise<void> => {
        await window.electron.uploadFile(file.path);
        const settings = await window.electron.getSettings();
        setAppSettings(settings);
        if (playingSongId !== undefined) {
            const index = settings.songs.findIndex((song) => song.id === playingSongId);
            if (index >= 0 && playingSound != null) {
                setHowlerEndCallback(playingSound, index);
            }
        }
    };

    const canPlayNextSong = (): boolean => {
        if (playingSongIndex === undefined || appSettings?.songs === undefined) {
            return false;
        }

        return playingSongIndex < appSettings.songs.length - 1;
    };

    const canPlayPreviousSong = (): boolean => {
        if (playingSongIndex === undefined || appSettings?.songs === undefined) {
            return false;
        }

        return playingSongIndex > 0;
    };

    const playNextSong = (): void => {
        if (playingSongIndex !== undefined) {
            playSong(playingSongIndex + 1);
        }
    };

    const playPreviousSong = (): void => {
        if (playingSongIndex !== undefined) {
            playSong(playingSongIndex - 1);
        }
    };

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
                                <UploadFile
                                    onLoadFile={uploadFile}
                                    fileInputLabel="Choose music file to add to library"
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
