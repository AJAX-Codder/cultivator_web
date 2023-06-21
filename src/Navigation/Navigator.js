import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLoggedIn, setSignIn } from "../redux/slices/authSlice";
import TraderNav from "./TraderNav";
import AuthNavigator from "./AuthNavigator";
import Cookies from "js-cookie";
const Navigator = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return isLoggedIn ? <TraderNav /> : <AuthNavigator />
}
export default Navigator;