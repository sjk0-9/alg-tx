import { encodeAddress } from 'algosdk';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '../../components/Banner';
import ExternalLink from '../../components/ExternalLink';
import { NetworkContext } from '../../contexts';
import useUrlTransactionDecoder, {
  DecodedTransactions,
  UseUrlTransactionDecoderReturn,
} from '../../hooks/useUrlTransactionDecoder';
import useWallets from '../../hooks/useWallets';
import { Networks } from '../../lib/algo/clients';
import { NAME } from '../../lib/helpers/names';
import PublishButton from '../../patterns/PublishButton';
import SignedTransactionCard from '../../patterns/transactions/SignedTransactionCard';
import TransactionCard from '../../patterns/transactions/TransactionCard';
import signAndPublishAtomicTransactions from './sign';

const numberOfAddressesToSign = (transactions: DecodedTransactions[]) => {
  const allWallets: Set<string> = transactions.reduce((acc, tx) => {
    if (tx.signed) {
      return acc;
    }
    acc.add(encodeAddress(tx.txn.from.publicKey));
    return acc;
  }, new Set<string>());
  return allWallets.size;
};

const AtomicTransferError = ({
  transactions,
  error,
}: Pick<UseUrlTransactionDecoderReturn, 'transactions' | 'error'>) => {
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

const getExternalLink = (
  network: Networks,
  { group, txId }: Awaited<ReturnType<typeof signAndPublishAtomicTransactions>>
) => {
  const baseUrl =
    network === 'mainnet'
      ? 'https://algoexplorer.io'
      : 'https://testnet.algoexplorer.io';
  if (group) {
    return `${baseUrl}/tx/group/${encodeURIComponent(group)}`;
  }
  return `${baseUrl}/tx/${txId}`;
};

const AtomicTransfer = () => {
  const { activeWallet } = useWallets();
  const network = useContext(NetworkContext);
  const { transactions, error, watch } = useUrlTransactionDecoder();
  const [result, setResult] = useState<
    Awaited<ReturnType<typeof signAndPublishAtomicTransactions>> | undefined
  >();

  useEffect(() => {
    // The URL has changed, so we should unset any saved transactions.
    setResult(undefined);
  }, [watch]);

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
              if (t.signed) {
                return (
                  <div key={t.txn.txID()} className="my-2">
                    <SignedTransactionCard transaction={t.signed} />
                  </div>
                );
              }
              return (
                <div key={t.txn.txID()} className="my-2">
                  <TransactionCard transaction={t.txn} />
                </div>
              );
            })}
          </>
        )}
      </div>
      {result ? (
        <div className="mt-4 text-lg text-center">
          Success!{' '}
          <ExternalLink to={getExternalLink(network, result)}>
            See transaction
          </ExternalLink>
        </div>
      ) : (
        <PublishButton
          onClick={async () => {
            const res = await signAndPublishAtomicTransactions(
              activeWallet!,
              network,
              transactions!
            );
            setResult(res);
          }}
          disabled={!!errorMessage}
        />
      )}
    </div>
  );
};

export default AtomicTransfer;
