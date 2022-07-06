import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Howl } from 'howler';
import { FileUpload } from './components/FileUpload';

function App() {
    const openFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', function() {
                const data = reader.result as string;
                const sound = new Howl({ src: [data] });

                sound.play();
            })
        

            reader.readAsDataURL(file);
        }
        
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <FileUpload label="Choose music file to play" onFileSelection={openFile} />
            </header>
        </div>
    );
}

export default App;
