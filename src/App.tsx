import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Header from './patterns/header';
import './foundations/css/background/core.css';
import { Networks } from './lib/algo/clients';
import { NetworkContext, RootContext } from './contexts';
import WalletProvider from './hooks/useWallets/WalletProvider';
import useDocumentTitle from './hooks/useTitle';

const App = ({ root, network }: { root: string; network: Networks }) => {
  useDocumentTitle();
  return (
    <RootContext.Provider value={root}>
      <NetworkContext.Provider value={network}>
        <WalletProvider>
          <div className="App">
            <Header />
            <div className="flex justify-center">
              <Outlet />
            </div>
          </div>
          <Toaster position="bottom-center" />
        </WalletProvider>
      </NetworkContext.Provider>
    </RootContext.Provider>
  );
};

export default App;
