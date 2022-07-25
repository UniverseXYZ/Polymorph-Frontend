import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useHistory, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Popup from "reactjs-popup";
// import './Header.scss';
import Button from "../button/Button";
import DesktopView from "./dimensions/desktop/DesktopView.jsx";
import TabletView from "./dimensions/tablet/TabletView.jsx";
import MobileView from "./dimensions/mobile/MobileView.jsx";
import AppContext from "../../ContextAPI";
import appDarkLogo from "../../assets/images/dark.svg";
import appLightLogo from "../../assets/images/light.svg";
import polymorphsDarkLogo from "../../assets/images/polymorphs-logo-dark.svg";
import polymorphsLightLogo from "../../assets/images/polymorphs-logo-light.svg";
import searchIcon from "../../assets/images/search-gray.svg";
import closeIcon from "../../assets/images/close-menu.svg";
import mp3Icon from "../../assets/images/mp3-icon.png";
import audioIcon from "../../assets/images/marketplace/audio-icon.svg";
import { defaultColors, handleScroll } from "../../utils/helpers";
import { CONNECTORS_NAMES } from "../../utils/dictionary";
// import { useLayout } from "../../app/providers";
import SelectWalletPopup from "../popups/SelectWalletPopup";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuthStore } from "../../stores/authStore";
import { useThemeStore } from "src/stores/themeStore";
import { useContractsStore } from "src/stores/contractsStore";
import { ethers } from "ethers";
import { usePolymorphStore } from "src/stores/polymorphStore";
import MintPolymorphicFaceSuccessPopup from "../popups/MintPolymorphicFaceSuccessPopup";
import ClaimLoadingPopup from "@legacy/popups/ClaimLoadingPopup";

const etherscanTxLink = "https://etherscan.io/tx/";

