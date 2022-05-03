import React, { useState, useEffect, useContext } from 'react';
// import './SelectNfts.scss';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import Button from '../button/Button';
import closeIconWhite from '../../assets/images/marketplace/close.svg';
import mp3Icon from '../../assets/images/mp3-icon.png';
import AppContext from '../../ContextAPI';
// import SearchFilters from '../nft/SearchFilters';
import RarityFilters from '../rarityCharts/filters/RarityFilters'
import { useSearchPolymorphs } from '../../utils/hooks/useRarityDebouncer'
import { categoriesArray } from '../../containers/rarityCharts/categories';
import NFTCard from '../nft/NFTCard';

const SelectNfts = (props) => {
  // const { myNFTs, setSellNFTBundleEnglishAuctionData } = useContext(AppContext);
  const { stepData, setStepData, bundleData } = props;
  const [selectedNFTsIds, setSelectedNFTsIds] = useState([]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState([]);
  const router = useRouter();

  const {
    inputText,
    setInputText,
    apiPage,
    setApiPage,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
    filter,
    setFilter,
    search,
    results,
    isLastPage,
    setIsLastPage,
  } = useSearchPolymorphs();

  const [categories, setCategories] = useState(categoriesArray);
  const [categoriesIndexes, setCategoriesIndexes] = useState([]);
  const [offset, setOffset] = useState(0);


  const handleCategoryFilterChange = (idx, traitIdx) => {
    const newCategories = [...categories];
    const attribute = newCategories[idx];
    const trait = attribute.traits[traitIdx];
    trait.checked = !trait.checked;
    setCategories(newCategories);
    let newFilter = [];
    if (trait.checked) {
      newFilter = [...filter, [attribute.value, trait.name]];
    } else if (attribute.value === 'righthand' || attribute.value === 'lefthand') {
      newFilter = filter.filter((f) => !(f[0] === attribute.value && f[1] === trait.name));
    } else {
      newFilter = filter.filter((f) => f[1] !== trait.name);
    }
    setFilter(newFilter);
  };

  const resetPagination = () => {
    // setMyUniverseNFTsActiverPage(0);
    setOffset(0);
  };

  const clickContinue = () => {
    let dataBundleSale = bundleData;
    dataBundleSale = { ...dataBundleSale, selectedNfts: selectedGalleryItem };
    setStepData({ ...stepData, settings: { ...dataBundleSale } });
    setSellNFTBundleEnglishAuctionData(bundleData);
    router.push('/nft-marketplace/summary');
  };

  // useEffect(() => {
  //   const getSelectedNFTs = [];
  //   myNFTs.forEach((nft) => {
  //     if (selectedNFTsIds.includes(nft.id)) {
  //       getSelectedNFTs.push(nft);
  //     }
  //   });
  //   setSelectedGalleryItem(getSelectedNFTs);
  // }, [selectedNFTsIds]);

  return (
    <div className="select--nfts--container">
      {/* {stepData.selectedItem !== 'single' ? ( */}
        <>
          <div className="section--title--block">
            <h3 className="section--title">Choose Polymorphs</h3>
            <p className="section--hint--text">
            Select polymorphs you’d like to burn from your wallet. 
            You can burn up to 20 Polymorphs at a time.
            </p>
          </div>
          <RarityFilters
            setSortField={setSortField}
            searchText={inputText}
            setSearchText={setInputText}
            setSortDir={setSortDir}
            sortDir={sortDir}
            setApiPage={setApiPage}
            resetPagination={resetPagination}
            categories={categories}
            setCategories={setCategories}
            categoriesIndexes={categoriesIndexes}
            setCategoriesIndexes={setCategoriesIndexes}
            resultsCount={results.length}
            handleCategoryFilterChange={handleCategoryFilterChange}
            setFilter={setFilter}
            filter={filter}
          />
          {/* {myNFTs.filter((nft) => !nft.hidden).length ? ( */}
            {/* <> */}
              {/* <SearchFilters data={myNFTs} /> */}
              {/* <div className="nfts__lists">
                {myNFTs
                  .filter((nft) => !nft.hidden)
                  .map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      canSelect
                      selectedNFTsIds={selectedNFTsIds}
                      setSelectedNFTsIds={setSelectedNFTsIds}
                    />
                  ))}
              </div> */}
            {/* </> */}
          {/* ) : ( */}
            {/* <></> */}
          {/* )} */}
        </>
      {/* ) : (
        <></>
      )} */}
      <div className="select--nfts--footer">
        <div className="select--nfts--footer--container">
          <div className="selected--nft--block">
            {selectedGalleryItem.map((elem, index) => (
              <div className="selected--nft--item" key={elem}>
                {elem.media.type === 'image/png' && (
                  <img src={URL.createObjectURL(elem.media)} alt="img" />
                )}
                {elem.media.type === 'audio/mpeg' && <img src={mp3Icon} alt="img" />}
                {elem.media.type === 'video/mp4' && (
                  <video
                    onMouseOver={(event) => event.target.play()}
                    onFocus={(event) => event.target.play()}
                    onMouseOut={(event) => event.target.pause()}
                    onBlur={(event) => event.target.pause()}
                    muted
                  >
                    <source src={URL.createObjectURL(elem.media)} type="video/mp4" />
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div
                  className="close--icon"
                  aria-hidden="true"
                  onClick={() => setSelectedNFTsIds(selectedNFTsIds.filter((i) => i !== elem.id))}
                >
                  <img src={closeIconWhite} alt="img" />
                </div>
              </div>
            ))}
          </div>
          <div className="buttons--group">
            <Button
              className="light-border-button"
              onClick={() => router.push('/nft-marketplace/select-method')}
            >
              Back
            </Button>
            <Button
              className="light-button"
              // disabled={
              //   !bundleData.startPrice ||
              //   !bundleData.endPrice ||
              //   !bundleData.bundleName ||
              //   !selectedGalleryItem.length
              // }
              onClick={clickContinue}
            >
              Burn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

SelectNfts.propTypes = {
  stepData: PropTypes.oneOfType([PropTypes.object]).isRequired,
  setStepData: PropTypes.func,
  bundleData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

SelectNfts.defaultProps = {
  setStepData: () => {},
};

export default SelectNfts;
