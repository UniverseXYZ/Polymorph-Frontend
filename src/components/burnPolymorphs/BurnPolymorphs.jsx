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
import LoadingSpinner from "@legacy/svgs/LoadingSpinner";

const polymorphContractV2Address =
  process.env.REACT_APP_POLYMORPHS_CONTRACT_V2_ADDRESS;

const BurnPolymorphs = ({ characters, type }) => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [tokenApproved, setTokenApproved] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingBurnToMint, setLoadingBurnToMint] = useState(false);

  const { polymorphContract, polymorphContractV2 } = useContractsStore();
  const { address } = useAuthStore();

  useEffect(async () => {
    if (polymorphContract) {
      const hasAlreadyApprovedTokens = await polymorphContract.isApprovedForAll(
        address,
        polymorphContractV2Address
      );
      if (hasAlreadyApprovedTokens) {
        setTokenApproved(true);
      }
    }
  }, []);

  const handleApproveToken = async () => {
    try {
      setLoadingApprove(true);
      const gasEstimate = await polymorphContract.estimateGas.setApprovalForAll(
        polymorphContractV2Address,
        true
      );
      const gasLimit = gasEstimate.mul(120).div(100);
      const approveTx = await polymorphContract.setApprovalForAll(
        polymorphContractV2Address,
        true,
        { gasLimit: gasLimit }
      );
      const approveTxReceipt = await approveTx.wait();
      if (approveTxReceipt.status !== 1) {
        setLoadingApprove(false);
        console.log("Error approving tokens");
        return;
      }
      setLoadingApprove(false);
      setTokenApproved(true);
    } catch (error) {
      setLoadingApprove(false);
      console.log(error);
    }
  };

  const handleBurnToMint = async () => {
    try {
      const burnToMintTokenIds = characters.map(function (item) {
        return item["tokenId"];
      });
      setLoadingBurnToMint(true);
      setStatus("loading");

      const gasEstimate =
        await polymorphContractV2.estimateGas.burnAndMintNewPolymorph(
          burnToMintTokenIds
        );

      const gasLimit = gasEstimate.mul(120).div(100);

      const burnToMintTx = await polymorphContractV2.burnAndMintNewPolymorph(
        burnToMintTokenIds,
        { gasLimit: gasLimit }
      );

      setStatus("burning");

      const burnToMintTxReceipt = await burnToMintTx.wait();
      if (burnToMintTxReceipt.status !== 1) {
        setLoadingApprove(false);
        console.log("Error with burning the tokens");
        return;
      }

      setLoadingBurnToMint(false);
      setStatus("success");
    } catch (error) {
      setLoadingBurnToMint(false);
      setStatus("");
      console.log(error);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  console.log(characters);
  console.log(status);
  return (
    <div className="burn--polymorph--page">
      <div className="lottie--animation">
        <Lottie options={defaultOptions} />
      </div>
      <div className="burn--polymorph--page--wrapper">
        <div className="burn--polymorph--page--wrapper--container">
          {!status ? (
            <>
              {characters.length > 0 ? (
                <div className="back--btn" onClick={() => router.back()}>
                  <ArrowLeftIcon />
                  <span>Choose Polymorphs</span>
                </div>
              ) : (
                <div
                  className="back--btn"
                  onClick={() => router.push("/burn-to-mint/burn")}
                >
                  <ArrowLeftIcon />
                  <span>Choose Polymorphs</span>
                </div>
              )}
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
                {characters.length > 0 ? (
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
                        disabled={tokenApproved || loadingApprove}
                      >
                        {loadingApprove ? <LoadingSpinner /> : null} Approve
                        Token
                      </Button>
                      <Button
                        className="light-button"
                        onClick={handleBurnToMint}
                        disabled={!tokenApproved || loadingBurnToMint}
                      >
                        {loadingBurnToMint ? <LoadingSpinner /> : null} Burn
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1>No Polymorphs selected</h1>
                    <p>
                      Please go back and select the polymorphs you'd like to
                      burn.
                    </p>
                  </div>
                )}
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
