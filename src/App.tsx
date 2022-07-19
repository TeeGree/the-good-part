import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Howl } from 'howler';
import { FileUpload } from './components/FileUpload';
import * as mm from 'music-metadata-browser';
import classes from './App.module.scss';

function App() {
    const [playingSound, setPlayingSound] = useState<Howl>();
    const [fileBeingPlayed, setFileBeingPlayed] = useState<File>();
    const [playingSoundMetadata, setPlayingSoundMetadata] = useState<mm.IAudioMetadata>();

    // useEffect(() => {
    //     const getFileMetadata = async (file: Blob) => {
    //         const metadata = await mm.parseBlob(file);
    //         setPlayingSoundMetadata(metadata);
    //     };

    //     if (fileBeingPlayed) {
    //         getFileMetadata(fileBeingPlayed);
    //     }
    // }, [fileBeingPlayed])

    const openFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            setFileBeingPlayed(file);
            const reader = new FileReader();
            reader.addEventListener('load', async (event: ProgressEvent<FileReader>) => {
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
            const duration = playingSound.duration();
            const playbackPosition = playingSound.seek();
            const width = `${playbackPosition / duration}%`;
            return (<>
                <div>Currently Playing: {fileBeingPlayed?.name}</div>
                <div className={classes.progressBarContainer}>
                    <div className={classes.progressBarFill} style={{ width: width }}>
                    </div>
                </div>
            </>)
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
