import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NetworkContext, RootContext } from '../../contexts';
import WalletDropdown from '../walletDropdown';
import './header.css';

const Header = () => {
  const root = useContext(RootContext);
  const network = useContext(NetworkContext);
  return (
    <header className="flex flex-row items-center justify-between w-screen px-6 py-4 bg-white border-b">
      <Link to={root}>
        <div className="logo">brx.algo</div>
      </Link>
      <div className="w-1 h-1 ml-4 mr-2 rounded-full bg-subtle" />
      <div className="text-sm text-subtle mb-[0.2rem] select-none">
        {network}
      </div>
      <div className="flex-grow" />
      <div>
        <WalletDropdown />
      </div>
    </header>
  );
};

export default Header;
