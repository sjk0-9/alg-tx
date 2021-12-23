import { Transaction, TransactionParams, TransactionType } from 'algosdk';
import { UnfinishedTransaction } from './unfinishedTx';

export type SerialisedTransaction = {
  /** Parameters for brx usage */
  p: {
    /** Fields that can be customised by the recipient, and their default value */
    c: { [field: string]: string | number | null };
  };
} & (
  | {
      /** Transaction encoded via encodeUnsignedTransaction represented in base64 */
      t: string;
      /** Signed transaction represented in base64 */
      s?: undefined;
      /** Body and type of UnfinishedTransaction */
      u?: undefined;
    }
  | {
      /** Transaction encoded via encodeUnsignedTransaction represented in base64 */
      t?: undefined;
      /** Signed transaction represented in base64 */
      s: string;
      /** Body and type of UnfinishedTransaction */
      u?: undefined;
    }
  | {
      /** Transaction encoded via encodeUnsignedTransaction represented in base64 */
      t?: undefined;
      /** Signed transaction represented in base64 */
      s?: undefined;
      /** Body and type of UnfinishedTransaction */
      u: { t: Partial<TransactionParams>; y: TransactionType };
    }
);

export const serialiseTx = (
  tx: Transaction | UnfinishedTransaction | Uint8Array
): SerialisedTransaction => {};

export const deserialiseTx = (
  obj: SerialisedTransaction
): Transaction | UnfinishedTransaction | Uint8Array => {};
