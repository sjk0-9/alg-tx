import MyAlgoConnect, { Accounts } from '@randlabs/myalgo-connect';
import createPersistedState from 'use-persisted-state';
import { Wallet } from './types';

const useMyAlgoWallets = createPersistedState('myAlgoWallets');
const myAlgoConnect = new MyAlgoConnect();

const useMyAlgoConnect = (): [Wallet[], () => Promise<void>] => {
  const [myAlgoWallets, setMyAlgoWallets] = useMyAlgoWallets<Accounts[]>([]);

  const connectToWallet = async () => {
    const wallets = await myAlgoConnect.connect();
    setMyAlgoWallets(wallets);
  };

  const returnWallets = myAlgoWallets.map(
    account =>
      ({
        id: `myalgo:${account.address}`,
        address: account.address,
        name: account.name || undefined,
        sign: Promise.resolve,
        disconnect: async () => {
          setMyAlgoWallets(original =>
            original.filter(a => a.address !== account.address)
          );
        },
        type: 'MyAlgo',
      } as Wallet)
  );

  return [returnWallets, connectToWallet];
};

export default useMyAlgoConnect;
