import { useEffect, useState } from 'react';
import usePrevious from '../usePrevious';
import useMyAlgoConnect from './myAlgo';
import { Connectors, Wallet } from './types';
import useWalletConnect from './walletConnect';

type UseWalletsType = {
  activeWallet?: Wallet;
  setActiveWallet: (wallet: Wallet | number | undefined) => void;
  wallets: Wallet[];
  connectors: Connectors;
};

const useWallets = (): UseWalletsType => {
  const [wcWallets, wcConnector] = useWalletConnect();
  const [maWallets, maConnector] = useMyAlgoConnect();
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  const connectors = {
    walletConnect: wcConnector,
    myAlgo: maConnector,
  };

  const wallets = [...wcWallets, ...maWallets];

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
  };
};

export default useWallets;
