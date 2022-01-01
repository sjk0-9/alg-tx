import React, { useContext } from 'react';
import {
  Address,
  AssetTransferTxn,
  microalgosToAlgos,
  PaymentTxn,
  SignedTransaction,
  Transaction,
  TransactionType,
} from 'algosdk';
import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { shortenAddress } from '../../lib/algo/address';
import { isSigned } from '../../lib/algo/transactions';
import ExternalLink from '../../components/ExternalLink';
import { NetworkContext } from '../../contexts';
import { useAssetLookup } from '../../hooks/useAlgoIndexer';
import {
  correctAssetDenomination,
  formatAssetName,
} from '../../lib/algo/asset';
import useWallets from '../../hooks/useWallets';
import { findWallet } from '../../hooks/useWallets/utils';

type ContentProp<T> = {
  txn: T;
  signedTranasction?: SignedTransaction;
};

const AddressTransfer = ({
  from,
  to,
}: {
  from: string | Address;
  to: string | Address;
}) => {
  const { wallets } = useWallets();
  const parsedFrom = findWallet(from, wallets)?.name || shortenAddress(from);
  const parsedTo = findWallet(to, wallets)?.name || shortenAddress(to);
  return (
    <div className="flex items-center flex-nowrap gap-2">
      {parsedFrom} <ArrowNarrowRightIcon className="w-4 h-4" />
      {parsedTo}
    </div>
  );
};

const PaymentTransactionContent = ({
  txn,
  signedTranasction,
}: ContentProp<PaymentTxn>) => (
  <div>
    <div className="flex flex-col">
      <div className="text-2xl whitespace-nowrap">
        {microalgosToAlgos(Number(txn.amount))} ALGO
      </div>
      <AddressTransfer from={txn.from} to={txn.to} />
    </div>
  </div>
);

const AssetTransferContent = ({ txn }: ContentProp<AssetTransferTxn>) => {
  const network = useContext(NetworkContext);
  const { asset } = useAssetLookup({ assetId: txn.assetIndex });
  const algoexplorerLink =
    network === 'mainnet'
      ? `https://algoexplorer.io/asset/${txn.assetIndex}`
      : `https://testnet.algoexplorer.io/asset/${txn.assetIndex}`;
  const asaDisplay = formatAssetName(txn.assetIndex, asset);
  const isOptIn = Number.isNaN(Number(txn.amount)) || Number(txn.amount) === 0;
  const display = isOptIn
    ? 'Opt In'
    : correctAssetDenomination(txn.amount, asset);
  return (
    <div>
      <div className="flex flex-col">
        <div className="text-2xl whitespace-nowrap">{display}</div>
        <div>
          <ExternalLink to={algoexplorerLink}>{asaDisplay.name}</ExternalLink>
        </div>
        <AddressTransfer
          from={txn.assetRevocationTarget || txn.from}
          to={txn.to}
        />
      </div>
    </div>
  );
};

export const TransactionCardContent = ({
  transaction,
}: {
  transaction: Transaction | SignedTransaction;
}) => {
  const signedTranasction = isSigned(transaction) ? transaction : undefined;
  const txn = isSigned(transaction) ? transaction.txn : transaction;
  switch (txn.type) {
    case TransactionType.pay:
      return (
        <PaymentTransactionContent
          txn={txn as unknown as PaymentTxn}
          signedTranasction={signedTranasction}
        />
      );
    case TransactionType.axfer:
      return (
        <AssetTransferContent
          txn={txn as unknown as AssetTransferTxn}
          signedTranasction={signedTranasction}
        />
      );
    default:
      return null;
  }
};
