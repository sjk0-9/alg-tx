import React, { createContext, Dispatch, useContext, useState } from 'react';
import { Wallet } from './types';

const ActiveWalletContext = createContext<
  [Wallet | undefined, Dispatch<Wallet | undefined>]
>([undefined, () => undefined]);

export const useActiveWallet = () => useContext(ActiveWalletContext);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  return (
    <ActiveWalletContext.Provider value={[activeWallet, setActiveWallet]}>
      {children}
    </ActiveWalletContext.Provider>
  );
};

export default WalletProvider;
