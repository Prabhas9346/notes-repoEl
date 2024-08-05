import './index.css';
import logo from './logo.png';
import { MdOutlineSearch } from 'react-icons/md';
import { IoIosLogOut } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Header = (props) => {
    const navigate = useNavigate();
    const addshadowbg = (event) => {
        document.getElementById('searchBox').classList.add('addshadowToSearch');
    };

    const removebg = () => {
        document
            .getElementById('searchBox')
            .classList.remove('addshadowToSearch');
    };
    const { toggleBtn, filterfn } = props;
    const logoutuser = () => {
        Cookies.remove('jwtToken');
        navigate('/');
    };
    const checkInput = (event) => {
        filterfn(event.target.value);
    };

    return (
        <div className="headerBox">
            <button className="MenuBtn" onClick={toggleBtn} id="menuIcon">
                <div class="menu-icon">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </button>
            <div className="keeplogoBox">
                <img className="keeplogo" src={logo} alt="logo" />
                <p className="keeplogotxt">Quick Keep</p>
            </div>
            <div className="searchBox" id="searchBox">
                <MdOutlineSearch className="searchele" />

                <input
                    onClick={addshadowbg}
                    onBlur={removebg}
                    className="searchInputEl"
                    type="search"
                    placeholder="Search"
                    onChange={checkInput}
                />
            </div>

            <button onClick={logoutuser} className="logOutBtn">
                <IoIosLogOut className="logoutImg" />
                Log Out
            </button>
        </div>
    );
};
export default Header;
