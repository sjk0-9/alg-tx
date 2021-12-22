import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { Networks } from './lib/algo/clients';
import AtomicTransferPage from './pages/atomicTransfer';

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
          <Route path="a" element={<AtomicTransferPage />} />
        </Route>
      ))}
    </Routes>
  </BrowserRouter>
);

export default Router;
