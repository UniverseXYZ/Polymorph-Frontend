import React, { useContext, useEffect, useMemo, useState } from 'react';
import Popup from 'reactjs-popup';
import { utils } from 'ethers';
import { useHistory, useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AppContext from '../../../ContextAPI';
import backArrow from '../../../assets/images/go-back-arrow.svg';
import Button from '../../button/Button';
import Tabs from '../../tabs/Tabs';
import PolymorphScrambleProp from './PolymorphScrambleProp';
// import './styles/PolymorphScramblePage.scss';
import PolymorphScramblePopup from '../../popups/PolymorphScramblePopup';
import LoadingPopup from '../../popups/LoadingPopup';
import PolymorphScrambleCongratulationPopup from '../../popups/PolymorphScrambleCongratulationPopup';
import NotFound from '../../notFound/NotFound';
import { isEmpty } from '../../../utils/helpers';
import neverScrambledIcon from '../../../assets/images/never-scrambled-badge.svg';
import singleTraitScrambledIcon from '../../../assets/images/single-trait-scrambled-badge.svg';
import { getPolymorphMeta } from '../../../utils/api/polymorphs.js';
import { shortenEthereumAddress } from '../../../utils/helpers/format.js';
import loadingBg from '../../../assets/images/mint-polymorph-loading-bg.png';
import { polymorphOwner, queryPolymorphsGraph2 } from '../../../utils/graphql/polymorphQueries';
import { getScrambleStatus } from '../../../utils/helpers/polymorphs';
import GeneParser from '../../../utils/helpers/GeneParser.js';
import PolymorphMetadataLoading from '../../popups/PolymorphMetadataLoading';
import { useGraphQueryHook } from '../../../utils/hooks/useGraphQueryHook';
import { useAuthStore } from '../../../stores/authStore';


const PolymorphScramblePage = () => {
  const router = useRouter();
  const { address } = useAuthStore(s => ({
    address: s.address,
  }));
  const [propertiesTabSelected, setPropertiesTabSelected] = useState(true);
  const [metadataTabSelected, setMetadataTabSelected] = useState(false);
  const [polymorphId, setPolymorphId] = useState();
  const [polymorphData, setPolymorphData] = useState({});
  const [polymorpGene, setPolymorphGene] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [morphOwner, setMorphOwner] = useState(false);
  const [geneCopied, setGeneCopied] = useState(false);
  const [ownerCopied, setOwnerCopied] = useState(false);
  const [morphSingleGenePrise, setMorphSingleGenePrice] = useState('');
  const [scrambled, setScrambled] = useState('none');
  const [traitsMap, setTraitsMap] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const [showMetadataLoading, setShowMetadataLoading] = useState(false);
  const [showScramblePopup, setShowScramblePopup] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const { data, ...mutation  } = useMutation(queryPolymorphsGraph2);

  useEffect(() => {
    const id = router.query?.id;
    if (id) {
      mutation.mutate(polymorphOwner(id));
      setPolymorphId(id);
    }
  }, [router.query?.id]);

  useEffect(() => {
    if (!data) return;
    const ownerOf = data?.transferEntities[0]?.to;
    const owner = ownerOf?.toLowerCase() === address?.toLowerCase();
    setIsOwner(owner);
    setMorphOwner(ownerOf);
  }, [data, address]);

  useEffect(async () => {
    if (!polymorphId) return;
    setLoading(true);
    const polymorphMeta = await getPolymorphMeta(polymorphId);
    setPolymorphData(polymorphMeta);
    setLoading(false);
  }, [polymorphId]);

  useEffect(async () => {
    if (!data) return;
    const gene = data?.tokenMorphedEntities[data?.tokenMorphedEntities.length - 1]?.newGene;
    setPolymorphGene(gene.toString());
    const parsedGenes = GeneParser.parse(gene.toString());
    setTraitsMap(parsedGenes);
  }, [data]);

  useEffect(async () => {
    if (!data) return;
    const genomChangePrice =
      data?.tokenMorphedEntities[data?.tokenMorphedEntities.length - 1]?.priceForGenomeChange;
    const genomChangePriceToEther = utils.formatEther(genomChangePrice);
    setMorphSingleGenePrice(genomChangePriceToEther);
  }, [data]);

  useEffect(() => {
    if (data) {
      setScrambled(getScrambleStatus(data.tokenMorphedEntities));
    }
  }, [data]);

  const tabs = [
    {
      name: 'Properties',
      active: propertiesTabSelected,
      handler: () => {
        setPropertiesTabSelected(true);
        setMetadataTabSelected(false);
      },
    },
    {
      name: 'Metadata',
      active: metadataTabSelected,
      handler: () => {
        setPropertiesTabSelected(false);
        setMetadataTabSelected(true);
      },
    },
  ];

  const showScrambleOptions = () => {
    setShowScramblePopup(true);
  };

  const attributes = useMemo(() => {
    const attributes = polymorphData?.data?.attributes || [];
    return attributes.map((attr) => ({
      trait: attr.trait_type,
      name: attr.value,
      // chance: PropTypes.string.isRequired, //TODO:: We dont have it
    }));
  }, [polymorphData?.data?.attributes])

  if (!polymorphId) {
    return null;
  }

  return (
    <div className="container scramble--wrapper">
      <Popup closeOnDocumentClick={false} open={showScramblePopup}>
        <PolymorphScramblePopup
          onClose={() => setShowScramblePopup(false)}
          polymorph={polymorphData}
          id={polymorphId}
          setPolymorph={setPolymorphData}
          setPolymorphGene={setPolymorphGene}
          setShowCongratulations={setShowCongratulations}
          setShowLoading={setShowLoading}
          setShowMetadataLoading={setShowMetadataLoading}
        />
      </Popup>

      <Popup closeOnDocumentClick={false} open={showLoading}>
        <LoadingPopup onClose={() => setShowLoading(false)} />
      </Popup>

      <Popup closeOnDocumentClick={false} open={showMetadataLoading}>
        <PolymorphMetadataLoading
          onClose={() => setShowMetadataLoading(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={polymorphData}
        />
      </Popup>

      <Popup closeOnDocumentClick={false} open={showCongratulations}>
        <PolymorphScrambleCongratulationPopup
          onClose={() => setShowCongratulations(false)}
          onOpenOptionsPopUp={showScrambleOptions}
          polymorph={polymorphData}
        />
      </Popup>

      <div
        className="go--back--wrapper"
        aria-hidden="true"
        onClick={() => router.push('/my-polymorphs')}
      >
        <img src={backArrow} alt="go back" />
        <span>My NFTs</span>
      </div>
      <div className="scramble--content">
        {!loading ? (
          <div className="avatar--wrapper">
            {scrambled && scrambled === 'single' ? (
              <div className="scrambled">
                <img alt="Single trait scrambled badge" src={singleTraitScrambledIcon} />
                <span className="tooltiptext">Single trait scrambled</span>
              </div>
            ) : (
              <></>
            )}
            {scrambled && scrambled === 'never' ? (
              <div className="scrambled">
                <img alt="Never scrambled badge" src={neverScrambledIcon} />
                <span className="tooltiptext">Never scrambled</span>
              </div>
            ) : (
              <></>
            )}
            <img src={polymorphData?.data?.image} className="avatar person" alt="Polymorph" />
          </div>
        ) : (
          <div className="loading" key={uuid()}>
            <img src={loadingBg} alt="polymorph" key={uuid()} />
            <div className="lds-roller">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}

        <div className="scramble--options">
          <div className="name">{polymorphData?.data?.name}</div>
          <div className="description">{polymorphData?.data?.description}</div>

          <Tabs items={tabs} attributes={attributes} />
          {propertiesTabSelected ? (
            <>
              <div className="scramble--properties">
                {attributes.length && Object.keys(traitsMap).length !== 0
                  ? attributes.map((attributeProps) => {
                      const chance = traitsMap[attributeProps.trait.toUpperCase()];
                      attributeProps.chance = chance;
                      return <PolymorphScrambleProp key={uuid()} data={attributeProps} />;
                    })
                  : null}
              </div>
            </>
          ) : (
            <div>
              <div className="metadata">
                <div className="mp--string--name">Next Morph Price</div>
                <div className="mp--string--value">{morphSingleGenePrise} ETH</div>
              </div>
              <div className="metadata">
                <div className="owner--string--name">Owner</div>
                <div className="owner--string--value">
                  {/* TODO: Take address from .env */}
                  <a
                    href={`${process.env.REACT_APP_ETHERSCAN_URL}/token/${process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS}?a=${morphOwner}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortenEthereumAddress(morphOwner)}
                  </a>
                </div>
              </div>
              <div className="metadata">
                <div className="genome--string--name">Genome string</div>
                <div className="copy-div">
                  <div className="copy__div">
                    <div className="copy" title="Copy to clipboard">
                      <div className="copied-div" hidden={!geneCopied}>
                        Gene copied!
                        <span />
                      </div>
                      <CopyToClipboard
                        text={polymorpGene}
                        onCopy={() => {
                          setGeneCopied(true);
                          setTimeout(() => {
                            setGeneCopied(false);
                          }, 1000);
                        }}
                      >
                        <div className="genome--string--value">
                          {shortenEthereumAddress(polymorpGene)}
                        </div>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isOwner ? (
            <Button className="light-button" onClick={showScrambleOptions} disabled>
              Scramble options
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PolymorphScramblePage;
