import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { utils } from "ethers";
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
  setShowMetadataLoading,
}) => {
  const userPolymorphs = usePolymorphStore((s) => s.userPolymorphs);
  const polymorphContractV2 = useContractsStore((s) => s.polymorphContractV2);

  const [singleTraitTabSelected, setSingleTraitSelected] = useState(true);
  const [allTraitsTabSelected, setAllTraitsTabSelected] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState("");
  const [randomizeGenePrise, setRandomizeGenePrice] = useState("");
  const [morphSingleGenePrise, setMorphSingleGenePrice] = useState("");

  // const traits = Object.keys(WEAR_TO_GENE_POSITION_MAP).map((key) => ({
  //   label: `${key}: ${
  //     polymorph?.data?.attributes.find((attr) => attr?.trait_type === key).value
  //   }`,
  //   value: key,
  // }));

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
    try {
      // Fetch randomize Price
      const amount = await polymorphContractV2.randomizeGenomePrice();
      const formatedEther = utils.formatEther(amount);
      setRandomizeGenePrice(formatedEther);

      // Set first trait to be selected
      setSelectedTrait(traits[0]);

      // Fetch single genom change price
      const genomChangePrice = await polymorphContractV2.priceForGenomeChange(
        id
      );
      const genomChangePriceToEther = utils.formatEther(genomChangePrice);
      setMorphSingleGenePrice(genomChangePriceToEther);
    } catch (e) {
      alert(e);
    }
  }, []);

  const onScramble = async () => {
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
        const genomeChangePrice =
          await polymorphContractV2.priceForGenomeChange(id);
        const morphGeneT = await polymorphContractV2.morphGene(
          id,
          genePosition,
          {
            value: genomeChangePrice,
          }
        );
        await morphGeneT.wait();
      } else {
        if (!id) return;
        // Randomize Genom
        const amount = await polymorphContractV2.randomizeGenomePrice();
        const randomizeT = await polymorphContractV2.randomizeGenome(id, {
          value: amount,
        });
        await randomizeT.wait();
      }
      // Update the view //
      setShowLoading(false);

      setShowMetadataLoading(true);
      // Get the new Meta
      // const data = await getPolymorphMeta(id);
      // setPolymorph(data);

      // Update the Gene
      // const gene = await polymorphContractV2.geneOf(id);
      // setPolymorphGene(gene.toString());

      // Update userPolymorphs
      // const newPolymorph = convertPolymorphObjects([data]);
      // const updatedPolymorphs = userPolymorphs.map((existingPolymorph) => {
      //   if (existingPolymorph.id === newPolymorph[0].id) {
      //     return newPolymorph[0];
      //   }
      //   return existingPolymorph;
      // });

      setShowMetadataLoading(false);
      setShowCongratulations(true);
    } catch (err) {
      setShowLoading(false);
      setShowMetadataLoading(false);
      setShowCongratulations(false);
      alert(err.message || err);
    }
  };

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
              <img
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
                    ? morphSingleGenePrise
                    : randomizeGenePrise}
                </div>
                <Button
                  className="light-button"
                  onClick={onScramble}
                  disabled={!selectedTrait && singleTraitTabSelected}
                >
                  {singleTraitTabSelected ? "Morph" : "Scramble"}
                </Button>
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
                  * This action might change your Character trait and can not be
                  reversed later!
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
  setShowMetadataLoading: PropTypes.func.isRequired,
};

export default PolymorphScramblePopup;
