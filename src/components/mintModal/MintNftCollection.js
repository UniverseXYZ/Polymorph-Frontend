import Input from '../input/Input';
import Button from '../button/Button';
import arrow from '../../assets/images/arrow.svg';
import union from '../../assets/images/Union.svg';
import upload from '../../assets/images/upload.svg';
import RemovePopup from '../popups/RemoveNftPopup';
import editIcon from '../../assets/images/edit.svg';
import removeIcon from '../../assets/images/remove.svg';
import mp3Icon from '../../assets/images/mp3-icon.png';
import videoIcon from '../../assets/images/video-icon.svg';
import { useContext, useRef, useState, useEffect } from 'react';
import AppContext from '../../ContextAPI';
import CreateNftCol from './CreateNftCol';
import randomColor from 'randomcolor';
import uuid from 'react-uuid';
import Popup from "reactjs-popup"
import LoadingPopup from '../popups/LoadingPopup'
import CongratsPopup from '../popups/CongratsPopup'

const MintNftCollection = ({ onClick }) => {
    
    const {
        setShowModal,
        savedCollections,
        setSavedCollections,
        savedNfts,
        setSavedNfts,
        savedCollectionID,
        setSavedCollectionID,
        myNFTs,
        setMyNFTs,
    } = useContext(AppContext);
    
    const [collectionNFTs, setCollectionNFTs] = useState([]);
    const [collectionNFTsID, setCollectionNFTsID] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownID, setDropdownID] = useState(0);
    const [showCollectible, setShowCollectible] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const inputFile = useRef(null);
    const ref = useRef(null);

    const [errors, setErrors] = useState({
        collectionName: '',
        collectible: '',
    });

    const [saveForLateClick, setSaveForLateClick] = useState(false);
    const [mintNowClick, setMintNowClick] = useState(false);

    const handleCollectionName = (value) => {
        setCollectionName(value);
    }

    const handleSaveForLater = () => {
        setMintNowClick(false);
        setSaveForLateClick(true);
        if (!collectionName) {
            setErrors({
                collectionName: '“Collection name” is not allowed to be empty',
                collectible: '',
            });
        } else {
            const collectionNameExists = savedCollections.length ? savedCollections.filter(collection => collection.name.toLowerCase() === collectionName.toLowerCase()) : [];
            const existsInMyNfts = myNFTs.length ? myNFTs.filter(nft => nft.collectionName?.toLowerCase() === collectionName.toLowerCase()) : [];
            if ((collectionNameExists.length || existsInMyNfts.length) && !savedCollectionID) {
                setErrors({
                    collectionName: '“Collection name” already exists',
                    collectible: '',
                });
            } else {
                setErrors({
                    collectionName: '',
                    collectible: '',
                });
            }
        }
    }

    const handleMinting = () => {
        setSaveForLateClick(false);
        setMintNowClick(true);
        setErrors({
            collectionName: !collectionName ? '“Collection name” is not allowed to be empty' : '',
            collectible: !collectionNFTs.length ? '“NFT collectible” is required' : '',
        });
        if (collectionName) {
            const collectionNameExists = savedCollections.length ? savedCollections.filter(collection => collection.name.toLowerCase() === collectionName.toLowerCase()) : [];
            const existsInMyNfts = myNFTs.length ? myNFTs.filter(nft => nft.collectionName?.toLowerCase() === collectionName.toLowerCase()) : [];
            if ((collectionNameExists.length || existsInMyNfts.length) && !savedCollectionID) {
                setErrors({
                    collectionName: '“Collection name” already exists',
                    collectible: !collectionNFTs.length ? '“NFT collectible” is required' : '',
                });
            } else {
                setErrors({
                    collectionName: '',
                    collectible: !collectionNFTs.length ? '“NFT collectible” is required' : '',
                });
            }
        }
    }

    const handleShowCollectible = () => {
        setMintNowClick(false);
        if (!collectionName) {
            setErrors({
                collectionName: '“Collection name” is not allowed to be empty',
                collectible: '',
            });
        } else {
            const collectionNameExists = savedCollections.filter(collection => collection.name.toLowerCase() === collectionName.toLowerCase());
            if (collectionNameExists.length && !savedCollectionID) {
                setErrors({
                    collectionName: '“Collection name” already exists',
                    collectible: '',
                });
            } else {
                setErrors({
                    collectionName: '',
                    collectible: '',
                });
                setShowCollectible(true);
            }
        }
    }

    const handleEdit = (id) => {
        document.body.classList.add('no__scroll');
        setCollectionNFTsID(id);
        setShowCollectible(true);
    }

    const handleClickOutside = (event) => {
        if (!event.target.classList.contains('three__dots')) {
            if (ref.current && !ref.current.contains(event.target)) {
                if (document.getElementById('popup-root')) {
                    if (!document.getElementById('popup-root').hasChildNodes()) {    
                        setShowDropdown(false);
                    }
                } else {
                    setShowDropdown(false);
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    })

    useEffect(() => {
        if (savedCollectionID) {
            const res = savedCollections.filter(item => item.id === savedCollectionID);
            setCollectionName(res[0].name);
            setCoverImage(res[0].previewImage);
        }
    }, [collectionNFTs])

    useEffect(() => {
        if (saveForLateClick) {
            if (!errors.collectionName) {
                if (!savedCollectionID) {
                    setSavedCollections([...savedCollections, {
                        id: collectionName,
                        previewImage: coverImage || randomColor(),
                        name: collectionName,
                    }])
                    if (collectionNFTs.length) {
                        var newArr = [...savedNfts];
                        collectionNFTs.forEach(nft => {
                            newArr.push(nft);
                        })
                        setSavedNfts(newArr);
                    }
                } else {
                    setSavedCollections(savedCollections.map(item => 
                        item.id === savedCollectionID ?
                            {
                                ...item,
                                id: collectionName,
                                previewImage: coverImage || randomColor(),
                                name: collectionName,
                            }
                            : item
                    ))
                    setSavedNfts(savedNfts.map(item => 
                        item.collectionId === savedCollectionID ?
                        {
                            ...item,
                            collectionId: collectionName,
                            collectionName: collectionName,
                            collectionAvatar: coverImage,
                        }
                        : item
                    ))
                    if (collectionNFTs.length) {
                        var newArray = [...savedNfts];
                        collectionNFTs.forEach(nft => {
                            newArray.push(nft);
                        })
                        setSavedNfts(newArray);
                    }
                    setSavedCollectionID(null);
                }
                setShowModal(false);
                document.body.classList.remove('no__scroll');
            }
        }
        if (mintNowClick) {
            if (!errors.collectionName && !errors.collectible) {
                document.getElementById('loading-hidden-btn').click();
                setTimeout(() => {
                    document.getElementById('popup-root').remove();
                    document.getElementById('congrats-hidden-btn').click();
                    setTimeout(() => {
                        var newMyNFTs = [...myNFTs];
                        collectionNFTs.forEach(nft => {
                            newMyNFTs.push({
                                id: uuid(),
                                type: 'collection',
                                collectionId: collectionName,
                                collectionName: collectionName,
                                collectionAvatar: coverImage || randomColor(),
                                previewImage: nft.previewImage,
                                name: nft.name,
                                description: nft.description,
                                numberOfEditions: Number(nft.editions),
                                generatedEditions: nft.generatedEditions,
                            });
                        })
                        setMyNFTs(newMyNFTs);
                        setShowModal(false);
                        document.body.classList.remove('no__scroll');
                    }, 2000)
                }, 3000)
            }
        }
    }, [errors])


    return !showCollectible ? (
        <div className="mintNftCollection-div">
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
            <div className="back-nft" onClick={() => onClick(null)}><img src={arrow} alt="back"/><span>Create NFT</span></div>
            <h2>{!savedCollectionID ? 'Create NFT Collection' : 'Edit NFT Collection'}</h2>
            <div className="name-image">
            <Input label="Collection Name" className="inp" error={errors.collectionName} placeholder="Enter the Collection Name" onChange={(e) => handleCollectionName(e.target.value)} value={collectionName} />

            <div className="input-cover">
            <p>Cover Image</p>
                <div className="inp-picture">
                    {coverImage && typeof coverImage === 'object' ?
                        <div className='cover-preview'>
                            <img className="cover-img" src={URL.createObjectURL(coverImage)} alt='Cover' />
                            <div onClick={() => inputFile.current.click()}>
                                <img className="upload-img" src={upload} alt='Upload Icon' />
                            </div>
                        </div> :
                        <div className="icon-div" onClick={() => inputFile.current.click()}>
                            <img className="upload-img" src={upload} alt='Upload Icon' />
                        </div>
                    }
                </div>
                <input type="file" hidden className="inp-disable" ref={inputFile} onChange={(e)=>setCoverImage(e.target.files[0])} />
            </div>
            </div>
            <div className='collection__nfts'>
                {collectionNFTs.map((nft, index) => {
                    return (
                        <div className={`saved__nft__box`} key={uuid()}>
                            <div className='saved__nft__box__image'>
                                {nft.previewImage.type === 'video/mp4' &&
                                    <video onMouseOver={event => event.target.play()} onMouseOut={event => event.target.pause()}>
                                        <source src={URL.createObjectURL(nft.previewImage)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                }
                                {nft.previewImage.type === 'audio/mpeg' &&
                                    <img className="preview-image" src={mp3Icon} alt={nft.name} />
                                }
                                {nft.previewImage.type !== 'audio/mpeg' && nft.previewImage.type !== 'video/mp4' &&
                                    <img className="preview-image" src={URL.createObjectURL(nft.previewImage)} alt={nft.name} />
                                }
                                {nft.previewImage.type === 'video/mp4' &&
                                    <img className='video__icon' src={videoIcon} alt='Video Icon' />
                                }
                            </div>
                            <div className='saved__nft__box__name'>
                                <h3>{nft.name}</h3>
                                <button className='three__dots' onClick={() => { setShowDropdown(!showDropdown); setDropdownID(nft.id); }}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    {(dropdownID === nft.id && showDropdown) &&
                                        <ul ref={ref} className='edit__remove'>
                                            <li className='edit' onClick={() => handleEdit(nft.id)}>
                                                <p>Edit</p>
                                                <img src={editIcon} alt='Edit Icon' />
                                            </li>
                                            <Popup
                                                trigger={
                                                    <li className='remove'>
                                                        <p>Remove</p>
                                                        <img src={removeIcon} alt='Remove Icon' />
                                                    </li>
                                                }
                                            >
                                                {
                                                    (close) => (
                                                        <RemovePopup
                                                            close={close}
                                                            nftID={nft.id}
                                                            removedItemName={nft.name}
                                                            removeFrom={'collection'}
                                                            collectionNFTs={collectionNFTs}
                                                            setCollectionNFTs={setCollectionNFTs}
                                                        />
                                                    )
                                                }
                                            </Popup>
                                        </ul>
                                    }
                                </button>
                            </div>
                            <div className='saved__nft__box__footer'>
                                <div className='collection__details'>
                                    {nft.type === 'collection' &&
                                        <>
                                            {typeof nft.collectionAvatar === 'string' && nft.collectionAvatar.startsWith('#') ?
                                                <div className='random__bg__color' style={{ backgroundColor: nft.collectionAvatar }}>{nft.collectionName.charAt(0)}</div> :
                                                <img src={URL.createObjectURL(nft.collectionAvatar)} alt={nft.collectionName} />
                                            }
                                            <span title={nft.collectionName}>{nft.collectionName.length > 13 ? nft.collectionName.substring(0,13)+'...' : nft.collectionName}</span>
                                        </>
                                    }
                                </div>
                                {nft.generatedEditions.length > 1 ?
                                    <div className='collection__count'>
                                        {`x${nft.generatedEditions.length}`}
                                        <div className='generatedEditions' style={{ gridTemplateColumns: `repeat(${Math.ceil(nft.generatedEditions.length/10)}, auto)` }}>
                                            {nft.generatedEditions.map(edition => {
                                                return (
                                                    <div key={edition}>{`#${edition}`}</div>
                                                )
                                            })}
                                        </div>
                                    </div> :
                                    <p className='collection__count'>{`#${nft.generatedEditions[0]}`}</p>
                                }
                            </div>
                            {nft.generatedEditions.length > 1 &&
                                <>
                                    <div className='saved__nft__box__highlight__one'></div>
                                    <div className='saved__nft__box__highlight__two'></div>
                                </>
                            }
                        </div>
                    )
                })}
                {savedCollectionID ? 
                    savedNfts.map(nft => {
                        return nft.collectionId === savedCollectionID ? (
                            <div className={`saved__nft__box`} key={uuid()}>
                                <div className='saved__nft__box__image'>
                                    {nft.previewImage.type === 'video/mp4' &&
                                        <video onMouseOver={event => event.target.play()} onMouseOut={event => event.target.pause()}>
                                            <source src={URL.createObjectURL(nft.previewImage)} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    }
                                    {nft.previewImage.type === 'audio/mpeg' &&
                                        <img className="preview-image" src={mp3Icon} alt={nft.name} />
                                    }
                                    {nft.previewImage.type !== 'audio/mpeg' && nft.previewImage.type !== 'video/mp4' &&
                                        <img className="preview-image" src={URL.createObjectURL(nft.previewImage)} alt={nft.name} />
                                    }
                                    {nft.previewImage.type === 'video/mp4' &&
                                        <img className='video__icon' src={videoIcon} alt='Video Icon' />
                                    }
                                </div>
                                <div className='saved__nft__box__name'>
                                    <h3>{nft.name}</h3>
                                    <button className='three__dots' onClick={() => { setShowDropdown(!showDropdown); setDropdownID(nft.id); }}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        {(dropdownID === nft.id && showDropdown) &&
                                            <ul ref={ref} className='edit__remove'>
                                                <li className='edit' onClick={() => handleEdit(nft.id)}>
                                                    <p>Edit</p>
                                                    <img src={editIcon} alt='Edit Icon' />
                                                </li>
                                                <Popup
                                                    trigger={
                                                        <li className='remove'>
                                                            <p>Remove</p>
                                                            <img src={removeIcon} alt='Remove Icon' />
                                                        </li>
                                                    }
                                                >
                                                    {
                                                        (close) => (
                                                            <RemovePopup
                                                                close={close}
                                                                nftID={nft.id}
                                                                removedItemName={nft.name}
                                                                removeFrom={'collection'}
                                                                collectionNFTs={collectionNFTs}
                                                                setCollectionNFTs={setCollectionNFTs}
                                                            />
                                                        )
                                                    }
                                                </Popup>
                                            </ul>
                                        }
                                    </button>
                                </div>
                                <div className='saved__nft__box__footer'>
                                    <div className='collection__details'>
                                        {nft.type === 'collection' &&
                                            <>
                                                {typeof nft.collectionAvatar === 'string' && nft.collectionAvatar.startsWith('#') ? 
                                                    <div className='random__bg__color' style={{ backgroundColor: nft.collectionAvatar }}>{nft.collectionName.charAt(0)}</div> :
                                                    <img src={URL.createObjectURL(nft.collectionAvatar)} alt={nft.collectionName} />
                                                }
                                                <span title={nft.collectionName}>{nft.collectionName.length > 13 ? nft.collectionName.substring(0,13)+'...' : nft.collectionName}</span>
                                            </>
                                        }
                                    </div>
                                    {nft.generatedEditions.length > 1 ?
                                        <div className='collection__count'>
                                            {`x${nft.generatedEditions.length}`}
                                            <div className='generatedEditions' style={{ gridTemplateColumns: `repeat(${Math.ceil(nft.generatedEditions.length/10)}, auto)` }}>
                                                {nft.generatedEditions.map(edition => {
                                                    return (
                                                        <div key={edition}>{`#${edition}`}</div>
                                                    )
                                                })}
                                            </div>
                                        </div> :
                                        <p className='collection__count'>{`#${nft.generatedEditions[0]}`}</p>
                                    }
                                </div>
                                {nft.generatedEditions.length > 1 &&
                                    <>
                                        <div className='saved__nft__box__highlight__one'></div>
                                        <div className='saved__nft__box__highlight__two'></div>
                                    </>
                                }
                            </div>
                        ) : <></>
                    }) : <></>
                }
                <div className="create-col" onClick={handleShowCollectible}>
                    <div className="plus-icon">
                        <img src={union} alt="create"/>
                    </div> 
                    <div className="collection-t">
                        <p>Create NFT collectible</p>
                    </div>
                </div>
            </div>
            {errors.collectible && <p className="error-message">{errors.collectible}</p>}
            <div className="collection-buttons">
                {!savedCollectionID ?
                    <>
                        <Button className="light-button" onClick={handleMinting}>Mint now</Button>
                        <Button className="light-border-button" onClick={handleSaveForLater}>Save for later</Button>
                    </> :
                    <Button className="light-button" onClick={handleSaveForLater}>Save changes</Button>
                }
            </div>
        </div>     
    ) : (
        <CreateNftCol
            setShowCollectible={setShowCollectible}
            collectionName={collectionName}
            coverImage={coverImage}
            collectionNFTs={collectionNFTs}
            setCollectionNFTs={setCollectionNFTs}
            collectionNFTsID={collectionNFTsID}
            setCollectionNFTsID={setCollectionNFTsID}
        />
    )
}

export default MintNftCollection;