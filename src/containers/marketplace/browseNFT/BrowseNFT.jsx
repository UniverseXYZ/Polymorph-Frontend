import React, { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import SaleType from '../../../components/marketplace/browseNFT/sidebarFiltration/SaleType';
import Price from '../../../components/marketplace/browseNFT/sidebarFiltration/Price';
import Collections from '../../../components/marketplace/browseNFT/sidebarFiltration/Collections';
import Creators from '../../../components/marketplace/browseNFT/sidebarFiltration/Creators';
import Submenu from '../../../components/submenu/Submenu';
import AppContext from '../../../ContextAPI';
import './BrowseNFT.scss';
import SelectedFiltersAndSorting from '../../../components/marketplace/browseNFT/selectedFiltersAndSorting/SelectedFiltersAndSorting';
import VerifiedOnly from '../../../components/marketplace/browseNFT/sidebarFiltration/VerifiedOnly';
import NFTsList from '../../../components/marketplace/browseNFT/NFTsList';
import { PLACEHOLDER_MARKETPLACE_NFTS } from '../../../utils/fixtures/BrowseNFTsDummyData';
import ReportPopup from '../../../components/popups/ReportPopup';

const BrowseNFT = () => {
  const { setDarkMode } = useContext(AppContext);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [saleTypeButtons, setSaleTypeButtons] = useState([
    {
      text: 'Buy now',
      description: 'Fixed price sale',
      selected: false,
    },
    {
      text: 'On Auction',
      description: 'You can place bids',
      selected: false,
    },
    {
      text: 'New',
      description: 'Recently added',
      selected: false,
    },
    {
      text: 'Has Offers',
      description: 'High is demand',
      selected: false,
    },
  ]);
  const [savedCollections, setSavedCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [savedCreators, setSavedCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);

  useEffect(() => {
    setDarkMode(false);
  }, []);

  return (
    <div className="browse--nft--page">
      {/* <Submenu title="NFT Marketplace" subtitles={['Browse NFTs', 'Activity']} /> */}
      <div className="browse--nft--grid">
        {/* <div className="browse--nft--sidebar--filtration" hidden>
          <SaleType saleTypeButtons={saleTypeButtons} setSaleTypeButtons={setSaleTypeButtons} />
          <Price setSelectedPrice={setSelectedPrice} />
          <Collections selectedColl={savedCollections} setSelectedColl={setSavedCollections} />
          <Creators selectedCreators={selectedCreators} setSelectedCreators={setSelectedCreators} />
          <VerifiedOnly />
        </div> */}
        <div className="browse--nft--content">
          <SelectedFiltersAndSorting
            saleTypeButtons={saleTypeButtons}
            setSaleTypeButtons={setSaleTypeButtons}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
            savedCollections={savedCollections}
            setSavedCollections={setSavedCollections}
            selectedCollections={selectedCollections}
            setSelectedCollections={setSelectedCollections}
            savedCreators={savedCreators}
            setSavedCreators={setSavedCreators}
            selectedCreators={selectedCreators}
            setSelectedCreators={setSelectedCreators}
          />
          <NFTsList data={PLACEHOLDER_MARKETPLACE_NFTS} />
          <Popup
            trigger={
              <button type="button" className="light-border-button load--more--nfts">
                Load More
              </button>
            }
          >
            {(close) => <ReportPopup onClose={close} />}
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default BrowseNFT;
