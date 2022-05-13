import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Popup from 'reactjs-popup';
// import './DesktopView.scss';
import HeaderAvatar from '../../HeaderAvatar';
import SelectWalletPopup from '../../../popups/SelectWalletPopup.jsx';
import copyIcon from '../../../../assets/images/copy.svg';
import arrowUP from '../../../../assets/images/arrow-down.svg';
import Group1 from '../../../../assets/images/Group1.svg';
import auctionHouseIcon from '../../../../assets/images/auction-house.svg';
import marketplaceIcon from '../../../../assets/images/nft-marketplace.svg';
import socialMediaIcon from '../../../../assets/images/social-media.svg';
import polymorphsIcon from '../../../../assets/images/polymorphs.svg';
import coreDropsIcon from '../../../../assets/images/core-drops.svg';
import navChartIcon from '../../../../assets/images/chart-nav-icon.svg';
import aboutIcon from '../../../../assets/images/about.svg';
import whitepaperIcon from '../../../../assets/images/whitepaper.svg';
import teamIcon from '../../../../assets/images/team.svg';
import governanceIcon from '../../../../assets/images/governance.svg';
import yieldFarmingIcon from '../../../../assets/images/yield-farming.svg';
import forumIcon from '../../../../assets/images/forum.svg';
import signalIcon from '../../../../assets/images/signal.svg';
import docsIcon from '../../../../assets/images/docs.svg';
import supportIcon from '../../../../assets/images/supportIcon.svg';
import myProfileIcon from '../../../../assets/images/my-profile.svg';
import myNFTsIcon from '../../../../assets/images/my-nfts.svg';
import signOutIcon from '../../../../assets/images/sign-out.svg';
import {
  shortenEnsDomain,
  shortenEthereumAddress,
  toFixed,
} from '../../../../utils/helpers/format';
import { useRouter } from 'next/router';
import Badge from '../../../badge/Badge';
import { useUserBalanceStore } from '../../../../stores/balanceStore';
import { useAuthStore } from '../../../../stores/authStore';

