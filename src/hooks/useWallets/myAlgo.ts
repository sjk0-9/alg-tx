import MyAlgoConnect, { Accounts } from '@randlabs/myalgo-connect';
import algosdk from 'algosdk';
import createPersistedState from 'use-persisted-state';
import { isSigned } from '../../lib/algo/transactions';
import { TxToSign, Wallet } from './types';

const useMyAlgoWallets = createPersistedState('myAlgoWallets');
const myAlgoConnect = new MyAlgoConnect();

const sign = async (transactions: TxToSign[]) => {
  const toSign = transactions
    .filter(({ viewOnly }) => !viewOnly)
    .map(({ txn }) => txn.toByte());
  const signedTxns = await myAlgoConnect.signTransaction(toSign);
  const parsedTxns = signedTxns.map(({ blob }) => blob);

  const mergedTxns = transactions.reduce(
    ({ signedIdx, txns }, { txn, viewOnly }) => {
      if (viewOnly) {
        let encodedTxn: Uint8Array;
        if (isSigned(txn)) {
          encodedTxn = algosdk.encodeObj(txn);
        } else {
          encodedTxn = algosdk.encodeUnsignedTransaction(txn);
        }
        return { signedIdx, txns: [...txns, encodedTxn] };
      }
      return {
        signedIdx: signedIdx + 1,
        txns: [...txns, parsedTxns[signedIdx]],
      };
    },
    { signedIdx: 0, txns: [] } as { signedIdx: number; txns: Uint8Array[] }
  );
  return mergedTxns.txns;
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
