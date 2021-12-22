import WalletConnect from '@walletconnect/client';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state';

import * as uuid from 'uuid';
import { Wallet } from './types';

const useWCStorageIds = createPersistedState('walletConnectStorageIds');

const createNewConnector = async (): Promise<[string, WalletConnect]> => {
  const storageId = `walletConnect:${uuid.v4()}`;
  const connector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org',
    storageId,
    qrcodeModal: QRCodeModal,
  });

  await new Promise<void>((resolve, reject) => {
    connector.createSession();

    connector.on('connect', (error, payload) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  return [storageId, connector];
};

const useWalletConnect = (): [Wallet[], () => Promise<void>] => {
  const [WCStorageIds, updateWCStorageIds] = useWCStorageIds<string[]>([]);
  const [WCInstances, updateWCInstances] = useState<{
    [storageId: string]: WalletConnect;
  }>({});

  const connectToWalletConnect = async () => {
    const [storageId, connector] = await createNewConnector();
    updateWCStorageIds(original => [...original, storageId]);
    updateWCInstances({
      ...WCInstances,
      [storageId]: connector,
    });
  };

  const wcWallets = WCStorageIds.map(storageId => {
    let connector = WCInstances[storageId];
    if (!connector) {
      connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org',
        storageId,
        qrcodeModal: QRCodeModal,
      });
    } else if (!connector.connected) {
      return { missingConnection: storageId };
    }

    if (connector.accounts.length === 0) {
      return { missingConnection: storageId };
    }

    return {
      id: storageId,
      address: connector.accounts[0],
      sign: Promise.resolve,
      disconnect: async () => {
        connector.killSession();
        updateWCStorageIds(original => original.filter(v => v !== storageId));
      },
      type: 'WalletConnect',
      connector,
    };
  });

  const removedWCWallets = wcWallets
    .filter(({ missingConnection }) => !!missingConnection)
    .map(({ missingConnection }) => missingConnection);

  useEffect(() => {
    console.log('removed', removedWCWallets);
    if (removedWCWallets.length) {
      updateWCStorageIds(original =>
        original.filter(v => !removedWCWallets.includes(v))
      );
    }
  }, [JSON.stringify(removedWCWallets)]);

  const wallets = wcWallets.filter(
    ({ missingConnection }) => !missingConnection
  ) as Wallet[];
  console.log('remainingWallets', wallets);

  return [wallets, connectToWalletConnect];
};

export default useWalletConnect;
