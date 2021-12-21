import WalletConnect from '@walletconnect/client';
import { Transaction } from 'algosdk';

export type TxToSign = {
  txn: Transaction;
  message: string;
};

export type Wallet = {
  address: string;
  sign: (transactions: TxToSign[]) => Promise<any>;
  disconnect: () => Promise<any>;
} & {
  type: 'WalletConnect';
  connector: WalletConnect;
};

export type Connectors = {
  walletConnect: () => Promise<void>;
};
