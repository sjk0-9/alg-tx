import {
  decodeSignedTransaction,
  decodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import { useParams } from 'react-router-dom';

export type DecodedTransactions = {
  txn: Transaction;
  signed?: SignedTransaction;
  raw: Uint8Array;
};

export type UseUrlTransactionDecoderReturn =
  | {
      transactions: DecodedTransactions[];
      error?: undefined;
      watch: string;
    }
  | {
      transactions?: undefined;
      error: any;
      watch: string;
    }
  | {
      transactions?: undefined;
      error?: undefined;
      watch: string;
    };

const useUrlTransactionDecoder = (): UseUrlTransactionDecoderReturn => {
  const { '*': transactions } = useParams();

  if (!transactions) {
    return { watch: 'NONE' };
  }

  const encodedTransactions = transactions.split(';');
  let decodedTransactions: DecodedTransactions[];
  try {
    decodedTransactions = encodedTransactions.map(etx => {
      const array = Uint8Array.from(Buffer.from(etx, 'base64'));
      try {
        const txn = decodeUnsignedTransaction(array);
        return { txn, raw: array };
      } catch {
        const signed = decodeSignedTransaction(array);
        return {
          txn: signed.txn,
          signed,
          raw: array,
        };
      }
    });
  } catch (e) {
    return {
      error: e,
      watch: JSON.stringify(e),
    };
  }
  return {
    transactions: decodedTransactions,
    watch: transactions,
  };
};

export default useUrlTransactionDecoder;
