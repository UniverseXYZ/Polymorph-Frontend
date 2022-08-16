import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { utils } from "ethers";
import Tabs from "../tabs/Tabs";
import Button from "../button/Button";
import closeIcon from "../../assets/images/cross.svg";
import ethIcon from "../../assets/images/eth.svg";
import SelectComponent from "../select/SelectComponent";
import { useContractsStore } from "src/stores/contractsStore";
import Image from "next/image";
import { ethers } from "ethers";
import polymorphicFaces from "../../abis/PolymorphicFacesRoot.json";
import { useUserBalanceStore } from "src/stores/balanceStore";
import { Tooltip } from "@chakra-ui/react";
import { useAuthStore } from "src/stores/authStore";
import LoadingSpinner from "@legacy/svgs/LoadingSpinnerBlack";

const GENE_POSITIONS_MAP = {
  background: 0,
  hairLeft: 1,
  hairRight: 2,
  earLeft: 3,
  earRight: 4,
  eyeLeft: 5,
  eyeRight: 6,
  beardTopLeft: 7,
  bearTopRight: 8,
  lipsLeft: 9,
  lipsRight: 10,
  bearBottomLeft: 11,
  bearBottomRight: 12,
};

const WEAR_TO_GENE_POSITION_MAP = [
  { title: "Background", value: GENE_POSITIONS_MAP.background },
  { title: "Hair Left", value: GENE_POSITIONS_MAP.hairLeft },
  {
    title: "Hair Right",
    value: GENE_POSITIONS_MAP.hairRight,
  },
  {
    title: "Ear Left",
    value: GENE_POSITIONS_MAP.earLeft,
  },
  {
    title: "Ear Right",
    value: GENE_POSITIONS_MAP.earRight,
  },
  {
    title: "Eye Left",
    value: GENE_POSITIONS_MAP.eyeLeft,
  },
  {
    title: "Eye Right",
    value: GENE_POSITIONS_MAP.eyeRight,
  },
  {
    title: "Beard Top Left",
    value: GENE_POSITIONS_MAP.beardTopLeft,
  },
  {
    title: "Beard Top Right",
    value: GENE_POSITIONS_MAP.bearTopRight,
  },
  {
    title: "Lips Left",
    value: GENE_POSITIONS_MAP.lipsLeft,
  },
  {
    title: "Lips Right",
    value: GENE_POSITIONS_MAP.lipsRight,
  },
  {
    title: "Beard Bottom Left",
    value: GENE_POSITIONS_MAP.bearBottomLeft,
  },
  {
    title: "Beard Top Right",
    value: GENE_POSITIONS_MAP.bearBottomRight,
  },
];

