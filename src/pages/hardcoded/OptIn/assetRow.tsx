import { XIcon } from '@heroicons/react/outline';
import React from 'react';
import { useAssetLookup } from '../../../hooks/useAlgoIndexer';
import { AssetType } from '../../../lib/algo/types';

type OptInAssetRowParams = {
  assetId: number;
  removeAsset: () => void;
};

const formatAssetName = (assetId: number, asset?: AssetType) => {
  if (asset?.params?.name && asset?.params?.unitName) {
    return { name: `${asset.params.name} (${asset.params.unitName})`, assetId };
  }
  if (asset?.params?.name || asset?.params?.unitName) {
    return { name: asset.params.name || asset.params.unitName, assetId };
  }
  return { name: `Asset ID: ${assetId}` };
};

const OptInAssetRow = ({ assetId, removeAsset }: OptInAssetRowParams) => {
  const { asset, isLoading, error } = useAssetLookup({ assetId });

  const assetName = formatAssetName(assetId, asset);
  return (
    <div className="py-2 flex flex-row">
      <div className="grow">
        <div>{assetName.name}</div>
        {assetName.assetId && (
          <div className="text-sm text-subtle">{assetName.assetId}</div>
        )}
      </div>
      <div>
        <button onClick={removeAsset}>
          <XIcon className="w-6 h-6 text-subtle hover:text-red-500 active:text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default OptInAssetRow;
