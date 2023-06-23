import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsLoggedIn, setSignIn, ModifySelection } from "../redux/slices/authSlice";
import TraderNav from "./TraderNav";
import AuthNavigator from "./AuthNavigator";
import Cookies from "js-cookie";
import "../assets/css/loading.css";
import { dataRef } from "../config/firebase2";
const Navigator = () => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const fetchData = async (email) => {
        try {
            const snapshot = await dataRef.ref("Cultivator/Traders").once("value");
            const data = snapshot.val();

            const filteredData = Object.values(data).filter(obj => obj.Email === email);

            if (filteredData.length > 0) {
                const trader = filteredData[0];
                const traderIndex = Object.keys(data).findIndex(key => data[key] === trader);
                const oneYearFromNow = new Date();
                oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
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
            console.log("Error retrieving data:", error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 4000);
        }
    };

    useEffect(() => {
        const authCookie = Cookies.get("Auth");
        if (authCookie !== undefined) {
            fetchData(authCookie);
        }
        else {
            setTimeout(() => {

                setLoading(false);
            }, 4000);
        }
    }, []);

    const isLoggedIn = useSelector(selectIsLoggedIn);

    if (loading) {
        return <div style={{ backgroundColor: '#31363C', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container" style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column',
            }}>
                <img src="https://raw.githubusercontent.com/AJAX-Codder/cultivator_web/master/public/favicon.ico" height={200} width={200} />
                <h2 className="brand-Name">CULTIVATORS</h2>
            </div>
        </div>;
    } else if (isLoggedIn) {
        return <TraderNav />;
    } else {
        return <AuthNavigator />;
    }
};

export default Navigator;
