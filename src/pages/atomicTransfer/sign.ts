import { SignedTransaction, Transaction } from 'algosdk';
import toast from 'react-hot-toast';
import { Wallet } from '../../hooks/useWallets/types';
import { Networks } from '../../lib/algo/clients';
import { signAndPublishWithToasts } from '../../lib/algo/signing';
import { isSigned } from '../../lib/algo/transactions';

const signAndPublishAtomicTransactions = async (
  wallet: Wallet,
  network: Networks,
  transactions: (Transaction | SignedTransaction)[]
) => {
  const toastId = 'signAndPublishAtomicTransactions';

  const toSign = transactions.map(txn => ({
    txn: isSigned(txn) ? txn.txn : txn,
    viewOnly: isSigned(txn),
    message: 'Sign atomic transactions',
  }));

  await signAndPublishWithToasts(wallet, network, toSign, toastId);

  toast.success(`Signed and published transactions`, { id: toastId });
};

export default signAndPublishAtomicTransactions;
