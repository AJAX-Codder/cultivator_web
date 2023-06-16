import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/slices/authSlice";
import TraderNav from "./TraderNav";
import AuthNavigator from "./AuthNavigator";
const Navigator = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    return isLoggedIn ? <TraderNav /> : <AuthNavigator />
}
export default Navigator;