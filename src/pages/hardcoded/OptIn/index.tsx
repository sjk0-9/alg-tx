import React, { useEffect } from 'react';
import { Navigate, Outlet, useParams, useSearchParams } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { isFinite } from 'lodash';
import localStorageCacheProvider from '../../../lib/helpers/localStorageCacheProvider';
import OptInAssetRow from './assetRow';
import AssetSearchBar from './assetSearch';

/**
 * A shortcut to allow people to remove the
 */
export const RedirectOptIn = () => {
  const params = useParams();
  return <Navigate to={`../?assetId=${params.assetId}`} />;
};

const OptIn = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const strAssetIds = searchParams.getAll('assetId');
  const assetIds = strAssetIds
    .map(strAssetId => parseInt(strAssetId, 10))
    .filter(isFinite);

  const setAssetIds = (intAssetIds: number[]) => {
    setSearchParams({
      ...searchParams,
      assetIds: intAssetIds.map(toString),
    });
  };

  const addAssetId = (assetId: number) => {
    if (assetIds.includes(assetId)) {
      // TODO-TOASTS: Add error toast here
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

  return (
    <SWRConfig value={{ provider: localStorageCacheProvider('opt-in') }}>
      <div className="card my-6 mx-2 sm:mx-6">
        <h1>Opt In to the following assets:</h1>
        {assetIds.map(assetId => (
          <OptInAssetRow
            key={assetId}
            assetId={assetId}
            removeAsset={() => removeAssetId(assetId)}
          />
        ))}
        <AssetSearchBar onSelect={addAssetId} />
      </div>
      <Outlet />
    </SWRConfig>
  );
};

export default OptIn;
