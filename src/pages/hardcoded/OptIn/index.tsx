import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useParams, useSearchParams } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { isFinite } from 'lodash';
import toast from 'react-hot-toast';
import localStorageCacheProvider from '../../../lib/helpers/localStorageCacheProvider';
import OptInAssetRow from './assetRow';
import AssetSearchBar from './assetSearch';
import useWallets from '../../../hooks/useWallets';
import { NetworkContext } from '../../../contexts';
import PublishButton from '../../../patterns/PublishButton';
import useDocumentTitle from '../../../hooks/useTitle';
import createTransactions from './transaction';

/**
 * A shortcut to allow people to remove the
 */
export const RedirectOptIn = () => {
  const params = useParams();
  return <Navigate to={`../?id=${params.assetId}`} />;
};

const OptIn = () => {
  useDocumentTitle('Opt-In');
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeWallet } = useWallets();
  const network = useContext(NetworkContext);

  const strAssetIds = searchParams.getAll('id');
  const assetIds = strAssetIds
    .map(strAssetId => parseInt(strAssetId, 10))
    .filter(isFinite)
    .slice(0, 16);

  const setAssetIds = (intAssetIds: number[]) => {
    setSearchParams({
      ...searchParams,
      id: intAssetIds.map(assetId => `${assetId}`),
    });
  };

  const addAssetId = (assetId: number) => {
    if (assetIds.includes(assetId)) {
      toast.error(`Asset ${assetId} already selected`);
      return;
    }
    setAssetIds([...assetIds, assetId]);
  };
  const removeAssetId = (assetId: number) => {
    setAssetIds(assetIds.filter(id => id !== assetId));
  };

  // Somehow, some non-integer has gotten into here
  useEffect(() => {
    if (strAssetIds.length !== assetIds.length) {
      setAssetIds(assetIds);
    }
  }, [JSON.stringify(assetIds)]);

  const hasAssets = !!assetIds.length;

  return (
    <SWRConfig value={{ provider: localStorageCacheProvider('opt-in') }}>
      <div className="main-card">
        <h1>Opt In to the following assets:</h1>
        <div className="divide-y my-4">
          {assetIds.map(assetId => (
            <OptInAssetRow
              key={assetId}
              assetId={assetId}
              removeAsset={() => removeAssetId(assetId)}
            />
          ))}
        </div>
        {assetIds.length < 16 ? (
          <AssetSearchBar onSelect={addAssetId} />
        ) : (
          <div>You can add a maximum of 16 assets per request.</div>
        )}
        <PublishButton
          text={!hasAssets ? 'Add one or more assets' : undefined}
          disabled={!hasAssets}
          transactions={async () =>
            createTransactions(activeWallet!, network, assetIds)
          }
        />
      </div>
      <Outlet />
    </SWRConfig>
  );
};

export default OptIn;
