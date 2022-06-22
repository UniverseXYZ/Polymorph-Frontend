import { useState } from "react";
import { useRouter } from "next/router";
import { usePolymorphStore } from "src/stores/polymorphStore";
import ClaimFacesCarousel from "./ClaimFacesCarousel";
import { ArtistsInfo } from "./ArtistsInfo";

const ClaimFacesSection = () => {
  const router = useRouter();
  const [facesAmountToClaim, setFacesAmountToClaim] = useState(0);

  const { userPolymorphs } = usePolymorphStore();

  // TO DO:
  // Add a condition, that the facesToClaimAmount is
  // <= the amount of available claimable faces
  const facesClaimCountHandler = (method) => {
    if (method === "add" && facesAmountToClaim < 20) {
      setFacesAmountToClaim(facesAmountToClaim + 1);
    }
    if (method === "sub" && facesAmountToClaim > 0) {
      setFacesAmountToClaim(facesAmountToClaim - 1);
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
                  <span>{6}</span>
                </div>
                <div className="change__count">
                  <div>
                    Faces to Claim
                    <span> (X claimed)</span>
                  </div>
                  <div className="buttons__wrapper">
                    <div>
                      <button onClick={() => facesClaimCountHandler("sub")}>
                        -
                      </button>
                      <span>{facesAmountToClaim}</span>
                      <button onClick={() => facesClaimCountHandler("add")}>
                        +
                      </button>
                    </div>
                    <button className="light-button">Claim</button>
                  </div>
                </div>
              </div>
              <div className="burn__polymorphs">
                <div className="count">{userPolymorphs.length}</div>
                <div className="change__count">
                  <div>
                    Polymorphs to Burn <span>(Y burnt)</span>
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
              <div className="artist__container">
                <img src={artist.image} />
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
    </>
  );
};

export default ClaimFacesSection;