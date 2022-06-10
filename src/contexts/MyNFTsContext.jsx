import React, { createContext, useState, useContext } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { getNftSummary } from '../utils/api/mintNFT';
import { nftKeys } from '../app/utils/query-keys';
import { useRouter } from 'next/router';
import { useAuthStore } from '../stores/authStore';

const MyNFTsContext = createContext(null);

const MyNFTsContextProvider = ({ children }) => {
  const { address, isAuthenticated, isAuthenticating } = useAuthStore(s => ({address: s.address, isAuthenticated: s.isAuthenticated, isAuthenticating: s.isAuthenticating}));
  const history = useRouter();

  const allCharactersFilter = 'All Characters';
  const polymorphsFilter = 'Polymorphs';

  const [collectionsIdAddressMapping, setCollectionsIdAddressMapping] = useState({});
  const [savedNfts, setSavedNfts] = useState([]);
  const [myNFTs, setMyNFTs] = useState([]);
  const [myMintingNFTs, setMyMintingNFTs] = useState([]);
  const [myUniversNFTsSearchPhrase, setMyUniversNFTsSearchPhrase] = useState('');
  const [myUniverseNFTsperPage, setMyUniverseNFTsPerPage] = useState(12);
  const [myUniverseNFTsActiverPage, setMyUniverseNFTsActiverPage] = useState(0);
  const [myUniverseNFTsOffset, setMyUniverseNFTsOffset] = useState(0);
  const [collectionFilter, setCollectionFilter] = useState(polymorphsFilter);
  const [myNFTsSelectedTabIndex, setMyNFTsSelectedTabIndex] = useState(0);
  const [myCollectionID, setMyCollectionID] = useState(null);
  const [universeNFTs, setUniverseNFTs] = useState([]);
  const [savedCollections, setSavedCollections] = useState([]);
  const [activeTxHashes, setActiveTxHashes] = useState([]);
  const [myMintingCollections, setMyMintingCollections] = useState([]);
  const [mintingNftsCount, setMintingNftsCount] = useState(0);
  const [mintingCollectionsCount, setMintingCollectionsCount] = useState(0);
  const [myMintableCollections, setMyMintableCollections] = useState([]);
  const [userPageNftsCount, setUserPageNftsCount] = useState(0);

  const { data: nftSummary } = useQuery(nftKeys.fetchNftSummary(address), getNftSummary, {
    enabled: !!address && isAuthenticated && !isAuthenticating,
  });

  const navigateToMyUniverseNFTsTab = (characterFilter) => {
    setCollectionFilter(characterFilter);
    setMyNFTsSelectedTabIndex(3);
    setMyUniverseNFTsActiverPage(0);
    setMyUniverseNFTsOffset(0);

    history.push('/my-nfts');
  };

  return (
    <MyNFTsContext.Provider
      value={{
        allCharactersFilter,
        polymorphsFilter,
        navigateToMyUniverseNFTsTab,
        collectionsIdAddressMapping,
        setCollectionsIdAddressMapping,
        savedNfts,
        setSavedNfts,
        myNFTs,
        setMyNFTs,
        myUniversNFTsSearchPhrase,
        setMyUniversNFTsSearchPhrase,
        myUniverseNFTsperPage,
        setMyUniverseNFTsPerPage,
        myUniverseNFTsActiverPage,
        setMyUniverseNFTsActiverPage,
        myUniverseNFTsOffset,
        setMyUniverseNFTsOffset,
        collectionFilter,
        setCollectionFilter,
        myNFTsSelectedTabIndex,
        setMyNFTsSelectedTabIndex,
        myCollectionID,
        setMyCollectionID,
        universeNFTs,
        setUniverseNFTs,
        savedCollections,
        setSavedCollections,
        activeTxHashes,
        setActiveTxHashes,
        myMintingNFTs,
        setMyMintingNFTs,
        myMintingCollections,
        setMyMintingCollections,
        mintingNftsCount,
        setMintingNftsCount,
        mintingCollectionsCount,
        setMintingCollectionsCount,
        myMintableCollections,
        setMyMintableCollections,
        nftSummary,
        userPageNftsCount,
        setUserPageNftsCount,
      }}
    >
      {children}
    </MyNFTsContext.Provider>
  );
};

MyNFTsContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

const useMyNftsContext = () => {
  const context = useContext(MyNFTsContext);

  if (!context) {
    throw new Error('useMyNftsContext was used outside of its Provider');
  }

  return context;
};

export { MyNFTsContextProvider, useMyNftsContext };
