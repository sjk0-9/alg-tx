import React from 'react';
import { useAssetLookup } from '../../../hooks/useAlgoIndexer';

type OptInAssetRowParams = {
  assetId: number;
  removeAsset: () => void;
};

const OptInAssetRow = ({ assetId }: OptInAssetRowParams) => {
  const { asset, isLoading, error } = useAssetLookup({ assetId });

  const assetName = asset?.params?.name || `Asset ID: ${assetId}`;
  return (
    <div>
      <h3>{assetName}</h3>
    </div>
  );
};

export default OptInAssetRow;
