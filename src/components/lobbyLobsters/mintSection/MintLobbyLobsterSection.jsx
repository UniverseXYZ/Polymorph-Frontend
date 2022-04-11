import React, { useState, useEffect, useContext } from 'react';
import { utils, BigNumber, FixedNumber } from 'ethers';
import Popup from 'reactjs-popup';
// import BondingCurve from '../../polymorphs/mint-polymorph/BondingCurve';
// import './MintLobbyLobsterSection.scss';
import lobsterLoadingBg from '../../../assets/images/lobby-lobsters/img_placeholder.png';
import AppContext from '../../../ContextAPI';
import { convertLobsterObjects } from '../../../utils/helpers/lobsters';
import { fetchTokensMetadataJson } from '../../../utils/api/polymorphs';
import LoadingPopup from '../../popups/LoadingPopup';
import MintPolymorphConfirmationPopup from '../../popups/MintPolymorphConfirmationPopup';
import { useWindowSize } from 'react-use';
import { useAuthStore } from '../../../stores/authStore';
import { useLobsterStore } from 'src/stores/lobsterStore';

const MintLobbyLobsterSection = React.forwardRef((props, ref) => {
  const { userLobsters, setUserLobsters } = useLobsterStore(s => ({userLobsters: s.userLobsters, setUserLobsters: s.setUserLobsters}));

  const lobsterContract = useAuthStore(s => s.lobsterContract)

  const [sliderValue, setSliderValue] = useState(10000);
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState(false);
  const windowSize = useWindowSize();
  const [mintedTokens, setMintedTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadataLoaded, setMetadataLoaded] = useState(false);

  useEffect(() => {
    setMobile(+windowSize.width <= 576);
  }, [windowSize]);

  const mintLobsters = async (amount) => {
    if (!lobsterContract) {
      try {
        await connectWeb3();
      } catch (err) {
        alert(err.message || error);
      }
    }

    if (!lobsterContract) return;

    const mintedIds = [];
    const overrideOptions = {
      value: utils.parseEther((0.1 * amount).toString()),
    };
    try {
      const mintTx = await lobsterContract?.functions['bulkBuy(uint256)'](amount, overrideOptions);
      setMetadataLoaded(false);
      setLoading(true);

      const receipt = await mintTx?.wait();
      // eslint-disable-next-line no-restricted-syntax
      for (const event of receipt.events) {
        if (event.event !== 'Transfer') {
          // eslint-disable-next-line no-continue
          continue;
        }
        mintedIds.push(event.args.tokenId.toString());
      }
      const metadataURIs = mintedIds.map((id) => `${lobsterBaseURI}${id}`);
      setMintedTokens(metadataURIs);
      setLoading(false);
      setCongrats(true);
      const nftMetadataObjects = await fetchTokensMetadataJson(metadataURIs);
      setMintedTokens(nftMetadataObjects);
      const lobsterNFTs = userLobsters.concat(convertLobsterObjects(nftMetadataObjects));
      setMetadataLoaded(true);
      setSliderValue(+sliderValue + quantity);
      setUserLobsters(lobsterNFTs);
    } catch (err) {
      alert(err.message || error);
    }
  };
  return (
    <div className="lobby--lobsters--mint--section" ref={ref}>
      <div className="lobby--lobsters--mint--section--background">
        <div className="lobby--lobsters--mint--section--container">
          <h1 className="title">Mint a Lobby Lobster</h1>
          <p className="desc">
            100% of primary sales will be donated to policy and lobby efforts. Secondary sales will
            be donated to groups focused on growing the Ethereum ecosystem. Mint a Lobby Lobster to
            become part of a community that will change the universe!
          </p>
          {/* <BondingCurve
            title="You can mint 20 Lobby Lobsters at a time"
            price={0.1}
            value={sliderValue}
            setValue={setSliderValue}
            max={10000}
            mobile={mobile}
            blur
            quantity={quantity}
            setQuantity={setQuantity}
            light={false}
            trailingZeros={1}
            mintAction={mintLobsters}
            soldOut
          /> */}
        </div>
      </div>
      <Popup closeOnDocumentClick={false} open={loading}>
        <LoadingPopup onClose={() => setLoading(false)} />
      </Popup>
      <Popup closeOnDocumentClick={false} open={congrats}>
        <MintPolymorphConfirmationPopup
          onClose={() => setCongrats(false)}
          quantity={quantity}
          mintedNFTs={mintedTokens}
          collectionName="Lobby Lobster"
          loadingImage={lobsterLoadingBg}
          metadataLoaded={metadataLoaded}
          buttonText="My Lobsters"
        />
      </Popup>
    </div>
  );
});

export default MintLobbyLobsterSection;
