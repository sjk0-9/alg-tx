import React, { useContext, useEffect, useState } from 'react';
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
import { NetworkContext } from '../../contexts';
import ExternalLink from '../../components/ExternalLink';

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
  const network = useContext(NetworkContext);
  // When switching or updating wallets, reset the name updates
  useEffect(() => {
    setNewWalletName(undefined);
  }, [wallet?.id]);

  const inputValue = newWalletName ?? (wallet?.name || '');

  const algoexplorerUrl =
    network === 'mainnet'
      ? `https://algoexplorer.io/address/${wallet?.address || ''}`
      : `https://testnet.algoexplorer.io/address/${wallet?.address || ''}`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Wallet: ${inputValue || shortenAddress(wallet?.address || '')}`}
      description={`See information and make edits to wallet ${
        wallet && walletName(wallet)
      }`}
    >
      <div className="flex flex-row gap-2">
        <ExternalLink to={algoexplorerUrl}>AlgoExplorer</ExternalLink>
        {network === 'testnet' && (
          <ExternalLink
            to={`https://bank.testnet.algorand.network/?account=${
              wallet?.address || ''
            }`}
          >
            Testnet Faucet
          </ExternalLink>
        )}
      </div>
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
