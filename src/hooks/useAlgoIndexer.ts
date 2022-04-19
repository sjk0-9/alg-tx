import { camelCase, reduce } from 'lodash';
import { useContext } from 'react';
import useSWR, { Fetcher } from 'swr';
import { NetworkContext } from '../contexts';
import getClients, { Networks } from '../lib/algo/clients';
import { AssetHoldingType, AssetType } from '../lib/algo/types';
import useDebounce from './useDebounce';

type Internal<T> = T & {
  network: Networks;
};

const useBase =
  <P, R, F>(
    fetcher: Fetcher<R, Internal<P>>,
    dataFormatter: (data?: R) => F,
    debounce: boolean = false
  ) =>
  (params: P | undefined) => {
    const network = useContext(NetworkContext);
    const debounced = debounce ? useDebounce(params, 2000) : params;
    const { data, error, isValidating, mutate } = useSWR(
      debounced !== undefined ? { ...debounced, network } : undefined,
      fetcher
    );
    return {
      isLoading: !data && !error && !!params,
      isValidating,
      error,
      mutate,
      ...dataFormatter(data),
    };
  };

const toCamelCase = (obj: { [key: string]: any }) =>
  reduce(
    obj,
    (acc: { [key: string]: any }, value, key) => {
      const cKey = camelCase(key);
      if (typeof value === 'object') {
        acc[cKey] = toCamelCase(value);
      } else {
        acc[cKey] = value;
      }
      return acc;
    },
    {}
  );

/*
 * =============================
 * Asset Search
 * =============================
 */

export type AssetSearchParams = {
  creator?: string;
  name?: string;
  unit?: string;
  assetId?: number;
  limit?: number;
};
type AssetSearchResult = AssetType[];

type AssetSearchFetcher = Fetcher<
  AssetSearchResult,
  Internal<AssetSearchParams>
>;

const assetSearchFetcher: AssetSearchFetcher = async ({
  network,
  creator,
  name,
  unit,
  assetId,
  limit,
}: Internal<AssetSearchParams>) => {
  const { indexerClient } = getClients(network);
  let query = indexerClient.searchForAssets();
  if (creator) {
    query = query.creator(creator);
  }
  if (name) {
    query = query.name(name);
  }
  if (unit) {
    query = query.unit(unit);
  }
  if (assetId) {
    query = query.index(assetId);
  }
  if (limit) {
    query = query.limit(limit);
  }
  const result = await query.do();
  const parsed = result.assets.map(toCamelCase);
  return parsed as AssetSearchResult;
};

export const useAssetSearch = useBase<
  AssetSearchParams,
  AssetSearchResult,
  { assets?: AssetSearchResult }
>(assetSearchFetcher, d => ({ assets: d }), true);

/*
 * =============================
 * Asset Lookup
 * =============================
 */

type AssetLookupResult = AssetType;

type AssetLookupParams = { assetId: number };

type AssetLookupFetcher = Fetcher<
  AssetLookupResult,
  Internal<AssetLookupParams>
>;

const assetLookupFetcher: AssetLookupFetcher = async ({
  network,
  assetId,
}: Internal<AssetLookupParams>) => {
  const { indexerClient } = getClients(network);
  const result = await indexerClient.lookupAssetByID(assetId).do();
  const parsed = toCamelCase(result.asset);
  return parsed as AssetLookupResult;
};

export const useAssetLookup = useBase<
  AssetLookupParams,
  AssetLookupResult,
  { asset?: AssetLookupResult }
>(assetLookupFetcher, d => ({ asset: d }));

/*
 * =============================
 * Account Asset Lookup
 * =============================
 */

type AccountAssetLookupResult = AssetHoldingType[];

type AccountAssetLookupParams = {
  account: string;
  assetId?: number;
  includeAll?: boolean;
};

type AccountAssetLookupFetcher = Fetcher<
  AccountAssetLookupResult,
  Internal<AccountAssetLookupParams>
>;

const accountAssetLookupFetcher: AccountAssetLookupFetcher = async ({
  network,
  account,
  assetId,
  includeAll,
}: Internal<AccountAssetLookupParams>) => {
  console.log('Hello');
  const { indexerClient } = getClients(network);
  let next: string | undefined;
  const assets = [];
  while (true) {
    console.log('here');
    let query = indexerClient.lookupAccountAssets(account);
    if (assetId) {
      query = query.assetId(assetId);
    }
    if (includeAll) {
      query = query.includeAll(includeAll);
    }
    if (next) {
      query = query.nextToken(next);
    }
    console.log('now');
    console.log(query);
    const result = await query.do();
    console.log(result);
    next = result['next-token'];
    assets.push(...result.assets.map(toCamelCase));
    if (!next) {
      return assets as AccountAssetLookupResult;
    }
  }
};

export const useAccountAssetLookup = useBase<
  AccountAssetLookupParams,
  AccountAssetLookupResult,
  { assets?: AccountAssetLookupResult }
>(accountAssetLookupFetcher, d => ({ assets: d }));
