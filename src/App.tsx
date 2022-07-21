import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Howl } from 'howler';
import { FileUpload } from './components/FileUpload';
import * as mm from 'music-metadata-browser';
import { Buffer } from 'buffer';
import * as process from 'process';
import { PlayingSongInfo } from './components/PlayingSongInfo';

window.Buffer = Buffer;
window.process = process;

function App() {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [fileBeingPlayed, setFileBeingPlayed] = useState<File>();
    const [playingSoundMetadata, setPlayingSoundMetadata] = useState<mm.IAudioMetadata>();
    const [playingSoundPercentPlayed, setPlayingSoundPercentPlayed] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (playingSound && playingSound && playingSound.playing()) {
                const duration = playingSound.duration();
                const playbackPosition = playingSound.seek();
                setPlayingSoundPercentPlayed((playbackPosition / duration) * 100);
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
            setPlayingSoundPercentPlayed(0);
        }
        setFileBeingPlayed(file);
        const metadata = await mm.parseBlob(file);
        setPlayingSoundMetadata(metadata);
        const reader = new FileReader();
        reader.addEventListener('load', onFileReaderLoadSong);

        reader.readAsDataURL(file);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <FileUpload label="Choose music file to play" onFileSelection={openFile} />
                <PlayingSongInfo
                    fileBeingPlayed={fileBeingPlayed}
                    fileMetadata={playingSoundMetadata}
                    playingSound={playingSound}
                    playingSoundPercentPlayed={playingSoundPercentPlayed}
                />
            </header>
        </div>
    );
}

export default App;