const Header = () => {
  const {
    isWalletConnected,
    setIsWalletConnected,
    connectWithWalletConnect,
    connectWithCoinbase,
    connectWithMetaMask,
    address,
    setLoginFn,
    onAccountsChanged,
  } = useAuthStore((s) => ({
    isWalletConnected: s.isWalletConnected,
    setIsWalletConnected: s.setIsWalletConnected,
    connectWithWalletConnect: s.connectWithWalletConnect,
    connectWithCoinbase: s.connectWithCoinbase,
    connectWithMetaMask: s.connectWithMetaMask,
    address: s.address,
    setLoginFn: s.setLoginFn,
    onAccountsChanged: s.onAccountsChanged,
  }));

  const { userPolymorphsAll, userPolymorphicFacesClaimed, userPolymorphs } =
    usePolymorphStore();

  const { polymorphicFacesContract, polymorphContractV2 } = useContractsStore();

  const router = useRouter();

  const darkMode = useThemeStore((s) => s.darkMode);
  // const { headerRef } = useLayout();

  const [selectedWallet, setSelectedWallet] = useState("");
  const [installed, setInstalled] = useState(
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
      ? true
      : false
  );
  const [showMenu, setShowMenu] = useState(false);
  const [showSelectWallet, setShowSelectWallet] = useState(false);
  const [showInstallWalletPopup, setShowInstallWalletPopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const searchRef = useRef();
  const ref = useRef();
  const [userPolymorphsCount, setUserPolymorphsCount] = useState(null);
  const [facesAmountToClaim, setFacesAmountToClaim] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [burntCount, setBurntCount] = useState();

  const availableFacesToClaim = burntCount - userPolymorphicFacesClaimed.length;

  const handleSearchKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (searchValue) {
        router.push(`/search`, { query: searchValue });
        setSearchValue("");
        searchRef.current.blur();
      }
    }
  };
  const handleAllResults = () => {
    router.push(`/search`, { query: searchValue });
    setSearchValue("");
    searchRef.current.blur();
  };

  const handleConnectWallet = async (wallet) => {
    // Here need to check if selected wallet is installed in browser
    setSelectedWallet(wallet);
    if (installed) {
      if (
        wallet === CONNECTORS_NAMES.MetaMask &&
        typeof window.ethereum !== "undefined"
      ) {
        await connectWithMetaMask();
        setShowMenu(false);
        setShowSelectWallet(false);
      } else if (wallet === CONNECTORS_NAMES.WalletConnect) {
        await connectWithWalletConnect();
        setIsWalletConnected(true);
        setShowMenu(false);
        setShowSelectWallet(false);
      } else if (wallet === CONNECTORS_NAMES.Coinbase) {
        await connectWithCoinbase();
        setShowMenu(false);
        setShowSelectWallet(false);
      }
    } else {
      setShowInstallWalletPopup(true);
    }
  };

  const handleClickOutside = (event) => {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      searchRef.current &&
      !searchRef.current.contains(event.target)
    ) {
      setSearchValue("");
    }
  };

  const getUsersPolymorphsCount = async () => {
    setUserPolymorphsCount(userPolymorphsAll.length);
  };

  useEffect(() => {
    if (isWalletConnected) {
      getUsersPolymorphsCount();
    } else {
      setUserPolymorphsCount(null);
    }
  }, [isWalletConnected, onAccountsChanged, userPolymorphsAll]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    setShowMenu(false);
    if (
      router.asPath === "/" ||
      router.asPath === "/about" ||
      router.asPath === "/minting-and-auctions/marketplace/active-auctions" ||
      router.asPath === "/minting-and-auctions/marketplace/future-auctions" ||
      router.asPath === "/polymorphs" ||
      router.asPath === "/mint-polymorph" ||
      router.asPath === "/team"
    ) {
      document.querySelector("header").classList.add("dark");
    } else {
      document.querySelector("header").classList.remove("dark");
    }
  }, [router.asPath]);

  useEffect(() => {
    if (darkMode && showMenu) {
      document.querySelector("header").classList.remove("dark");
    } else if (darkMode && !showMenu) {
      document.querySelector("header").classList.add("dark");
    }
  }, [showMenu, darkMode]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setLoginFn(() => () => {
      setShowLoginPopup(true);
    });
  }, [setLoginFn]);

  useEffect(async () => {
    if (polymorphContractV2 && address) {
      const burntAmount = await polymorphContractV2.burnCount(address);
      setBurntCount(burntAmount.toNumber());
    }
  }, [polymorphContractV2 && address]);

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
    try {
      setShowLoadingModal(true);
      const claimTx = await polymorphicFacesContract["mint(uint256)"](
        facesAmountToClaim
      );
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
    <header>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div className="app__logo">
        <Link href="/">
          <a className="dark">
            <img src={polymorphsDarkLogo} alt="App Logo" />
          </a>
        </Link>
        <Link href="/">
          <a className="light">
            {/* <img src={appLightLogo} alt="App Logo" /> */}
            <img src={polymorphsLightLogo} alt="App Logo" />
          </a>
        </Link>
        {/* <div className="search--field">
          <div className={`search--field--wrapper ${searchFocus || searchValue ? 'focus' : ''}`}>
            <div className="box--shadow--effect--block" />
            <img className="search" src={searchIcon} alt="Search" />
            <input
              type="text"
              className="inp"
              placeholder="Search"
              ref={searchRef}
              onChange={(e) => e.target.value.length < 16 && setSearchValue(e.target.value)}
              value={searchValue}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            {searchValue.length > 0 && (
              <>
                <img
                  className="close"
                  src={closeIcon}
                  alt="Close"
                  onClick={() => setSearchValue('')}
                  aria-hidden="true"
                />
                <div className="search__results" ref={ref}>
                  {PLACEHOLDER_MARKETPLACE_NFTS.filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                  ).length > 0 ||
                  PLACEHOLDER_MARKETPLACE_USERS.filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                  ).length > 0 ||
                  PLACEHOLDER_MARKETPLACE_AUCTIONS.filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                  ).length > 0 ||
                  PLACEHOLDER_MARKETPLACE_COLLECTIONS.filter((item) =>
                    item.name.toLowerCase().includes(searchValue.toLowerCase())
                  ).length > 0 ? (
                    // PLACEHOLDER_MARKETPLACE_COMMUNITIES.filter((item) =>
                    //   item.name.toLowerCase().includes(searchValue.toLowerCase())
                    // ).length > 0 ||
                    // PLACEHOLDER_MARKETPLACE_GALLERIES.filter((item) =>
                    //   item.name.toLowerCase().includes(searchValue.toLocaleLowerCase())
                    // ).length ? (
                    <div className="search__nfts">
                      {PLACEHOLDER_MARKETPLACE_NFTS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).length > 0 && <h4>NFTs</h4>}
                      {PLACEHOLDER_MARKETPLACE_NFTS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).map((nft) => (
                        <div className="nft__div">
                          <div className="nft--image">
                            {nft.media.type !== 'audio/mpeg' && nft.media.type !== 'video/mp4' && (
                              <img src={nft.media.url} alt="NFT" />
                            )}
                            {nft.media.type === 'video/mp4' && (
                              <video
                                onMouseOver={(event) => event.target.play()}
                                onFocus={(event) => event.target.play()}
                                onMouseOut={(event) => event.target.pause()}
                                onBlur={(event) => event.target.pause()}
                              >
                                <source src={nft.media.url} type="video/mp4" />
                                <track kind="captions" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                            {nft.media.type === 'audio/mpeg' && (
                              <img className="nft--image" src={mp3Icon} alt={nft.name} />
                            )}
                            {nft.media.type === 'audio/mpeg' && (
                              <div className="video__icon">
                                <img src={audioIcon} alt="Video Icon" />
                              </div>
                            )}
                          </div>
                          <div className="nft--desc">
                            <h5 className="nft--name">{nft.name}</h5>
                            <p className="nft--price">
                              {nft.price} ETH / {nft.editions.split('/')[0]} of{' '}
                              {nft.editions.split('/')[1]}
                            </p>
                          </div>
                        </div>
                      ))}
                      {PLACEHOLDER_MARKETPLACE_USERS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).length > 0 && <h4>Users</h4>}
                      {PLACEHOLDER_MARKETPLACE_USERS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).map((user) => (
                        <div className="users__div">
                          <div className="user--avatar">
                            <img src={user.avatar} alt="User" />
                          </div>
                          <div className="user--desc">
                            <h5 className="user--name">{user.name}</h5>
                            <p className="user--followers">{user.followers} Followers</p>
                          </div>
                        </div>
                      ))}
                      {PLACEHOLDER_MARKETPLACE_AUCTIONS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).length > 0 && <h4>Auctions</h4>}
                      {PLACEHOLDER_MARKETPLACE_AUCTIONS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).map((auction) => (
                        <div className="auction__div">
                          <div className="auction--image">
                            <img src={auction.photo} alt="Auction" />
                          </div>
                          <div className="auction--desc">
                            <h5 className="auction--title">{auction.name}</h5>
                            <p className="auction--artist">by {auction.creator.name}</p>
                          </div>
                        </div>
                      ))}
                      {PLACEHOLDER_MARKETPLACE_COLLECTIONS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).length > 0 && <h4>Collections</h4>}
                      {PLACEHOLDER_MARKETPLACE_COLLECTIONS.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).map((collection) => (
                        <div className="collection__div">
                          {!collection.photo ? (
                            <div
                              className="random--avatar--color"
                              style={{
                                backgroundColor:
                                  defaultColors[Math.floor(Math.random() * defaultColors.length)],
                              }}
                            >
                              {collection.name.charAt(0)}
                            </div>
                          ) : (
                            <div className="collection--image">
                              <img src={collection.photo} alt="Coll" />
                            </div>
                          )}
                          <div className="collection--desc">
                            <h5 className="collection--name">{collection.name}</h5>
                            <p className="collection--owner">by {collection.owner.name}</p>
                          </div>
                        </div>
                      ))}
                      {PLACEHOLDER_MARKETPLACE_COMMUNITIES.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).length > 0 && <h4>Communities</h4>}
                      {PLACEHOLDER_MARKETPLACE_COMMUNITIES.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).map((communities) => (
                        <div className="communities__div">
                          <div className="communities--photo">
                            <img src={communities.photo} alt="Comm" />
                          </div>
                          <div className="communities--desc">
                            <h5 className="communities--name">{communities.name}</h5>
                            <p className="communities--members">{communities.members} Members</p>
                          </div>
                        </div>
                      ))}
                      {PLACEHOLDER_MARKETPLACE_GALLERIES.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLocaleLowerCase())
                      ).length > 0 && <h4>Galleries</h4>}
                      {PLACEHOLDER_MARKETPLACE_GALLERIES.filter((item) =>
                        item.name.toLowerCase().includes(searchValue.toLowerCase())
                      ).map((galleries) => (
                        <div className="galleries__div">
                          <div className="galleries--photo">
                            <img src={galleries.photos[0]} alt="Gall" />
                          </div>
                          <div className="galleries--desc">
                            <h5 className="galleries--name">{galleries.name}</h5>
                            <p className="galleries--likes">{galleries.likesCount} Likes</p>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="light-border-button"
                        onClick={() => handleAllResults()}
                      >
                        All results
                      </Button>
                    </div>
                  ) : (
                    <div className="no__result">
                      <p>No items found</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div> */}
      </div>
      <DesktopView
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
        ethereumAddress={address || ""}
        handleConnectWallet={handleConnectWallet}
        showInstallWalletPopup={showInstallWalletPopup}
        setShowInstallWalletPopup={setShowInstallWalletPopup}
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
        userPolymorphsCount={userPolymorphsCount}
        userPolymorphsToBurnCount={userPolymorphs?.length}
        userPolymorphsBurntCount={burntCount}
        userClaimedFacesCount={userPolymorphicFacesClaimed?.length}
        claimTx={claimTxHandler}
        setFacesAmountToClaim={facesClaimCountHandler}
        facesAmountToClaim={facesAmountToClaim}
      />
      <TabletView
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
        ethereumAddress={address || ""}
        handleConnectWallet={handleConnectWallet}
        showInstallWalletPopup={showInstallWalletPopup}
        setShowInstallWalletPopup={setShowInstallWalletPopup}
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setShowSearch={setShowSearch}
        showSearch={showSearch}
        userPolymorphsCount={userPolymorphsCount}
        userPolymorphsToBurnCount={userPolymorphs?.length}
        userPolymorphsBurntCount={burntCount}
        userClaimedFacesCount={userPolymorphicFacesClaimed?.length}
        claimTx={claimTxHandler}
        setFacesAmountToClaim={facesClaimCountHandler}
        facesAmountToClaim={facesAmountToClaim}
      />
      <MobileView
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
        ethereumAddress={address || ""}
        handleConnectWallet={handleConnectWallet}
        setShowMenu={setShowMenu}
        setShowSelectWallet={setShowSelectWallet}
        showMenu={showMenu}
        showSelectWallet={showSelectWallet}
        showInstallWalletPopup={showInstallWalletPopup}
        setSelectedWallet={setSelectedWallet}
        setShowInstallWalletPopup={setShowInstallWalletPopup}
        selectedWallet={selectedWallet}
        setShowMobileSearch={setShowMobileSearch}
        showMobileSearch={showMobileSearch}
        userPolymorphsCount={userPolymorphsCount}
        userPolymorphsToBurnCount={userPolymorphs?.length}
        userPolymorphsBurntCount={burntCount}
        userClaimedFacesCount={userPolymorphicFacesClaimed?.length}
        claimTx={claimTxHandler}
        setFacesAmountToClaim={facesClaimCountHandler}
        facesAmountToClaim={facesAmountToClaim}
      />

      <Popup
        closeOnDocumentClick={false}
        trigger={<></>}
        open={showLoginPopup}
        onOpen={() => setShowLoginPopup(true)}
        onClose={() => setShowLoginPopup(false)}
      >
        {(close) => (
          <SelectWalletPopup
            close={close}
            showInstallWalletPopup={showInstallWalletPopup}
            setShowInstallWalletPopup={setShowInstallWalletPopup}
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
            handleConnectWallet={(wallet) => {
              setShowLoginPopup(false);
              handleConnectWallet(wallet);
            }}
          />
        )}
      </Popup>
      {showLoadingModal && (
        <Popup closeOnDocumentClick={false} open={showLoadingModal}>
          <ClaimLoadingPopup onClose={() => setShowLoadingModal(false)} />
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
    </header>
  );
};

export default Header;
