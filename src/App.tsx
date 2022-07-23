import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { FileUpload } from './components/FileUpload';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';
import * as process from 'process';
import { PlayingSongInfo } from './components/PlayingSongInfo';
import classes from './App.module.scss';

window.Buffer = Buffer;
window.process = process;

function App() {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [fileBeingPlayed, setFileBeingPlayed] = useState<File>();
    const [playingSoundMetadata, setPlayingSoundMetadata] = useState<mm.IAudioMetadata>();
    const [playingSoundPercentPlayed, setPlayingSoundPercentPlayed] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playingSound && playingSound && playingSound.playing()) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                if (duration === playbackPosition) {
                    setPlayingSound(undefined);
                    setPlayingSoundPercentPlayed(null);
                } else {
                    setPlayingSoundPercentPlayed((playbackPosition / duration) * 100);
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

    const onFileReaderLoadSong = async (event: ProgressEvent<FileReader>) => {
        if (event.target == null) {
            return;
        }
        
        const filepath = event.target.result as string;
            
        const howlerSound = new Howl({ src: [filepath], preload: true });

        howlerSound.once('play', () => {
            setPlayingSound(howlerSound);
        });

        howlerSound.once('end', () => {
            setPlayingSound(undefined);
        })
        
        howlerSound.play();
    }

    const playSong = async (file: File) => {
        if (playingSound) {
            playingSound.stop();
            setPlayingSoundPercentPlayed(null);
            setPlayingSound(undefined);
        }

        if (isPaused) {
            setIsPaused(false);
        }
        setFileBeingPlayed(file);
        const metadata = await mm.parseBlob(file);
        setPlayingSoundMetadata(metadata);
        const reader = new FileReader();
        reader.addEventListener('load', onFileReaderLoadSong);

        reader.readAsDataURL(file);
    }

    const pausePlayingSong = () => {
        setIsPaused(true);
    }

    const resumePlayingSong = () => {
        setIsPaused(false);
    }

    return (
        <div className={classes.app}>
            <div className={classes.appContainer}>
                <FileUpload label="Choose music file to play" onFileSelection={openFile} />
                <div className={classes.playingSongInfo}>
                    <PlayingSongInfo
                        fileBeingPlayed={fileBeingPlayed}
                        fileMetadata={playingSoundMetadata}
                        playingSound={playingSound}
                        playingSoundPercentPlayed={playingSoundPercentPlayed}
                        onPause={pausePlayingSong}
                        onPlay={resumePlayingSong}
                        isPaused={isPaused}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
