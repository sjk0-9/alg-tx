import React, { useEffect, useState } from 'react';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import Dialog from '../../components/Dialog';
import '../../components/css/button.css';
import { Wallet } from '../../hooks/useWallets/types';
import {
  walletName,
  prettyWalletType,
  shortenAddress,
} from '../../lib/helpers/wallet';
import AddressBox from '../AddressBox';
import { Label, TextInput } from '../../components/form';
import { InlineWrapper } from '../../components/form/wrappers';

const EditWalletDialog = ({
  open,
  wallet,
  onClose,
}: {
  open: boolean;
  wallet?: Wallet;
  onClose: () => void;
}) => {
  const [newWalletName, setNewWalletName] = useState<string | undefined>(
    undefined
  );
  // When switching or updating wallets, reset the name updates
  useEffect(() => {
    setNewWalletName(undefined);
  }, [wallet?.id]);

  const inputValue = newWalletName ?? (wallet?.name || '');
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Wallet: ${inputValue || shortenAddress(wallet?.address || '')}`}
      description={`See information and make edits to wallet ${
        wallet && walletName(wallet)
      }`}
    >
      <a
        href={`https://algoexplorer.io/address/${wallet?.address || ''}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex my-2 w-min"
      >
        AlgoExplorer
        <ExternalLinkIcon className="w-5 h-5" />
      </a>
      <p className="my-1">Wallet Type: {wallet && prettyWalletType(wallet)}</p>
      <div className="my-1">
        Address: <AddressBox address={wallet?.address || ''} />
      </div>
      <InlineWrapper>
        <Label htmlFor="name">Nickname (optional):</Label>
        <TextInput
          id="name"
          name="name"
          value={inputValue}
          onChange={e => setNewWalletName(e.currentTarget.value)}
        />
      </InlineWrapper>
      <div className="flex flex-row justify-between gap-2 mt-2">
        <button className="btn-danger">Disconnect</button>
        <div className="flex-grow" />
        <button className="btn-secondary">Cancel</button>
        <button className="btn-primary w-32">Save</button>
      </div>
    </Dialog>
  );
};

export default EditWalletDialog;
