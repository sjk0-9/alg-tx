import { XIcon } from '@heroicons/react/outline';
import React from 'react';
import { useAssetLookup } from '../../../hooks/useAlgoIndexer';
import { formatAssetName } from '../../../lib/algo/asset';

type OptInAssetRowParams = {
  assetId: number;
  removeAsset: () => void;
};

const OptInAssetRow = ({ assetId, removeAsset }: OptInAssetRowParams) => {
  const { asset } = useAssetLookup({ assetId });

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
