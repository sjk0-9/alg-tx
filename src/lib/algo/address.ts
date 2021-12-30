import { Address, encodeAddress } from 'algosdk';

export const shortenAddress = (address: string | Address | Buffer): string => {
  if (typeof address === 'string') {
    return `${address.slice(0, 6)}...${address.slice(54)}`;
  }
  if ('publicKey' in address) {
    return shortenAddress(encodeAddress(address.publicKey));
  }
  return shortenAddress(encodeAddress(address));
};
