import toast from 'react-hot-toast';
import { TxToSign, Wallet } from '../../hooks/useWallets/types';
import getClients, { Networks } from './clients';
import { waitForTx } from './wait';

export const signAndPublishWithToasts = async (
  wallet: Wallet,
  network: Networks,
  toSign: TxToSign[],
  toastId: string
) => {
  const { algodClient } = getClients(network);

  if (wallet.type === 'WalletConnect') {
    toast.loading('Waiting for Algorand App', { id: toastId });
  } else if (wallet.type === 'MyAlgo') {
    toast.loading('Waiting for My Algo', { id: toastId });
  }

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
};
