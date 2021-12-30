import { encodeAddress, SignedTransaction, Transaction } from 'algosdk';
import React, { useContext } from 'react';
import Banner from '../../components/Banner';
import { NetworkContext } from '../../contexts';
import useUrlTransactionDecoder, {
  UseUrlTransactionDecoderReturn,
} from '../../hooks/useUrlTransactionDecoder';
import useWallets from '../../hooks/useWallets';
import { isSigned } from '../../lib/algo/transactions';
import { NAME } from '../../lib/helpers/names';
import PublishButton from '../../patterns/PublishButton';
import SignedTransactionCard from '../../patterns/transactions/SignedTransactionCard';
import TransactionCard from '../../patterns/transactions/TransactionCard';
import signAndPublishAtomicTransactions from './sign';

const numberOfAddressesToSign = (
  transactions: (Transaction | SignedTransaction)[]
) => {
  const allWallets: Set<string> = transactions.reduce((acc, tx) => {
    if (isSigned(tx)) {
      return acc;
    }
    acc.add(encodeAddress(tx.from.publicKey));
    return acc;
  }, new Set<string>());
  return allWallets.size;
};

const AtomicTransferError = ({
  transactions,
  error,
}: UseUrlTransactionDecoderReturn) => {
  if (error || !transactions) {
    return 'Could not read transactions.';
  }
  const numToSign = numberOfAddressesToSign(transactions);
  if (numToSign > 1) {
    return `Multiple wallets required for signing. ${NAME} currently does not support more than one.`;
  }
  if (numToSign === 0) {
    return `No transactions left to sign`;
  }
  return undefined;
};

const AtomicTransfer = () => {
  const { activeWallet } = useWallets();
  const network = useContext(NetworkContext);
  const { transactions, error } = useUrlTransactionDecoder();
  const errorMessage = AtomicTransferError({ transactions, error });
  return (
    <div className="main-card">
      <h1>Review and sign:</h1>
      <div className="my-2">
        {errorMessage ? (
          <Banner type="error" title="Invalid">
            {errorMessage}
          </Banner>
        ) : (
          <>
            {transactions!.map(t => {
              if (isSigned(t)) {
                return (
                  <div key={t.txn.txID()} className="my-2">
                    <SignedTransactionCard transaction={t} />
                  </div>
                );
              }
              return (
                <div key={t.txID()} className="my-2">
                  <TransactionCard transaction={t} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <PublishButton
        onClick={() =>
          signAndPublishAtomicTransactions(
            activeWallet!,
            network,
            transactions!
          )
        }
        disabled={!!errorMessage}
      />
    </div>
  );
};

export default AtomicTransfer;
