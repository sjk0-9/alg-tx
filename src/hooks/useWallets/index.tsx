import { useEffect } from 'react';
import createPersistedState from 'use-persisted-state';
import { DISCLAIMER_VERSION } from '../../patterns/DisclaimerModal';
import usePrevious from '../usePrevious';
import useMyAlgoConnect from './myAlgo';
import { Connectors, SignType, Wallet } from './types';
import useWalletConnect from './walletConnect';
import { useActiveWallet } from './WalletProvider';

const useAcceptedLicenseVersion = createPersistedState(
  'acceptedLicenseVersion'
);

type AcceptedLicenseVersionType =
  | {
      acceptedVersion?: string;
      doNotShowAgain?: boolean;
    }
  | undefined;

type UseWalletsType = {
  activeWallet?: Wallet;
  setActiveWallet: (wallet: Wallet | number | undefined) => void;
  wallets: Wallet[];
  connectors: Connectors;
  licenseCheck: AcceptedLicenseVersionType;
  setLicenseCheck: (v: AcceptedLicenseVersionType) => void;
};

const checkForLicenseAgreement =
  (sign: SignType, licenseCheck: AcceptedLicenseVersionType): SignType =>
  async (...args) => {
    let lc: AcceptedLicenseVersionType = licenseCheck;
    // Manually check local storage because it may not have refreshed in the
    // hook.
    const storageLicenseCheck = localStorage.getItem('acceptedLicenseVersion');
    if (storageLicenseCheck) {
      lc = JSON.parse(storageLicenseCheck);
    }
    if (lc?.acceptedVersion !== DISCLAIMER_VERSION) {
      throw new Error('User has not accepted terms and conditions');
    }
    return sign(...args);
  };

const useWallets = (): UseWalletsType => {
  const [wcWallets, wcConnector] = useWalletConnect();
  const [maWallets, maConnector] = useMyAlgoConnect();
  const [activeWallet, setActiveWallet] = useActiveWallet();
  const [licenseCheck, setLicenseCheck] =
    useAcceptedLicenseVersion<AcceptedLicenseVersionType>();

  const connectors = {
    walletConnect: wcConnector,
    myAlgo: maConnector,
  };

  const wallets = [...wcWallets, ...maWallets].map(wallet => ({
    ...wallet,
    sign: checkForLicenseAgreement(wallet.sign, licenseCheck),
  }));

  const walletAddresses = wallets.map(w => w.address);
  const previousWallets = usePrevious<string[]>(walletAddresses);
  const newWalletAddress = walletAddresses.find(
    w => !previousWallets?.includes(w)
  );

  // Make sure that if there's at least one wallet remaining,
  // we have a valid active wallet.
  // If there are none, make sure we don't have an active wallet.
  useEffect(() => {
    if (
      walletAddresses.length &&
      (!activeWallet || !walletAddresses.includes(activeWallet.address))
    ) {
      setActiveWallet(wallets[0]);
    } else if (walletAddresses.length === 0) {
      setActiveWallet(undefined);
    }
  }, [JSON.stringify(walletAddresses)]);

  // Make sure there's a new wallet address.
  useEffect(() => {
    if (newWalletAddress) {
      setActiveWallet(wallets.find(w => w.address === newWalletAddress));
    }
  }, [newWalletAddress]);

  return {
    activeWallet,
    setActiveWallet: wallet => {
      if (wallet === undefined) {
        setActiveWallet(undefined);
      } else if (typeof wallet === 'number') {
        // Is index
        setActiveWallet(wallets[wallet]);
      } else {
        // Is wallet itself
        setActiveWallet(wallet);
      }
    },
    wallets,
    connectors,
    licenseCheck,
    setLicenseCheck,
  };
};

export default useWallets;
