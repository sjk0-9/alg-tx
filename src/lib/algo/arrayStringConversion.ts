import { TransactionParams } from 'algosdk';

export type TransactionParamsWithStrings = Omit<
  TransactionParams,
  'note' | 'lease'
> & { note?: string; lease?: string };

const encode = (s?: string) =>
  s === undefined ? undefined : new TextEncoder().encode(s);
const decode = (a?: Uint8Array) =>
  a === undefined ? undefined : new TextDecoder().decode(a);

type TransactionWithStringsOverload = {
  (tx: TransactionParams): TransactionParamsWithStrings;
  (tx: Partial<TransactionParams>): Partial<TransactionParamsWithStrings>;
};

export const transactionWithStrings: TransactionWithStringsOverload = (
  tx: any
): any => ({
  ...tx,
  note: decode(tx.note),
  lease: decode(tx.lease),
});

type TransactionWithArraysOverload = {
  (tx: TransactionParamsWithStrings): TransactionParams;
  (tx: Partial<TransactionParamsWithStrings>): Partial<TransactionParams>;
};

export const transactionWithArrays: TransactionWithArraysOverload = (
  tx: any
): any => ({
  ...tx,
  note: encode(tx.note),
  lease: encode(tx.lease),
});
