import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Popup from "reactjs-popup";
import ArrowLeftIcon from "../../components/svgs/ArrowLeftIcon";
import CharactersGrid from "../../components/charactersGrid/CharactersGrid";
import Button from "@legacy/button/Button";
import neverScrambledIcon from "../../assets/images/never-scrambled-badge.svg";
import Lottie from "react-lottie";
import animationData from "../../utils/animations/burn_polymorph_bg_animation.json";
import BurnPolymorphAnimation from "./animations/BurnPolymorphAnimation";
import BurnPolymorphLoadingPopup from "../../components/popups/BurnPolymorphLoadingPopup";
import BurnPolymorphSuccessPopup from "../../components/popups/BurnPolymorphSuccessPopup";
import { useContractsStore } from "../../stores/contractsStore";
import { useAuthStore } from "src/stores/authStore";

const polymorphContractV2Address =
  process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS;

const BurnPolymorphs = ({ characters, type }) => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [tokenApproved, setTokenApproved] = useState(false);

  const { polymorphContract } = useContractsStore();
  const { address } = useAuthStore();

  useEffect(async () => {
    const hasAlreadyApprovedTokens = await polymorphContract.isApprovedForAll(
      address,
      polymorphContractV2Address
    );
    if (hasAlreadyApprovedTokens) {
      setTokenApproved(true);
    }
  }, []);

  const handleApproveToken = async () => {
    const approveTx = await polymorphContract.setApprovalForAll(
      polymorphContractV2Address,
      true
    );
    const approveTxReceipt = await approveTx.wait();
    if (approveTxReceipt.status !== 1) {
      console.log("Error approving tokens");
      return;
    }
    setTokenApproved(true);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleBurnClick = () => {
    setStatus("burning");
    setTimeout(() => {
      setStatus("loading");
      setTimeout(() => {
        setStatus("success");
      }, 2000);
    }, 3000);
  };

  return (
    <div className="burn--polymorph--page">
      <div className="lottie--animation">
        <Lottie options={defaultOptions} />
      </div>
      <div className="burn--polymorph--page--wrapper">
        <div className="burn--polymorph--page--wrapper--container">
          {!status ? (
            <>
              <div
                className="back--btn"
                onClick={() => router.push("/burn-to-mint/burn")}
              >
                <ArrowLeftIcon />
                <span>Choose Polymorphs</span>
              </div>
              <div className="burn--polymorph--grid">
                <div>
                  <CharactersGrid characters={characters} />
                  {type === "single" && (
                    <img
                      className="scrambled--icon"
                      src={neverScrambledIcon}
                      alt="Never Scrambled"
                    />
                  )}
                </div>
                <div>
                  <h1>
                    {type === "single"
                      ? `Burn Troll God #${router.query.id}`
                      : `Burn ${characters.length} Polymorphs`}
                  </h1>
                  <p>
                    You can only burn your polymorph one time. <br /> The new
                    polymorph will get the same traits and badges.
                  </p>
                  <div className="burn--polymorphs--buttons">
                    <Button
                      className="light-button"
                      onClick={handleApproveToken}
                      disabled={tokenApproved}
                    >
                      Approve Token
                    </Button>
                    <Button
                      className="light-button"
                      onClick={handleBurnClick}
                      disabled={!tokenApproved}
                    >
                      Burn
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : status === "burning" ? (
            <div className="burning--polymorph--animation">
              <CharactersGrid characters={characters} />
              <BurnPolymorphAnimation />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Popup closeOnDocumentClick={false} open={status === "loading"}>
        <BurnPolymorphLoadingPopup onClose={() => setStatus("")} />
      </Popup>
      <Popup closeOnDocumentClick={false} open={status === "success"}>
        <BurnPolymorphSuccessPopup
          onClose={() => setStatus("")}
          characters={characters}
        />
      </Popup>
    </div>
  );
};

export default BurnPolymorphs;
