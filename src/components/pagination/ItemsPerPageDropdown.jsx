import { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import {Animated} from "react-animated-css";
import AppContext from '../../ContextAPI';
import arrowDownIcon from '../../assets/images/arrow-down.svg';

const ItemsPerPageDropdown = ({ perPage, setPerPage }) => {
    const { handleClickOutside } = useContext(AppContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const itemsPerPage = [12, 24, 48];
    const ref = useRef(null);

    useEffect(() => {
        document.addEventListener('click', (e) => handleClickOutside(e, 'items__per__page', ref, setShowDropdown), true);
        return () => {
            document.removeEventListener('click', (e) => handleClickOutside(e, 'items__per__page', ref, setShowDropdown), true);
        };
    })

    return (
        <div className='items__per__page'>
            <label>Items per page</label>
            <button ref={ref} onClick={() => setShowDropdown(!showDropdown)}>
                <span>{perPage}</span>
                <img src={arrowDownIcon} alt='Chevron' className={showDropdown ? 'rotate' : ''} />
                {showDropdown &&
                    <div className='items__per__page__dropdown'>
                        <Animated animationIn="fadeIn">
                            <ul>
                                {itemsPerPage.map((n, index) => {
                                    return (
                                        <li key={index} className={perPage === n ? 'active' : ''} onClick={() => setPerPage(n)}>{n}</li>
                                        )
                                    })}
                            </ul>
                        </Animated>
                    </div>
                }
            </button>
        </div>
    )
}

ItemsPerPageDropdown.propTypes = {
    perPage: PropTypes.number,
    setPerPage: PropTypes.func,
}

export default ItemsPerPageDropdown;