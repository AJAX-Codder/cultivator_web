import React from 'react';
import "../../assets/css/style.css"
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { selectTraders, setSignOut } from '../../redux/slices/authSlice';
import { firebase } from '../../config/firebase';
const auth = getAuth(firebase);
const Navbar = () => {
    let { Name, TradeImg } = useSelector(selectTraders);
    const dispatch = useDispatch();
    const logOut = async () => {
        try {
            await signOut(auth);
            alert('LogOut successfully');
            dispatch(setSignOut());
        } catch (error) {
            console.log('Logout error:', error);
            alert('An error occurred during logout. Please try again.');
        }
    };

    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <a className="navbar-brand brand-logo" href="home.php">
                    <span
                        style={{
                            fontWeight: 700,
                            fontFamily: 'Gill Sans, Gill Sans MT, Calibri, Trebuchet MS, sans-serif',
                            color: 'blueviolet',
                        }}
                    >
                        CULTIVATOR
                    </span>
                </a>
            </div>
            <div className="navbar-menu-wrapper d-flex align-items-stretch">
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
                    <span className="mdi mdi-menu"></span>
                </button>
                <ul className="navbar-nav navbar-nav-right">
                    <li className="nav-item nav-profile dropdown">
                        <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false" >
                            <div className="nav-profile-img">
                                <img src={TradeImg} alt='' />
                                <span className="availability-status online"></span>
                            </div>
                            <div className="nav-profile-text">
                                <p className="mb-1 text-black">{Name}</p>
                            </div>
                        </a>
                        <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown"></div>
                    </li>
                    <li className="nav-item d-none d-lg-block full-screen-link">
                        <a className="nav-link">
                            <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
                        </a>
                    </li>
                    <li className="nav-item nav-logout d-none d-lg-block" onClick={logOut}>
                        <a className="nav-link" href="#">
                            <i className="mdi mdi-power"></i>
                        </a>
                    </li>
                    <li className="nav-item nav-settings d-none d-lg-block">
                        <a className="nav-link" href="#">
                            <i className="mdi mdi-format-line-spacing"></i>
                        </a>
                    </li>
                </ul>
                <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
                    <span className="mdi mdi-menu"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
