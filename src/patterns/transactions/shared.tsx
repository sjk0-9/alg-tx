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
}) => (
  <div className="flex items-center flex-nowrap gap-2">
    {shortenAddress(from)} <ArrowNarrowRightIcon className="w-4 h-4" />
    {shortenAddress(to)}
  </div>
);

const PaymentTransactionContent = ({
  txn,
  signedTranasction,
}: ContentProp<PaymentTxn>) => (
  <div>
    <div className="flex gap-x-2 items-center flex-wrap">
      <div className="whitespace-nowrap">
        {microalgosToAlgos(Number(txn.amount))} ALGO
      </div>
      <span>-</span>
      <AddressTransfer from={txn.from} to={txn.to} />
    </div>
  </div>
);

const AssetTransferContent = ({ txn }: ContentProp<AssetTransferTxn>) => {
  const network = useContext(NetworkContext);
  const algoexplorerLink =
    network === 'mainnet'
      ? `https://algoexplorer.io/asset/${txn.assetIndex}`
      : `https://testnet.algoexplorer.io/asset/${txn.assetIndex}`;
  const isOptIn = Number.isNaN(Number(txn.amount)) || Number(txn.amount) === 0;
  const display = isOptIn ? 'Opt In to ' : `${Number(txn.amount)} of `;
  return (
    <div>
      <div className="flex gap-x-2 items-center flex-wrap">
        <div className="whitespace-nowrap">
          {display}
          <ExternalLink to={algoexplorerLink}>
            ASA #{txn.assetIndex}
          </ExternalLink>
        </div>
        <span>-</span>
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
