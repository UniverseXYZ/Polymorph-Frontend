import { Contract, utils } from 'ethers';
import React, { useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { useClickAway, useTitle } from 'react-use';
import { useRouter } from 'next/router';

import useStateIfMounted from '../../../../../utils/hooks/useStateIfMounted';
import { getNftSummary } from '../../../../../utils/api/mintNFT';
import Tabs from '../../../../../components/tabs/Tabs';
import LoadingPopup from '../../../../../components/popups/LoadingPopup';
import plusIcon from '../../../../../assets/images/plus.svg';
import Wallet from '../../../../../components/myNFTs/Wallet';
import SavedNFTs from '../../../../../components/myNFTs/SavedNFTs';
import UniverseNFTs from '../../../../../components/myNFTs/UniverseNFTs';
import NFTsActivity from '../../../../../components/myNFTs/NFTsActivity';
import { WalletTab } from './components';
import FiltersContextProvider from '../../../account/pages/my-nfts-page/components/search-filters/search-filters.context';
import { useAuthStore } from '../../../../../stores/authStore';
import Contracts from '../../../../../contracts/contracts.json';
import { useErrorStore } from '../../../../../stores/errorStore';
import { useThemeStore } from 'src/stores/themeStore';
import { usePolymorphStore } from 'src/stores/polymorphStore';
import { useMyNftsStore } from 'src/stores/myNftsStore';
import { useQuery } from 'react-query';
import { nftKeys } from '@app/utils/query-keys';
 
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

  const userPolymorphs = usePolymorphStore(s => s.userPolymorphs)

  const { signer, address } = useAuthStore(state => ({
    signer: state.signer,
    address: state.address
  }));

  const { setShowError, setErrorTitle, setErrorBody } = useErrorStore(s => ({setShowError: s.setShowError, setErrorTitle: s.setErrorTitle, setErrorBody: s.setErrorBody}))

  const setDarkMode = useThemeStore(s => s.setDarkMode);

  const {isAuthenticated, isAuthenticating} = useAuthStore(s => ({isAuthenticated: s.isAuthenticated, isAuthenticating: s.isAuthenticating}))

  const scrollContainer = useRef(null);

  const { data: nftSummary } = useQuery(nftKeys.fetchNftSummary(address), getNftSummary, {
    enabled: !!address && isAuthenticated && !isAuthenticating,
  });

  // State hooks
  const [totalNfts, getTotalNfts] = useState<string | number>('-');
  const [showLoading, setShowLoading] = useStateIfMounted(false);
  const [showCongratsMintedSavedForLater, setShowCongratsMintedSavedForLater] = useStateIfMounted(false);
  const [isDropdownOpened, setIsDropdownOpened] = useStateIfMounted(false);

  const tabs = [
    { name: 'Wallet', amount: totalNfts },
    // { name: 'Universe Collections', amount: nftSummary?.collections },
    // { name: 'Saved NFTs', amount: nftSummary?.savedNfts },
    // { name: 'Universe NFTs', amount: (userPolymorphs.length || 0) },
  ];

  // NEW
  const [selectedSavedNfts, setSelectedSavedNfts] = useStateIfMounted([]);

  const [triggerRefetch, setTriggerRefetch] = useStateIfMounted(false);

  useTitle('Universe - My NFTs', { restoreOnUnmount: true });

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

  const renderTabsWrapper = () => (
    <Tabs
      scrollContainer={scrollContainer}
      items={tabs.map(({ name, amount }, index) => ({
        name,
        active: myNFTsSelectedTabIndex === index,
        handler: setMyNFTsSelectedTabIndex.bind(this, index),
        length: amount,
      }))}
    />
  );

  const renderPopups = () => (
    <>
      <Popup closeOnDocumentClick={false} open={showLoading}>
        <LoadingPopup
          text="The transaction is in progress. Keep this window opened. Navigating away from the page will reset the current progress."
          onClose={() => setShowLoading(false)}
          contractInteraction
        />
      </Popup>
    </>
  );

  const renderIfNFTsExist = () => (
    <>
      <div className="mynfts__page__gradient">
        <div className="container mynfts__page__header">
          <h1 className="title">My NFTs</h1>
          <div className="create__mint__btns">
            {myNFTsSelectedTabIndex === 3 && (
              <button
                type="button"
                className="light-border-button light--button--mobile"
                onClick={() => router.push('/polymorph-rarity')}
              >
                Polymorph rarity chart
              </button>
            )}
            {/* {myNFTsSelectedTabIndex !== 2 && (
              <button
                type="button"
                ref={createButtonRef}
                className={`create--nft--dropdown  ${
                  isDropdownOpened ? 'opened' : ''
                } light-button light--button--mobile`}
                onClick={() => setIsDropdownOpened(!isDropdownOpened)}
                aria-hidden="true"
              >
                Create
                <img src={plusIcon} alt="icon" />
                {isDropdownOpened && (
                  <div className="sort__share__dropdown">
                    <ul>
                      <li
                        aria-hidden="true"
                        onClick={() => router.push('/my-nfts/create?tabIndex=1&nftType=single')}
                      >
                        NFT
                      </li>
                      <li
                        aria-hidden="true"
                        onClick={() => router.push('/my-nfts/create?tabIndex=1&nftType=collection')}
                      >
                        Collection
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            )} */}
          </div>
        </div>
        {renderTabsWrapper()}
      </div>

      {myNFTsSelectedTabIndex === 0 && (
        <FiltersContextProvider defaultSorting={0} >
          <WalletTab getTotalNfts={getTotalNfts} />
        </FiltersContextProvider>
      )}
      {/* <div className="container mynfts__page__body">
        {myNFTsSelectedTabIndex === 1 && <DeployedCollections scrollContainer={scrollContainer} />}
        {myNFTsSelectedTabIndex === 2 && (
          <SavedNFTs
            selectedSavedNfts={selectedSavedNfts}
            setSelectedSavedNfts={setSelectedSavedNfts}
            triggerRefetch={triggerRefetch}
            setTriggerRefetch={setTriggerRefetch}
            scrollContainer={scrollContainer}
          />
        )}
        {myNFTsSelectedTabIndex === 3 && <UniverseNFTs scrollContainer={scrollContainer} />}
        {myNFTsSelectedTabIndex === 6 && <NFTsActivity />}
      </div> */}
    </>
  );

  return (
    <>
      <div className="mynfts__page">{renderIfNFTsExist()}</div>
      {renderPopups()}
    </>
  );
};
