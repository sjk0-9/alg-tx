import BigNumber from 'bignumber.js';
import { AssetType } from './types';

export const formatAssetName = (assetId: number, asset?: AssetType) => {
  if (asset?.params?.name && asset?.params?.unitName) {
    return { name: `${asset.params.name} (${asset.params.unitName})`, assetId };
  }
  if (asset?.params?.name || asset?.params?.unitName) {
    return { name: asset.params.name || asset.params.unitName, assetId };
  }
  return { name: `Asset ID: ${assetId}` };
};

export const correctAssetDenomination = (
  amount: number | BigInt,
  asset?: AssetType
) => {
  if (!asset || !asset.params.decimals) {
    return amount.toString(10);
  }

  const num = new BigNumber(amount.toString(10));
  return num.dividedBy(10 ** asset.params.decimals).toString(10);
};
