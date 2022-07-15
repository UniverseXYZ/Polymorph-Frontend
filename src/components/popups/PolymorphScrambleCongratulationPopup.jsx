import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import uuid from "react-uuid";
import Button from "../button/Button.jsx";
import closeIcon from "../../assets/images/cross.svg";
import { useRouter } from "next/router";
import { getPolymorphMetaV2 } from "@legacy/api/polymorphs.js";
import { renderLoaders } from "../../containers/rarityCharts/renderLoaders.jsx";
import { getPolymorphicFacesMeta } from "../../utils/api/polymorphicFaces.js";
import Image from "next/image.js";

const PolymorphScrambleCongratulationPopup = ({
  onClose,
  onOpenOptionsPopUp,
  polymorph,
  isPolymorph,
  isPolymorphicFace,
}) => {
  const router = useRouter();
  const [metadata, setMetadata] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    if (loading && isPolymorph) {
      const { data } = await getPolymorphMetaV2(polymorph.tokenid);
      if (data !== "") {
        setMetadata(data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
    if (loading && isPolymorphicFace) {
      const { data } = await getPolymorphicFacesMeta(polymorph.tokenid);
      if (data !== "") {
        setMetadata(data);
        setLoading(false);
      } else {
        setLoading(true);
      }
    }
  }, [loading]);

  return (
    <div className="polymorph_popup">
      <img
        className="close"
        src={closeIcon}
        alt="Close"
        onClick={onClose}
        aria-hidden="true"
      />
      <h1>Congratulations!</h1>
      <p className="desc">
        You have sucessfully scrambled your Polymorphic Universe NFT
      </p>
      {loading && (
        <p className="info">Your NFTs may take up to 2 minutes to load</p>
      )}

      {!loading && metadata ? (
        <div className="polymorph_confirmation_image">
          <Image
            height={440}
            width={440}
            src={metadata?.image}
            alt="soldier"
            key={uuid()}
          />
        </div>
      ) : isPolymorph ? (
        renderLoaders(1)
      ) : (
        renderLoaders(1, "faces")
      )}
      <div className="button__div_polymorph">
        <Button
          className="light-button"
          onClick={() => {
            router.push("/my-polymorphs");
          }}
        >
          My Polymorphs
        </Button>
        <Button
          className="light-border-button"
          onClick={() => {
            onClose();
            onOpenOptionsPopUp();
          }}
        >
          Scramble again
        </Button>
      </div>
    </div>
  );
};

PolymorphScrambleCongratulationPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpenOptionsPopUp: PropTypes.func.isRequired,
  polymorph: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PolymorphScrambleCongratulationPopup;
