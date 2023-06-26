import algosdk from 'algosdk';

export type Networks = 'mainnet' | 'testnet';

type ServerAddress = {
  [network in Networks]: string;
};

const ALGOD_TOKEN = '';
const ALGOD_SERVER: ServerAddress = {
  mainnet: 'https://mainnet-api.algonode.cloud',
  testnet: 'https://testnet-api.algonode.cloud',
};
const ALGOD_PORT = '443';

const INDEXER_TOKEN = '';
const INDEXER_SERVER: ServerAddress = {
  mainnet: 'https://mainnet-idx.algonode.cloud',
  testnet: 'https://testnet-idx.algonode.cloud',
};
const INDEXER_PORT = '443';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const getClients_ = (network: 'mainnet' | 'testnet') => {
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

const clients = {
  mainnet: getClients_('mainnet'),
  testnet: getClients_('testnet'),
};

const getClients = (network: 'mainnet' | 'testnet' = 'mainnet') =>
  clients[network];

export default getClients;
