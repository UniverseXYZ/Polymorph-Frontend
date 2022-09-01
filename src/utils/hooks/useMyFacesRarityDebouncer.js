import React, { useContext, useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import { useAsyncAbortable } from 'react-async-hook';
import AppContext from '../../ContextAPI';
import useStateIfMounted from './useStateIfMounted';
import { usePolymorphStore } from 'src/stores/polymorphStore';

const buildRarityUrl = (
  page = 1,
  perPagee = 12,
  text = '',
  sortField = '',
  sortDir = '',
  filter = '',
  ids = [],
) => {
  let filterQuery = '';
  // eslint-disable-next-line prefer-const
  let bundledFilters = {};
  filter.forEach((f) => {
    const attr = f[0];
    let trait = f[1];

    // TODO: Fix these ugly ass workaround in the backend or front end
    if (trait === 'Astronaut Helmet') {
      trait = 'Astronnaut Helmet';
    } else if (trait === 'Bow & Arrow') {
      trait = 'Bow and Arrow';
    } else if (trait === 'Bow Tie & Suit') {
      trait = 'Bow Tie and Suit';
    } else if (trait === 'Suit & Tie') {
      trait = 'Suit and Tie';
    } else if (trait === 'Tennis Socks & Shoes') {
      trait = 'Tennis Socks and Shoes';
    }
    // const existingTraits = bundledFilters[attr] ? [...bundledFilters[attr]]
    bundledFilters[attr] = bundledFilters[attr] ? [...bundledFilters[attr], trait] : [trait];
  });

  Object.keys(bundledFilters).forEach((attr) => {
    const traits = bundledFilters[attr];
    let attrQuery = '';
    if (traits.length === 1) {
      attrQuery = `${attr}_eq_${traits[0]}.`;
    } else if (traits.length > 1) {
      attrQuery = `${attr}_eq`;
      traits.forEach((trait) => {
        attrQuery += `_${trait}`;
      });
      attrQuery += `.`;
    }
    filterQuery += attrQuery;
  });

  const endpoint = `${process.env.REACT_APP_FACES_RARITY_METADATA_URL}?page=${page}&take=${perPagee}`;
  if (text) {
    endpoint = `${endpoint}&search=${text}`;
  }
  if (sortField) {
    endpoint = `${endpoint}&sortField=${sortField}`;
  }
  if (sortDir) {
    endpoint = `${endpoint}&sortDir=${sortDir}`;
  }
  if (filter) {
    endpoint = `${endpoint}&filter=${filterQuery}`;
  }
  if (ids.length) {
    endpoint = `${endpoint}&ids=${ids.join(',')}`;
  } 
  else {
    endpoint = `${endpoint}&ids=1000000`;
  }

  return endpoint;
};

export const useSearchPolymorphicFaces = (fromNetwork) => {

  const { userPolymorphicFaces, userPolymorphicFacesPolygon, userPolymorphicFacesAll, userFacesBeingBridgedToEthereum, userFacesBeingBridgedToPolygon } = usePolymorphStore();

  const perPage = userPolymorphicFaces.length + userPolymorphicFacesPolygon.length + userFacesBeingBridgedToEthereum.length + userFacesBeingBridgedToPolygon.length; 
  const [inputText, setInputText] = useStateIfMounted('');
  const [apiPage, setApiPage] = useStateIfMounted(1);
  const [sortField, setSortField] = useStateIfMounted('tokenid');
  const [sortDir, setSortDir] = useStateIfMounted('desc');
  const [filter, setFilter] = useStateIfMounted([]);
  const [results, setResults] = useStateIfMounted();
  const [isLastPage, setIsLastPage] = useStateIfMounted(false);

  const searchPolymorphsRarity = async (endpoint,  abortSignal) => {
    // Query V1 Rarity
    const result = await fetch(endpoint, {
      signal: abortSignal,
    });
    if (result.status !== 200) {
      throw new Error(`bad status = ${result.status}`);
    }
    const json = await result.json();
    setResults(json);
    return json;
  };

  const loadMorePolymorphs = async (endpoint, abortSignal) => {
    // Query Faces Rarity
    const result = await fetch(endpoint, {
      signal: abortSignal,
    });
    if (result.status !== 200) {
      throw new Error(`bad status = ${result.status}`);
    }
    const json = await result.json();
    setResults((old) => [...old, ...json]);
    setIsLastPage(false);
    return json;
  };

  // Debounce the original search async function
  const debouncedSearchPolymorphsRarity = useConstant(() =>
    AwesomeDebouncePromise(searchPolymorphsRarity, 1000)
  );

  // Debounce the original search async function
  const debouncedLoadMorePolymorphs = useConstant(() =>
    AwesomeDebouncePromise(loadMorePolymorphs, 1000)
  );

  const search = useAsyncAbortable(
    async (abortSignal, text) => {
      let ids;
      if(fromNetwork === "Ethereum") {
        ids = userPolymorphicFaces.concat(userFacesBeingBridgedToEthereum).map((p) => p.id)
      } else if (fromNetwork === "Polygon") {
        ids = userPolymorphicFacesPolygon.concat(userFacesBeingBridgedToPolygon).map((p) => p.id)
      } else {
        ids = userPolymorphicFacesAll.map((p) => p.id)
      }
      // If the input is empty, return nothing immediately (without the debouncing delay!)
      // Else we use the debounced api
      const endpoint = buildRarityUrl(
        apiPage,
        perPage,
        text,
        sortField,
        sortDir,
        filter,
        ids,
        fromNetwork
      );

      if (apiPage === 1) {
        return debouncedSearchPolymorphsRarity(endpoint, abortSignal);
        // return debouncedSearchPolymorphsRarity(endpoint, abortSignal);
      }
      return debouncedLoadMorePolymorphs(endpoint, abortSignal);
    },
    // Ensure a new request is made everytime the text changes (even if it's debounced)
    [inputText, apiPage, sortField, sortDir, filter, userPolymorphicFaces, fromNetwork]
  );

  // Return everything needed for the hook consumer
  return {
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
  };
};
