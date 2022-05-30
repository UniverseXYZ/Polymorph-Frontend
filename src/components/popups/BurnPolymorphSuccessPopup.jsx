import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Slider from "react-slick";
import closeIcon from "../../assets/images/cross.svg";
import Button from "@legacy/button/Button";
import { renderLoaders } from "../../containers/rarityCharts/renderLoaders.jsx";
import { getPolymorphMetaV2 } from "../../utils/api/polymorphs";

const endpointRarityV2 = process.env.REACT_APP_RARITY_METADATA_URL_V2;

const BurnPolymorphSuccessPopup = ({ onClose, characters }) => {
  const [loading, setLoading] = useState(true);
  const [fetchedJson, setFetchedJson] = useState("");
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const fetchMetadata = async () => {
    const ids = [...characters.map((character) => character.tokenId)];
    const endpoint = `${endpointRarityV2}?ids=${ids}`;
    try {
      const result = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await result.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(async () => {
  //   if (loading) {
  //     const resultJson = await fetchMetadata();
  //     if (resultJson.length > 0) {
  //       setFetchedJson(resultJson);
  //     } else {
  //       setLoading(true);
  //     }
  //   }
  //   if (fetchedJson.length > 0) {
  //     setLoading(false);
  //   }
  // }, [loading, fetchedJson]);
  console.log("characters", characters);

  useEffect(async () => {
    const promises = [];
    characters.forEach((character) =>
      promises.push(getPolymorphMetaV2(character.tokenId))
    );
    console.log("promises are", promises);

    console.log("loading is", loading);
    if (loading) {
      try {
        const res = await Promise.all(promises);
        console.log("res is ", res);
        if (!res.length) {
          console.error("server error. cannot get meta data");
          console.log("res length is  0");
          setLoading(true);
        }

        if (res.length > 0) {
          console.log("res length is NOT 0");
          console.log("res are ", res);
          const images = [];
          res.forEach((res) => images.push(res.data.image));
          console.log("images", images);
          setFetchedJson(images);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }

      // const { data } = await getPolymorphMetaV2(characters[0].tokenId);
      // if (data !== "") {
      //   setFetchedJson(data);
      //   setLoading(false);
      // } else {
      //   setLoading(true);
      // }
    }
  }, [loading]);
  console.log("fetched json is", fetchedJson);
  return (
    <div className="burn--polymorph--success--popup">
      <button type="button" className="popup-close" onClick={onClose}>
        <img src={closeIcon} alt="Close" />
      </button>
      <h2 className="title">Congratulations!</h2>
      <p className="desc">{`You have successfully burnt your old polymorph${
        characters.length > 1 ? "s" : ""
      } and minted a new one${characters.length > 1 ? "s" : ""}`}</p>
      {loading ? (
        <p className="info">Your NFTs may take up to 2 minutes to load</p>
      ) : (
        <></>
      )}
      {characters.length > 1 ? (
        <div className="batch--polymorphs">
          {!loading && fetchedJson ? (
            <Slider {...settings}>
              {fetchedJson?.map((c, i) => {
                return (
                  <div className="polymorph--img" key={c.tokenid}>
                    <img src={fetchedJson[i]} alt="Polymorph" />
                  </div>
                );
              })}
            </Slider>
          ) : (
            renderLoaders(characters.length)
          )}
        </div>
      ) : (
        <div className="single--polymorph">
          {!loading && fetchedJson ? (
            <div className="polymorph--img">
              <img src={fetchedJson[0]} alt="Polymorph" />
            </div>
          ) : (
            renderLoaders(1)
          )}
        </div>
      )}
      <div className="actions">
        <Button className="light-button" onClick={onClose}>
          Burn More
        </Button>
        <Button
          className="light-border-button"
          onClick={() => router.push("/my-polymorphs")}
        >
          My Polymorphs
        </Button>
      </div>
    </div>
  );
};

BurnPolymorphSuccessPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  characters: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

export default BurnPolymorphSuccessPopup;
