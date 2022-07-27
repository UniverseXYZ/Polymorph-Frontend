import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import { useAsyncAbortable } from 'react-async-hook';
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
  version = '',
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

  let endpoint;

  if(version === 'V1') {
    endpoint = `${process.env.REACT_APP_RARITY_METADATA_URL}?page=${page}&take=${perPagee}`;
  }
  if(version === 'V2') {
    endpoint = `${process.env.REACT_APP_RARITY_METADATA_URL_V2}?page=${page}&take=${perPagee}`;
  }

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
    endpoint = `${endpoint}&ids=${ids.join(",")}`;
  } else {
    endpoint = `${endpoint}&ids=1000000`;
  }
  return endpoint;
};

export const useSearchPolymorphs = () => {
  const { userPolymorphs, userPolymorphsV2 } =
    usePolymorphStore();

  const perPage = 100;
  const [inputText, setInputText] = useStateIfMounted("");
  const [apiPage, setApiPage] = useStateIfMounted(1);
  const [sortField, setSortField] = useStateIfMounted("rarityscore");
  const [sortDir, setSortDir] = useStateIfMounted("desc");
  const [filter, setFilter] = useStateIfMounted([]);
  const [results, setResults] = useStateIfMounted();
  const [isLastPage, setIsLastPage] = useStateIfMounted(false);
  const [queryVersion, setQueryVersion] = useStateIfMounted("all");

  const searchPolymorphsRarity = async (
    endpoint,
    endpointV2,
    abortSignal,
    query
  ) => {

    switch (query) {
      case "V1":
      // Query V1 Rarity
      const resultV1 = await fetch(endpoint, {
        signal: abortSignal,
      });
      if (resultV1.status !== 200) {
        throw new Error(`bad status = ${resultV1.status}`);
      }
      const jsonV1 = await resultV1.json();
      setResults(jsonV1);
      return jsonV1;

      case "V2":
      // Query V2 Rarity
      const resultV2 = await fetch(endpointV2, {
        signal: abortSignal,
      });
      if (resultV2.status !== 200) {
        throw new Error(`bad status = ${resultV2.status}`);
      }
      const jsonV2 = await resultV2.json();
      setResults(jsonV2);
      return jsonV2;
        
      case "all":
      // Query V1 & V2
      const resultQueryV1 = await fetch(endpoint, {
        signal: abortSignal,
      });
      if (resultQueryV1.status !== 200) {
        throw new Error(`bad status = ${resultQueryV1.status}`);
      }
      const jsonQueryV1 = await resultQueryV1.json();
      const resultQueryV2 = await fetch(endpointV2, {
        signal: abortSignal,
      });
      if (resultQueryV2.status !== 200) {
        throw new Error(`bad status = ${resultQueryV2.status}`);
      }
      const jsonQueryV2 = await resultQueryV2.json();        
      const jsonCommon = [...jsonQueryV1].concat([...jsonQueryV2]);
      setResults(jsonCommon);
      return jsonCommon;
    }
  };

  const loadMorePolymorphs = async (endpoint, endpointV2, abortSignal, query) => {
    switch (query) {
      case "V1":
      // Query V1 Rarity
      const resultV1 = await fetch(endpoint, {
        signal: abortSignal,
      });
      if (resultV1.status !== 200) {
        throw new Error(`bad status = ${resultV1.status}`);
      }
      const jsonV1 = await resultV1.json();
      setResults((old) => [...old, ...jsonV1]);
      setIsLastPage(false);
      return jsonV1;

      case "V2":
      // Query V2 Rarity
      const resultV2 = await fetch(endpointV2, {
        signal: abortSignal,
      });
      if (resultV2.status !== 200) {
        throw new Error(`bad status = ${resultV2.status}`);
      }
      const jsonV2 = await resultV2.json();
      setResults((old) => [...old, ...jsonV2]);
      setIsLastPage(false)
      return jsonV2;

      case "all":
      // Query V1 & V2
      const resultQueryV1 = await fetch(endpoint, {
        signal: abortSignal,
      });
      if (resultQueryV1.status !== 200) {
        throw new Error(`bad status = ${resultQueryV1.status}`);
      }
      const jsonQueryV1 = await resultQueryV1.json();
      const resultQueryV2 = await fetch(endpointV2, {
        signal: abortSignal,
      });
      if (resultQueryV2.status !== 200) {
        throw new Error(`bad status = ${resultQueryV2.status}`);
      }
      const jsonQueryV2 = await resultQueryV2.json();        
      const jsonCommon = [...jsonQueryV1].concat([...jsonQueryV2]);
      setResults((old) => [...old, ...jsonCommon]);
      setIsLastPage(false)
      return jsonCommon;
    }
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
      // If the input is empty, return nothing immediately (without the debouncing delay!)
      // Else we use the debounced api
      const endpoint = buildRarityUrl(
        apiPage,
        perPage,
        text,
        sortField,
        sortDir,
        filter,
        userPolymorphs.map((p) => p.id),
        "V1"
      );

      const endpointV2 = buildRarityUrl(
        apiPage,
        perPage,
        text,
        sortField,
        sortDir,
        filter,
        userPolymorphsV2.map((p) => p.id),
        "V2"
      );

      if (apiPage === 1) {
        return debouncedSearchPolymorphsRarity(
          endpoint,
          endpointV2,
          abortSignal,
          queryVersion
        );
      }
      return debouncedLoadMorePolymorphs(endpoint, endpointV2, abortSignal, queryVersion);
    },
    // Ensure a new request is made everytime the text changes (even if it's debounced)
    [
      inputText,
      apiPage,
      sortField,
      sortDir,
      filter,
      userPolymorphs,
      queryVersion,
    ]
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
    queryVersion,
    setQueryVersion,
  };
};
