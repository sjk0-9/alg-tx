import algosdk from 'algosdk';
import toast from 'react-hot-toast';
import { Wallet } from '../../../hooks/useWallets/types';
import getClients, { Networks } from '../../../lib/algo/clients';
import { signAndPublishWithToasts } from '../../../lib/algo/signing';

const signAndPublishOptInTransaction = async (
  wallet: Wallet,
  network: Networks,
  assetIds: number[]
) => {
  const { algodClient } = getClients(network);
  const toastId = toast.loading('Building transaction');

  const params = await algodClient.getTransactionParams().do();
  const transactions = assetIds.map(assetId =>
    algosdk.makeAssetTransferTxnWithSuggestedParams(
      wallet.address,
      wallet.address,
      undefined,
      undefined,
      0,
      undefined,
      assetId,
      params
    )
  );

  algosdk.assignGroupID(transactions);

  const toSign = transactions.map(txn => ({
    txn,
    message: `Opt in to ${txn.assetIndex}`,
  }));

  await signAndPublishWithToasts(wallet, network, toSign, toastId);

  toast.success(
    `Opted In to ${assetIds.length} asset${assetIds.length > 1 ? 's' : ''}!`,
    { id: toastId }
  );
};

export default signAndPublishOptInTransaction;
