import React from 'react';
import CopyButton from '../components/CopyButton';

const AddressBox = ({ address }: { address: string }) => (
  <div className="flex justify-between items-center gap-2">
    <div className="code-block select-all overflow-x-scroll">{address}</div>
    <CopyButton copyText={address} />
  </div>
);

export default AddressBox;
