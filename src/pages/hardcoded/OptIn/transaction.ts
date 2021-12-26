import algosdk from 'algosdk';
import toast from 'react-hot-toast';
import { Wallet } from '../../../hooks/useWallets/types';
import getClients, { Networks } from '../../../lib/algo/clients';
import { waitForTx } from '../../../lib/algo/wait';

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

  if (wallet.type === 'WalletConnect') {
    toast.loading('Waiting for Algorand App', { id: toastId });
  } else if (wallet.type === 'MyAlgo') {
    toast.loading('Waiting for My Algo', { id: toastId });
  }

  const toSign = transactions.map(txn => ({
    txn,
    message: `Opt in to ${txn.assetIndex}`,
  }));
  let signed: Uint8Array[];
  try {
    signed = (await wallet.sign(toSign)) as Uint8Array[];
  } catch (e) {
    toast.error('Failed to connect to wallet', { id: toastId });
    throw e;
  }

  toast.loading('Sending transaction', { id: toastId });

  let response: { txId: string };
  try {
    response = await algodClient.sendRawTransaction(signed).do();
  } catch (e) {
    toast.error('No response from algo client', { id: toastId });
    throw e;
  }

  toast.loading('Waiting for confirmation', { id: toastId });

  try {
    await waitForTx(response.txId, network);
  } catch (e) {
    toast.error('Timed out waiting for confirmation', { id: toastId });
    throw e;
  }

  toast.success(
    `Opted In to ${assetIds.length} asset${assetIds.length > 1 ? 's' : ''}!`,
    { id: toastId }
  );
};

export default signAndPublishOptInTransaction;
