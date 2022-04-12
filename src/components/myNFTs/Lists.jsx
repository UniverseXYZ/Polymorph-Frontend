import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Animated } from 'react-animated-css';
import mp3Icon from '../../assets/images/mp3-icon.png';
import videoIcon from '../../assets/images/video-icon.svg';
import checkIcon from '../../assets/images/check-nft.svg';
import nonSelecting from '../../assets/images/nonSelecting.svg';
import vector from '../../assets/images/vector2.svg';
import universeIcon from '../../assets/images/universe-img.svg';

const Lists = ({
  data,
  perPage,
  offset,
  selectedNFTIds,
  setSelectedNFTIds,
  winners,
  nftsPerWinner,
}) => {
  const sliceData = data.slice(offset, offset + perPage);
  const location = useLocation();
  const isCreatingAction = location.pathname === '/create-tiers';

  const [openEditions, setOpenEditions] = useState(null);
  const [hideIcon, setHideIcon] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEditions, setSelectedEditions] = useState({});

  const tierById = !!(winners && nftsPerWinner);
  const editMode = auction?.rewardTiers?.find((element) => element.id === location.state);

  const activateInfo = (index) => {
    setHideIcon(true);
    setActiveIndex(index);
  };

  const handleSavedNfts = (clickedNFT) => {
    if (isCreatingAction) {
      if (tierById && winners <= clickedNFT.tokenIds.length && !clickedNFT.isUsed) {
        if (nftsPerWinner > selectedNFTIds.length || selectedNFTIds.includes(clickedNFT.id))
          setSelectedNFTIds((prevValue) => {
            const nftIndex = prevValue.findIndex((nft) => nft === clickedNFT.id);
            if (nftIndex !== -1) {
              return [...prevValue.slice(0, nftIndex), ...prevValue.slice(nftIndex + 1)];
            }
            return [...prevValue, clickedNFT.id];
          });
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      const newSelectedNFTIds = [];
      editMode.nfts.forEach((nft) => {
        newSelectedNFTIds.push(nft.id);
      });
      setSelectedNFTIds(newSelectedNFTIds);
    }
  }, []);

  const handleShow = (nft) => {
    if (tierById) {
      if (selectedNFTIds.includes(nft.id) && winners <= nft.tokenIds.length) {
        setOpenEditions(openEditions ? null : nft.id);
      }
    }
  };
  const handleSelectAll = (event, nftId) => {
    if (event.target.className === 'edition-container' || event.target.className === 'checkmark') {
      if (selectAll === false) {
        const changedNFT = sliceData.find((nft) => nft.id === nftId);

        setSelectedEditions({ ...selectedEditions, [nftId]: [...changedNFT.tokenIds] });
        setSelectAll(true);
      } else {
        setSelectedEditions({ ...selectedEditions, [nftId]: [] });
        setSelectAll(false);
      }
    }
  };
  const handleSelectEdition = (event, nftId, edition) => {
    if (event.target.className === 'edition-container' || event.target.className === 'checkmark') {
      if (!selectedEditions[nftId]?.includes(edition)) {
        const selectedEditionsByNftId = selectedEditions[nftId] ? selectedEditions[nftId] : [];

        setSelectedEditions({
          ...selectedEditions,
          [nftId]: [...selectedEditionsByNftId, edition],
        });
      } else {
        setSelectAll(false);
        setSelectedEditions({
          ...selectedEditions,
          [nftId]: selectedEditions[nftId]?.filter(
            (selectedEdition) => selectedEdition !== edition
          ),
        });
      }
    }
  };

  return (
    <div className="nfts__lists">
      {data
        .filter((nft) => !nft.hidden)
        .map((nft, index) => (
          <div style={{ position: 'relative' }} key={nft.id}>
            {tierById && winners > nft.tokenIds.length && !nft.isUsed ? (
              <>
                <img
                  className="nonicon__icon"
                  src={nonSelecting}
                  alt="Check Icon"
                  onMouseOver={() => activateInfo(index)}
                  onFocus={() => activateInfo(index)}
                  onMouseLeave={() => setHideIcon(false)}
                  onBlur={() => setHideIcon(false)}
                />
                {hideIcon && index === activeIndex && (
                  <Animated animationIn="zoomIn" style={{ position: 'relative', zIndex: 111 }}>
                    <div className="warning-text">
                      <p>
                        This NFT doesn&apos;t have enough editions to be entered into this tier. You
                        must have the equal amount of winners as NFTs available.
                      </p>
                    </div>
                  </Animated>
                )}
              </>
            ) : (
              <></>
            )}
            {nft.isUsed ? (
              <>
                <img
                  className="nonicon__icon"
                  src={nonSelecting}
                  alt="Check Icon"
                  onMouseOver={() => activateInfo(index)}
                  onFocus={() => activateInfo(index)}
                  onMouseLeave={() => setHideIcon(false)}
                  onBlur={() => setHideIcon(false)}
                />
                {hideIcon && index === activeIndex && (
                  <Animated animationIn="zoomIn" style={{ position: 'relative', zIndex: 111 }}>
                    <div className="warning-text">
                      <p>This NFT is already used in another auction.</p>
                    </div>
                  </Animated>
                )}
              </>
            ) : (
              <></>
            )}
            <div
              className={`nft__box ${selectedNFTIds.includes(nft.id) ? 'selected' : ''} ${
                (tierById && winners > nft.tokenIds.length) ||
                nft.isUsed ||
                (tierById &&
                  nftsPerWinner === selectedNFTIds.length &&
                  !selectedNFTIds.includes(nft.id))
                  ? 'disabled'
                  : ''
              }`}
              key={nft.id}
            >
              <div
                className="nft__box__image"
                onClick={() => handleSavedNfts(nft)}
                aria-hidden="true"
              >
                {isCreatingAction && (
                  <>
                    {selectedNFTIds.includes(nft.id) &&
                      tierById &&
                      winners <= nft.tokenIds?.length && (
                        <span className="selected-div">
                          <span className="selected-number">
                            {`${
                              nft.tokenIds.length === 1
                                ? '1/1'
                                : `${
                                    selectedEditions[nft.id] ? selectedEditions[nft.id].length : 0
                                  }/${nft.tokenIds.length}`
                            }`}
                          </span>
                          <img className="check__icon" src={checkIcon} alt="Check Icon" />
                        </span>
                      )}
                  </>
                )}
                {nft.artworkType && nft.artworkType.endsWith('mp4') && isCreatingAction && (
                  <video
                    onMouseOver={(event) => event.target.play()}
                    onFocus={(event) => event.target.play()}
                    onMouseOut={(event) => event.target.pause()}
                    onBlur={(event) => event.target.pause()}
                  >
                    <source src={nft.optimized_url} type="video/mp4" />
                    <track kind="captions" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {nft.artworkType && nft.artworkType.endsWith('mpeg') && isCreatingAction && (
                  <img className="preview-image" src={mp3Icon} alt={nft.name} />
                )}
                {nft.artworkType &&
                  !nft.artworkType.endsWith('mpeg') &&
                  !nft.artworkType.endsWith('mp4') &&
                  isCreatingAction && (
                    <img className="preview-image" src={nft.optimized_url} alt={nft.name} />
                  )}
                {nft.artworkType && !nft.artworkType.endsWith('mp4') && (
                  <img className="video__icon" src={videoIcon} alt="Video Icon" />
                )}
              </div>
              <div className={`nft__box__name ${isCreatingAction ? 'no__hover' : ''}`}>
                <h3 title={nft.name}>{nft.name}</h3>
                {!nft.collection || (nft.collection && isCreatingAction) ? (
                  nft.tokenIds.length > 1 ? (
                    <div className="collection__count">
                      {isCreatingAction && (
                        <>
                          <button
                            type="button"
                            className={
                              openEditions !== nft.id
                                ? 'editions-btn button'
                                : 'editions-btn selected button'
                            }
                            onClick={() => handleShow(nft)}
                          >
                            Edition #
                            <img
                              src={vector}
                              className={openEditions === nft.id && 'icon-up'}
                              alt="icon"
                            />
                          </button>
                          <ul className="editions-list" hidden={openEditions !== nft.id}>
                            <li disabled>Choose edition number</li>
                            <li>
                              <label
                                className="edition-container"
                                aria-hidden="true"
                                onClick={(event) => handleSelectAll(event, nft.id)}
                              >
                                Select All
                                <input type="checkbox" checked={selectAll} />
                                <span className="checkmark" />
                              </label>
                            </li>
                            {nft.tokenIds.map((edition) => (
                              <li key={edition}>
                                <label
                                  htmlFor={edition}
                                  className="edition-container"
                                  aria-hidden="true"
                                  onClick={(event) => handleSelectEdition(event, nft.id, edition)}
                                >
                                  {`#${edition}`}
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedEditions[nft.id]?.includes(edition) || selectAll
                                    }
                                    id={edition}
                                  />
                                  <span className="checkmark" />
                                </label>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {!(
                        selectedNFTIds.includes(nft.id) &&
                        tierById &&
                        winners <= nft.tokenIds.length
                      ) &&
                        !isCreatingAction && (
                          <div
                            className="generatedEditions"
                            style={{
                              gridTemplateColumns: `repeat(${Math.ceil(
                                nft.tokenIds.length / 10
                              )}, auto)`,
                            }}
                          >
                            {nft.tokenIds.map((edition) => (
                              <div key={edition}>{`#${edition}`}</div>
                            ))}
                          </div>
                        )}
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </div>
              <div className="nft__box__footer">
                <div className="collection__details">
                  {nft.collection && (
                    <>
                      {typeof nft.collection.coverUrl === 'string' &&
                      nft.collection.coverUrl.startsWith('#') ? (
                        <div
                          className="random__bg__color"
                          style={{ backgroundColor: nft.collection.coverUrl }}
                        >
                          {nft.collection.name.charAt(0)}
                        </div>
                      ) : nft.collection.symbol === 'NFUC' ? (
                        <img src={universeIcon} alt={nft.collection.name} />
                      ) : (
                        <img src={nft.collection.coverUrl} alt={nft.collection.name} />
                      )}
                      <span>{nft.collection.name}</span>
                    </>
                  )}
                </div>
                {nft.tokenIds.length > 1 ? (
                  <div className="collection__count">
                    {selectedNFTIds && selectedNFTIds.includes(nft.id)
                      ? `x${nft.tokenIds.length - winners}`
                      : `x${nft.tokenIds.length}`}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {nft.tokenIds.length > 1 && (
                <>
                  <div className="nft__box__highlight__one" />
                  <div className="nft__box__highlight__two" />
                </>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

Lists.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array]).isRequired,
  perPage: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  selectedNFTIds: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setSelectedNFTIds: PropTypes.func.isRequired,
  winners: PropTypes.number,
  nftsPerWinner: PropTypes.number,
};

Lists.defaultProps = {
  winners: null,
  nftsPerWinner: null,
};

export default Lists;
