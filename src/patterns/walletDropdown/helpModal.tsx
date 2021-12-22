import React from 'react';
import Dialog from '../../components/Dialog';
import '../../components/css/button.css';

const HelpDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    title="Help"
    description="Help for connecting your algorand wallet"
  >
    <h3 className="py-2 font-medium">The Algorand App won&apos;t connect</h3>
    <p className="py-1">
      The WalletConnect service can be a bit difficult at times.
    </p>
    <p className="py-1">
      The QR code can&apos;t be read by your normal Camera or QR scan app. Make
      sure you&apos;e scanning the QR code from the official Algorand App.
    </p>
    <p className="py-1">
      If it still doesn&apos;t work, try quitting and reopening the wallet app
      and refreshing web page.
    </p>
    <h3 className="py-2 font-medium">I want to add another My Algo wallet</h3>
    <p className="py-1">Select &quot;Add My Algo Wallet&quot;.</p>
    <p className="py-1">
      In the pop-up window, before you log in, select &quot;Manage
      Accounts&quot;. Then log in, and select which accounts you want attached
      to brx.
    </p>
    <button
      className="float-right w-24 btn-secondary"
      onClick={async () => {
        onClose();
      }}
    >
      Ok
    </button>
  </Dialog>
);

export default HelpDialog;
