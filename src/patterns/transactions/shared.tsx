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
    <div className="flex flex-nowrap flex-col sm:flex-row sm:items-center sm:gap-2">
      <div>
        <span className="inline sm:hidden">From: </span> {parsedFrom}{' '}
      </div>
      <div className="hidden sm:block">
        <ArrowNarrowRightIcon className="w-4 h-4" />
      </div>
      <div>
        <span className="inline sm:hidden">To: </span> {parsedTo}
      </div>
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
        {microalgosToAlgos(Number(txn.amount || 0))} ALGO
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
      <div className="flex flex-col over">
        <div className="text-2xl whitespace-nowrap">{display}</div>
        <div className="hidden sm:block">
          <ExternalLink to={algoexplorerLink}>{asaDisplay.name}</ExternalLink>
        </div>
        <div className="block sm:hidden">
          <ExternalLink to={algoexplorerLink}>
            {asaDisplay.shortName}
          </ExternalLink>
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
