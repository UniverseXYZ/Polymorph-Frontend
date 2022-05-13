import create from "zustand";

type IMyNftsStore = {
  // Constants
  allCharactersFilter: string,
  polymorphsFilter: string,

  // Getters
  myNFTs: [],
  savedNfts: [],
  myMintableCollections:[],
  activeTxHashes: [],
  myNFTsSelectedTabIndex: number,
  myUniverseNFTsActiverPage: number,
  myUniverseNFTsOffset: number,
  collectionFilter: string,

  // Setters
  setMyNFTs: (myNFTs: []) => void,
  setSavedNfts: (savedNfts: []) => void,
  setMyMintableCollections: (myMintableCollections: []) => void,
  setActiveTxHashes: (activeTxHashes: []) => void,
  setMyNFTsSelectedTabIndex: (myNFTsSelectedTabIndex: number) => void,
  setMyUniverseNFTsActiverPage: (myUniverseNFTsActiverPage: number) => void,
  setMyUniverseNFTsOffset: (myUniverseNFTsOffset: number) => void,
  setCollectionFilter: (collectionFilter: string) => void,

  // Helpers
  navigateToMyUniverseNFTsTab: (characterFilter: string) => void,
}

export const useMyNftsStore = create<IMyNftsStore>((set) => ({
  allCharactersFilter: "All Characters",
  polymorphsFilter: "Polymorphs",
  myNFTs: [],
  savedNfts: [],
  myMintableCollections: [],
  activeTxHashes: [],
  myNFTsSelectedTabIndex: 0,
  myUniverseNFTsActiverPage: 0,
  myUniverseNFTsOffset: 0,
  collectionFilter: "",
  setMyNFTsSelectedTabIndex: (myNFTsSelectedTabIndex) => {
    set(state => ({
      ...state,
      myNFTsSelectedTabIndex
    }))
  },
  setActiveTxHashes: (activeTxHashes) => {
    set(state => ({
      ...state,
      activeTxHashes
    }))
  },
  setMyNFTs: (myNFTs) => {
    set(state => ({
      ...state,
      myNFTs
    }))
  },
  setMyMintableCollections: (myMintableCollections) => {
    set(state => ({
      ...state,
      myMintableCollections
    }))
  },
  setSavedNfts: (savedNfts) => {
    set(state => ({
      ...state,
      savedNfts
    }))
  },
  setCollectionFilter: (collectionFilter) => {
    set(state => ({
      ...state,
      collectionFilter
    }))
  },
  setMyUniverseNFTsActiverPage: (myUniverseNFTsActiverPage) => {
    set(state => ({
      ...state,
      myUniverseNFTsActiverPage
    }))
  },
  setMyUniverseNFTsOffset: (myUniverseNFTsOffset) => {
    set(state => ({
      ...state,
      myUniverseNFTsOffset
    }))
  },
  navigateToMyUniverseNFTsTab: (characterFilter) => {
    set(state => ({
      ...state,
      collectionFilter: characterFilter,
      myNFTsSelectedTabIndex: 3,
      myUniverseNFTsActiverPage: 0,
      myUniverseNFTsOffset: 0
    }))
  },
}))