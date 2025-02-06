import React from 'react';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AfriCO-X</h1>
      </header>
      <main>
        <Register />
        <Login />
      </main>
    </div>
  );
}

export default App;
