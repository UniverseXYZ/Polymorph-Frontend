/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import BridgePolymorphCard from "./BridgePolymorphCard";
import closeIcon from "../../assets/images/close-menu.svg";
import RarityChartsLoader from "../../containers/rarityCharts/RarityChartsLoader";
import { Button } from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroller";
import Image from "next/image";
import ethIcon from "../../assets/images/eth--icon--blue.png";
import arrowUp from "../../assets/images/arrow-down.svg";
import searchIcon from "../../assets/images/search--icon.png";
import polygonIcon from "../../assets/images/polygon--icon.png";
import RaritySearchField from "../input/RaritySearchField";
import crossIcon from "../../assets/images/cross-icon.png";

const List = ({
  data,
  searchText,
  setSearchText,
  resetPagination,
  perPage,
  offset,
  isLastPage,
  setPerPage,
  setOffset,
  setApiPage,
  setIsLastPage,
  categories,
  setCategories,
  categoriesIndexes,
  setCategoriesIndexes,
  setFilter,
  filter,
  loading,
  results,
  apiPage,
  getSelectedCards,
  selectedNetwork,
  setSelectedNetwork,
}) => {
  const sliceData = data?.slice(offset, offset + perPage) || [];
  const emptySlots = perPage - sliceData.length || 4;
  const [showClearALL, setShowClearALL] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const removeSelectedCardById = (tokenId) => {
    const newSelectedCards = selectedCards.filter(
      (card) => card.tokenId !== tokenId
    );
    setSelectedCards(newSelectedCards);
  };

  useEffect(() => {
    if (selectedCards.length <= 20) {
      getSelectedCards([selectedCards]);
    }
  }, [selectedCards]);

  useEffect(() => {
    let check = false;
    categories.forEach((item) => {
      const res = item.traits.filter((i) => i.checked);
      if (res.length) {
        check = true;
      }
    });
    if (check) {
      setShowClearALL(true);
    } else {
      setShowClearALL(false);
    }
  }, [categories]);

  useEffect(() => {
    setSelectedCards([]);
  }, [selectedNetwork]);

  return (
    <>
      <div className="bridge--list">
        <div className="list">
          <div className="network--and--search--wrapper">
            <div className="network--select">
              <div>From Network</div>
              <button onClick={() => setDropdownOpened(!dropdownOpened)}>
                {selectedNetwork === "ethereum" && (
                  <>
                    <Image src={ethIcon} width={24} height={24} />
                    Ethereum
                    <Image src={arrowUp} width={10} height={10} />
                  </>
                )}
                {selectedNetwork === "polygon" && (
                  <>
                    <Image src={polygonIcon} width={24} height={24} />
                    Polygon
                    <Image src={arrowUp} width={10} height={10} />
                  </>
                )}
              </button>
              {dropdownOpened && (
                <div className="network--dropdown">
                  <button
                    onClick={() => {
                      setSelectedNetwork("ethereum");
                      setDropdownOpened(false);
                    }}
                  >
                    <Image src={ethIcon} width={24} height={24} />
                    Ethereum
                  </button>
                  <button
                    onClick={() => {
                      setSelectedNetwork("polygon");
                      setDropdownOpened(false);
                    }}
                  >
                    <Image src={polygonIcon} width={24} height={24} />
                    Polygon
                  </button>
                </div>
              )}
            </div>
            <div className="search">
              <div
                className={`search--field--wrapper ${
                  showSearchInput ? "search--field--wrapper--expand" : ""
                }`}
              >
                <RaritySearchField
                  placeholder="Search items"
                  searchText={searchText}
                  setSearchText={setSearchText}
                  setApiPage={setApiPage}
                  resetPagination={resetPagination}
                />
              </div>
              <button onClick={() => setShowSearchInput(!showSearchInput)}>
                <Image
                  src={showSearchInput ? crossIcon : searchIcon}
                  width={40}
                  height={40}
                />
              </button>
            </div>
          </div>
          {loading && !isLastPage ? (
            <div className="bridge--grid">
              <RarityChartsLoader number={9} />
            </div>
          ) : results.length ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={() => setPerPage(perPage + 8)}
              hasMore={data.length >= perPage ? true : false}
              loader={<div key={0}>Loading ...</div>}
              useWindow={false}
            >
              <div className="bridge--grid">
                {sliceData.map((item, i) => (
                  <BridgePolymorphCard
                    key={item.tokenid}
                    item={item}
                    index={offset + i + 1}
                    selected={selectedCards.some(
                      (card) => card.tokenId === item.tokenid
                    )}
                    setSelected={() =>
                      selectedCards.some(
                        (card) => card.tokenId === item.tokenid
                      )
                        ? removeSelectedCardById(item.tokenid)
                        : selectedCards.length < 20
                        ? setSelectedCards([
                            ...selectedCards,
                            { tokenId: item.tokenid, imageUrl: item.imageurl },
                          ])
                        : null
                    }
                  />
                ))}
                {isLastPage ? (
                  <RarityChartsLoader number={emptySlots} />
                ) : (
                  <></>
                )}
              </div>
            </InfiniteScroll>
          ) : (
            <div className="bridge--no--nfts--found">
              <p>No Polymorph could be found :’(</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

List.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]).isRequired,
  perPage: PropTypes.number.isRequired,
  apiPage: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  isLastPage: PropTypes.bool.isRequired,
  setOffset: PropTypes.func.isRequired,
  setApiPage: PropTypes.func.isRequired,
  setIsLastPage: PropTypes.func.isRequired,
  setPerPage: PropTypes.func.isRequired,
  categories: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategories: PropTypes.func.isRequired,
  categoriesIndexes: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setCategoriesIndexes: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  filter: PropTypes.oneOfType([PropTypes.array]).isRequired,
  results: PropTypes.oneOfType([PropTypes.array]).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default List;
