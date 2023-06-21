import React, { useState } from 'react';
import "../../assets/css/style.css"
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { selectTraders, setSignOut } from '../../redux/slices/authSlice';
import { firebase } from '../../config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'
const auth = getAuth(firebase);
const Navbar = () => {
    const [click, setClick] = useState(true)
    let { Name, TradeImg } = useSelector(selectTraders);
    const dispatch = useDispatch();
    const logOut = async () => {
        try {
            await signOut(auth);
            toast.success('માહિતી હટાવાઈ.. !', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                dispatch(setSignOut());
            }, 3050);
        } catch (error) {
            toast.error('કૈંક વાંધો છે.. !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
            console.log('Logout error:', error);
            alert('An error occurred during logout. Please try again.');
        }
    };
    const toggleFullScreen = () => {
        if (
            (document.fullScreenElement !== undefined &&
                document.fullScreenElement === null) ||
            (document.msFullscreenElement !== undefined &&
                document.msFullscreenElement === null) ||
            (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
            (document.webkitIsFullScreen !== undefined &&
                !document.webkitIsFullScreen)
        ) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(
                    Element.ALLOW_KEYBOARD_INPUT
                );
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const Minimize = () => {
        var body = $('body');
        var traders = $("#Traders");
        var tdImg = $("#tdImg");
        if (click) {
            tdImg.animate({
                width: "50px",
                height: "50px"
            }, 300);
        }
        else {
            tdImg.animate({
                width: "150px",
                height: "150px"
            }, 400);
        }
        setClick(!click);
        if (body.hasClass('sidebar-toggle-display') || body.hasClass('sidebar-absolute')) {
            body.toggleClass('sidebar-hidden');
            traders.toggleClass("d-flex");
        } else {
            traders.toggleClass("d-none");
            body.toggleClass('sidebar-icon-only');
        }
    }
    return (
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                <a className="navbar-brand brand-logo" href="">
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
                <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" onClick={Minimize}>
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
                    <li className="nav-item d-none d-lg-block full-screen-link cursor-pointer" onClick={toggleFullScreen}>
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
