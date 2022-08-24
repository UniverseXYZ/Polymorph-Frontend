import create from "zustand";
import { getERC20PriceCoingecko, getEthPriceCoingecko } from "../utils/api/etherscan";
import { TokenTicker } from "../utils/enums";
import { useUserBalanceStore } from "./balanceStore";

interface IErc20PriceStoreState {
  // Getters
  ethUsdPrice: number;
  daiUsdPrice: number;
  usdcUsdPrice: number;
  xyzUsdPrice: number;
  wethUsdPrice: number;
  maticUsdPrice: number;

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
  maticUsdPrice: 0,
  // fetching functions
  fetchPrices: async () => {
    try {
      const [ethPrice] = await Promise.all([getEthPriceCoingecko()]);
      set(() => ({
        ethUsdPrice: ethPrice?.market_data?.current_price?.usd ?? 0,
      }));
      const newUsdPrice = get().ethUsdPrice;
      useUserBalanceStore.getState().setUsdEthBalance(newUsdPrice);

      const [maticPrice] = await Promise.all([
        getERC20PriceCoingecko("matic-network"),
      ]);
      set(() => ({
        maticUsdPrice: maticPrice?.market_data?.current_price?.usd ?? 0,
      }));
      const newUsdPriceMatic = get().maticUsdPrice;
      useUserBalanceStore.getState().setUsdMaticBalance(newUsdPriceMatic);
    } catch (err) {
      console.log("coingecko price fetching failed");
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
      case TokenTicker.MATIC:
        return get().maticUsdPrice;
      default:
        return get().ethUsdPrice;
    }
  },
}));
