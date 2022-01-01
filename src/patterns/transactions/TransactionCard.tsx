import React from 'react';
import { Transaction } from 'algosdk';
import { friendlyTypeName } from '../../lib/algo/transactions';
import { TransactionCardContent } from './shared';
import TransactionDetails from './Details';
import TransactionWarnings from './Warnings';

type TransactionCardProps = {
  transaction: Transaction;
};

const TransactionCard = ({ transaction }: TransactionCardProps) => (
  <div className="expandable-card">
    <div className="header">
      <h5 className="mb-2 text-subtle">{friendlyTypeName(transaction.type)}</h5>
      <TransactionCardContent transaction={transaction} />
      <TransactionWarnings transaction={transaction} />
    </div>
    <TransactionDetails txn={transaction} />
  </div>
);

export default TransactionCard;
