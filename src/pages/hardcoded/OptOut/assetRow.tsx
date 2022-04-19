import React, { useContext } from 'react';
import ExternalLink from '../../../components/ExternalLink';
import { Checkbox } from '../../../components/form';
import { NetworkContext } from '../../../contexts';
import { useAssetLookup } from '../../../hooks/useAlgoIndexer';
import { formatAssetName } from '../../../lib/algo/asset';

type OptOutAssetRowParams = {
  assetId: number;
  selected: boolean;
  toggleSelect: () => void;
  disabled: boolean;
};

const OptOutAssetRow = ({
  assetId,
  selected,
  toggleSelect,
  disabled,
}: OptOutAssetRowParams) => {
  const { asset } = useAssetLookup({ assetId });
  const network = useContext(NetworkContext);

  const assetName = formatAssetName(assetId, asset);

  const algoexplorerBase =
    network === 'mainnet'
      ? 'https://algoexplorer.io'
      : 'https://testnet.algoexplorer.io';

  const algoexplorerLink = `${algoexplorerBase}/asset/${assetId}`;

  return (
    <div
      className={`
        py-2 px-4 my-2
        flex flex-row
        hover:bg-grey-100 active:bg-grey-200
        content-center
        cursor-pointer
        ${disabled ? 'bg-grey-100 cursor-default' : ''}
      `}
      onClick={toggleSelect}
    >
      <div className="justify-self-center self-center">
        <Checkbox onChange={toggleSelect} checked={selected} />
      </div>
      <div className="grow">
        <div className={`${disabled ? 'text-grey-500' : ''}`}>
          {assetName.name}
        </div>
        {assetName.assetId && (
          <div
            className={`text-sm text-subtle ${disabled ? 'text-grey-300' : ''}`}
          >
            {assetName.assetId} -{' '}
            <ExternalLink to={algoexplorerLink} icon>
              algoexplorer.io
            </ExternalLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptOutAssetRow;
