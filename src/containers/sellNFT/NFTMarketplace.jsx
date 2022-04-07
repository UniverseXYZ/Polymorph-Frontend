import React, { useEffect } from 'react';
import './NFTMarketplace.scss';
import { useLocation } from 'react-router-dom';
import NewTabs from '../../components/tabs/NewTabs.jsx';
import SellNftSubHeader from '../../components/sellNft/sellNftSubHeader/SellNftSubHeader.jsx';
import SelectSellMethodTab from '../../components/sellNft/selectSellMethodTab/SelectSellMethodTab.jsx';
import SelectItemsMethodTab from '../../components/sellNft/selectItemsTab/SelectItemsMethodTab.jsx';
import DutchAuctionContainer from '../../components/sellNft/dutchAuction/DutchAuctionContainer.jsx';
import EnglishAuctionContainer from '../../components/sellNft/englishAuction/EnglishAuctionContainer.jsx';
import FixedListingContainer from '../../components/sellNft/fixedListing/FixedListingContainer.jsx';
import Summary from '../../components/sellNft/summary/Summary.jsx';
import selectSellMethodIconWhite from '../../assets/images/sellNft/select-sell-method-white.svg';
import selectSellMethodIconBlack from '../../assets/images/sellNft/select-sell-method-black.svg';
import RewardIconActive from '../../assets/images/ion_layers.svg';
import RewardIcon from '../../assets/images/ion_layers-disactive.svg';
import ReviewIcon from '../../assets/images/eye-review.svg';
import ReviewIconActive from '../../assets/images/eye-review-disactive.svg';
import SettingIconActive from '../../assets/images/settings-solid.svg';
import SettingIcon from '../../assets/images/setting-solid-disactive.svg';
import nftImage from '../../assets/images/marketplace/nfts/nft13.png';
// import { useMarketplaceContext } from '../../contexts/MarketplaceContext';
import { useThemeContext } from '../../contexts/ThemeContext';

const getContent = (type, data, setData) => {
  if (type === 'dutch') return <DutchAuctionContainer data={data} setData={setData} />;
  if (type === 'english') return <EnglishAuctionContainer data={data} setData={setData} />;
  if (type === 'fixedListing') return <FixedListingContainer data={data} setData={setData} />;
  return <h1>other type</h1>;
};

const NFTMarketplace = () => {
  const location = useLocation();
  // const { stepsData, setStepsData } = useMarketplaceContext();
  const { setDarkMode } = useThemeContext();
  const nftName = location.state?.name || 'NFT Name';

  const headerLabels = [
    {
      labelText: 'Select items',
      icon: RewardIcon,
      iconActive: RewardIconActive,
      route: '/nft-marketplace/select-items',
      index: 0,
      // content: <SelectItemsMethodTab onSelect={setStepsData} data={stepsData} />,
      home: true,
    },
    {
      labelText: 'Select sell method',
      icon: selectSellMethodIconBlack,
      iconActive: selectSellMethodIconWhite,
      route: '/nft-marketplace/select-method',
      index: 1,
      // content: <SelectSellMethodTab onSelect={setStepsData} data={stepsData} />,
      home: false,
    },
    {
      labelText: 'Settings',
      icon: SettingIcon,
      iconActive: SettingIconActive,
      route: '/nft-marketplace/settings',
      index: 2,
      // content: getContent(stepsData.selectedMethod, stepsData, setStepsData),
      home: false,
    },
    {
      labelText: 'Summary',
      icon: ReviewIcon,
      iconActive: ReviewIconActive,
      route: '/nft-marketplace/summary',
      index: 3,
      // content: <Summary nftImage={nftImage} data={stepsData} />,
      home: false,
    },
  ];

  useEffect(() => {
    setDarkMode(false);
  }, []);

  return (
    <div className="nft--marketplace">
      <SellNftSubHeader backPageName={nftName} title="Sell NFT" />
      <NewTabs tabData={headerLabels} />
      {location.pathname === '/nft-marketplace/select-items' && (
        <div className="before--footer--black--bg--section" />
      )}
    </div>
  );
};

export default NFTMarketplace;
