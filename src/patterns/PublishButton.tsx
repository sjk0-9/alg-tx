import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Banner from '../components/Banner';
import ExternalLink from '../components/ExternalLink';
import { createCustomLoadingToast } from '../components/Toast';
import { NetworkContext } from '../contexts';
import WrappedSpinner from '../foundations/spinner/wrapped';
import useWallets from '../hooks/useWallets';
import { TxToSign, Wallet } from '../hooks/useWallets/types';
import { walletName } from '../hooks/useWallets/utils';
import getClients, { Networks } from '../lib/algo/clients';
import parseClientError, {
  AlgoClientError,
  ParsedAlgoClientError,
} from '../lib/algo/errors/parseClientError';
import { isSigned } from '../lib/algo/transactions';
import { waitForTx } from '../lib/algo/wait';
import { s } from '../lib/helpers/string';
import Disclaimer, { DISCLAIMER_VERSION } from './DisclaimerModal';

type PublishStateData = {
  txId: string;
  groupId?: string;
  toSign: TxToSign[];
  signed: Uint8Array[];
};
export type PublishState =
  | {
      state: 'signing';
      data: Pick<PublishStateData, 'toSign'>;
    }
  | {
      state: 'publishing';
      data: Pick<PublishStateData, 'toSign' | 'signed'>;
    }
  | {
      state: 'waiting';
      data: PublishStateData;
    }
  | {
      state: 'failed-signing';
      data: { error: Error } & Pick<PublishStateData, 'toSign'>;
    }
  | {
      state: 'cancelled-signing';
      data: Pick<PublishStateData, 'toSign'>;
    }
  | {
      state: 'failed-publishing';
      data: { error: Error } & Pick<PublishStateData, 'toSign' | 'signed'>;
    }
  | {
      state: 'failed-waiting';
      data: { error: Error } & PublishStateData;
    }
  | {
      state: 'success-sign-only';
      data: Pick<PublishStateData, 'toSign' | 'signed'>;
    }
  | {
      state: 'success';
      data: PublishStateData;
    };

type PublishButtonProps = {
  onStateUpdate?: (newState: PublishState) => void;
  transactions: TxToSign[] | (() => Promise<TxToSign[]>);
  disabled?: boolean;
  text?: string;
};

const getQty = (transactions: PublishButtonProps['transactions']) =>
  Array.isArray(transactions)
    ? transactions.filter(tx => !tx.viewOnly).length
    : undefined;

const isReadyToPublish = (transactions: TxToSign[]) =>
  transactions.find(tx => tx.viewOnly && !isSigned(tx.txn)) === undefined;

const signButtonTxt = (
  otherText: string | undefined,
  qty?: number,
  activeWallet?: Wallet
) => {
  const hasWallet = activeWallet !== undefined;
  if (otherText) {
    return otherText;
  }
  if (!hasWallet) {
    return 'Connect your wallet to sign the transaction';
  }
  if (qty !== undefined) {
    return `Sign ${qty} ${s(qty, 'Transaction')} with ${walletName(
      activeWallet
    )}`;
  }
  return `Sign Transaction with ${walletName(activeWallet)}`;
};

const getExternalLink = (
  network: Networks,
  { group, txId }: { group?: string; txId?: string }
) => {
  const baseUrl =
    network === 'mainnet'
      ? 'https://algoexplorer.io'
      : 'https://testnet.algoexplorer.io';
  if (group) {
    return `${baseUrl}/tx/group/${encodeURIComponent(group)}`;
  }
  return `${baseUrl}/tx/${txId}`;
};

