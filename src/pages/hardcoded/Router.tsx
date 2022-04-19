import React, { useContext } from 'react';

import { Route } from 'react-router-dom';
import { NetworkContext } from '../../contexts';
import OptIn, { RedirectOptIn } from './OptIn';
import OptOut from './OptOut';

type RoutesList = React.ReactElement[];

const mainnetRoutes: RoutesList = [];

const testnetRoutes: RoutesList = [];

const sharedRoutes: RoutesList = [
  <Route key="opt-in" path="opt-in" element={<OptIn />}>
    <Route key="opt-in" path=":assetId" element={<RedirectOptIn />} />,
    <Route key="opt-in" path="asset/:assetId" element={<RedirectOptIn />} />,
  </Route>,
  <Route key="opt-out" path="opt-out" element={<OptOut />} />,
];

const hardcodedRouteList = () => {
  const network = useContext(NetworkContext);
  const routes = [...sharedRoutes];
  switch (network) {
    case 'mainnet':
      routes.push(...mainnetRoutes);
      break;
    case 'testnet':
      routes.push(...testnetRoutes);
      break;
    default:
      throw new Error(`Unknown network`);
  }

  return routes;
};

export default hardcodedRouteList;
