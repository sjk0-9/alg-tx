import React from 'react';
import './App.css';
import Header from './patterns/header';
import './foundations/background/core.css';

function App() {
  console.log('Rendering App');

  return (
    <div className="App">
      <Header />
    </div>
  );
}

export default App;
