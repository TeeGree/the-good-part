import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { FileUpload } from './components/FileUpload';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';
import * as process from 'process';
import { PlayingSongInfo } from './components/PlayingSongInfo';
import classes from './App.module.scss';
import { AppSettings } from './models/AppSettings';

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
            if (settings.songs.length > 0 && playingSoundMetadata === undefined) {
                window.electron.getSongInfo(settings.songs[0].fullPath).then(songInfo => {
                    // This will play twice in development because of strict mode.
                    setPlayingSoundMetadata(songInfo.metadata);
                    onLoadSong(songInfo.relativePath, songInfo.filename);
                });
            }
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playingSound && playingSound && playingSound.playing()) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                if (duration === playbackPosition) {
                    setPlayingSound(undefined);
                    setCurrentPlaybackTime(null);
                    setTotalDuration(null);
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

    const openFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            await playSong(file);
        }
    }

    const onLoadSong = (filepath: string, fileName: string) => {
        const howlerSound = new Howl({ src: [filepath], preload: true });

        howlerSound.once('play', () => {
            setPlayingSound(howlerSound);
            setNameOfFile(fileName);
            setTotalDuration(howlerSound.duration());
        });

        howlerSound.once('end', () => {
            setPlayingSound(undefined);
        })
        
        if (playingSound) {
            playingSound.stop();
        }

        howlerSound.play();
    }

    const playSong = async (file: File) => {
        if (playingSound) {
            playingSound.stop();
            setCurrentPlaybackTime(null);
            setTotalDuration(null);
            setPlayingSound(undefined);
        }

        if (isPaused) {
            setIsPaused(false);
        }
        
        const metadata = await mm.parseBlob(file);
        setPlayingSoundMetadata(metadata);
        const reader = new FileReader();
        reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
            if (event.target !== null) {
                onLoadSong(event.target.result as string, file.name);
            }
        });

        reader.readAsDataURL(file);
    }

    const pausePlayingSong = () => {
        setIsPaused(true);
    }

    const resumePlayingSong = () => {
        setIsPaused(false);
    }

    const getMusicFileInput = (): JSX.Element => {
        if (appSettings === undefined) {
            return (
                <>
                    <FileUpload label="Choose music file to play" onFileSelection={openFile} />
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
                </>
            );
        }

        return (<></>);
    }

    return (
        <div className={classes.app}>
            <div className={classes.appContainer}>
                {getMusicFileInput()}
            </div>
        </div>
    );
}

export default App;
