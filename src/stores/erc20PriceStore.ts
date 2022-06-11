import create from "zustand";
import { getERC20PriceCoingecko, getEthPriceCoingecko } from "../utils/api/etherscan";
import { TokenTicker } from "../app/enums";
import { useUserBalanceStore } from "./balanceStore";

interface IErc20PriceStoreState {
  // Getters
  ethUsdPrice: number;
  daiUsdPrice: number;
  usdcUsdPrice: number;
  xyzUsdPrice: number;
  wethUsdPrice: number;

  // Helpers
  fetchPrices: () => void;
  getTokenPriceByTicker: (ticker: TokenTicker) => number;
}

export const useErc20PriceStore = create<IErc20PriceStoreState>((set, get) => ({
  // initial state
  ethUsdPrice: 0,
  daiUsdPrice: 0,
  usdcUsdPrice: 0,
  xyzUsdPrice: 0,
  wethUsdPrice: 0,
  // fetching functions
  fetchPrices: async () => {
    try {
      const [ethPrice, daiInfo, usdcInfo, xyzInfo, wethInfo] = await Promise.all([
        getEthPriceCoingecko(),
        getERC20PriceCoingecko('dai'),
        getERC20PriceCoingecko('usd-coin'),
        getERC20PriceCoingecko('universe-xyz'),
        getERC20PriceCoingecko('weth'),
      ]);
      
      set(() => ({
        ethUsdPrice: ethPrice?.market_data?.current_price?.usd ?? 0,
        daiUsdPrice: daiInfo?.market_data?.current_price?.usd ?? 0,
        usdcUsdPrice: usdcInfo?.market_data?.current_price?.usd ?? 0,
        xyzUsdPrice: xyzInfo?.market_data?.current_price?.usd ?? 0,
        wethUsdPrice: wethInfo?.market_data?.current_price?.usd ?? 0
      }));

      const newUsdPrice = get().ethUsdPrice;
      useUserBalanceStore.getState().setUsdEthBalance(newUsdPrice);
    } catch (err) {
      console.log('coingecko price fetching failed');
      console.log(err);
    }
  },
  // getters
  getTokenPriceByTicker: (ticker: TokenTicker) => {
    switch (ticker) {
      case TokenTicker.ETH:
        return get().ethUsdPrice;
      case TokenTicker.USDC:
        return get().usdcUsdPrice;
      case TokenTicker.DAI:
        return get().daiUsdPrice;
      case TokenTicker.WETH:
        return get().wethUsdPrice;
      case TokenTicker.XYZ:
        return get().xyzUsdPrice;
      default:
        return get().ethUsdPrice;
    }
  }
}))