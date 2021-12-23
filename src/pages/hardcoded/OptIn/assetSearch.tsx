import React, { useState } from 'react';
import algosdk from 'algosdk';
import { isFinite } from 'lodash';
import {
  AssetSearchParams,
  useAssetSearch,
} from '../../../hooks/useAlgoIndexer';
import SearchBox from '../../../components/SearchBox';
import { AssetType } from '../../../lib/algo/types';

const getSearchParams = (
  searchString: string
): AssetSearchParams | undefined => {
  const cleanString = searchString.trim();
  if (cleanString.length < 3) {
    return undefined;
  }
  if (algosdk.isValidAddress(cleanString)) {
    return { creator: cleanString, limit: 10 };
  }
  if (isFinite(parseInt(cleanString, 10))) {
    return { assetId: parseInt(cleanString, 10), limit: 10 };
  }
  return { name: cleanString, limit: 10 };
};

type AssetSearchBarParams = {
  onSelect: (assetId: number) => void;
};

const formatOption = (asset: AssetType) => {
  const id = asset.index;
  const { name, unitName } = asset.params;
  if (name && unitName) {
    return { id, option: `${name} (${unitName})`, optionSecondary: `${id}` };
  }
  if (name || unitName) {
    return { id, option: `${name || unitName}`, optionSecondary: `${id}` };
  }
  return { id, option: `${id}` };
};

const AssetSearchBar = ({ onSelect }: AssetSearchBarParams) => {
  const [searchString, setSearchString] = useState<string>('');
  const searchParams = getSearchParams(searchString);

  const { assets = [], isLoading, error } = useAssetSearch(searchParams);

  const options = assets.map(formatOption);

  return (
    <SearchBox
      searchString={searchString}
      onSearchChange={setSearchString}
      options={options}
      onSelect={() => {}}
    />
  );
};

export default AssetSearchBar;
