import React from 'react';
import "../../assets/css/style.css"
import { useSelector } from 'react-redux';
import { selectTraders } from '../../redux/slices/authSlice';
const Sidebar = () => {
    let { Name, Trade, TradeImg } = useSelector(selectTraders);
    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className='w-100' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <img src={TradeImg} id='tdImg' style={{ width: 150, height: 150, borderRadius: '50%', border: "5px solid " }} alt="profile" />
                    <span className="login-status online"></span>
                    <div className="nav-profile-text d-flex flex-column p-1" id="Traders">
                        <span className="font-weight-bold text-center" style={{ fontWeight: 'bolder', fontSize: "22px" }} >{Trade}</span>
                        <span className="text-secondary text-small text-center" style={{ fontSize: '12px' }}>{Name}</span>
                    </div>
                </li>
                <li className="nav-item">
                    <div className="nav-link" style={{ cursor: 'pointer' }} id='HOME'>
                        <span className="menu-title">અનુક્રમણિકા</span>
                        <i className="mdi mdi-home menu-icon"></i>
                    </div>
                </li>
                <li className="nav-item sidebar-actions">
                    <span className="nav-link">
                        <button className="btn btn-block btn-lg btn-gradient-primary " id="ADDKHEDUT" style={{ position: 'absolute', bottom: 10 }}>
                            + ખેડૂત ઉમેરો
                        </button>
                    </span>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
