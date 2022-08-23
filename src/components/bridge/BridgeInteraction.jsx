import Image from "next/image";
import polygonIcon from "../../assets/images/polygon-icon.png";
import ethereumIcon from "../../assets/images/eth-icon-blue.png";
import { usePolymorphStore } from "src/stores/polymorphStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "src/stores/authStore";
import { Tooltip } from "@chakra-ui/react";
import { useContractsStore } from "src/stores/contractsStore";
import { useMyNftsStore } from "src/stores/myNftsStore";
import LoadingSpinner from "@legacy/svgs/LoadingSpinnerBlack";
import Popup from "reactjs-popup";
import NftsBridgedSuccessPopup from "../popups/NftsBridgedSuccessPopup";
import CheckPendingStatus from "./CheckPendingStatus";

const etherscanTxLink = "https://etherscan.io/tx/";
const polygonscanTxLink = "https://polygonscan.com/tx/";

const BridgeInteraction = ({ bridgeFromNetwork }) => {
  const {
    setUserSelectedNFTsToBridge,
    userSelectedNFTsToBridge,
    userFacesBeingBridged,
  } = usePolymorphStore();

  const { myNFTsSelectedTabIndex } = useMyNftsStore();
  const { address, activeNetwork } = useAuthStore();
  const {
    polymorphContractV2,
    polymorphContractV2Polygon,
    polymorphRootTunnel,
    polymorphChildTunnel,
    polymorphicFacesContract,
    polymorphicFacesContractPolygon,
    polymorphicFacesRootTunnel,
    polymorphicFacesChildTunnel,
  } = useContractsStore();

  const [step, setStep] = useState(1);
  const [contract, setContract] = useState("");
  const [tunnelContract, setTunnelContract] = useState("");
  const [approved, setApproved] = useState(false);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);
  const [showSuccessTranfserModal, setShowSuccessTransferModal] =
    useState(false);
  const [txHash, setTxHash] = useState("");
  const [isApprovedForAll, setIsApprovedForAll] = useState();
  const [fetchedPendingFaces, setFetchedPendingFaces] = useState();

  useEffect(() => {
    setUserSelectedNFTsToBridge([]);
  }, [bridgeFromNetwork]);

  const approveHandler = async () => {
    if (activeNetwork !== bridgeFromNetwork) return;
    try {
      setLoadingApproved(true);
      const tx = await contract.setApprovalForAll(tunnelContract.address, true);
      const txReceipt = await tx.wait();
      if (txReceipt.status !== 1) {
        setApproved(false);
        console.log("Error approving tokens");
        return;
      }
      setApproved(true);
      setLoadingApproved(false);
      setStep(2);
    } catch (error) {
      console.log(error);
      setApproved(false);
      setLoadingApproved(false);
      setStep(1);
    }
  };

  const transferHandler = async () => {
    if (activeNetwork !== bridgeFromNetwork) return;
    try {
      setLoadingTransfer(true);
      const nftsToBridge = userSelectedNFTsToBridge.map((nft) => nft.tokenId);
      const tx = await tunnelContract.moveThroughWormhole(nftsToBridge);
      const txReceipt = await tx.wait();
      if (txReceipt.status !== 1) {
        setTransferred(false);
        console.log("Error transfering tokens");
        return;
      }
      setTransferred(true);
      setLoadingTransfer(false);
      const request = await fetch(
        `${
          process.env.REACT_APP_PENDING_DIRECTION_URL
        }ids=${nftsToBridge}&type=${myNFTsSelectedTabIndex}&direction=${
          bridgeFromNetwork === "Polygon" ? "Ethereum" : "Polygon"
        }`,
        {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await request.json();
      if (bridgeFromNetwork === "Polygon") {
        setStep(3);
        setShowSuccessTransferModal(true);
        setTxHash(polygonscanTxLink + txReceipt.transactionHash);
      } else if (bridgeFromNetwork === "Ethereum") {
        setShowSuccessTransferModal(true);
        setTxHash(etherscanTxLink + txReceipt.transactionHash);
      }
    } catch (error) {
      console.log(error);
      setTransferred(false);
      setLoadingTransfer(false);
      setStep(2);
    }
  };

  useEffect(() => {
    if (myNFTsSelectedTabIndex === 0 && bridgeFromNetwork === "Ethereum") {
      setContract(polymorphContractV2);
      setTunnelContract(polymorphRootTunnel);
    }
    if (myNFTsSelectedTabIndex === 0 && bridgeFromNetwork === "Polygon") {
      setContract(polymorphContractV2Polygon);
      setTunnelContract(polymorphChildTunnel);
    }
    if (myNFTsSelectedTabIndex === 1 && bridgeFromNetwork === "Ethereum") {
      setContract(polymorphicFacesContract);
      setTunnelContract(polymorphicFacesRootTunnel);
    }
    if (myNFTsSelectedTabIndex === 1 && bridgeFromNetwork === "Polygon") {
      setContract(polymorphicFacesContractPolygon);
      setTunnelContract(polymorphicFacesChildTunnel);
    }
  }, [myNFTsSelectedTabIndex, bridgeFromNetwork]);

  useEffect(async () => {
    if (
      activeNetwork === bridgeFromNetwork &&
      activeNetwork === "Ethereum" &&
      myNFTsSelectedTabIndex === 0
    ) {
      const hasApprovedAll = await polymorphContractV2.isApprovedForAll(
        address,
        polymorphRootTunnel.address
      );
      if (hasApprovedAll) {
        setStep(2);
      } else {
        setStep(1);
      }
      setIsApprovedForAll(hasApprovedAll);
    }
    if (
      activeNetwork === bridgeFromNetwork &&
      activeNetwork === "Ethereum" &&
      myNFTsSelectedTabIndex === 1
    ) {
      const hasApprovedAll = await polymorphicFacesContract.isApprovedForAll(
        address,
        polymorphicFacesRootTunnel.address
      );
      if (hasApprovedAll === true) {
        setStep(2);
      } else {
        setStep(1);
      }
      setIsApprovedForAll(hasApprovedAll);
    }
  }, [activeNetwork, bridgeFromNetwork, myNFTsSelectedTabIndex]);

  useEffect(async () => {
    const queryTokens = userFacesBeingBridged.map((face) => face.tokenId);
    if (userFacesBeingBridged) {
      const response = await fetch(
        `${process.env.REACT_APP_PENDING_DIRECTION_URL}ids=${queryTokens}&type=1`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setFetchedPendingFaces(data);
    }
  }, [userFacesBeingBridged]);

  return (
    <>
      <div className="bridge--interaction--container">
        <div className="header">
          <div>To Network</div>
          <div className="network">
            {bridgeFromNetwork === "Ethereum" && (
              <>
                <Image src={polygonIcon} width={24} height={24} alt="" />
                <div>Polygon</div>
              </>
            )}
            {bridgeFromNetwork === "Polygon" && (
              <>
                <Image src={ethereumIcon} width={24} height={24} alt="" />
                <div>Ethereum</div>
              </>
            )}
          </div>
        </div>
        <div className="body">
          <div className="selected--amount">
            <div>Selected NFTs</div>
            <div>
              {userSelectedNFTsToBridge ? userSelectedNFTsToBridge.length : "0"}{" "}
              / 20
            </div>
          </div>
          <div className="estimate--indicators">
            <div>
              <div>Gas cost</div>
              <div>~ $5.24</div>
            </div>
            <div>
              <div>Transfer time</div>
              <div>~ 1 hour</div>
            </div>
          </div>
          <div className="step">
            <div>Step 1</div>
            <Tooltip
              hasArrow
              label={`${
                activeNetwork !== bridgeFromNetwork
                  ? `Please switch your network to ${bridgeFromNetwork} for bridging NFTs from ${bridgeFromNetwork} to ${activeNetwork}.`
                  : ""
              }`}
            >
              <span>
                <button
                  className="light-button"
                  disabled={
                    step !== 1 ||
                    activeNetwork !== bridgeFromNetwork ||
                    userSelectedNFTsToBridge.length === 0 ||
                    loadingApproved
                  }
                  onClick={approveHandler}
                >
                  {loadingApproved ? <LoadingSpinner /> : null}
                  <span>Approve</span>
                </button>
              </span>
            </Tooltip>
          </div>
          <div className="step">
            <div>Step 2</div>
            <Tooltip
              hasArrow
              label={`${
                activeNetwork !== bridgeFromNetwork
                  ? `Please switch your network to ${bridgeFromNetwork} for bridging NFTs from ${bridgeFromNetwork} to ${activeNetwork}.`
                  : ""
              }`}
            >
              <span>
                <button
                  className="light-button"
                  disabled={
                    step !== 2 ||
                    activeNetwork !== bridgeFromNetwork ||
                    loadingTransfer ||
                    userSelectedNFTsToBridge.length === 0
                  }
                  onClick={transferHandler}
                >
                  {loadingTransfer ? <LoadingSpinner /> : null}
                  <span>Transfer</span>
                </button>
              </span>
            </Tooltip>
          </div>
        </div>
        {userFacesBeingBridged.length ? (
          <div className={"pending-nfts"}>
            <div className={"recent-transactions"}>Pending Transactions</div>
            {userFacesBeingBridged?.map((face) => {
              return (
                <CheckPendingStatus
                  id={face.tokenId}
                  nft="face"
                  pendingEntity={fetchedPendingFaces?.filter(
                    (fetchedFace) =>
                      fetchedFace.TokenId.toString() === face.tokenId
                  )}
                />
              );
            })}
          </div>
        ) : null}
      </div>
      <Popup closeOnDocumentClick={false} open={showSuccessTranfserModal}>
        {(close) => (
          <NftsBridgedSuccessPopup
            onClose={() => setShowSuccessTransferModal(false)}
            txHash={txHash}
          />
        )}
      </Popup>
    </>
  );
};

export default BridgeInteraction;
