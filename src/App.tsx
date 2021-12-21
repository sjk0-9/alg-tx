import React from 'react';
import logo from './logo.svg';
import './App.css';
import useWallets from './hooks/useWallets';
import WalletDropdown from './patterns/walletDropdown';

function App() {
  const { wallets, connectors } = useWallets();

  console.log('Rendering App');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-3xl font-bold underline">Hello Vite + React!</p>
        <button type="button" onClick={connectors.walletConnect}>
          Connect!
        </button>
        <p>Connected:</p>
        <ul>
          {wallets.map(wallet => (
            <li key={wallet.address}>{wallet.address}</li>
          ))}
        </ul>
        <WalletDropdown />
      </header>
    </div>
  );
}

export default App;
