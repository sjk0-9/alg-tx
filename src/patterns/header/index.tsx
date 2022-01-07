import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NetworkContext, RootContext } from '../../contexts';
import Logo from '../../foundations/logo';
import WalletDropdown from '../walletDropdown';

const Header = () => {
  const root = useContext(RootContext);
  const network = useContext(NetworkContext);
  return (
    <header>
      <div className="flex flex-row items-center justify-between w-screen px-4 sm:px-6 py-2 sm:py-4 bg-white border-b">
        <Link to={root}>
          <Logo />
        </Link>
        <div className="hidden sm:block w-1 h-1 ml-4 mr-2 rounded-full bg-subtle" />
        <div className="hidden sm:block sm:text-sm text-subtle mb-[0.2rem] select-none">
          {network}
        </div>
        <div className="flex-grow" />
        <div>
          <WalletDropdown />
        </div>
      </div>
      <div className="block sm:hidden w-screen text-xs bg-grey-200 p-0.5 text-center text-subtle">
        {network}
      </div>
    </header>
  );
};

export default Header;
