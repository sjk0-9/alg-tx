import algosdk from 'algosdk';

export type Networks = 'mainnet' | 'testnet';

type ServerAddress = {
  [network in Networks]: string;
};

const ALGOD_TOKEN = '';
const ALGOD_SERVER: ServerAddress = {
  mainnet: 'https://algoexplorerapi.io/',
  testnet: 'https://testnet.algoexplorerapi.io/',
};
const ALGOD_PORT = '443';

const INDEXER_TOKEN = '';
const INDEXER_SERVER: ServerAddress = {
  mainnet: 'https://algoexplorerapi.io/idx2/v2/',
  testnet: 'https://testnet.algoexplorerapi.io/idx2/',
};
const INDEXER_PORT = '443';

const getClients = (network: 'mainnet' | 'testnet' = 'mainnet') => {
  const algodClient = new algosdk.Algodv2(
    ALGOD_TOKEN,
    ALGOD_SERVER[network],
    ALGOD_PORT
  );

  const indexerClient = new algosdk.Indexer(
    INDEXER_TOKEN,
    INDEXER_SERVER[network],
    INDEXER_PORT
  );

  return { network, algodClient, indexerClient };
};

export default getClients;
