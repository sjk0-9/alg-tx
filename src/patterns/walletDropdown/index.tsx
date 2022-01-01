import React, { useContext, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  CashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  IdentificationIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
} from '@heroicons/react/solid';

import { Link } from 'react-router-dom';
import useWallets from '../../hooks/useWallets';
import { Wallet } from '../../hooks/useWallets/types';

import DisconnectWalletDialog from './disconnectModal';
import HelpDialog from './helpModal';
import { NetworkContext } from '../../contexts';
import { Networks } from '../../lib/algo/clients';
import EditWalletDialog from './editModal';
import { walletName } from '../../hooks/useWallets/utils';

type MenuButtonProps = {
  activeWallet: Wallet;
  open: boolean;
};

const MenuButtonWithWallet = ({ activeWallet, open }: MenuButtonProps) => (
  <Menu.Button className="menu-button">
    <div className="flex items-center gap-1">
      <CashIcon className="w-5 h-5 mr-1" />
      {walletName(activeWallet)}
      {open ? (
        <ChevronUpIcon className="w-5 h-5" />
      ) : (
        <ChevronDownIcon className="w-5 h-5" />
      )}
    </div>
  </Menu.Button>
);

const MenuButtonNoWallet = () => (
  <Menu.Button className="menu-button">Connect a wallet</Menu.Button>
);

type WalletRowProps = {
  wallet: Wallet;
  disconnectWallet: (wallet: Wallet) => void;
  setActiveWallet: (wallet: Wallet) => void;
  editWallet: (wallet: Wallet) => void;
};

const WalletRow = ({
  wallet,
  disconnectWallet,
  setActiveWallet,
  editWallet,
}: WalletRowProps) => (
  <div key={wallet.id} className="min-w-max relative">
    <Menu.Item>
      {({ active }) => (
        <div
          className={`menu-item ${active && 'menu-item-active'} pr-20`}
          onClick={() => setActiveWallet(wallet)}
        >
          <div className="flex flex-row items-center gap-3">
            {walletName(wallet)}
          </div>
        </div>
      )}
    </Menu.Item>
    <Menu.Item>
      {({ active }) => (
        <div
          onClick={e => {
            e.stopPropagation();
            editWallet(wallet);
          }}
          className="absolute inset-y-0 flex items-center justify-center cursor-pointer right-6 menu-item-margin"
        >
          <IdentificationIcon
            className={`w-4 h-4 text-subtle hover:text-subtle-h active:text-subtle-a ${
              active ? 'text-subtle-h' : ''
            }`}
          />
        </div>
      )}
    </Menu.Item>
    <Menu.Item>
      {({ active }) => (
        <div
          onClick={e => {
            e.stopPropagation();
            disconnectWallet(wallet);
          }}
          className="absolute inset-y-0 right-0 flex items-center justify-center cursor-pointer menu-item-margin"
        >
          <TrashIcon
            className={`w-4 h-4 text-subtle hover:text-red-600 active:text-red-700 ${
              active ? 'text-red-600' : ''
            }`}
          />
        </div>
      )}
    </Menu.Item>
  </div>
);

type AddWalletRowProps = { name: string; connector: () => Promise<void> };

const AddWalletRow = ({ name, connector }: AddWalletRowProps) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`menu-item ${active && 'menu-item-active'}`}
        onClick={connector}
      >
        <div className="flex flex-row items-center w-max gap-1">
          <PlusIcon className="w-5 h-5" />
          {name}
        </div>
      </button>
    )}
  </Menu.Item>
);

const SwitchNetworkRow = () => {
  const network = useContext(NetworkContext);
  const otherNetwork: Networks = network === 'mainnet' ? 'testnet' : 'mainnet';
  const link = otherNetwork === 'mainnet' ? '/' : '/testnet';

  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          className={`menu-item ${active && 'menu-item-active'}`}
          to={link}
          target="_blank"
        >
          <div className="flex flex-row items-center w-max gap-1">
            Use {otherNetwork}
            <ExternalLinkIcon className="w-5 h-5 text-subtle" />
          </div>
        </Link>
      )}
    </Menu.Item>
  );
};
const HelpRow = ({ onClick }: { onClick: () => void }) => (
  <Menu.Item>
    {({ active }) => (
      <button
        className={`menu-item ${active && 'menu-item-active'}`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center w-max gap-1">
          <QuestionMarkCircleIcon className="w-5 h-5 text-subtle" />
          Help
        </div>
      </button>
    )}
  </Menu.Item>
);

const WalletDropdown = () => {
  const { activeWallet, setActiveWallet, wallets, connectors } = useWallets();
  const [disconnectWallet, setDisconnectWallet] = useState<
    Wallet | undefined
  >();
  const [showDisconnectWallet, setShowDisconnectWallet] =
    useState<boolean>(false);
  const [editWallet, setEditWallet] = useState<Wallet | undefined>();
  const [showEditWallet, setShowEditWallet] = useState<boolean>(false);

  const [showHelp, setShowHelp] = useState<boolean>(false);

  return (
    <>
      <DisconnectWalletDialog
        open={showDisconnectWallet}
        wallet={disconnectWallet}
        onClose={() => setShowDisconnectWallet(false)}
      />
      <EditWalletDialog
        open={showEditWallet}
        wallet={editWallet}
        onClose={() => setShowEditWallet(false)}
        onDisconnect={() => {
          setShowEditWallet(false);
          setShowDisconnectWallet(true);
        }}
      />
      <HelpDialog open={showHelp} onClose={() => setShowHelp(false)} />
      <Menu as="div" className="menu-wrapper">
        {({ open }) => (
          <>
            {activeWallet ? (
              <MenuButtonWithWallet activeWallet={activeWallet} open={open} />
            ) : (
              <MenuButtonNoWallet />
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
                  <div className="menu-item-section">
                    {wallets.map(wallet => (
                      <WalletRow
                        key={wallet.id}
                        wallet={wallet}
                        setActiveWallet={setActiveWallet}
                        editWallet={w => {
                          setEditWallet(w);
                          setDisconnectWallet(w);
                          setShowEditWallet(true);
                        }}
                        disconnectWallet={w => {
                          setDisconnectWallet(w);
                          setShowDisconnectWallet(true);
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="menu-item-section">
                  <AddWalletRow
                    name="Algorand App"
                    connector={connectors.walletConnect}
                  />
                  <AddWalletRow
                    name="My Algo Wallet"
                    connector={connectors.myAlgo}
                  />
                </div>
                <div className="menu-item-section">
                  <SwitchNetworkRow />
                </div>
                <div className="menu-item-section">
                  <HelpRow onClick={() => setShowHelp(true)} />
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
