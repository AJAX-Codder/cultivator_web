import React, { useEffect, useState } from 'react';
import '../../assets/css/login.css';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { setSignIn } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { firebase } from '../../config/firebase';
const auth = getAuth(firebase);
const db = getFirestore();
const LoginForm = () => {
    const dispatch = useDispatch();
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
        const { email, password } = credential;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const response = await fetch(`https://cultivator-d9052-default-rtdb.firebaseio.com/Cultivator.json`);
            const { Traders } = await response.json();
            let traders = null;
            let flag = false;
            for (const traderId in Traders) {
                const trader = Traders[traderId];
                if (trader.Email === email) {
                    traders = trader;
                    flag = true;
                    break;
                }
            }
            if (flag) {
                const data = {
                    id: email,
                    isLoggedIn: true,
                    traders: traders,
                };
                dispatch(setSignIn(data));
            }
            else {
                alert("Invalid")
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        // $(document).on("submit", "#Verify-OTP-Form", (e) => {
        //     e.preventDefault();
        //     $.ajax({
        //         type: "post",
        //         url: "./PHP/Verify_OTP.php",
        //         data: {
        //             UserOTP: $("#input").val()
        //         },
        //         success: function (response) {
        //             if (response === "Valid") {
        //                 $(".popup-reset-pass").css('display', 'flex');
        //             } else {
        //                 alert(response);
        //             }
        //         }
        //     });
        //     $(".popup-otp").css('display', 'none');
        // });
        // $(document).on("submit", "#reset-pass", (e) => {
        //     e.preventDefault();
        //     if ($("#NewPass").val() === $("#RePass").val()) {
        //         $.ajax({
        //             type: "post",
        //             url: "./PHP/ChangePassord.php",
        //             data: {
        //                 Pass: $("#NewPass").val(),
        //                 Email: $("#REMAIL").val()
        //             },
        //             success: function (response) {
        //                 if (response === "Password Changed...") {
        //                     Swal.fire(
        //                         'Good job!',
        //                         'Password Changed..',
        //                         'success'
        //                     );
        //                     $(".popup-reset-pass").css('display', 'none');
        //                 } else {
        //                     Swal.fire(
        //                         'Ohh!',
        //                         'Something Went Wrong',
        //                         'error'
        //                     );
        //                 }
        //             }
        //         });
        //     } else {
        //         alert("Password Not Match...!!");
        //     }
        // });
        // $(document).ready(function () {
        //     if (window.innerWidth <= 800) {
        //         $("#left").addClass('d-none');
        //         $("#right").removeClass('w-50');
        //         $("#right").css('width', "80%");
        //         $("h2").css("text-align", "center");
        //         $("#form").addClass('align-items-center');
        //     }

        //     /* popup Control */
        //     $(document).on("click", ".act5", () => {
        //         $(".popup-login").css('display', 'flex');
        //     });
        //     $(document).on("click", "#close", () => {
        //         $(".popup-login").css('display', 'none');
        //         $(".popup-register").css('display', 'none');
        //         $(".popup-forgotpass").css('display', 'none');
        //         $(".popup-otp").css('display', 'none');
        //     });
        //     $(document).on("click", "#new-user", () => {
        //         $(".popup-login").css('display', 'none');
        //         $(".popup-register").css('display', 'flex');
        //     });
        //     $(document).on("click", "#old-user", () => {
        //         $(".popup-login").css('display', 'flex');
        //         $(".popup-register").css('display', 'none');
        //     });
        //     $(document).on("click", "#Forgot", (e) => {
        //         e.preventDefault();
        //         $(".popup-login").css('display', 'none');
        //         $(".popup-register").css('display', 'none');
        //         $(".popup-forgotpass").css('display', 'flex');
        //     });
        //     $(document).on("submit", "#send-otp", (e) => {
        //         e.preventDefault();
        //         $.ajax({
        //             type: "post",
        //             url: "./PHP/ChangePass.php",
        //             data: {
        //                 EMAIL: $("#REMAIL").val()
        //             },
        //             success: function (response) {
        //                 alert(response);
        //             }
        //         });
        //         $(".popup-forgotpass").css('display', 'none');
        //         $(".popup-otp").css('display', 'flex');
        //         let curtime = new Date().getTime();
        //         let expiretime = curtime + 60000;
        //         let x = setInterval(() => {
        //             curtime = new Date().getTime();
        //             if ((expiretime - curtime) > 0) {
        //                 $("#expire-text").text("OTP expires after: " + Math.floor((expiretime - curtime) / 1000) + "s");
        //             } else {
        //                 $("#expire-text").text("OTP expired...!!");
        //                 clearInterval(x);
        //             }
        //         }, 1000);
        //     });
        // });
    }, []);
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
                                            <div id="Forgot" style={{ width: '80%', fontSize: '14px', color: '#6F0E7E', textAlign: 'right', paddingTop: '10px' }}>
                                                forgot password ?
                                            </div>
                                            <div style={{ width: '80%', fontSize: '14px', color: '#6F0E7E', paddingTop: '10px' }}>
                                                <input type="checkbox" name="remember" id="chk" /> Remember Me
                                            </div>
                                            <div style={{ marginTop: '15px', width: '80%' }}>
                                                <button className="btn btn-gradient-primary" name="SubmitBtn" type="submit">
                                                    Log In
                                                </button>
                                            </div>
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
            {/* <div className="popup-forgotpass d-none">
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
                            <input type="email" id="REMAIL" placeholder="Enter your Email" value="" required />
                        </div>
                        <button type="submit" className="bg-gradient-primary">Send OTP</button>
                    </form>
                </div>
            </div>
            <div className="popup-reset-pass d-none">
                <div className="popup">
                    <i className="mdi mdi-close" id="close" aria-hidden="true" style={{ float: 'right', margin: '5px', marginRight: '10px', fontWeight: 'bold', cursor: 'pointer' }}></i>
                    <form
                        action=""
                        id="reset-pass"
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <h2 style={{ color: 'rgba(0, 0, 0, .8)', fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif' }}>Change Password</h2>
                        <br />
                        <div className="input-group">
                            <i className="fa-solid fa-lock"></i>
                            <input type="text" id="NewPass" placeholder="New Password" required
                            />
                        </div>
                        <div className="input-group">
                            <i className="fa-solid fa-lock"></i>
                            <input type="password" id="RePass" placeholder="Re-Type Password" required />
                        </div>
                        <button type="submit" className="bg-gradient-primary">Change Password</button>
                    </form>
                </div>
            </div>
            <div className="popup-otp d-none">
                <div className="popup">
                    <i className="mdi mdi-close" id="close" aria-hidden="true" style={{ float: 'right', margin: '10px', color: 'rgba(0, 0, 0, .2)', fontWeight: 'bold', cursor: 'pointer' }}></i>
                    <form
                        className="Verify-model-content"
                        id="Verify-OTP-Form"
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div className="Avatar" dropzone="true">
                            <img src="./Avatar.jpg" alt="" srcSet="" />
                        </div>
                        <span style={{ color: 'blueviolet', fontWeight: 'bold', fontSize: '16px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', margin: '10px' }}>One Time Password</span>
                        <div className="otp center">
                            <input type="number" id="input" className="input" name="OTP" onInput="OTP_Verify()" pattern="[0-9]{6}" required title="" />
                            <span className="dig center"></span>
                            <span className="dig center"></span>
                            <span className="dig center"></span>
                            <span className="dig center"></span>
                            <span className="dig center"></span>
                            <span className="dig center"></span>
                        </div>
                        <div className="expire">otp expire after 2:6</div>
                        <button className="verify-btn" type="submit" style={{ background: 'blueviolet' }}>
                            Verify OTP
                        </button>
                    </form>
                </div>
            </div> */}
        </>
    );
};

export default LoginForm;
