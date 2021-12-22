import { useContext } from 'react';
import { NetworkContext } from '../contexts';
import getClients from '../lib/algo/clients';

const mainnetClients = getClients('mainnet');
const testnetClients = getClients('testnet');

const useAlgoClient = () => {
  const network = useContext(NetworkContext);

  switch (network) {
    case 'mainnet':
      return mainnetClients;
    case 'testnet':
      return testnetClients;
    default:
      throw new Error(`Unknown network context ${network}`);
  }
};

export default useAlgoClient;
