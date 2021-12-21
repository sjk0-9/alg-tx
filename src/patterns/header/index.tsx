import React from 'react';
import WalletDropdown from '../walletDropdown';
import './header.css';

const Header = () => (
  <header className="flex flex-row items-center justify-between w-screen px-6 py-4 bg-white border-b">
    <a href="/" className="logo">
      brx.algo
    </a>
    <div>
      <WalletDropdown />
    </div>
  </header>
);

export default Header;
