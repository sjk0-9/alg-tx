import algosdk, { TransactionType } from 'algosdk';
import {
  deserialiseTx,
  SerialisedTransaction,
  serialiseTx,
} from '../../../src/lib/algo/parser';
import {
  makeUnfinishedPaymentTransaction,
  UnfinishedTransaction,
} from '../../../src/lib/algo/unfinishedTx';

const accA = algosdk.generateAccount();
const accB = algosdk.generateAccount();
const defaultSuggestedParams: algosdk.SuggestedParams = {
  flatFee: true,
  fee: 1000,
  firstRound: 0,
  lastRound: 0,
  genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
  genesisID: 'testnet-v1.0',
};

describe('algo parser', () => {
  describe('serialiseTx', () => {
    it('should take an unfinished transaction and get an object from it', () => {
      const unfinishedTx: UnfinishedTransaction =
        makeUnfinishedPaymentTransaction(
          {
            to: accB.addr,
            amount: 1000,
          },
          {
            note: 'Say something nice',
          }
        );
      const serialisedTx = serialiseTx(unfinishedTx);
      expect(serialisedTx).toEqual({
        p: {
          c: { note: 'Say something nice' },
        },
        u: {
          t: { to: accB.addr, amount: 1000 },
          type: 'pay',
        },
      });
    });
    it.todo('should take a finished transaction and get an object from it');
    it.todo('should take a singed transaction and get an object from it');
  });
  describe('deserialiseTx', () => {
    it.todo(
      'should take an unfinished object and get a transaction from it',
      () => {
        const serialised: SerialisedTransaction = {
          p: {
            c: { amount: 0 },
          },
          u: {
            t: {
              from: accA.addr,
              note: 'Hello World',
            },
            y: TransactionType.pay,
          },
        };
        const deserialisedTx = deserialiseTx(serialised);
      }
    );
    it.todo('should take a finished object and get a transaction from it');
    it.todo('should take a signed object and get a signed transaction from it');
  });
  it.todo('should be deterministic object -> transaction -> object');
  it.todo('should be deterministic transaction -> object -> transaction');
  it.todo(
    'should be deterministic signed transaction -> object -> signed transaction'
  );
});