const PublishButton = ({
  onStateUpdate = () => undefined,
  disabled,
  text,
  transactions,
}: PublishButtonProps) => {
  const location = useLocation();
  const network = useContext(NetworkContext);
  const { activeWallet, licenseCheck, setLicenseCheck } = useWallets();
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [publishState, setPublishState] = useState<PublishState | undefined>();
  const hasWallet = activeWallet !== undefined;

  const canPublish = hasWallet && !disabled;

  const qty = getQty(transactions);

  const setState = (newState: PublishState) => {
    setPublishState(newState);
    onStateUpdate(newState);
  };

  const publish = async () => {
    /* ============================
     * Preparing transactions
     * ============================ */
    setError(undefined);
    setIsPublishing(true);
    let toSign: TxToSign[];
    const toastId = 'sign-and-publish';
    if (!Array.isArray(transactions)) {
      createCustomLoadingToast('Preparing transaction', { id: toastId });
    }
    try {
      toSign = Array.isArray(transactions)
        ? transactions
        : await transactions();
    } catch (e) {
      setIsPublishing(false);
      setError(e as Error);
      toast.error('Error preparing transaction', { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
      return;
    }

    const willPublish = isReadyToPublish(toSign);

    /* ============================
     * Signing transactions
     * ============================ */
    let signed: Uint8Array[] | null;
    setState({ state: 'signing', data: { toSign } });

    let cancelledSigning = false;
    const toastText = {
      WalletConnect: 'Waiting for Pera Algo App',
      MyAlgo: 'Waiting for My Algo',
    }[activeWallet!.type];

    createCustomLoadingToast(
      {
        text: toastText,
        linkText: 'cancel',
        onLinkClick: () => {
          cancelledSigning = true;
        },
      },
      { id: toastId }
    );

    try {
      signed = (await Promise.any([
        activeWallet!.sign(toSign),
        (async () => {
          while (cancelledSigning === false) {
            await new Promise(resolve => {
              setTimeout(resolve, 100);
            });
          }
          return null;
        })(),
      ])) as Uint8Array[] | null;
    } catch (e) {
      setIsPublishing(false);
      setError(e as Error);
      setState({
        state: 'failed-signing',
        data: { error: e as Error, toSign },
      });
      toast.error('Error signing transaction', { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
      return;
    }

    if (!signed) {
      setState({ state: 'cancelled-signing', data: { toSign } });
      setIsPublishing(false);
      toast('Transaction cancelled', { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
      return;
    }
    if (!willPublish) {
      setState({ state: 'success-sign-only', data: { toSign, signed } });
      setIsPublishing(false);
      toast.success('Transaction signed', { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
      return;
    }

    /* ============================
     * Publishing transactions
     * ============================ */

    createCustomLoadingToast('Sending transaction', { id: toastId });

    let txId: string;
    const { algodClient } = getClients(network);
    try {
      ({ txId } = await algodClient.sendRawTransaction(signed).do());
    } catch (e) {
      const parsedError = parseClientError(e as AlgoClientError);
      setIsPublishing(false);
      setError(parsedError);
      setState({
        state: 'failed-publishing',
        data: { error: parsedError, toSign, signed },
      });
      toast.error('Error from algo client', { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
      console.error(
        parsedError.message,
        parsedError.type,
        parsedError.data,
        JSON.stringify(parsedError.original)
      );
      return;
    }

    /* ============================
     * Waiting for transactions
     * ============================ */

    createCustomLoadingToast('Waiting for confirmation', { id: toastId });
    setState({ state: 'waiting', data: { txId, toSign, signed } });

    try {
      await waitForTx(txId, network);
    } catch (e) {
      setIsPublishing(false);
      setError(e as Error);
      setState({
        state: 'failed-waiting',
        data: { error: e as Error, toSign, signed, txId },
      });
      toast.error('Timed out waiting for confirmation', { id: toastId });
      setTimeout(() => toast.dismiss(toastId), 2000);
      return;
    }

    setState({ state: 'success', data: { toSign, signed, txId } });
    setIsPublishing(false);
    toast.success('Success!', { id: toastId });
    setTimeout(() => toast.dismiss(toastId), 2000);
  };

  // If something's changed, we might as well unset any errors that may exist
  useEffect(() => {
    setError(undefined);
  }, [activeWallet?.address, disabled, text, JSON.stringify(location)]);

  return (
    <>
      <Disclaimer
        isOpen={showDisclaimer}
        onAccept={async doNotShowAgain => {
          setShowDisclaimer(false);
          setLicenseCheck({
            doNotShowAgain,
            acceptedVersion: DISCLAIMER_VERSION,
          });
          await publish();
        }}
        onCancel={() => setShowDisclaimer(false)}
      />
      {error && (
        <div className="mt-4">
          <Banner type="error" title={error.message}>
            {(error as ParsedAlgoClientError<any>).resolution}
          </Banner>
        </div>
      )}
      {publishState?.state === 'success' && (
        <div className="mt-4 text-lg text-center">
          Success!{' '}
          <ExternalLink to={getExternalLink(network, publishState!.data)}>
            See transaction
          </ExternalLink>
        </div>
      )}
      {!['success-sign-only', 'success'].includes(
        publishState?.state || ''
      ) && (
        <button
          onClick={async () => {
            if (isPublishing) {
              return;
            }
            if (
              canPublish &&
              licenseCheck?.acceptedVersion === DISCLAIMER_VERSION &&
              licenseCheck?.doNotShowAgain
            ) {
              await publish();
            } else if (canPublish) {
              setShowDisclaimer(true);
            }
          }}
          disabled={!canPublish}
          className="btn-primary w-full mt-4"
        >
          <WrappedSpinner loading={isPublishing}>
            {signButtonTxt(text, qty, activeWallet)}
          </WrappedSpinner>
        </button>
      )}
    </>
  );
};

export default PublishButton;
