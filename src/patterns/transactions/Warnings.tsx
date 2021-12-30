import React from 'react';
import { Transaction, TransactionType } from 'algosdk';
import Banner from '../../components/Banner';
import { shortenAddress } from '../../lib/algo/address';

const TransactionWarnings = ({ transaction }: { transaction: Transaction }) => {
  const warnings = [];
  if (transaction.reKeyTo) {
    warnings.push({
      title: 'ReKey warning',
      message: `This transaction rekeys the wallet to ${shortenAddress(
        transaction.reKeyTo
      )}. If you don't have access to the keys of ${shortenAddress(
        transaction.reKeyTo
      )}, you won't be able to access this wallet.`,
    });
  }
  if (
    transaction.closeRemainderTo &&
    transaction.type === TransactionType.pay
  ) {
    warnings.push({
      title: 'Close wallet warning',
      message: `This transaction sends all remaining ALGO in this wallet to ${shortenAddress(
        transaction.closeRemainderTo
      )}.`,
    });
  }
  if (
    transaction.closeRemainderTo &&
    transaction.type === TransactionType.axfer
  ) {
    warnings.push({
      title: 'Close asset warning',
      message: `This transaction sends all of remaining ASA #${
        transaction.assetIndex
      } in this wallet to ${shortenAddress(
        transaction.closeRemainderTo
      )} and opts out of the asset.`,
    });
  }
  return (
    <>
      {warnings.map(({ title, message }) => (
        <div key={title} className="my-2">
          <Banner type="warning" title={title} size="sm">
            {message}
          </Banner>
        </div>
      ))}
    </>
  );
};

export default TransactionWarnings;
