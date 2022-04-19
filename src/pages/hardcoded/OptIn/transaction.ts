import algosdk from 'algosdk';
import { Wallet } from '../../../hooks/useWallets/types';
import getClients, { Networks } from '../../../lib/algo/clients';

const createTransactions = async (
  wallet: Wallet,
  network: Networks,
  assetIds: number[]
) => {
  const { algodClient } = getClients(network);

  const params = await algodClient.getTransactionParams().do();
  const transactions = assetIds.map(assetId =>
    algosdk.makeAssetTransferTxnWithSuggestedParams(
      wallet.address,
      wallet.address,
      undefined,
      undefined,
      0,
      undefined,
      assetId,
      params
    )
  );

  algosdk.assignGroupID(transactions);
  return transactions.map(txn => ({ txn, message: 'Sign to opt into asset' }));
};

export default createTransactions;
