import toast from 'react-hot-toast';
import { TxToSign, Wallet } from '../../hooks/useWallets/types';
import getClients, { Networks } from './clients';
import parseClientError, { AlgoClientError } from './errors/parseClientError';
import { waitForTx } from './wait';

export const signWithToasts = async (
  wallet: Wallet,
  toSign: TxToSign[],
  toastId: string
) => {
  if (wallet.type === 'WalletConnect') {
    toast.loading('Waiting for Algorand App', { id: toastId });
  } else if (wallet.type === 'MyAlgo') {
    toast.loading('Waiting for My Algo', { id: toastId });
  }

  try {
    return (await wallet.sign(toSign)) as Uint8Array[];
  } catch (e) {
    toast.error('Failed to connect to wallet', { id: toastId });
    throw e;
  }
};

export const publishWithToasts = async (
  network: Networks,
  signed: Uint8Array[],
  toastId: string
) => {
  toast.loading('Sending transaction', { id: toastId });

  const { algodClient } = getClients(network);
  let response: { txId: string };
  try {
    response = await algodClient.sendRawTransaction(signed).do();
  } catch (e) {
    const parsedError = parseClientError(e as AlgoClientError);
    toast.error('Error from algo client', { id: toastId });
    console.error(
      parsedError.message,
      parsedError.type,
      parsedError.data,
      JSON.stringify(parsedError.original)
    );
    throw parsedError;
  }

  toast.loading('Waiting for confirmation', { id: toastId });

  try {
    await waitForTx(response.txId, network);
  } catch (e) {
    toast.error('Timed out waiting for confirmation', { id: toastId });
    throw e;
  }

  return response.txId;
};

export const signAndPublishWithToasts = async (
  wallet: Wallet,
  network: Networks,
  toSign: TxToSign[],
  toastId: string
) => {
  const signed = await signWithToasts(wallet, toSign, toastId);
  const transactionId = await publishWithToasts(network, signed, toastId);
  return transactionId;
};
