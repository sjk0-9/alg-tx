import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { Networks } from './lib/algo/clients';
import AtomicTransfer from './pages/atomicTransfer';
import hardcodedRouteList from './pages/hardcoded/Router';
import Home from './pages/home';

const networkSelectionRoutes = [
  ['/', 'mainnet'],
  ['/mainnet', 'mainnet'],
  ['/testnet', 'testnet'],
] as [string, Networks][];

const Router = () => (
  <BrowserRouter>
    <Routes>
      {networkSelectionRoutes.map(([path, network]) => (
        <Route
          key={path}
          path={path}
          element={<App root={path} network={network} />}
        >
          <Route index element={<Home />} />
          <Route path="h">{hardcodedRouteList()}</Route>
          <Route path="a" element={<AtomicTransfer />} />
        </Route>
      ))}
    </Routes>
  </BrowserRouter>
);

export default Router;
