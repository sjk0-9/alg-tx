import WalletConnect from '@walletconnect/client';
import { Transaction } from 'algosdk';

export type TxToSign = {
  txn: Transaction;
  message: string;
};

export type Wallet = {
  id: string;
  address: string;
  name?: string;
  sign: (transactions: TxToSign[]) => Promise<any>;
  disconnect: () => Promise<any>;
} & (
  | {
      type: 'WalletConnect';
      connector: WalletConnect;
    }
  | {
      type: 'MyAlgo';
    }
);

export type Connectors = {
  walletConnect: () => Promise<void>;
  myAlgo: () => Promise<void>;
};
