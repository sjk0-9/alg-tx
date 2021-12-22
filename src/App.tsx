import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './patterns/header';
import './foundations/css/background/core.css';
import { Networks } from './lib/algo/clients';
import { NetworkContext, RootContext } from './contexts';

const App = ({ root, network }: { root: string; network: Networks }) => (
  <RootContext.Provider value={root}>
    <NetworkContext.Provider value={network}>
      <div className="App">
        <Header />
        <Outlet />
      </div>
    </NetworkContext.Provider>
  </RootContext.Provider>
);

export default App;