const PolymorphicFaceScramblePopup = ({
  onClose,
  polymorph,
  id,
  setShowCongratulations,
  setShowLoading,
  morphPrice,
}) => {
  const {
    polymorphicFacesContract,
    polymorphicFacesContractPolygon,
    wrappedEthContract,
  } = useContractsStore();
  const { polygonWethAllowanceInWeiForFaces } = useUserBalanceStore();
  const { address } = useAuthStore();
  const [singleTraitTabSelected, setSingleTraitSelected] = useState(true);
  const [allTraitsTabSelected, setAllTraitsTabSelected] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState("");
  const [randomizeGenePrice, setRandomizeGenePrice] = useState("");
  const [morphSingleGenePrice, setMorphSingleGenePrice] = useState("");
  const [contract, setContract] = useState("");
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);

  const traits = WEAR_TO_GENE_POSITION_MAP.map((key) => ({
    label: key.title,
    value: key.value.toString(),
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
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_ADDRESS,
        polymorphicFaces?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorph.tokenid
      );
      const genomChangePriceToEther = utils.formatEther(
        fetchedPrice.toNumber()
      );
      setMorphSingleGenePrice(genomChangePriceToEther);
      const amount = await contractInstance.randomizeGenomePrice();
      const formatedRandomizeGenomePriceToEther = utils.formatEther(amount);
      setRandomizeGenePrice(formatedRandomizeGenomePriceToEther);
      setContract(polymorphicFacesContract);
    }
    if (polymorph.network === "Polygon") {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.REACT_APP_INFURA_RPC_PROVIDER_POLYGON
      );
      // create instance of contract with infura provider
      const contractInstance = new ethers.Contract(
        process.env.REACT_APP_POLYMORPHIC_FACES_CONTRACT_POLYGON_ADDRESS,
        polymorphicFaces?.abi,
        provider
      );
      const fetchedPrice = await contractInstance.priceForGenomeChange(
        polymorph.tokenid
      );
      const genomChangePriceToEther = utils.formatEther(
        fetchedPrice.toNumber()
      );
      setMorphSingleGenePrice(genomChangePriceToEther);
      const amount = await contractInstance.randomizeGenomePrice();
      const formatedRandomizeGenomePriceToEther = utils.formatEther(amount);
      setRandomizeGenePrice(formatedRandomizeGenomePriceToEther);
      setContract(polymorphicFacesContractPolygon);
    }
  }, [polymorph.network]);

  const onScramble = async () => {
    if (contract) {
      onClose();
      setShowLoading(true);
      try {
        if (singleTraitTabSelected) {
          // Take the Gene Position
          const genePosition =
            WEAR_TO_GENE_POSITION_MAP[selectedTrait.value].value;

          // Morph a Gene
          const genomeChangePrice = utils
            .parseEther(morphSingleGenePrice)
            .toNumber();
          const morphGeneTx = await contract.morphGene(id, genePosition, {
            value: genomeChangePrice,
          });
          const txReceipt = await morphGeneTx.wait();
          if (txReceipt.status !== 1) {
            console.log("Morph Polymorphic Face transaction failed");
            return;
          }
        } else {
          if (!id) return;
          // Randomize Genom
          const amount = utils.parseEther(randomizeGenePrice).toNumber();
          const randomizeTx = await contract.randomizeGenome(id, {
            value: amount,
          });
          const txReceipt = await randomizeTx.wait();
          if (txReceipt.status !== 1) {
            console.log("Scramble Polymorphic Face transaction failed");
            return;
          }
        }
        // Update the view //
        setShowLoading(false);
        setShowCongratulations(true);
      } catch (err) {
        setShowLoading(false);
        setShowCongratulations(false);
        alert(err.message || err);
      }
    }
  };

  const approveHandler = async () => {
    setLoadingApproved(true);
    try {
      const userWrappedEthBalance = await wrappedEthContract.balanceOf(address);
      const tx = await wrappedEthContract.increaseAllowance(
        polymorphicFacesContractPolygon.address,
        userWrappedEthBalance
      );
      const txReceipt = await tx.wait();
      if (txReceipt.status !== 1) {
        console.log("Error approving tokens");
        return;
      }
      setShowApproveButton(false);
      setLoadingApproved(false);
      console.log(userWrappedEthBalance);
    } catch (error) {
      console.log(error);
      setLoadingApproved(false);
    }
  };

  useEffect(() => {
    if (singleTraitTabSelected && polymorph.network !== "Ethereum") {
      if (utils.formatEther(polygonWethAllowanceInWeiForFaces) < morphPrice) {
        setShowApproveButton(true);
      } else {
        setShowApproveButton(false);
      }
    }
    if (allTraitsTabSelected && polymorph.network !== "Ethereum") {
      if (
        utils.formatEther(polygonWethAllowanceInWeiForFaces) <
        randomizeGenePrice
      ) {
        setShowApproveButton(true);
      } else {
        setShowApproveButton(false);
      }
    }
  }, [singleTraitTabSelected, polymorph.network]);

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
                    Mutating a single trait means you can morph an eye or an
                    ear. This option will only morph 1 gene.
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
                  Would you like to scramble your Polymorphic Face into a brand
                  new one? This will randomize the genome, and reset the cost of
                  a single trait scramble back to 0.001 ETH.
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
                  * This action will randomise all traits of your Polymorphic
                  Face and can not be reversed later!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PolymorphicFaceScramblePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  polymorph: PropTypes.oneOfType([PropTypes.object]).isRequired,
  id: PropTypes.string.isRequired,
  setShowCongratulations: PropTypes.func.isRequired,
  setShowLoading: PropTypes.func.isRequired,
};

export default PolymorphicFaceScramblePopup;
