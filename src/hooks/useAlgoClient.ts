import { useContext } from 'react';
import { NetworkContext } from '../contexts';
import getClients from '../lib/algo/clients';

const useAlgoClient = () => {
  const network = useContext(NetworkContext);
  return getClients(network);
};

export default useAlgoClient;
