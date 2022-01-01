import WalletConnect from '@walletconnect/client';
import { SignedTransaction, Transaction } from 'algosdk';

export type TxToSign =
  | {
      txn: Transaction;
      /**
       * this transaction isn't for signing
       * (e.g. signed by someone else, or to be signed elsewhere)
       */
      viewOnly?: boolean;
      message?: string;
    }
  | {
      txn: Transaction | SignedTransaction;
      viewOnly: true;
      message?: string;
    };

export type SignType = (
  transactions: TxToSign[]
) => Promise<(Uint8Array | null)[]>;

export type Wallet = {
  id: string;
  address: string;
  name?: string;
  sign: SignType;
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
