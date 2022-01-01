import toast from 'react-hot-toast';
import { DecodedTransactions } from '../../hooks/useUrlTransactionDecoder';
import { TxToSign, Wallet } from '../../hooks/useWallets/types';
import { Networks } from '../../lib/algo/clients';
import { signAndPublishWithToasts } from '../../lib/algo/signing';

const signAndPublishAtomicTransactions = async (
  wallet: Wallet,
  network: Networks,
  transactions: DecodedTransactions[]
) => {
  const toastId = 'signAndPublishAtomicTransactions';

  const toSign = transactions.map(({ txn, raw, signed }) =>
    signed
      ? {
          txn: signed,
          viewOnly: true,
        }
      : { txn, viewOnly: false, message: 'Sign atomic transactions' }
  ) as TxToSign[];

  const txId = await signAndPublishWithToasts(wallet, network, toSign, toastId);

  toast.success(`Signed and published transactions`, { id: toastId });

  if (transactions[0].txn.group) {
    return { group: Buffer.from(transactions[0].txn.group).toString('base64') };
  }
  return { txId };
};

export default signAndPublishAtomicTransactions;
