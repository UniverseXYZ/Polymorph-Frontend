import { useState } from "react";
import { useRouter } from "next/router";
import { usePolymorphStore } from "src/stores/polymorphStore";
import ClaimFacesCarousel from "./ClaimFacesCarousel";
import { ArtistsInfo } from "./ArtistsInfo";
import Popup from "reactjs-popup";
import MintPolymorphicFaceSuccessPopup from "../popups/MintPolymorphicFaceSuccessPopup";
import { useContractsStore } from "src/stores/contractsStore";

const etherscanTxLink = "https://etherscan.io/tx/";

const ClaimFacesSection = () => {
  const router = useRouter();
  const [facesAmountToClaim, setFacesAmountToClaim] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState("");

  const { userPolymorphs, userPolymorphicFacesClaimed, userPolymorphsV1Burnt } =
    usePolymorphStore();
  const { polymorphicFacesContract } = useContractsStore();

  const availableFacesToClaim =
    userPolymorphsV1Burnt.length - userPolymorphicFacesClaimed.length;

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

  const claimTxHandler = async () => {
    const claimTx = await polymorphicFacesContract["mint(uint256)"](
      facesAmountToClaim
    );
    const claimTxReceipt = await claimTx.wait();

    if (claimTxReceipt.status !== 1) {
      console.log("Error while claiming faces");
      setShowSuccessModal(false);
      return;
    }
    setTxHash(etherscanTxLink + claimTxReceipt.transactionHash);
    setShowSuccessModal(true);
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
                  {userPolymorphsV1Burnt && userPolymorphicFacesClaimed ? (
                    <span>
                      {userPolymorphsV1Burnt.length -
                        userPolymorphicFacesClaimed.length}{" "}
                    </span>
                  ) : null}
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
                        -
                      </button>
                      <span>{facesAmountToClaim}</span>
                      <button
                        className={`${
                          facesAmountToClaim === 20 ? "disabled" : ""
                        }`}
                        onClick={() => facesClaimCountHandler("add")}
                      >
                        +
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
                    Polymorphs to Burn{" "}
                    <span>({userPolymorphsV1Burnt.length} burnt)</span>
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
