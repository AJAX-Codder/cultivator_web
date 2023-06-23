import React, { useEffect, useState } from 'react';
import '../../assets/css/login.css';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { ModifySelection, setSignIn } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux'
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { firebase } from '../../config/firebase';
import Cookies from 'js-cookie';
import { ColorRing } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { dataRef } from '../../config/firebase2';
const auth = getAuth(firebase);
const LoginForm = () => {
    const [isLoading, setLoading] = useState(false);
    const [isLoading2, setLoading2] = useState(false);
    const dispatch = useDispatch();
    const [emailId, setEmailID] = useState("");
    const [credential, setCredential] = useState({
        email: "",
        password: "",
    });
    const getData = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setCredential({ ...credential, [name]: value });
    }
    const handleData = async (e) => {
        e.preventDefault();
        setLoading(true)
        const { email, password } = credential;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const snapshot = await dataRef.ref("Cultivator/Traders").once("value");
            const data = snapshot.val();
            const filteredData = Object.values(data).filter(obj => obj.Email === email);

            if (filteredData.length > 0) {
                const trader = filteredData[0];
                const traderIndex = Object.keys(data).findIndex(key => data[key] === trader);
                const oneYearFromNow = new Date();
                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
                Cookies.set("Auth", email, { expires: oneYearFromNow });
                const modifiedSelection = {
                    TraderId: traderIndex,
                    FarmerIndex: null,
                    FolderIndex: null,
                    EntryIndex: null
                };

                dispatch(ModifySelection(modifiedSelection));
                dispatch(setSignIn({
                    id: traderIndex,
                    isLoggedIn: true,
                    traders: trader,
                    selection: modifiedSelection
                }));
            }

        } catch (error) {
            toast.error('ખોટી માહિતી છે.. !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
        finally {
            setLoading(false)
        }
    };
    $(document).on("click", "#close", (e) => {
        e.preventDefault();
        $(".popup-forgotpass").addClass('d-none');
        $(".popup-forgotpass").removeClass('d-flex');
    });
    $(document).on("click", "#Forgot", (e) => {
        e.preventDefault();
        $(".popup-forgotpass").addClass('d-flex');
        $(".popup-forgotpass").removeClass('d-none');
    });
    const handleForget = (e) => {
        setLoading2(true);
        e.preventDefault();
        sendPasswordResetEmail(auth, emailId)
            .then(() => {
                Swal.fire(
                    'Reset Link',
                    'Check Your Mail..!',
                    'success'
                );
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ખાતું ઉપલબ્ધ નથી.. ',
                });
            }).finally(() => {
                setLoading2(false);
                $(".popup-forgotpass").addClass('d-none');
                $(".popup-forgotpass").removeClass('d-flex')
            });
    }
    return (
        <>
            <div className="container-scroller">
                <div className="main-panel w-100" style={{ height: '100vh' }}>
                    <div
                        className="content-wrapper d-flex justify-content-center"
                        style={{
                            backgroundSize: 'cover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div className="stretch-card" style={{ width: '800px', height: '500px' }}>
                            <div className="card overflow-hidden" style={{ borderRadius: '15px' }}>
                                <div
                                    className="h-100 d-flex w-100 justify-content-center align-items-center"
                                    style={{ minWidth: '400px', flexWrap: 'wrap-reverse' }}
                                >
                                    <div className="h-100 w-50" id="left">
                                        <img
                                            src="https://raw.githubusercontent.com/AJAX-Codder/HalDharak/master/assets/images/Group%2015.png"
                                            alt=""
                                            style={{ height: '100%', width: '100%', minWidth: '400px' }}
                                        />
                                    </div>
                                    <div
                                        id="right"
                                        className="w-50 h-100 d-flex flex-column justify-content-center align-items-center"
                                        style={{ paddingTop: '30px' }}
                                    >
                                        <h2
                                            style={{
                                                fontFamily: "'Keania One', cursive",
                                                color: '#6F0E7E',
                                                textAlign: 'left',
                                                width: '100%',
                                            }}
                                        >
                                            Welcome
                                        </h2>
                                        <form
                                            className="form-sample w-100 d-flex flex-column"
                                            style={{ marginTop: '30px' }}
                                            method="post"
                                            onSubmit={handleData}
                                        >
                                            <div className="d-flex p-0" style={{ margin: '2px', marginBottom: '20px', width: '80%' }}>
                                                <i className="mdi mdi-account" style={{ position: 'absolute', fontSize: '24px', color: '#6F0E7E' }}></i>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="w-100"
                                                    value={credential.email}
                                                    onChange={getData}
                                                    placeholder="abc@gmail.com"
                                                    style={{
                                                        border: 'none',
                                                        borderBottom: '1px solid #6F0E7E',
                                                        paddingLeft: '30px',
                                                        paddingBottom: '5px',
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div className="d-flex h-25" style={{ width: '80%' }}>
                                                <i className="mdi mdi-lock" style={{ position: 'absolute', fontSize: '24px', color: '#6F0E7E' }}></i>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    className="w-100"
                                                    value={credential.password}
                                                    onChange={getData}
                                                    placeholder=".........."
                                                    style={{
                                                        border: 'none',
                                                        borderBottom: '1px solid #6F0E7E',
                                                        paddingLeft: '30px',
                                                        paddingBottom: '6px',
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div id="Forgot" style={{ width: '80%', fontSize: '14px', color: '#6F0E7E', textAlign: 'right', paddingTop: '10px' }} >
                                                forgot password ?
                                            </div>
                                            <div style={{ width: '80%', fontSize: '14px', color: '#6F0E7E', paddingTop: '10px' }}>
                                                <input type="checkbox" name="remember" id="chk" /> Remember Me
                                            </div>
                                            {<div style={{ marginTop: '15px', width: '80%' }}>
                                                <button className="btn btn-gradient-primary p-0" name="SubmitBtn" type="submit" style={{ width: 100, height: 45 }}>
                                                    {isLoading ? <ColorRing
                                                        visible={true}
                                                        height="40"
                                                        width="40"
                                                        ariaLabel="blocks-loading"
                                                        wrapperStyle={{}}
                                                        wrapperClass="blocks-wrapper"
                                                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                                                    /> : "Log In"}
                                                </button>
                                            </div>}
                                            <div className="separator d-flex justify-content-between" style={{ width: '80%', marginTop: '20px', color: '#6F0E7E', opacity: '.9' }}>
                                                <div style={{ borderBottom: '2px solid #6F0E7E', height: '15px', width: '40%', opacity: '.7' }}></div>
                                                OR
                                                <div style={{ borderBottom: '2px solid #6F0E7E', height: '15px', width: '40%', opacity: '.7' }}></div>
                                            </div>
                                            <div className="social d-flex justify-content-around" style={{ width: '80%', marginTop: '15px' }}>
                                                <div className="google d-flex flex-column justify-content-center align-items-center" style={{ color: '#8B130C', fontWeight: '700' }}>
                                                    <i
                                                        className="mdi mdi-google d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: '46px',
                                                            height: '45px',
                                                            background: '#8B130C',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            fontSize: '24px',
                                                            textAlign: 'center',
                                                        }}
                                                    ></i>
                                                    Google
                                                </div>
                                                <div className="google d-flex flex-column justify-content-center align-items-center" style={{ color: '#1958A0', fontWeight: '700', textAlign: 'center', paddingLeft: '20px' }}>
                                                    <i
                                                        className="mdi mdi-facebook d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: '46px',
                                                            height: '45px',
                                                            background: '#1958A0',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            fontSize: '24px',
                                                            textAlign: 'center',
                                                        }}
                                                    ></i>
                                                    facebook
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popup-forgotpass d-none">
                <div className="popup">
                    <i className="mdi mdi-close" id="close" aria-hidden="true" style={{ float: 'right', margin: '5px', marginRight: '10px', fontWeight: 'bold', cursor: 'pointer' }}></i>
                    <form
                        action=""
                        id="send-otp"
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <h2 style={{ color: 'rgba(0, 0, 0, .8)', fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}>Forgot Password</h2>
                        <br />
                        <div className="input-group">
                            <i className="fa-solid fa-user"></i>
                            <input type="email" id="REMAIL" placeholder="Enter your Email" value={emailId} onChange={(e) => setEmailID(e.target.value)} required />
                        </div>
                        <button type="submit" className="bg-gradient-primary" onClick={handleForget}>
                            {isLoading2 ? <ColorRing
                                visible={true}
                                height="40"
                                width="40"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                            /> : "Send OTP"}</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
