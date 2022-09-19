import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ethers, utils } from "ethers";
import Tabs from "../tabs/Tabs";
import Button from "../button/Button";
// import '../polymorphs/scramble/styles/PolymorphScramblePopup.scss';
import closeIcon from "../../assets/images/cross.svg";
import ethIcon from "../../assets/images/eth.svg";
import SelectComponent from "../select/SelectComponent";
import { getPolymorphMeta } from "../../utils/api/polymorphs.js";
import { convertPolymorphObjects } from "../../utils/helpers/polymorphs";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useContractsStore } from "src/stores/contractsStore";
import Image from "next/image";
import polymorphV2 from "../../abis/PolymorphRoot.json";
import { useAuthStore } from "src/stores/authStore";
import { useUserBalanceStore } from "src/stores/balanceStore";
import { Tooltip } from "@chakra-ui/react";
import LoadingSpinner from "@legacy/svgs/LoadingSpinnerBlack";

const GENE_POSITIONS_MAP = {
  BACKGROUND: 1,
  PANTS: 2,
  TORSO: 3,
  FOOTWEAR: 4,
  FACE: 5,
  HEAD: 6,
  RIGHT_WEAPON: 7,
  LEFT_WEAPON: 8,
};

const WEAR_TO_GENE_POSITION_MAP = {
  background: GENE_POSITIONS_MAP.BACKGROUND,
  pants: GENE_POSITIONS_MAP.PANTS,
  torso: GENE_POSITIONS_MAP.TORSO,
  footwear: GENE_POSITIONS_MAP.FOOTWEAR,
  eyewear: GENE_POSITIONS_MAP.FACE,
  headwear: GENE_POSITIONS_MAP.HEAD,
  righthand: GENE_POSITIONS_MAP.RIGHT_WEAPON,
  lefthand: GENE_POSITIONS_MAP.LEFT_WEAPON,
};

