import getClients, { Networks } from './clients';

const wait = async (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

const waitAndCompare = async (maxTime: number, waitTime: number) => {
  const currentTime = new Date().getTime();
  if (currentTime + waitTime > maxTime) {
    return false;
  }
  await wait(waitTime);
  return true;
};

export const waitForTx = async (
  txid: string,
  network: Networks,
  timeout = 20000
) => {
  const { indexerClient } = getClients(network);
  const startTime = new Date().getTime();
  const maxTime = startTime + timeout;
  // All good to wait the first time around
  while (await waitAndCompare(maxTime, 5000)) {
    try {
      const result = await indexerClient.lookupTransactionByID(txid).do();
      if (result?.transaction?.['confirmed-round']) {
        return;
      }
    } catch (e) {
      continue;
    }
  }
  throw new Error(`Timeout checking for transaction ${txid}`);
};
