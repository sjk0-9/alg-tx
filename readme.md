# Alg-TX

Alg-tx is no longer under development.
It is unlikely to function for very much longer (if it still does at all).

I'm releasing this so that people who have used it in the past can possibly redeem it and either re-purpose parts of it for their own work, or use it as a basis to build upon. If that's you, a rough summary of what you're about to dive into:

## Development

It's built using react and typescript using vite for development and building.
There's no backend servers or anything like that.
On build, a single package is created, that can be hosted anywhere (currently I used [fleek.co](https://fleek.co/)).
Simple as that.

To run locally:

```bash
yarn
yarn dev
```

And visit `localhost:3000` in your web-browser.

While I feel it's reasonably simple, it doesn't have any documentation or tests, so diving in mightn't be the easiest.
In absence of any real support, a brief overview of the codebase under the `src` directory:

In terms of the react JSX components, they vaguely follow the [atlassian design system](https://atlassian.design/):

* `src/foundations/` - most basic react building blocks of the app - css, colors, logos etc.
* `src/components/` - contains simple, reusable components.
* `src/patterns/` - more complex react components, made up of multiple subcomponents.
* `src/pages/` - the individual pages.

The html itself uses [tailwindcss](https://tailwindcss.com/) for styling.

Since this is a single page, non-hosted app, routing is performed by ReactRouter using the hashrouter.

All stateful management of the app is handled within `src/hooks/`, communicating with wallets, communicating with servers, all that is abstracted into react hooks. That said, there's very little in the way of persisted state that needs to be managed. The wallet configuration is via `use-persisted-state`, and logic for the contents of the web page (e.g. the atomic transaction helper), is just stored as URL state via React Router.

Finally, `src/lib/` contains the arbitrary helpers to abstract away complexity. Especially things for processing algorand data.

## Publishing

To publish your own version, you just have to run `yarn build`.
This will create a directory `dist/`.
Upload the full directory to any of a number of hosting services, and you'll be able to access the website, live, on the internet.
I used [fleek.co](https://fleek.co/) as it is insanely easy to set up and integrate so that pushes to github immediately start a build that then gets automatically released.

## Atomic Transaction Examples

These are the code examples I've shared for helping people generate their own atomic transaction URLs.

Knowing the address of the end user, you create a group of transactions, some that need to be signed by you, some by the end user. You then assign the group id, sign your ones, encode them in base64, and append them to the end of the `alg-tx.com/#/a/` url, joined by a `;`.

In both examples, a user pays 10 algos and opts into an asset, and the "bot" will then transfer 1 copy of
that asset to the user.

### Javascript

```javascript
import algosdk from 'algosdk';
import algodClient from '../wherever/you/have/defined/your/client';

const algTxBaseUrl = `https://alg-tx.com/#/a/`;
const BOT_ADDRESS = '<BOT_ADDRESS>';
const { sk: BOT_SK } = algosdk.mnemonicToSecretKey('<BOT_MNEMONIC>');
const ASSET_ID = 123456

/**
 * Takes an array of signed and unsigned Algorand transactions.
 * Transactions should all belong to the same atomic group.
 * Returns a string of the URL for the user to sign.
 */
export const buildAlgTxUrl = (transactions) => {
  const encodedTransactions = transactions.map(tx => {
    // If it's a Uint8Array, it's a transaction we've signed
    // It's already encoded.
    if (tx instanceof Uint8Array) {
      return tx;
    }
    return algosdk.encodeUnsignedTransaction(tx);
  });
  const b64Transactions = encodedTransactions.map(txn =>
    Buffer.from(txn).toString('base64')
  );
  const url = `${algTxBaseUrl}${b64Transactions.join(';')}`;
  return url;
};

const wrapTx = async (userAddress) => {
  const params = await algodClient.getTransactionParameters.do();
  const userTransactions = [
    // User sending their algo
    algosdk.makePaymentTxnWithSuggestedParams(
      userAddress, BOT_ADDRESS, algosdk.algosToMicroAlgos(10), undefined, undefined, params
    ),
    // User opt into new asset in case they haven't already
    // (No harm besides minuscule fee if they already are)
    algosdk.makeAssetTransferTxnWithSuggestedParams(
      userAddress, userAddress, undefined, undefined, 0, undefined, ASSET_ID, params
    ),
  ];
  const botTransactions = [
    algosdk.makeAssetTransferTxnWithSuggestedParams(
      BOT_ADDRESS, userAddress, undefined, undefined, 1, undefined, ASSET_ID, params
    ),
  ];
  algosdk.assignGroupId([...userTransactions, ...botTransactions]);
  const signedBotTransactions = botTransactions.map(txn => txn.sign(BOT_SK));
  const url = buildAlgTxUrl([...userTransactions, ...signedBotTransactions]);
  return url;
}
```

### Python

```python
from algosdk.v2client import algod
from algosdk.util import algos_to_microalgos
from algosdk import encoding
from algosdk.future.transaction import AssetTransferTxn, AssetOptInTxn, PaymentTxn, assign_group_id

ac = algod.AlgodClient(API_TOKEN, ALGOD_ADDRESS, API_HEADERS)
BOT_ADDRESS = 'SOMEALGOADDRESS...'
BOT_PK = 'Private Key of the bot'
ASSET_ID = 123456

def generate_link(user_addresss):
  params = ac.suggested_params()
  
  tx1 = PaymentTxn(
    user_address, params, BOT_ADDRESS, algos_to_microalgos(10)
  )
  tx2 = AssetOptInTxn(
    user_address, params, ASSET_ID
  )
  tx3 = AssetTransferTxn(
    BOT_ADDRESS, params, user_address, 1, ASSET_ID
  )
  assign_group_id([tx1, tx2, tx3])
  signed_tx3 = tx2.sign(BOT_PK)
  txns = [tx1, tx2, signed_tx3]

  encoded = [encoding.msgpack_encode(tx) for tx in txns]

  address = f"alg-tx.com/#/a/{';'.join(encoded)}"
```

## Closing

I appreciate all the support and encouragement that the algorand community has been.
I've made some real friends here, and have had a wonderful time learning new things, and being able to support some very talented and creative people.
As such it's not easy for me to say goodbye to this project, but I do have to be realistic.
For a wide variety of reasons, this is going to be where I leave the journey.
I am sharing this here hoping that some mark I've left is able to carry on, and continue to be something that helps people, and maybe in a small way, continue to build towards the promises of an open, accessible and fair Web3.

All the best.

SJK0-9
