import toast from 'react-hot-toast';
import { createCustomLoadingToast } from '../../components/Toast';
import { TxToSign, Wallet } from '../../hooks/useWallets/types';
import getClients, { Networks } from './clients';
import parseClientError, { AlgoClientError } from './errors/parseClientError';
import { waitForTx } from './wait';

export const signWithToasts = async (
  wallet: Wallet,
  toSign: TxToSign[],
  toastId: string
) => {
  let isCancelled = false;
  const toastText = {
    WalletConnect: 'Waiting for Pera Algo App',
    MyAlgo: 'Waiting for My Algo',
  }[wallet.type];

  createCustomLoadingToast(
    {
      text: toastText,
      linkText: 'cancel',
      onLinkClick: () => {
        isCancelled = true;
      },
    },
    { id: toastId }
  );

  let result: Uint8Array[] | null;
  console.log('hello!!');
  try {
    result = (await Promise.any([
      wallet.sign(toSign),
      (async () => {
        while (isCancelled === false) {
          await new Promise(resolve => {
            setTimeout(resolve, 100);
          });
        }
        return null;
      })(),
    ])) as Uint8Array[] | null;
  } catch (e) {
    toast.error('Failed to connect to wallet', { id: toastId });
    setTimeout(() => toast.dismiss(toastId), 2000);
    throw e;
  }
  console.log('result');
  if (result === null) {
    toast('Transaction cancelled', { id: toastId });
    setTimeout(() => toast.dismiss(toastId), 2000);
    return null;
  }
  return result;
};

export const publishWithToasts = async (
  network: Networks,
  signed: Uint8Array[],
  toastId: string
) => {
  console.log('hello publishing');
  createCustomLoadingToast({ text: 'Sending transaction' }, { id: toastId });

  const { algodClient } = getClients(network);
  let response: { txId: string };
  console.log('here');
  try {
    response = await algodClient.sendRawTransaction(signed).do();
  } catch (e) {
    const parsedError = parseClientError(e as AlgoClientError);
    toast.error('Error from algo client', { id: toastId });
    setTimeout(() => toast.dismiss(toastId), 2000);
    console.error(
      parsedError.message,
      parsedError.type,
      parsedError.data,
      JSON.stringify(parsedError.original)
    );
    throw parsedError;
  }

  return response.txId;
};

export const waitWithToasts = async (
  network: Networks,
  txId: string,
  toastId: string
) => {
  createCustomLoadingToast(
    { text: 'Waiting for confirmation' },
    { id: toastId }
  );

  try {
    await waitForTx(txId, network);
  } catch (e) {
    toast.error('Timed out waiting for confirmation', { id: toastId });
    setTimeout(() => toast.dismiss(toastId), 2000);
    throw e;
  }
};

export const signAndPublishWithToasts = async (
  wallet: Wallet,
  network: Networks,
  toSign: TxToSign[],
  toastId: string
) => {
  const signed = await signWithToasts(wallet, toSign, toastId);
  if (!signed) {
    return null;
  }
  const transactionId = await publishWithToasts(network, signed, toastId);
  await waitWithToasts(network, transactionId, toastId);
  return transactionId;
};
