import React, { useState } from 'react';
import "../../assets/css/style.css"
import { useSelector, useDispatch } from 'react-redux';
import { selectTraders, addFarmer, selectId } from '../../redux/slices/authSlice';
import Swal from 'sweetalert2';
import { dataRef } from '../../config/firebase2';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { Switch } from '@mui/material';
import { setHeading, showHeding } from '../../redux/slices/setting';
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));
const Sidebar = () => {
    let id = useSelector(selectId);
    let { Name, Trade, TradeImg, Farmers } = useSelector(selectTraders);
    const show = useSelector(showHeding);
    const handleSwitchToggle = () => {
        dispatch(setHeading(show === "false" ? "true" : "false"));
    };
    const dispatch = useDispatch();
    const AddFarmer = async () => {
        Swal.fire({
            title: 'નવા ખેડૂતને ઉમેરો',
            html: `
      <hr>
      <div class="form-group">
        <input type="text" class="form-control" id="EFName" placeholder="ખેડૂતનામ " required>
      </div>
      <div class="form-group">
        <input type="text" class="form-control" id="EFCity" placeholder="ગામ " required>
      </div>
      <div class="form-group">
        <input type="tel" class="form-control" id="EMNO" placeholder="9876543210" required pattern="[0-9]{10}">
      </div>
    `,
            showCancelButton: true,
            cancelButtonText: 'રદ કરો',
            confirmButtonText: 'ઉમેરો',
            focusConfirm: false,
            preConfirm: async () => {
                const NewName = Swal.getPopup().querySelector('#EFName').value;
                const NewVillage = Swal.getPopup().querySelector('#EFCity').value;
                const NewMobile = Swal.getPopup().querySelector('#EMNO').value;

                if (!NewName || !NewVillage || !NewMobile) {
                    Swal.showValidationMessage('Please enter all values');
                }

                const currentDate = new Date();

                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                const year = String(currentDate.getFullYear());

                const formattedDate = `${day}-${month}-${year}`;

                const currentYear = currentDate.getFullYear();
                const newFarmer = {
                    Name: NewName,
                    Village: NewVillage,
                    Mobile: NewMobile,
                    Pic: 'https://w7.pngwing.com/pngs/534/724/png-transparent-farmer-agriculture-selling-food-food-vertebrate-agriculture-thumbnail.png',
                    Balance: 0,
                    Date: formattedDate,
                    Folder: {}
                };
                return newFarmer;
            }
        }).then((response) => {
            if (response.isConfirmed) {
                let newFarmer = response.value;
                let FID = ""
                try {
                    FID = dataRef.ref(`/Cultivator/Traders/${id}/Farmers/`).push(newFarmer).key;
                    dispatch(addFarmer({ ...newFarmer, FID }));
                    toast.success('ખેડૂત ઉમેરાયો.. !', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                } catch (error) {
                    console.log(error)
                    toast.error('કૈંક વાંધો છે.. !', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                }
            }
        });
    };
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
                <li className='nav-item'>
                    <div className="nav-link" style={{ cursor: 'pointer' }}>
                        <span className="menu-title">Theme</span>
                        <MaterialUISwitch value={false} />
                    </div>
                </li>
                <li className='nav-item'>
                    <div className="nav-link" style={{ cursor: 'pointer' }}>
                        <span className="menu-title">Bill Heading</span>
                        <Switch
                            className="menu-icon"
                            checked={show === "false" ? false : true}
                            onChange={handleSwitchToggle}
                        />
                    </div>
                </li>
                <li className="nav-item sidebar-actions">
                    <span className="nav-link">
                        <button className="btn btn-block btn-lg btn-gradient-primary " id="ADDKHEDUT" style={{ position: 'absolute', bottom: 10 }} onClick={() => AddFarmer()}>
                            + ખેડૂત ઉમેરો
                        </button>
                    </span>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
