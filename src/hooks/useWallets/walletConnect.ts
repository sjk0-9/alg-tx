import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import algosdk from 'algosdk';
import { useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state';

import * as uuid from 'uuid';
import { TxToSign, Wallet } from './types';

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

const sign = (connector: WalletConnect) => async (txs: TxToSign[]) => {
  const txnWithbuffers = txs.map(({ txn, viewOnly, message }) => {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString('base64');

    return {
      txn: encodedTxn,
      signers: viewOnly ? [] : undefined,
      message,
    };
  });

  const request = formatJsonRpcRequest('algo_signTxn', [txnWithbuffers]);
  const result: Array<string | null> = await connector.sendCustomRequest(
    request
  );
  const decodedResult = result.map(r =>
    r ? new Uint8Array(Buffer.from(r, 'base64')) : null
  );
  return decodedResult;
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
      sign: sign(connector),
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
    if (removedWCWallets.length) {
      updateWCStorageIds(original =>
        original.filter(v => !removedWCWallets.includes(v))
      );
    }
  }, [JSON.stringify(removedWCWallets)]);

  const wallets = wcWallets.filter(
    ({ missingConnection }) => !missingConnection
  ) as Wallet[];

  return [wallets, connectToWalletConnect];
};

export default useWalletConnect;
