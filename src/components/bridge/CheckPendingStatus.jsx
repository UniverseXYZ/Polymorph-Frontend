import axios from "axios";
import { useEffect, useState } from "react";
import { useContractsStore } from "src/stores/contractsStore";
import LoadingSpinner from "@legacy/svgs/LoadingSpinnerBlack";
import polygonIcon from "../../assets/images/polygon-icon.png";
import ethereumIcon from "../../assets/images/eth-icon-blue.png";
import arrowRight from "../../assets/images/bridge/arrow-right.png";
import Image from "next/image";
import { Tooltip } from "@chakra-ui/react";
import { useAuthStore } from "src/stores/authStore";

const CheckPendingStatus = ({ id, nft, direction }) => {
  const { polymorphicFacesRootTunnel } = useContractsStore();
  const { activeNetwork } = useAuthStore();

  const [proofObject, setProofObject] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [buttonName, setButtonName] = useState("Check");

  const checkIfReady = async (id) => {
    setIsChecking(true);
    setButtonName("Check");

    try {
      const result = await axios
        .get(`/api/proofForFaces/${id}/`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then(({ data }) => {
          if (data.transferStatus.isCheckPointed === true) {
            setProofObject(data.transferStatus);
            setIsReady(true);
            setIsChecking(false);
          } else {
            setIsChecking(false);
            setButtonName("Try again");
          }
        });
    } catch (err) {
      console.log(err);
      setIsChecking(false);
      setIsReady(false);
    }
  };

  const unlockHandler = async () => {
    setIsUnlocking(true);
    try {
      console.log(proofObject.proof);
      if (nft === "face") {
        const tx = await polymorphicFacesRootTunnel.receiveMessage(
          proofObject.proof
        );
        const txReceipt = await tx.wait();

        if (txReceipt.status !== 1) {
          console.log("Error bridging tokens");
          return;
        }
        setIsUnlocking(false);
      }
    } catch (err) {
      console.log(err);
      setIsUnlocking(false);
    }
  };

  return (
    <div className={"pending-item"}>
      <div className="images">
        {direction === "Ethereum" && (
          <>
            <Image src={polygonIcon} width={18} height={18} alt="" />
            <Image src={arrowRight} width={12} height={12} alt="" />
            <Image src={ethereumIcon} width={18} height={18} alt="" />
            <span>Polymorphic Face #{id}</span>
          </>
        )}
        {direction === "Polygon" && (
          <>
            <Image src={ethereumIcon} width={18} height={18} alt="" />
            <Image src={arrowRight} width={12} height={12} alt="" />
            <Image src={polygonIcon} width={18} height={18} alt="" />
            <span>Polymorphic Face #{id}</span>
          </>
        )}
      </div>
      {!isReady && direction === "Ethereum" && (
        <button
          className="light-button"
          onClick={() => checkIfReady(id)}
          disabled={isChecking}
        >
          {isChecking ? <LoadingSpinner /> : null}
          <span>{buttonName}</span>
        </button>
      )}
      {isReady && direction === "Ethereum" && (
        <Tooltip
          hasArrow
          label={`${
            activeNetwork !== "Ethereum" ? "Only available on Ethereum" : ""
          }`}
        >
          <span>
            <button
              className="light-button"
              onClick={unlockHandler}
              disabled={activeNetwork !== "Ethereum"}
            >
              {isUnlocking ? <LoadingSpinner /> : null}
              <span>Unlock</span>
            </button>
          </span>
        </Tooltip>
      )}
    </div>
  );
};

export default CheckPendingStatus;
