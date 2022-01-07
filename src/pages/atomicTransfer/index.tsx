import { encodeAddress } from 'algosdk';
import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Banner from '../../components/Banner';
import ExternalLink from '../../components/ExternalLink';
import { NetworkContext } from '../../contexts';
import useUrlTransactionDecoder, {
  DecodedTransactions,
  UseUrlTransactionDecoderReturn,
} from '../../hooks/useUrlTransactionDecoder';
import useWallets from '../../hooks/useWallets';
import { Wallet } from '../../hooks/useWallets/types';
import { stringAddress } from '../../lib/algo/address';
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

const getDefaultSignableTransactions = (
  transactions?: DecodedTransactions[],
  wallet?: Wallet
) => {
  if (!transactions || !wallet) {
    return new Set<number>();
  }

  const indexes = transactions
    .map((tx, idx) => {
      if (!tx.signed && stringAddress(tx.txn.from) === wallet.address) {
        return idx;
      }
      return null;
    })
    .filter(v => v !== null) as number[];
  return new Set<number>(indexes);
};
const AtomicTransfer = () => {
  const { activeWallet } = useWallets();
  const network = useContext(NetworkContext);
  const { transactions, error, watch } = useUrlTransactionDecoder();
  const [result, setResult] = useState<
    Awaited<ReturnType<typeof signAndPublishAtomicTransactions>> | undefined
  >();
  const [idxToSign, setIdxToSign] = useState<Set<number>>(new Set());

  useEffect(() => {
    // The URL has changed, so we should unset any saved transactions.
    setResult(undefined);
  }, [watch]);

  useEffect(() => {
    setIdxToSign(getDefaultSignableTransactions(transactions, activeWallet));
  }, [watch, activeWallet?.address]);

  const setIndex = (idx: number) => (toSign: boolean) => {
    if (toSign) {
      setIdxToSign(new Set([...idxToSign, idx]));
      toast('Set transaction to sign', { duration: 1500, id: 'setIdxToSign' });
    } else {
      setIdxToSign(new Set([...idxToSign].filter(i => i !== idx)));
      toast('Set transaction to not sign', {
        duration: 1500,
        id: 'setIdxToSign',
      });
    }
  };

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
            {transactions!.map((t, idx) => {
              if (t.signed) {
                return (
                  <div key={t.txn.txID()} className="my-2">
                    <SignedTransactionCard transaction={t.signed} />
                  </div>
                );
              }
              return (
                <div key={t.txn.txID()} className="my-2">
                  <TransactionCard
                    transaction={t.txn}
                    signable
                    willSign={idxToSign.has(idx)}
                    setWillSign={setIndex(idx)}
                  />
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
          disabled={!!errorMessage || idxToSign.size === 0}
          text={
            idxToSign.size === 0
              ? 'Select at least one transaction to sign'
              : undefined
          }
          qty={idxToSign.size}
        />
      )}
    </div>
  );
};

export default AtomicTransfer;
