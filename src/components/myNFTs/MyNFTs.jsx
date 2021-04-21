import { useContext, useEffect, useState } from 'react';
import Wallet from './Wallet';
import SavedNFTs from './SavedNFTs';
import SavedCollections from './SavedCollections';
import MintModal from '../mintModal/MintModal';
import AppContext from '../../ContextAPI';
import '../mintModal/Modals.scss';
import Popup from "reactjs-popup"
import LoadingPopup from '../popups/LoadingPopup'
import CongratsPopup from '../popups/CongratsPopup'
import { useLocation, useHistory } from 'react-router';
import arrow from '../../assets/images/arrow.svg';
import union from '../../assets/images/Union.svg';

const MyNFTs = () => {
    const { 
        savedNfts,
        savedCollections,
        setSavedNfts, 
        selectedTabIndex, 
        setSelectedTabIndex, 
        showModal, 
        setShowModal, 
        setActiveView, 
        myNFTs, 
        setMyNFTs,
        selectedNft,
        auction,
        setAuction
    } = useContext(AppContext);
    const tabs = ['Wallet', 'Saved NFTs', 'Saved Collections'];
    const [filteredNFTs, setFilteredNFTs] = useState([]);
    const location = useLocation();
    const isCreatingAction = location.pathname === '/select-nfts';
    const history = useHistory();

    console.log(location.state)
    // console.log(auction)

    const handleClose = () => {
        document.body.classList.remove('no__scroll');
        setShowModal(false);
    }

    const handleOpen = () => {
        setActiveView(null)
        setShowModal(true);
        document.body.classList.add('no__scroll')
    }

    const checkSelectedSavedNfts = () => {
        const res = savedNfts.filter(nft => nft.selected)

        return res.length ? false : true;
    }

    const handleMintSelected = () => {
        document.getElementById('loading-hidden-btn').click();
        setTimeout(() => {
            document.getElementById('popup-root').remove();
            document.getElementById('congrats-hidden-btn').click();
            setTimeout(() => {
                var newMyNFTs = [...myNFTs];
                savedNfts.forEach(nft => {
                    if (nft.selected) {
                        nft.type === 'single' ?
                            newMyNFTs.push({
                                id: nft.id,
                                type: nft.type,
                                previewImage: nft.previewImage,
                                name: nft.name,
                                description: nft.description,
                                numberOfEditions: Number(nft.numberOfEditions),
                                generatedEditions: nft.generatedEditions,
                            }) : 
                            newMyNFTs.push({
                                id: nft.id,
                                type: nft.type,
                                collectionId: nft.collectionName,
                                collectionName: nft.collectionName,
                                collectionAvatar: nft.collectionAvatar,
                                previewImage: nft.previewImage,
                                name: nft.name,
                                description: nft.description,
                                numberOfEditions: Number(nft.numberOfEditions),
                                generatedEditions: nft.generatedEditions,
                            });
                    }
                })
                setMyNFTs(newMyNFTs);
                const newSavedNFTs = savedNfts.filter(nft => !nft.selected);
                setSavedNfts(newSavedNFTs);
            }, 2000)
        }, 3000)
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Universe Minting - My NFTs'
        return () => { document.title = 'Universe Minting' };
    }, [])

    useEffect(() => {
        setFilteredNFTs(myNFTs);
    }, [])
        
    return (
        <div className='container mynfts__page'>
            <Popup
                trigger={<button id='loading-hidden-btn' style={{ display: 'none' }}></button>}
            >
                {
                    (close) => (
                        <LoadingPopup onClose={close} />
                    )
                }
            </Popup>
            <Popup
                trigger={<button id='congrats-hidden-btn' style={{ display: 'none' }}></button>}
            >
                {
                    (close) => (
                        <CongratsPopup onClose={close} />
                    )
                }
            </Popup>
            {myNFTs.length || savedNfts.length || savedCollections.length ?
                <>
                    <div className='mynfts__page__header'>
                        <h1 className='title'>My NFTs</h1>
                        <div className='create__mint__btns'>
                            {selectedTabIndex === 1 &&
                                <button className='mint__btn' onClick={handleMintSelected} disabled={checkSelectedSavedNfts()}>Mint selected</button>
                            }
                            <button className='mint__btn' onClick={handleOpen}>Create NFT</button>
                        </div>
                        {showModal &&
                            <MintModal open={showModal} onClose={handleClose}></MintModal>
                        }
                    </div>

                    <div className='mynfts__page__body'>
                        <ul className='tabs'>
                            {tabs.map((tab, index) => {
                                return (
                                    <li key={index} className={selectedTabIndex === index ? 'active' : ''} onClick={() => setSelectedTabIndex(index)}>{tab}</li>
                                )
                            })}
                        </ul>
                        {selectedTabIndex === 0 &&
                            <Wallet filteredNFTs={filteredNFTs} setFilteredNFTs={setFilteredNFTs} />
                        }
                        {selectedTabIndex === 1 &&
                            <SavedNFTs />
                        }
                        {selectedTabIndex === 2 &&
                            <SavedCollections />
                        }
                    </div>
                </> :
                    isCreatingAction ? 
                        (
                        <div className='container select-nfts'>
                        <div className="back-rew" onClick={() => { history.push('/reward-tiers') }}><img src={arrow} alt="back"/><span>Create reward tier</span></div>
                        {showModal &&
                            <MintModal open={showModal} onClose={handleClose}></MintModal>
                        }
                        <div>
                        <div className='head-part'>
                            <h2 className="tier-title">Select NFTs</h2>
                        </div>
                        <div className="space-tier-div">
                            {selectedNft.length >0 ? "" : 
                                <p>No NFTs found in your wallet</p>
                            }
                        </div>
                        <div className="create-rew-tier select-ntfs" onClick={handleOpen} >
                            <div className="plus-icon">
                                <img src={union} alt="create"/>
                            </div> 
                            <div className="create-rew-text">
                                <p>Create NFT</p>
                            </div>
                        </div>
                        </div>
                        </div>  ) :
                        (
                        <div className='empty__nfts'>
                            <h1 className='title'>My NFTs</h1>
                            <h3>No NFTs found</h3>
                            <p className='desc'>Create NFTs or NFT collections with our platform by clicking the button below</p>
                            <button className='mint__btn' onClick={handleOpen}>Create NFT</button>
                            {showModal &&
                                <MintModal open={showModal} onClose={handleClose}></MintModal>
                            }
                        </div>
                        )
            }
        </div>
    )
}

export default MyNFTs;