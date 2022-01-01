import React, { useState } from 'react';
import WrappedSpinner from '../foundations/spinner/wrapped';
import useWallets from '../hooks/useWallets';
import { Wallet } from '../hooks/useWallets/types';
import { walletName } from '../hooks/useWallets/utils';
import Disclaimer, { DISCLAIMER_VERSION } from './DisclaimerModal';

type PublishButtonProps = {
  onClick: () => Promise<void>;
  disabled?: boolean;
  text?: string;
};

const signButtonTxt = (
  otherText: string | undefined,
  activeWallet?: Wallet
) => {
  const hasWallet = activeWallet !== undefined;
  if (otherText) {
    return otherText;
  }
  if (!hasWallet) {
    return 'Connect your wallet to sign the transaction';
  }

  return `Sign Transaction with ${walletName(activeWallet)}`;
};

const PublishButton = ({ onClick, disabled, text }: PublishButtonProps) => {
  const { activeWallet, licenseCheck, setLicenseCheck } = useWallets();
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const hasWallet = activeWallet !== undefined;

  const canPublish = hasWallet && !disabled;

  const publish = async () => {
    setIsPublishing(true);
    try {
      await onClick();
    } finally {
      setIsPublishing(false);
    }
  };

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
          {signButtonTxt(text, activeWallet)}
        </WrappedSpinner>
      </button>
    </>
  );
};

export default PublishButton;
