import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'react-uuid';
// import SearchTokenIdField from '../input/SearchTokenIdField';

const NftEditions = ({ push, searchValue, nft, setSearchValue, collectionAddress }) => (
  <div className="editions">
    <p>{`${nft.tokenIds?.length ? nft.tokenIds.length : nft.numberOfEditions}/${
      nft.numberOfEditions
    }`}</p>
    {nft.tokenIds && nft.tokenIds.length ? (
      <div className="tokenIds-dropdown">
        {/* <SearchTokenIdField searchValue={searchValue} setSearchValue={setSearchValue} /> */}
        <ul className="tokenIds">
          {nft.tokenIds.filter((tokenId) => tokenId.toString().includes(searchValue)).length ? (
            <>
              {nft.tokenIds
                .filter((tokenId) => tokenId.toString().includes(searchValue))
                .map((tokenId) => (
                  <li
                    key={uuid()}
                    aria-hidden="true"
                    onClick={() => {
                      push(`/nft/${nft.collection?.address || collectionAddress}/${tokenId}`, {
                        nft,
                      });
                    }}
                  >{`#${tokenId}`}</li>
                ))}
            </>
          ) : (
            <p>No results</p>
          )}
        </ul>
        <div className="inset--bottom--shadow" />
      </div>
    ) : (
      <></>
    )}
  </div>
);

NftEditions.propTypes = {
  push: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  nft: PropTypes.oneOfType([PropTypes.object]).isRequired,
  setSearchValue: PropTypes.func.isRequired,
  collectionAddress: PropTypes.string.isRequired,
};
export default NftEditions;
