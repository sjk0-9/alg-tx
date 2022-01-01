import React from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import {
  microalgosToAlgos,
  encodeAddress,
  SignedTransaction,
  Transaction,
} from 'algosdk';
import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/react/outline';

type TransactionDetailsProps = {
  txn: Transaction;
  signedTranasction?: SignedTransaction;
};

const TXN_ROWS: (keyof Transaction)[] = [
  'type',
  'from',
  'to',
  'fee',
  'amount',
  'note',
  'group',
  'lease',
  'firstRound',
  'lastRound',
  'genesisID',
  'genesisHash',
  'closeRemainderTo',
  'reKeyTo',
  'voteKey',
  'selectionKey',
  'voteFirst',
  'voteLast',
  'voteKeyDilution',
  'assetIndex',
  'assetTotal',
  'assetDecimals',
  'assetDefaultFrozen',
  'assetManager',
  'assetReserve',
  'assetFreeze',
  'assetClawback',
  'assetUnitName',
  'assetName',
  'assetURL',
  'assetMetadataHash',
  'freezeAccount',
  'freezeState',
  'assetRevocationTarget',
  'appIndex',
  'flatFee',
  'nonParticipation',
  'extraPages',
  'txID',
];

const parseNumberObject = (
  row: keyof Transaction,
  value: number
): number | string => {
  switch (row) {
    case 'fee':
      return `${microalgosToAlgos(value)} ALGO`;
    default:
      return value;
  }
};

const parseRowObject = (
  key: keyof Transaction,
  value: Transaction[keyof Transaction]
): string | undefined => {
  if (typeof value === 'object' && 'publicKey' in value) {
    return encodeAddress(value.publicKey);
  }
  if (ArrayBuffer.isView(value) && value.length === 0) {
    return undefined;
  }
  if (ArrayBuffer.isView(value) && ['note', 'lease'].includes(key)) {
    return Buffer.from(value).toString();
  }
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value).toString('base64');
  }
  return JSON.stringify(value);
};
const transactionRows = ({ txn, signedTranasction }: TransactionDetailsProps) =>
  TXN_ROWS.map(property => {
    const value = txn[property];
    switch (typeof value) {
      case 'string':
        return { property, value };
      case 'number':
        return { property, value: parseNumberObject(property, value) };
      case 'bigint':
        return { property, value: parseNumberObject(property, Number(value)) };
      case 'boolean':
        return { property, value: value ? 'true' : 'false' };
      case 'object':
        return { property, value: parseRowObject(property, value) };
      case 'function':
        try {
          // @ts-ignore
          return { property, value: value.bind(txn)() };
        } catch (e) {
          return undefined;
        }
      default:
        return undefined;
    }
  }).filter(v => !!v && v.value !== undefined) as {
    property: keyof Transaction;
    value: Transaction[keyof Transaction];
  }[];

const TransactionTable = ({
  txn,
  signedTranasction,
}: TransactionDetailsProps) => (
  <table className="border-collapse table-auto">
    <thead>
      <tr>
        <th className="text-left">Property</th>
        <th className="text-left">Value</th>
      </tr>
    </thead>
    <tbody>
      {transactionRows({ txn, signedTranasction }).map(
        ({ property, value }) => (
          <tr key={property}>
            <td className="pr-2">{property}</td>
            <td className="pr-2">{value}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
);

const TransactionDetails = (props: TransactionDetailsProps) => (
  <div className="mt-2">
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full items-center gap-4 justify-between pb-2 text-sm text-subtle hover:text-subtle-h active:text-subtle-a">
            <div className="flex-grow" />
            {open ? (
              <>
                <ChevronDoubleUpIcon className="w-4 h-4" />
                Details
                <ChevronDoubleUpIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                <ChevronDoubleDownIcon className="w-4 h-4" />
                Details
                <ChevronDoubleDownIcon className="w-4 h-4" />
              </>
            )}
            <div className="flex-grow" />
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out origin-top"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition duration-75 ease-out origin-top"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
          >
            <Disclosure.Panel className="bottom overflow-x-scroll">
              <TransactionTable {...props} />
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  </div>
);

export default TransactionDetails;
