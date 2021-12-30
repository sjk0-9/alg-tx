import { SignedTransaction, Transaction, TransactionType } from 'algosdk';

export const isSigned = (
  t: Transaction | SignedTransaction
): t is SignedTransaction =>
  'sig' in t || 'lsig' in t || 'msig' in t || 'sgnr' in t;

export const friendlyTypeName = (type: TransactionType | undefined) => {
  switch (type) {
    case TransactionType.pay:
      return 'Payment Transaction';
    case TransactionType.acfg:
      return 'Asset Configuration Transaction';
    case TransactionType.afrz:
      return 'Asset Freeze Transaction';
    case TransactionType.appl:
      return 'Application Transaction';
    case TransactionType.axfer:
      return 'Asset Transfer Transaction';
    case TransactionType.keyreg:
      return 'Key Registration Transaction';
    case undefined:
      return 'Undefined Transaction Type';
    default:
      throw new Error('Unknown Transaction Type');
  }
};
