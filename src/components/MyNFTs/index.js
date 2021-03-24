import { useState } from 'react';
import './my-nfts.scss';
import Wallet from './Wallet';
import SavedNFTs from './SavedNFTs';
import SavedCollections from './SavedCollections';
import Modal from '../Modal';
import { PLACEHOLDER_NFTS } from './NFTsDummyData';

const MyNFTs = () => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const tabs = ['Wallet', 'Saved NFTs', 'Saved Collections'];
    const handleClose = () => setShowModal(false);
        
    return (
        <div className='container mynfts__page'>
            {PLACEHOLDER_NFTS.length ?
                <>
                    <div className='mynfts__page__header'>
                        <h1 className='title'>My NFTs</h1>
                        <button onClick={() => setShowModal(true)}>Mint NFT</button>
                        <Modal open={showModal} onClose={handleClose}></Modal>
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
                            <Wallet data={PLACEHOLDER_NFTS} />
                        }
                        {selectedTabIndex === 1 &&
                            <SavedNFTs />
                        }
                        {selectedTabIndex === 2 &&
                            <SavedCollections />
                        }
                    </div>
                </> :
                <div className='empty__nfts'>
                    <h1 className='title'>My NFTs</h1>
                    <h3>No NFTs found</h3>
                    <p className='desc'>Create NFTs or NFT collections with our platform by clicking the button below</p>
                    <button onClick={() => setShowModal(true)}>Mint NFT</button>
                    <Modal open={showModal} onClose={handleClose}></Modal>
                </div>
            }
        </div>
    )
}

export default MyNFTs;