import algosdk from 'algosdk';
import React, { useContext, useState } from 'react';
import { SWRConfig } from 'swr';
import Banner from '../../../components/Banner';
import { NetworkContext } from '../../../contexts';
import Spinner from '../../../foundations/spinner';
import { useAccountAssetLookup } from '../../../hooks/useAlgoIndexer';
import useWallets from '../../../hooks/useWallets';
import { shortenAddress } from '../../../lib/algo/address';
import getClients from '../../../lib/algo/clients';
import localStorageCacheProvider from '../../../lib/helpers/localStorageCacheProvider';
import PublishButton, { PublishState } from '../../../patterns/PublishButton';
import OptOutAssetRow from './assetRow';

const OptOut = () => {
  const network = useContext(NetworkContext);
  const { activeWallet } = useWallets();
  const { assets, isLoading, error, mutate } = useAccountAssetLookup(
    activeWallet?.address ? { account: activeWallet?.address } : undefined
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [publishState, setPublishState] = useState<PublishState | undefined>();
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);

  const publishing = ['signing', 'publishing', 'waiting', 'success'].includes(
    publishState?.state || ''
  );

  const toggleSelected = (assetId: number) => {
    if (publishing) {
      return;
    }
    if (selected.has(assetId)) {
      setSelected(new Set([...selected.keys()].filter(a => a !== assetId)));
    } else if (selected.size < 16) {
      setSelected(new Set([...selected.keys(), assetId]));
    }
  };
  const zeroBalanceAssets = assets?.filter(val => val.amount === 0);

  return (
    <SWRConfig value={{ provider: localStorageCacheProvider('opt-out') }}>
      <div className="main-card">
        <h1>Opt Out of the following assets:</h1>
        <div className="my-2">
          {activeWallet ? (
            <>
              <p className="font-semibold mb-2">
                Selected Wallet: {shortenAddress(activeWallet.address)}
              </p>
              {zeroBalanceAssets?.length && (
                <p>
                  Select the following 0 balance assets that you want to opt out
                  of. If assets you expect aren&apos;t here, double check
                  you&apos;ve got the right account and that your asset balance
                  is 0.
                </p>
              )}
            </>
          ) : (
            <p>Connect to a wallet via the dropdown above</p>
          )}
        </div>
        {error && (
          <Banner type="error">
            Something went wrong retrieving account assets.
            <br />
            {error.message}
          </Banner>
        )}
        {isLoading && (
          <div className="mt-12 mb-10">
            <Spinner size="lg" color="primary" />
          </div>
        )}
        {selected.size >= 16 && (
          <div className="my-2">
            <Banner type="notice">
              Can only opt out of a maximum of 16 assets at a time.
            </Banner>
          </div>
        )}
        {zeroBalanceAssets && (
          <>
            <div className="max-h-[60vh] overflow-y-scroll">
              {zeroBalanceAssets.map(({ assetId }) => (
                <OptOutAssetRow
                  key={assetId}
                  assetId={assetId}
                  selected={selected.has(assetId)}
                  toggleSelect={() => toggleSelected(assetId)}
                  disabled={
                    (selected.size >= 16 && !selected.has(assetId)) ||
                    publishing
                  }
                />
              ))}
            </div>
            {activeWallet?.type === 'MyAlgo' && (
              <p className="text-sm my-2">
                MyAlgo may require you to confirm each transaction with the
                warning &ldquo;This transaction will empty the funds of your
                account&rdquo;. They want you to be careful of mallicious
                parties that could trick you into signing the opt-out
                transaction to take all of this asset.
                <br />
                To confirm you are safe, you can double check you have 0 of the
                corresponding asset, and the &ldquo;Close Remainder To&rdquo;
                address is your own.
              </p>
            )}
          </>
        )}
        {zeroBalanceAssets !== undefined && zeroBalanceAssets.length === 0 && (
          <>
            <p>No assets with 0 balance</p>
            <p>
              You can currently only opt out of assets where you have no balance
            </p>
          </>
        )}
        <PublishButton
          text={selected.size === 0 ? 'Select one or more assets' : undefined}
          disabled={selected.size === 0}
          transactions={async () => {
            const { algodClient } = getClients(network);
            const params = await algodClient.getTransactionParams().do();
            const assetIds = Array.from(selected);
            const transactions = assetIds.map(assetId =>
              algosdk.makeAssetTransferTxnWithSuggestedParams(
                activeWallet!.address,
                activeWallet!.address,
                activeWallet!.address,
                undefined,
                0,
                undefined,
                assetId,
                params
              )
            );
            algosdk.assignGroupID(transactions);
            return transactions.map(txn => ({
              txn,
              message: 'Opt out of asset',
            }));
          }}
          onStateUpdate={async state => {
            setPublishState(state);
            if (state.state === 'success') {
              await mutate();
              setShowMoreButton(true);
            }
          }}
        />
        {publishState?.state === 'success' && assets?.length && showMoreButton && (
          <div className="mt-4 mb-2 flex-row justify-center text-center">
            <button
              className="btn-link"
              onClick={() => {
                /*
                setPublishState(undefined);
                setSelected(new Set());
                setPublishButtonKey(k => k + 1);
                setShowMoreButton(false);
                */
                // Hacky thing to get around walletconnect not working
                // properly when you call multiple times in a row.
                window.location.reload();
              }}
            >
              Opt out of more assets
            </button>
          </div>
        )}
      </div>
    </SWRConfig>
  );
};

export default OptOut;
