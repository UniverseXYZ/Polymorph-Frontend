import { ethers } from 'ethers';

export const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const formatEtherWithDecimals = (ether, decimals) => {
  const parsed = +ethers.utils.formatEther(ether);
  return decimals ? parsed.toFixed(decimals) : parsed;
};

export const shortenEnsDomain = (ens) => {
  const ensArray = ens.split('.eth');
  if (ensArray[0].length < 15) return ens;
  return `${ensArray[0].substring(0, 12)}...eth`;
};

export const shortenEthereumAddress = (address) =>
  `${address?.substring(0, 4)}...${address?.substring(address?.length - 3, address?.length)}`;

export const toFixed = (num, fixed) => {
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)[0];
};

export const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
