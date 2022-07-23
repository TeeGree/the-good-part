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

    useEffect(() => {
        const interval = setInterval(() => {
            if (playingSound && playingSound && playingSound.playing()) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                setPlayingSoundPercentPlayed((playbackPosition / duration) * 100);
            } else if (playingSound !== undefined) {
                setPlayingSound(undefined);
                setPlayingSoundPercentPlayed(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [playingSound]);

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

        howlerSound.on('play', () => {
            setPlayingSound(howlerSound);
        })
        
        howlerSound.play();
    }

    const playSong = async (file: File) => {
        if (playingSound) {
            playingSound.stop();
            setPlayingSoundPercentPlayed(null);
        }
        setFileBeingPlayed(file);
        const metadata = await mm.parseBlob(file);
        setPlayingSoundMetadata(metadata);
        const reader = new FileReader();
        reader.addEventListener('load', onFileReaderLoadSong);

        reader.readAsDataURL(file);
    }

    return (
        <div className={classes.app}>
            <body className={classes.appContainer}>
                <FileUpload label="Choose music file to play" onFileSelection={openFile} />
                <div className={classes.playingSongInfo}>
                    <PlayingSongInfo
                        fileBeingPlayed={fileBeingPlayed}
                        fileMetadata={playingSoundMetadata}
                        playingSound={playingSound}
                        playingSoundPercentPlayed={playingSoundPercentPlayed}
                    />
                </div>
            </body>
        </div>
    );
}

export default App;