const PolymorphScramblePopup = ({
  onClose,
  polymorph,
  id,
  setPolymorph,
  setPolymorphGene,
  setShowCongratulations,
  setShowLoading,
  morphPrice,
}) => {
  const userPolymorphs = usePolymorphStore((s) => s.userPolymorphs);
  const {
    polymorphContractV2,
    polymorphContractV2Polygon,
    wrappedEthContract,
  } = useContractsStore();
  const { polygonWethAllowanceInWeiForPolymorphs } = useUserBalanceStore();
  const { address } = useAuthStore();

  const [singleTraitTabSelected, setSingleTraitSelected] = useState(true);
  const [allTraitsTabSelected, setAllTraitsTabSelected] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState("");
  const [randomizeGenePrice, setRandomizeGenePrice] = useState("");
  const [morphSingleGenePrice, setMorphSingleGenePrice] = useState("");
  const [contract, setContract] = useState("");
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);

  const traits = Object.keys(WEAR_TO_GENE_POSITION_MAP).map((key) => ({
    label: `${key.charAt(0).toUpperCase() + key.slice(1)}`,
    value: key,
  }));

  const tabs = [
    {
      name: "Single Trait",
      active: singleTraitTabSelected,
      handler: () => {
        setSingleTraitSelected(true);
        setAllTraitsTabSelected(false);
      },
    },
    {
      name: "All traits",
      active: allTraitsTabSelected,
      handler: () => {
        setSingleTraitSelected(false);
        setAllTraitsTabSelected(true);
      },
    },
  ];

  useEffect(async () => {
    if (polymorph.network === "Ethereum") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_ETHEREUM
      );
      // create instance of contract with infura provider
      // const contractInstance = new ethers.Contract(
      //   process.env.REACT_APP_POLYMORPHS_CONTRACT_ADDRESS,
      //   polymorphV2?.abi,
      //   provider
      // );
      const fetchedPrice = await polymorphContractV2.priceForGenomeChange(
        polymorph.tokenid
      );
      const genomChangePriceToEther = utils.formatEther(fetchedPrice);
      console.log(genomChangePriceToEther)
      setMorphSingleGenePrice(genomChangePriceToEther);
      const amount = await polymorphContractV2.randomizeGenomePrice();
      const formatedRandomizeGenomePriceToEther = utils.formatEther(amount);
      setRandomizeGenePrice(formatedRandomizeGenomePriceToEther);
      setContract(polymorphContractV2);
    }
    if (polymorph.network === "Polygon") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_POLYGON
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_POLYGON_ADDRESS,
        polymorphV2?.abi,
        provider
      );
      const fetchedPrice = await polymorphContractV2Polygon.priceForGenomeChange(
        polymorph.tokenid
      );
      const genomChangePriceToEther = utils.formatEther(fetchedPrice);
      setMorphSingleGenePrice(genomChangePriceToEther);
      const amount = await polymorphContractV2Polygon.randomizeGenomePrice();
      const formatedRandomizeGenomePriceToEther = utils.formatEther(amount);
      setRandomizeGenePrice(formatedRandomizeGenomePriceToEther);
      setContract(polymorphContractV2Polygon);
    }
  }, []);

  const onScramble = async () => {
    if (contract) {
      onClose();
      setShowLoading(true);
      try {
        if (singleTraitTabSelected) {
          // Take the Gene Position
          const genePosition = WEAR_TO_GENE_POSITION_MAP[selectedTrait?.value];
          if (!genePosition) {
            alert("There is no such Gene !");
            return;
          }

          // Morph a Gene
          const genomeChangePrice = await contract.priceForGenomeChange(id);
          const morphGeneTx = await contract.morphGene(id, genePosition, {
            value: polymorph.network === "Ethereum" ? genomeChangePrice : 0,
          });
          const txReceipt = await morphGeneTx.wait();
          if (txReceipt.status !== 1) {
            console.log("Morph Polymorph transaction failed");
            return;
          }
        } else {
          if (!id) return;
          // Randomize Genom
          const amount = await contract.randomizeGenomePrice();
          const randomizeTx = await contract.randomizeGenome(id, {
            value: polymorph.network === "Ethereum" ? amount : 0,
          });
          const txReceipt = await randomizeTx.wait();
          if (txReceipt.status !== 1) {
            console.log("Scramble Polymorph transaction failed");
            return;
          }
        }
        // Update the view //
        setShowLoading(false);
        setShowCongratulations(true);
      } catch (err) {
        setShowLoading(false);
        setShowCongratulations(false);
        {
          err?.data?.message
            ? alert(
                err?.data?.message &&
                  `You don't have enough WETH\n ${err?.data?.message}`
              )
            : alert(err.message);
        }
      }
    }
  };

  const approveHandler = async () => {
    setLoadingApproved(true);
    try {
      const userWrappedEthBalance = await wrappedEthContract.balanceOf(address);
      const tx = await wrappedEthContract.increaseAllowance(
        polymorphContractV2Polygon.address,
        userWrappedEthBalance
      );
      const txReceipt = await tx.wait();
      if (txReceipt.status !== 1) {
        console.log("Error approving tokens");
        return;
      }
      setShowApproveButton(false);
      setLoadingApproved(false);
    } catch (error) {
      console.log(error);
      setLoadingApproved(false);
    }
  };

  useEffect(() => {
    if (singleTraitTabSelected && polymorph.network !== "Ethereum") {
      if (
        utils.formatEther(polygonWethAllowanceInWeiForPolymorphs) < morphPrice
      ) {
        setShowApproveButton(true);
      } else {
        setShowApproveButton(false);
      }
    }
    if (allTraitsTabSelected && polymorph.network !== "Ethereum") {
      if (
        utils.formatEther(polygonWethAllowanceInWeiForPolymorphs) <
        randomizeGenePrice
      ) {
        setShowApproveButton(true);
      } else {
        setShowApproveButton(false);
      }
    }
  }, [singleTraitTabSelected, polymorph.network, morphSingleGenePrice]);

  const currentTrait = polymorph?.data?.attributes.find(
    (attr) => attr?.trait_type === selectedTrait.label
  );

  return (
    <div className="scramble-popup">
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="" />
      </button>
      <div className="scramble-popup-div">
        <div className="scramble--popup">
          <div className="scramble--popup--content">
            <div className="avatar-wrapper-popup">
              <Image
                width={440}
                height={440}
                src={polymorph?.imageurl}
                className="avatar-popup"
                alt="avatar"
              />
            </div>

            <div className="scramble--options--popup">
              <div className="name">{polymorph?.data?.name}</div>

              <Tabs items={tabs} />
              {singleTraitTabSelected ? (
                <>
                  <div className="description">
                    Mutating a single trait means you can morph a hat or morph a
                    torso. This option will only morph 1 gene.
                  </div>

                  <div className="traits--popup">
                    <SelectComponent
                      options={traits}
                      onChange={(trait) => setSelectedTrait(trait)}
                      placeholder="Pick a trait type to scramble"
                      value={selectedTrait}
                    />
                  </div>
                </>
              ) : (
                <div className="description">
                  Would you like to scramble your Polymorph into a brand new
                  one? This will randomize the genome, and reset the cost of a
                  single trait scramble back to 0.01 ETH.
                </div>
              )}

              <div className="scramble--action">
                <div className="scramble--price">
                  <img src={ethIcon} alt="" />
                  {singleTraitTabSelected
                    ? morphSingleGenePrice
                    : randomizeGenePrice}
                </div>
                {showApproveButton ? (
                  <Tooltip
                    className="tooltip"
                    variant={"black"}
                    hasArrow
                    label={`You need to approve spending your wrapped ETH first`}
                  >
                    <span className={"tooltip-span"}>
                      <Button className="light-button" onClick={approveHandler}>
                        {loadingApproved ? <LoadingSpinner /> : null}
                        <span>Approve</span>
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    className="light-button"
                    onClick={onScramble}
                    disabled={!selectedTrait && singleTraitTabSelected}
                  >
                    {singleTraitTabSelected ? "Morph" : "Scramble"}
                  </Button>
                )}
              </div>

              {singleTraitTabSelected ? (
                <div className="next-price-description">
                  * You’re about to morph the &nbsp;
                  <b>
                    {selectedTrait?.label}: {currentTrait?.value}
                  </b>
                  . Your next scramble will cost more than the last one. You
                  have the same chance to receive the trait you already have as
                  the trait you may want.
                </div>
              ) : (
                <div className="next-price-description">
                  * This action will randomise all traits of your Polymorph and
                  can not be reversed later!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PolymorphScramblePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  // setPolymorph: PropTypes.func.isRequired,
  // setPolymorphGene: PropTypes.func.isRequired,
  polymorph: PropTypes.oneOfType([PropTypes.object]).isRequired,
  id: PropTypes.string.isRequired,
  setShowCongratulations: PropTypes.func.isRequired,
  setShowLoading: PropTypes.func.isRequired,
};

export default PolymorphScramblePopup;
