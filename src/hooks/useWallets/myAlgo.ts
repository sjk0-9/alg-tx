import MyAlgoConnect, { Accounts } from '@randlabs/myalgo-connect';
import algosdk, { Transaction } from 'algosdk';
import createPersistedState from 'use-persisted-state';
import { encodeSignedTransaction, isSigned } from '../../lib/algo/transactions';
import { TxToSign, Wallet } from './types';

const useMyAlgoWallets = createPersistedState('myAlgoWallets');
const useMyAlgoNames = createPersistedState('myAlgoNames');
const myAlgoConnect = new MyAlgoConnect();

const sign = async (transactions: TxToSign[]) => {
  const toSign = transactions
    .filter(({ txn, viewOnly }) => !viewOnly && !isSigned(txn))
    .map(({ txn }) => (txn as Transaction).toByte());
  const signedTxns = await myAlgoConnect.signTransaction(toSign);
  const parsedTxns = signedTxns.map(({ blob }) => blob);

  const mergedTxns = transactions.reduce(
    ({ signedIdx, txns }, { txn, viewOnly }) => {
      if (viewOnly) {
        let encodedTxn: Uint8Array;
        if (isSigned(txn)) {
          encodedTxn = encodeSignedTransaction(txn);
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
  const [myAlgoNames, setMyAlgoNames] = useMyAlgoNames<{
    [address: string]: string | undefined;
  }>({});

  const connectToWallet = async () => {
    const wallets = await myAlgoConnect.connect();
    setMyAlgoWallets(wallets);
  };

  const returnWallets = myAlgoWallets.map(
    account =>
      ({
        id: `myalgo:${account.address}`,
        address: account.address,
        name: myAlgoNames[account.address] ?? (account.name || undefined),
        sign,
        disconnect: async () => {
          setMyAlgoWallets(original =>
            original.filter(a => a.address !== account.address)
          );
        },
        setName: (name: string | undefined) => {
          setMyAlgoNames(names => ({ ...names, [account.address]: name }));
        },
        type: 'MyAlgo',
      } as Wallet)
  );

  return [returnWallets, connectToWallet];
};

export default useMyAlgoConnect;
