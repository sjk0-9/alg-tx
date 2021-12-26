import MyAlgoConnect, { Accounts } from '@randlabs/myalgo-connect';
import createPersistedState from 'use-persisted-state';
import { TxToSign, Wallet } from './types';

const useMyAlgoWallets = createPersistedState('myAlgoWallets');
const myAlgoConnect = new MyAlgoConnect();

const sign = async (transactions: TxToSign[]) => {
  const toSign = transactions.map(({ txn }) => txn.toByte());
  const signedTxns = await myAlgoConnect.signTransaction(toSign);
  const parsedTxns = signedTxns.map(({ blob }) => blob);
  return parsedTxns;
};

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
        sign,
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
