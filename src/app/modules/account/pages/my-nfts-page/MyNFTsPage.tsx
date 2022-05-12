import { Contract, utils } from 'ethers';
import React, { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { useClickAway, useTitle } from 'react-use';
import { useRouter } from 'next/router';

import useStateIfMounted from '../../../../../utils/hooks/useStateIfMounted';
import UniverseNFTs from '../../../../../components/myNFTs/UniverseNFTs';
import FiltersContextProvider from '../../../account/pages/my-nfts-page/components/search-filters/search-filters.context';
import { useAuthStore } from '../../../../../stores/authStore';
import Contracts from '../../../../../contracts/contracts.json';
import { useErrorStore } from '../../../../../stores/errorStore';
import { useThemeStore } from 'src/stores/themeStore';
import { usePolymorphStore } from 'src/stores/polymorphStore';
import { useMyNftsStore } from 'src/stores/myNftsStore';
 
// @ts-ignore
const { contracts } = Contracts[process.env.REACT_APP_NETWORK_CHAIN_ID];

export const MyNFTsPage = () => {
  const router = useRouter();
  const createButtonRef = useRef<HTMLButtonElement>(null);

  // Context hooks
  const {
    myNFTsSelectedTabIndex,
    setMyNFTsSelectedTabIndex,
    activeTxHashes,
    setActiveTxHashes,
  } = useMyNftsStore(s => ({
    myNFTsSelectedTabIndex: s.myNFTsSelectedTabIndex,
    setMyNFTsSelectedTabIndex: s.setMyNFTsSelectedTabIndex,
    activeTxHashes: s.activeTxHashes,
    setActiveTxHashes: s.setActiveTxHashes,
  }))


  const setDarkMode = useThemeStore(s => s.setDarkMode)

  const scrollContainer = useRef(null);

  // State hooks
  const [showLoading, setShowLoading] = useStateIfMounted(false);
  const [isDropdownOpened, setIsDropdownOpened] = useStateIfMounted(false);

  useTitle('My Polymorphs', { restoreOnUnmount: true });

  useClickAway(createButtonRef, () => {
    setIsDropdownOpened(false);
  });

  useEffect(() => {
    if (!showLoading) {
      setActiveTxHashes([]);
    }
  }, [showLoading]);

  useEffect(() => {
    setDarkMode(false);
  }, []);

  const renderIfNFTsExist = () => (
    <>
      <div className="mynfts__page__gradient">
        <div className="container mynfts__page__header">
          <h1 className="title">My Polymorphs</h1>
        </div>

      </div>

      {myNFTsSelectedTabIndex === 0 && (
        <FiltersContextProvider defaultSorting={0} >
          <UniverseNFTs scrollContainer={scrollContainer} />
        </FiltersContextProvider>
      )}
    </>
  );

  return (
    <>
      <div className="mynfts__page">{renderIfNFTsExist()}</div>
    </>
  );
};
