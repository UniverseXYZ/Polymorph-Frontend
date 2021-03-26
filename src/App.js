import { useState } from 'react';
import './assets/scss/normalize.scss';
import { BrowserRouter as Routes, Redirect, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import MyNFTs from './components/MyNFTs';
import MyAccount from './components/MyAccount';
import AppContext from './ContextAPI';
import nft1Image from './assets/images/saved-nft1.png';
import nft2Image from './assets/images/saved-nft2.png';
import nft3Image from './assets/images/saved-nft3.png';
import nft4Image from './assets/images/saved-nft4.png';
import testCollectionAvatar from './assets/images/test-collection-avatar.svg';

const App = () => {
    const [isWalletConnected, setIsWalletConnected] = useState(true);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [savedNfts, setSavedNfts] = useState([
        {
            id: 1,
            bgImage: nft1Image,
            name: 'NFT 1',
            type: 'collection',
            collectionAvatar: testCollectionAvatar,
            collectionName: 'CryptoKitties',
            collectionCount: 5,
            selected: false,
        },
        {
            id: 2,
            bgImage: nft2Image,
            name: 'SingleNFT #2909',
            type: 'single',
            selected: false,
        },
        {
            id: 3,
            bgImage: nft3Image,
            name: 'NFT 3',
            type: 'collection',
            collectionAvatar: testCollectionAvatar,
            collectionName: 'Crazy Collection',
            collectionCount: 5,
            selected: false,
        },
        {
            id: 4,
            bgImage: nft4Image,
            name: 'SingleNFT #2910',
            type: 'single',
            selected: false,
        },
    ]);
    const [savedCollections, setSavedCollections] = useState([
        {
            id: 1,
            bgImage: nft1Image,
            name: 'Collection name',
            avatar: nft1Image,
        },
        {
            id: 2,
            bgImage: nft2Image,
            name: 'Mooncat Rescue',
            avatar: nft2Image,
        },
        {
            id: 3,
            bgImage: nft3Image,
            name: 'Crazy Collection',
            avatar: nft3Image,
        },
        {
            id: 4,
            bgImage: nft4Image,
            name: 'HashMasks',
            avatar: nft4Image,
        },
    ]);

    const handleClickOutside = (event, className, ref, cb) => {
        if (!event.target.classList.contains(className)) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (className === 'mod-div') {
                    document.body.classList.remove('no__scroll');
                    setTimeout(() => { cb(false) }, 500);
                } else {
                    cb(false);
                }
            }
        }
    };

    return (
        <AppContext.Provider
            value={{
                isWalletConnected,
                setIsWalletConnected,
                handleClickOutside,
                savedNfts,
                setSavedNfts,
                selectedTabIndex,
                setSelectedTabIndex,
                showModal,
                setShowModal,
                savedCollections,
                setSavedCollections,
            }}
        >
            <Routes>
                <Header />
                <Switch>
                    <Route exact path="/" component={() => <MyNFTs />} />
                    <Route exact path="/my-account" component={() => <MyAccount />} />
                    <Route path="*" component={() => <Redirect to='/' />} />
                </Switch>
            </Routes>
        </AppContext.Provider>
    );
}

export default App;