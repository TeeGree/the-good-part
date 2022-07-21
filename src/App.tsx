import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Howl } from 'howler';
import { FileUpload } from './components/FileUpload';
import * as mm from 'music-metadata-browser';
import classes from './App.module.scss';
import { Buffer } from 'buffer';
import * as process from 'process';

window.Buffer = Buffer;
window.process = process;

function App() {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [fileBeingPlayed, setFileBeingPlayed] = useState<File>();
    const [playingSoundMetadata, setPlayingSoundMetadata] = useState<mm.IAudioMetadata>();
    const [playingSoundPercentPlayed, setPlayingSoundPercentPlayed] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('This will run every second!');
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
            setFileBeingPlayed(file);
            const metadata = await mm.parseBlob(file);
            setPlayingSoundMetadata(metadata);
            const reader = new FileReader();
            reader.addEventListener('load', async () => {
                const filepath = reader.result as string;
                
                const howlerSound = new Howl({ src: [filepath], preload: true });

                if (playingSound) {
                    playingSound.stop();
                }

                howlerSound.on('play', () => {
                    setPlayingSound(howlerSound);
                })
                
                howlerSound.play();
            });

            reader.readAsDataURL(file);
        }
    }

    const getPlayingSongInfo = (): JSX.Element => {
        if (playingSound && playingSound && playingSound.playing()) {
            const metadata = playingSoundMetadata;
            const width = `${playingSoundPercentPlayed}%`;
            let songTitleText = 'Song';
            const fallbackFilename = fileBeingPlayed?.name;
            const title = metadata?.common?.title;
            const artist = metadata?.common?.artist;
            if (title) {
                songTitleText = `Currently playing: ${title}`;
                if (artist) {
                    songTitleText += ` by ${artist}`;
                }
            } else if (fallbackFilename) {
                songTitleText = `Currently playing: ${fallbackFilename}`;
            }
            return (<>
                <div>{songTitleText}</div>
                <div className={classes.progressBarContainer}>
                    <div className={classes.progressBarFill} style={{ width: width }}>
                    </div>
                </div>
            </>);
        }
        return (<></>);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <FileUpload label="Choose music file to play" onFileSelection={openFile} />
                {getPlayingSongInfo()}
            </header>
        </div>
    );
}

export default App;
