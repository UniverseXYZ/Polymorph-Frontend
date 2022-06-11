import { TokenTicker } from '../enums';
import { IToken } from '../types';

import ETHWhiteIcon from './../../assets/images/v2/tokens/ETH_white.svg';
import ETHIcon from './../../assets/images/v2/tokens/ETH_white.svg';
import USDCIcon from './../../assets/images/v2/tokens/USDC.svg';
import DAIIcon from './../../assets/images/v2/tokens/DAI.svg';
import XYZIcon from './../../assets/images/v2/tokens/XYZ.svg';
import WETHIcon from './../../assets/images/v2/tokens/WETH.svg';
import { ZERO_ADDRESS } from './zero-address';

export const TOKENS_MAP: Record<TokenTicker, IToken> = {
  [TokenTicker.ETH]: {
    ticker: TokenTicker.ETH,
    decimals: 18,
    name: 'Ethereum',
    icons: [ETHWhiteIcon, ETHIcon],
    coingeckoId: 'ethereum'
  },
  [TokenTicker.USDC]: {
    ticker: TokenTicker.USDC,
    // USDC Rinkeby Token has 18 decimals, mainnet has 6
    decimals: process.env.REACT_APP_NETWORK_CHAIN_ID === "1" ? 6 : 18,
    name: 'USDC Coin',
    icons: [USDCIcon],
    contractName: 'USDC',
    coingeckoId: 'usd-coin'
  },
  [TokenTicker.DAI]: {
    ticker: TokenTicker.DAI,
    decimals: 18,
    name: 'DAI Stablecoin',
    icons: [DAIIcon],
    contractName: 'DAI',
    coingeckoId: 'dai'
  },
  [TokenTicker.XYZ]: {
    ticker: TokenTicker.XYZ,
    decimals: 18,
    name: 'XYZ Governance Token',
    icons: [XYZIcon],
    contractName: 'XYZ',
    coingeckoId: 'universe-xyz'
  },
  [TokenTicker.WETH]: {
    ticker: TokenTicker.WETH,
    decimals: 18,
    name: 'Wrapped Ether',
    icons: [WETHIcon],
    contractName: 'WrappedEther',
    coingeckoId: 'ethereum'
  },
};

export const TOKENS = Object.keys(TOKENS_MAP).map((ticker) => TOKENS_MAP[ticker as TokenTicker]);

export const getTokenByAddress = (tokenAddress: string | null | undefined) => {
  return  TOKENS_MAP[TokenTicker.ETH];
}

export const getTokenAddressByTicker = (ticker: TokenTicker) => {
    return ZERO_ADDRESS;
}
