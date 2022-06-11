import create, { GetState, Mutate, SetState, StoreApi } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type IThemeStore = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

const defaultTheme = {
  darkMode: false
}

export const useThemeStore = create<
  IThemeStore,
  SetState<IThemeStore>,
  GetState<IThemeStore>,
  Mutate<StoreApi<IThemeStore>, [['zustand/subscribeWithSelector', never]]>
>(subscribeWithSelector((set) => ({
  ...defaultTheme,
  setDarkMode: (darkMode) => {
    set(state => ({
      ...state,
      darkMode
    }))
  }
})))

useThemeStore.subscribe(s => s.darkMode, () => {
  const darkMode = useThemeStore.getState().darkMode;
})