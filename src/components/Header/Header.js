import './Header.scss';
import appLogo from '../../assets/images/dark.svg';
import Nav from './Nav';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <div className='app__logo'>
                <Link to={'/'}><img src={appLogo} alt='App Logo' /></Link>
            </div>
            <div className='nav'>
                <Nav />
            </div>
        </header>
    )
}

export default Header;