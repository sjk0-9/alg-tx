import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import algosdk, { Transaction } from 'algosdk';
import { identity, pickBy } from 'lodash';
import { useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state';

import * as uuid from 'uuid';
import { encodeSignedTransaction, isSigned } from '../../lib/algo/transactions';
import { TxToSign, Wallet } from './types';

const useWCStorageIds = createPersistedState('walletConnectStorageIds');
const useWCWalletNames = createPersistedState('walletConnectNames');

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

const sign =
  (connector: WalletConnect) =>
  async (txs: TxToSign[]): Promise<Uint8Array[]> => {
    const txnWithbuffers = txs.map(({ txn, viewOnly, message }) => {
      let encodedTxn: Uint8Array;
      if (isSigned(txn)) {
        // We need to remove all the signed stuff from the transaction to
        // get the wallet to recognise it.
        encodedTxn = algosdk.encodeUnsignedTransaction(txn.txn);
      } else {
        encodedTxn = algosdk.encodeUnsignedTransaction(txn as Transaction);
      }

      const b64Txn = Buffer.from(encodedTxn).toString('base64');

      const result = {
        txn: b64Txn,
        signer: viewOnly || isSigned(txn) ? [] : undefined,
        message: message || 'default message',
      };
      return pickBy(result, identity);
    });

    const request = formatJsonRpcRequest('algo_signTxn', [txnWithbuffers]);
    const result: Array<string | null> = await connector.sendCustomRequest(
      request
    );
    const decodedResult = result.map(r =>
      r ? new Uint8Array(Buffer.from(r, 'base64')) : null
    );
    // Put the signed stuff back in
    const mergedResult = decodedResult.map((val, idx) => {
      if (val !== null) {
        return val;
      }
      const { txn } = txs[idx];
      if (isSigned(txn)) {
        return encodeSignedTransaction(txn);
      }
      return algosdk.encodeUnsignedTransaction(txn);
    });
    return mergedResult;
  };

const useWalletConnect = (): [Wallet[], () => Promise<void>] => {
  const [WCStorageIds, updateWCStorageIds] = useWCStorageIds<string[]>([]);
  const [WCNames, updateWCNames] = useWCWalletNames<{
    [storageId: string]: string | undefined;
  }>({});
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
      name: WCNames[storageId],
      type: 'WalletConnect',
      connector,
      setName: (name: string | undefined) => {
        updateWCNames(names => ({ ...names, [storageId]: name }));
      },
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

  console.log('Call to Wallet Connect');

  return [wallets, connectToWalletConnect];
};

export default useWalletConnect;
