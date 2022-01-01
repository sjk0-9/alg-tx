import { Address, encodeAddress } from 'algosdk';

export const stringAddress = (address: string | Address | Buffer): string => {
  if (typeof address === 'string') {
    return address;
  }
  if ('publicKey' in address) {
    return encodeAddress(address.publicKey);
  }
  return encodeAddress(address);
};

export const shortenAddress = (address: string | Address | Buffer): string => {
  const sAddress = stringAddress(address);
  return `${sAddress.slice(0, 6)}...${sAddress.slice(54)}`;
};
