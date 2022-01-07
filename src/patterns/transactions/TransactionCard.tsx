import React from 'react';
import { Switch } from '@headlessui/react';
import { Transaction } from 'algosdk';
import { friendlyTypeName } from '../../lib/algo/transactions';
import { TransactionCardContent } from './shared';
import TransactionDetails from './Details';
import TransactionWarnings from './Warnings';
import './transactionCard.css';

type TransactionCardProps = {
  transaction: Transaction;
} & (
  | {
      signable?: false;
      willSign?: undefined;
      setWillSign?: undefined;
    }
  | {
      signable: true;
      willSign: boolean;
      setWillSign: (willSign: boolean) => void;
    }
);

const SignToggle = ({
  signable,
  willSign,
  setWillSign,
}: TransactionCardProps) => {
  if (signable === false) {
    return null;
  }
  return (
    <div className="flex flex-row items-center gap-2">
      <Switch
        checked={willSign!}
        onChange={setWillSign!}
        className={`${
          willSign ? 'bg-primary' : 'bg-subtle'
        } relative inline-flex items-center h-6 rounded-full w-11`}
      >
        <span className="sr-only">Mark as to sign</span>
        <span
          className={`${
            willSign ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full`}
        />
      </Switch>
    </div>
  );
};

const TransactionCard = (props: TransactionCardProps) => {
  const { transaction } = props;
  return (
    <div className="expandable-card">
      <div className="header">
        <div className="mb-2 flex flex-row items-center justify-between">
          <div className="inline">
            <h5 className="text-subtle">
              {friendlyTypeName(transaction.type)}
            </h5>
          </div>
          <SignToggle {...props} />
        </div>
        <TransactionCardContent transaction={transaction} />
        <TransactionWarnings transaction={transaction} />
      </div>
      <TransactionDetails txn={transaction} />
    </div>
  );
};

export default TransactionCard;
