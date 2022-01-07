import BigNumber from 'bignumber.js';
import { AssetType } from './types';

const SHORT_NAME_LENGTH = 24;
const computeShortName = (name: string, baseName?: string) => {
  if (name.length < SHORT_NAME_LENGTH) {
    return name;
  }
  if (baseName && baseName.length < SHORT_NAME_LENGTH) {
    return baseName;
  }
  const bestBreak = name.slice(0, SHORT_NAME_LENGTH).match(/^(.*)\W/);
  if (bestBreak) {
    return `${bestBreak[1]}...`;
  }
  return `${name.slice(0, SHORT_NAME_LENGTH - 4)}...`;
};

export const formatAssetName = (assetId: number, asset?: AssetType) => {
  let name: string | undefined;
  if (asset?.params?.name && asset?.params?.unitName) {
    name = `${asset.params.name} (${asset.params.unitName})`;
  } else if (asset?.params?.name || asset?.params?.unitName) {
    name = asset.params.name || asset.params.unitName;
  }
  if (name) {
    const shortName = computeShortName(name, asset?.params?.name);
    return { name, shortName, assetId };
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
