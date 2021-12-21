import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/solid';

import useWallets from '../../hooks/useWallets';
import { Wallet } from '../../hooks/useWallets/types';
import { shortenAddress } from '../../helpers/address';
import Dialog from '../../components/Dialog';

import '../../components/css/menuDropdown.css';
import '../../components/css/button.css';
import Spinner from '../../foundations/spinner';
import WrappedSpinner from '../../foundations/spinner/wrapped';

type MenuButtonProps = {
  activeWallet: Wallet;
  open: boolean;
  loading: boolean;
};

const MenuButtonWithWallet = ({
  activeWallet,
  open,
  loading,
}: MenuButtonProps) => (
  <Menu.Button className="menu-button">
    <WrappedSpinner loading={loading}>
      <div className="flex items-center gap-1">
        <CashIcon className="w-5 h-5 mr-1" />
        {shortenAddress(activeWallet.address)}
        {open ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </div>
    </WrappedSpinner>
  </Menu.Button>
);

const MenuButtonNoWallet = ({ loading }: { loading: boolean }) => (
  <Menu.Button className="menu-button">
    {loading ? <Spinner /> : 'Connect a wallet'}
  </Menu.Button>
);

type WalletRowProps = {
  wallet: Wallet;
  disconnectWallet: (wallet: Wallet) => void;
  setActiveWallet: (wallet: Wallet) => void;
};

const WalletRow = ({
  wallet,
  disconnectWallet,
  setActiveWallet,
}: WalletRowProps) => (
  <>
    <Menu.Item key={wallet.address}>
      {({ active }) => (
        <div
          className={`menu-item ${active && 'menu-item-active'}`}
          onClick={() => setActiveWallet(wallet)}
        >
          <div className="flex flex-row items-center gap-3">
            {shortenAddress(wallet.address)}
            <TrashIcon
              className="w-4 h-4 text-zinc-400 hover:text-red-600 active:text-red-700"
              onClick={e => {
                e.stopPropagation();
                disconnectWallet(wallet);
              }}
            />
          </div>
        </div>
      )}
    </Menu.Item>
  </>
);

type AddWalletRowProps = { name: string; connector: () => Promise<void> };

const AddWalletRow = ({ name, connector }: AddWalletRowProps) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`menu-item ${active && 'menu-item-active'}`}
        onClick={connector}
      >
        <div className="flex flex-row items-center gap-1">
          <PlusIcon className="w-5 h-5" />
          {name}
        </div>
      </button>
    )}
  </Menu.Item>
);

const DisconnectWalletDialog = ({
  wallet,
  onClose,
}: {
  wallet?: Wallet;
  onClose: () => void;
}) => (
  <Dialog
    open={!!wallet}
    onClose={onClose}
    title="Disconnect account"
    description={`This will disconnect your algorand wallet ${
      wallet && shortenAddress(wallet.address)
    }`}
  >
    <p className="my-2">
      Are you sure you want to disconnect your algorand wallet?
    </p>
    <p className="my-2">You can reconnect again via the connection menu.</p>
    <div className="flex flex-row justify-end mt-4 gap-2">
      <button onClick={onClose} className="btn-secondary">
        Cancel
      </button>
      <button
        className="btn-primary"
        onClick={async () => {
          await wallet?.disconnect();
          onClose();
        }}
      >
        Disconnect
      </button>
    </div>
  </Dialog>
);

const WalletDropdown = () => {
  const { activeWallet, setActiveWallet, wallets, connectors } = useWallets();
  const [disconnectWallet, setDisconnectWallet] = useState<
    Wallet | undefined
  >();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const wrappedConnector = (connector: () => Promise<void>) => async () => {
    setIsLoading(true);
    try {
      await connector();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DisconnectWalletDialog
        wallet={disconnectWallet}
        onClose={() => setDisconnectWallet(undefined)}
      />
      <Menu>
        {({ open }) => (
          <>
            {activeWallet ? (
              <MenuButtonWithWallet
                activeWallet={activeWallet}
                open={open}
                loading={isLoading}
              />
            ) : (
              <MenuButtonNoWallet loading={isLoading} />
            )}
            <Transition
              as={React.Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="menu-dropdown">
                {!!wallets.length && (
                  <div className="py-2">
                    {wallets.map(wallet => (
                      <WalletRow
                        key={wallet.address}
                        wallet={wallet}
                        setActiveWallet={setActiveWallet}
                        disconnectWallet={setDisconnectWallet}
                      />
                    ))}
                  </div>
                )}
                <div className="py-2">
                  <AddWalletRow
                    name="Algorand App"
                    connector={wrappedConnector(connectors.walletConnect)}
                  />
                  <AddWalletRow
                    name="My Algo Wallet"
                    connector={Promise.resolve}
                  />
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </>
  );
};

export default WalletDropdown;
