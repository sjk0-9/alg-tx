/**
 * Asset type as returned by indexer for asset search and lookup queries
 * but with camelCase key names.
 */
export type AssetType = {
  index: number;
  deleted: boolean;
  createdAtRound: number;
  destroyedAtRound?: number;
  params: {
    clawback: string;
    creator: string;
    decimals: number;
    defaultFrozen: boolean;
    freeze: string;
    manager: string;
    metadataHash?: string;
    name?: string;
    nameB64?: string;
    reserve: string;
    total: number;
    unitName?: string;
    unitNameB64?: string;
    url?: string;
    urlB64?: string;
  };
};
