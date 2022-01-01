import { Address } from 'algosdk';
import { shortenAddress, stringAddress } from '../../lib/algo/address';
import { Wallet } from './types';

export const findWallet = (address: string | Address, wallets: Wallet[]) => {
  const sAddress = stringAddress(address);
  return wallets.find(wallet => wallet.address === sAddress);
};

export const prettyWalletType = (wallet: Wallet) => {
  switch (wallet.type) {
    case 'WalletConnect':
      return 'Algorand App';
    case 'MyAlgo':
      return 'My Algo';
    default:
      // @ts-ignore
      throw new Error(`Unknown wallet type ${wallet.type}`);
  }
};

export const walletName = (wallet: Wallet) => {
  if (wallet.name) {
    return wallet.name;
  }
  return shortenAddress(wallet.address);
};
