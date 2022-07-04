import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';


function App() {
  const openFile = async () => {
    await window.electron.openFile();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button onClick={openFile}>Click me</Button>
      </header>
    </div>
  );
}

export default App;
