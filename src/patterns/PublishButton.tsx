import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from '../components/Banner';
import ExternalLink from '../components/ExternalLink';
import { NetworkContext } from '../contexts';
import WrappedSpinner from '../foundations/spinner/wrapped';
import useWallets from '../hooks/useWallets';
import { TxToSign, Wallet } from '../hooks/useWallets/types';
import { walletName } from '../hooks/useWallets/utils';
import { Networks } from '../lib/algo/clients';
import { ParsedAlgoClientError } from '../lib/algo/errors/parseClientError';
import {
  signWithToasts,
  publishWithToasts,
  waitWithToasts,
} from '../lib/algo/signing';
import { isSigned } from '../lib/algo/transactions';
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
  transactions: TxToSign[];
  disabled?: boolean;
  text?: string;
};

const getQty = (transactions: TxToSign[]) =>
  transactions.filter(tx => !tx.viewOnly).length;

const isReadyToPublish = (transactions: TxToSign[]) =>
  transactions.find(tx => tx.viewOnly && !isSigned(tx.txn)) !== undefined;

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
    const toSign = transactions;
    const willPublish = isReadyToPublish(toSign);
    const toastId = 'sign-and-publish';
    setError(undefined);
    setIsPublishing(true);
    setState({ state: 'signing', data: { toSign } });
    let signed: Uint8Array[];
    try {
      signed = await signWithToasts(activeWallet!, toSign, toastId);
    } catch (e) {
      setIsPublishing(false);
      setError(e as Error);
      setState({
        state: 'failed-signing',
        data: { error: e as Error, toSign },
      });
      return;
    }
    if (!willPublish) {
      setState({ state: 'success-sign-only', data: { toSign, signed } });
      setIsPublishing(false);
      return;
    }
    let txId: string;
    try {
      txId = await publishWithToasts(network, signed, toastId);
    } catch (e) {
      setIsPublishing(false);
      setError(e as Error);
      setState({
        state: 'failed-publishing',
        data: { error: e as Error, toSign, signed },
      });
      return;
    }
    setState({ state: 'waiting', data: { txId, toSign, signed } });
    try {
      await waitWithToasts(network, txId, toastId);
    } catch (e) {
      setIsPublishing(false);
      setError(e as Error);
      setState({
        state: 'failed-waiting',
        data: { error: e as Error, toSign, signed, txId },
      });
      return;
    }
    setState({ state: 'success', data: { toSign, signed, txId } });
    setIsPublishing(false);
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