const DesktopView = ({
  isWalletConnected,
  setIsWalletConnected,
  ethereumAddress,
  handleConnectWallet,
  showInstallWalletPopup,
  setShowInstallWalletPopup,
  selectedWallet,
  setSelectedWallet,
}) => {
  const [isAccountDropdownOpened, setIsAccountDropdownOpened] = useState(false);
  const [isMintingDropdownOpened, setIsMintingDropdownOpened] = useState(false);
  const [isPolymorphsDropdownOpened, setIsPolymorphsDropdownOpened] = useState(false);
  const [isAboutDropdownOpened, setIsAboutDropdownOpened] = useState(false);
  const [isDAODropdownOpened, setIsDAODropdownOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  // const location = useLocation();
  const {
    address,
    isAuthenticated,
    yourEnsDomain,
    loggedInArtist,
    signOut,
    isAuthenticating,
  } = useAuthStore(s => ({
    address: s.address,
    isAuthenticated: s.isAuthenticated,
    yourEnsDomain: s.yourEnsDomain,
    loggedInArtist: s.loggedInArtist,
    signOut: s.signOut,
    isAuthenticating: s.isAuthenticating,
  }))

  const { yourBalance, usdEthBalance } = useUserBalanceStore(state => ({yourBalance: state.yourBalance, usdEthBalance: state.usdEthBalance}))

  return (
    <div className="desktop__nav">
      <ul>
        <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push('/burn-to-mint')}
          >
              <span className="nav__link__title">Burn to Mint</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push('/polymorph-rarity')}
          >
            <span className="nav__link__title">Rarity Chart</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => router.push('/my-polymorphs')}
          >
            <span className="nav__link__title">My Polymorphs
              {/* Change the hardcoded value to the user's amount of polymorphs */}
              <span>16</span>
            </span>
          </button>
        </li>
        {/* <li>
          <button
            type="button"
            className="menu-li"
            onClick={() => setIsDAODropdownOpened(!isDAODropdownOpened)}
          >
            <span className="nav__link__title">DAO</span>
            <img className="arrow" src={arrowUP} alt="arrow" />
          </button>
          <div className="dropdown minting-drop">
            <div className="dropdown__body">
              <button
                type="button"
                onClick={() => {
                  setIsDAODropdownOpened(false);
                  window.open('https://dao.universe.xyz/governance');
                }}
              >
                <img src={governanceIcon} alt="Governance" />
                <span>Governance</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDAODropdownOpened(false);
                  window.open('https://dao.universe.xyz/yield-farming');
                }}
              >
                <img src={yieldFarmingIcon} alt="Yield Farming" />
                <span>Yield Farming</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDAODropdownOpened(false);
                  window.open('https://forum.universe.xyz/');
                }}
              >
                <img src={forumIcon} alt="Forum" />
                <span>Forum</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDAODropdownOpened(false);
                  window.open('https://signal.universe.xyz/#/');
                }}
              >
                <img src={signalIcon} alt="Signal" />
                <span>Signal</span>
              </button>
            </div>
          </div>
        </li> */}
        {isWalletConnected && isAuthenticated ? (
          <li>
            <button
              // style={{ width: 200 }}
              type="button"
              className="menu-li myAccount"
              onClick={() => setIsAccountDropdownOpened(!isAccountDropdownOpened)}
            >
              <HeaderAvatar scale={3} />
              <span className="nav__link__title">
                <div className="ethereum__address">
                    {yourEnsDomain
                      ? shortenEnsDomain(yourEnsDomain)
                      : shortenEthereumAddress(ethereumAddress)}
                </div>
              </span>
              <img className="arrow" src={arrowUP} alt="arrow" />
            </button>
            <div className="dropdown drop-account">
              <div className="dropdown__header">
                <div className="copy-div">
                  <button
                    type="button"
                    style={{ background: 'transparent' }}
                    onClick={() => {
                      if (!loggedInArtist.universePageAddress && !address) return;

                      const path = loggedInArtist.universePageAddress
                        ? loggedInArtist.universePageAddress
                        : address;
                        router.push(`/${path}`, {
                        id: loggedInArtist.id,
                      });

                      setIsAccountDropdownOpened(false);
                    }}
                  >
                    <HeaderAvatar scale={4} />
                  </button>
                  <div className="ethereum__address">
                    {yourEnsDomain
                      ? shortenEnsDomain(yourEnsDomain)
                      : shortenEthereumAddress(ethereumAddress)}
                  </div>
                  <div className="copy__div">
                    <div className="copy" title="Copy to clipboard">
                      <div className="copied-div" hidden={!copied}>
                        Address copied!
                        <span />
                      </div>
                      <CopyToClipboard
                        text={ethereumAddress}
                        onCopy={() => {
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 1000);
                        }}
                      >
                        <span>
                          <img src={copyIcon} alt="Copy to clipboard icon" className="copyImg" />
                        </span>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>

                <div className="group1">
                  <img src={Group1} alt="ETH" />
                  <span className="first-span">{toFixed(yourBalance, 2)} ETH</span>
                  <span className="second-span">${toFixed(usdEthBalance, 2)}</span>
                </div>
                {/* <div className="group2">
                  <img src={Group2} alt="WETH" />
                  <span className="first-span">6,24 WETH</span>
                  <span className="second-span">$10,554</span>
                </div> */}
              </div>
              <div className="dropdown__body">
                <button
                  type="button"
                  className="disconnect"
                  onClick={() => {
                    signOut();
                    router.push('/');
                    setIsAccountDropdownOpened(false);
                  }}
                >
                  {/* <img src={signOutIcon} alt="Sign out" /> */}
                  Disconnect
                </button>
              </div>
            </div>
          </li>
        ) : (
          <li>
            <Popup
              closeOnDocumentClick={false}
              trigger={
                <button type="button" className="sign__in">
                  {isAuthenticating ? 'Signing in...' : 'Sign in'}
                </button>
              }
            >
              {(close) => (
                <SelectWalletPopup
                  close={close}
                  handleConnectWallet={handleConnectWallet}
                  showInstallWalletPopup={showInstallWalletPopup}
                  setShowInstallWalletPopup={setShowInstallWalletPopup}
                  selectedWallet={selectedWallet}
                  setSelectedWallet={setSelectedWallet}
                />
              )}
            </Popup>
          </li>
        )}
      </ul>
    </div>
  );
};

DesktopView.propTypes = {
  isWalletConnected: PropTypes.bool.isRequired,
  setIsWalletConnected: PropTypes.func.isRequired,
  ethereumAddress: PropTypes.string.isRequired,
  handleConnectWallet: PropTypes.func.isRequired,
  showInstallWalletPopup: PropTypes.bool.isRequired,
  setShowInstallWalletPopup: PropTypes.func.isRequired,
  selectedWallet: PropTypes.string.isRequired,
  setSelectedWallet: PropTypes.func.isRequired,
};

export default DesktopView;
