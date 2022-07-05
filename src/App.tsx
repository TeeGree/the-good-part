import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Howl } from 'howler';


function App() {
    const openFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        //const filepathResult = await window.electron.openFile();
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
                <input type="file" onChange={openFile} />
            </header>
        </div>
    );
}

export default App;
