import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePolymorphStore } from "src/stores/polymorphStore";
import ClaimFacesCarousel from "./ClaimFacesCarousel";
import { ArtistsInfo } from "./ArtistsInfo";
import Popup from "reactjs-popup";
import MintPolymorphicFaceSuccessPopup from "../popups/MintPolymorphicFaceSuccessPopup";
import ClaimLoadingPopup from "@legacy/popups/ClaimLoadingPopup";
import { useContractsStore } from "src/stores/contractsStore";
import { useAuthStore } from "src/stores/authStore";
import PlusIcon from "../../assets/images/plus-icon-white.svg";
import MinusIcon from "../../assets/images/minus-icon-white.svg";
import { queryPolymorphsGraphV2 } from "@legacy/graphql/polymorphQueries";
import { mintedV2Polymorphs } from "@legacy/graphql/polymorphQueries";

const etherscanTxLink = "https://etherscan.io/tx/";

const ClaimFacesSection = () => {
  const router = useRouter();
  const [facesAmountToClaim, setFacesAmountToClaim] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [burntCount, setBurntCount] = useState();

  const { address } = useAuthStore();
  const { userPolymorphs, userPolymorphicFacesClaimed, userPolymorphsV1Burnt } =
    usePolymorphStore();
  const { polymorphicFacesContract, polymorphContractV2 } = useContractsStore();

  const availableFacesToClaim = burntCount - userPolymorphicFacesClaimed.length;

  const facesClaimCountHandler = (method) => {
    if (
      method === "add" &&
      facesAmountToClaim < 20 &&
      facesAmountToClaim < availableFacesToClaim
    ) {
      setFacesAmountToClaim(facesAmountToClaim + 1);
    }
    if (method === "sub" && facesAmountToClaim > 0) {
      setFacesAmountToClaim(facesAmountToClaim - 1);
    }
  };

  useEffect(async () => {
    if (address) {
      const { mintedEntities } = await queryPolymorphsGraphV2(
        mintedV2Polymorphs(address)
      );
      setBurntCount(mintedEntities.length);
    }
  }, [address]);

  const claimTxHandler = async () => {
    try {
      setShowLoadingModal(true);
      const claimTx = await polymorphicFacesContract.claim(facesAmountToClaim);
      const claimTxReceipt = await claimTx.wait();

      if (claimTxReceipt.status !== 1) {
        console.log("Error while claiming faces");
        setShowLoadingModal(false);
        setShowSuccessModal(false);
        return;
      }
      setTxHash(etherscanTxLink + claimTxReceipt.transactionHash);
      setShowLoadingModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setShowLoadingModal(false);
      setShowSuccessModal(false);
    }
  };

  return (
    <>
      <div className="claim__faces__section">
        <div className="claim__faces__container">
          <div className="header__subsection">
            <div className="heading">Claim Your Polymorphic Faces</div>
            <div className="subheading">
              Each V1 Polymorph burned grants a free Polymorphic Face claim!
              <br />
              Polymorphic Faces are built to scramble and can only be obtained
              by burning V1 Polymorphs.
            </div>
            <div className="claim__container">
              <div className="claim__faces">
                <div className="count">
                  <span>
                    {availableFacesToClaim ? availableFacesToClaim : "0"}{" "}
                  </span>
                </div>
                <div className="change__count">
                  <div>
                    Faces to Claim
                    <span> ({userPolymorphicFacesClaimed.length} claimed)</span>
                  </div>
                  <div className="buttons__wrapper">
                    <div>
                      <button
                        className={`${
                          facesAmountToClaim === 0 ? "disabled" : ""
                        }`}
                        onClick={() => facesClaimCountHandler("sub")}
                      >
                        <img src={MinusIcon} alt='' />
                      </button>
                      <span>{facesAmountToClaim}</span>
                      <button
                        className={`${
                          facesAmountToClaim === 20 ? "disabled" : ""
                        }`}
                        onClick={() => facesClaimCountHandler("add")}
                      >
                        <img src={PlusIcon} alt='' />
                      </button>
                    </div>
                    <button
                      disabled={facesAmountToClaim === 0}
                      className={`light-button ${
                        facesAmountToClaim === 0 ? "disabled" : ""
                      }`}
                      onClick={claimTxHandler}
                    >
                      Claim
                    </button>
                  </div>
                </div>
              </div>
              <div className="burn__polymorphs">
                <div className="count">{userPolymorphs.length}</div>
                <div className="change__count">
                  <div>
                    Polymorphs to Burn <span>({burntCount ? burntCount : '0'} burnt)</span>
                  </div>
                  <div className="buttons__wrapper">
                    <button
                      className="light-button"
                      onClick={() => router.push("/burn-to-mint/burn")}
                    >
                      Burn to Mint
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
      <div className="carousel__subsection">
        <ClaimFacesCarousel />
      </div>
      <div className="artists__subsection">
        <div className="heading">Artists</div>

        <div className="artists__list__container">
          {ArtistsInfo.map((artist) => {
            return (
              <div className="artist__container" key={artist.name}>
                <div className="left--border" />
                <div className="bottom--border" />
                <img src={artist.image} alt="artist" />
                <div className="artist__info">
                  <p>{artist.name}</p>
                  <button onClick={() => window.open(artist.portfolioLink)}>
                    Portfolio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showLoadingModal && (
        <Popup closeOnDocumentClick={false} open={showLoadingModal}>
          <ClaimLoadingPopup
            onClose={() => setShowLoadingModal(false)}
            text={"Claiming Your Polymorphic Face..."}
          />
        </Popup>
      )}
      {showSuccessModal ? (
        <Popup closeOnDocumentClick={false} open={showSuccessModal}>
          <MintPolymorphicFaceSuccessPopup
            amount={facesAmountToClaim}
            txHash={txHash}
            onClose={() => setShowSuccessModal(false)}
          ></MintPolymorphicFaceSuccessPopup>
        </Popup>
      ) : null}
    </>
  );
};

export default ClaimFacesSection;
