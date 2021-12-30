import {
  decodeSignedTransaction,
  decodeUnsignedTransaction,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import { useLocation } from 'react-router-dom';

export type UseUrlTransactionDecoderReturn =
  | {
      transactions: (SignedTransaction | Transaction)[];
      error?: undefined;
    }
  | {
      transactions?: undefined;
      error: any;
    }
  | { transactions?: undefined; error?: undefined };

const useUrlTransactionDecoder = (): UseUrlTransactionDecoderReturn => {
  const { hash } = useLocation();

  if (!hash) {
    return {};
  }

  const encodedTransactions = hash.split(';');
  let decodedTransactions: (Transaction | SignedTransaction)[];
  try {
    decodedTransactions = encodedTransactions.map(etx => {
      const array = Uint8Array.from(Buffer.from(etx, 'base64'));
      try {
        return decodeUnsignedTransaction(array);
      } catch {
        return decodeSignedTransaction(array);
      }
    });
  } catch (e) {
    return {
      error: e,
    };
  }
  return {
    transactions: decodedTransactions,
  };
};

export default useUrlTransactionDecoder;
