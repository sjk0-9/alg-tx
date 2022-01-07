import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from '../components/Banner';
import WrappedSpinner from '../foundations/spinner/wrapped';
import useWallets from '../hooks/useWallets';
import { Wallet } from '../hooks/useWallets/types';
import { walletName } from '../hooks/useWallets/utils';
import { ParsedAlgoClientError } from '../lib/algo/errors/parseClientError';
import { s } from '../lib/helpers/string';
import Disclaimer, { DISCLAIMER_VERSION } from './DisclaimerModal';

type PublishButtonProps = {
  onClick: () => Promise<void>;
  qty?: number;
  disabled?: boolean;
  text?: string;
};

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

const PublishButton = ({
  onClick,
  disabled,
  text,
  qty,
}: PublishButtonProps) => {
  const location = useLocation();
  const { activeWallet, licenseCheck, setLicenseCheck } = useWallets();
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const hasWallet = activeWallet !== undefined;

  const canPublish = hasWallet && !disabled;

  const publish = async () => {
    setError(undefined);
    setIsPublishing(true);
    try {
      await onClick();
    } catch (e) {
      console.log(error);
      setError(e as Error);
    } finally {
      setIsPublishing(false);
    }
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
    </>
  );
};

export default PublishButton;
