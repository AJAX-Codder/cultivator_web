import React from 'react';
import "../../assets/css/style.css"
import { useSelector, useDispatch } from 'react-redux';
import { selectTraders, addFarmer, selectId } from '../../redux/slices/authSlice';
import Swal from 'sweetalert2';
import { dataRef } from '../../config/firebase2';
import { toast } from 'react-toastify';
const Sidebar = () => {
    let id = useSelector(selectId);
    let { Name, Trade, TradeImg, Farmers } = useSelector(selectTraders);
    const dispatch = useDispatch();
    const AddFarmer = async (lastID, index) => {

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
                    ID: (parseInt(lastID) + 1).toString(),
                    Name: NewName,
                    Village: NewVillage,
                    Mobile: NewMobile,
                    Pic: 'https://w7.pngwing.com/pngs/534/724/png-transparent-farmer-agriculture-selling-food-food-vertebrate-agriculture-thumbnail.png',
                    Balance: 0,
                    Date: formattedDate,
                    Folder: [{
                        Balance: 0,
                        Invoice: [],
                        MFID: "0",
                        Year: currentYear
                    }]
                };
                return newFarmer;
            }
        }).then((response) => {
            if (response.isConfirmed) {
                let newFarmer = response.value;
                try {
                    dataRef.ref(`/Cultivator/Traders/${id}/Farmers/${index}`).set(newFarmer);
                    dispatch(addFarmer(newFarmer));
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
                <li className="nav-item sidebar-actions">
                    <span className="nav-link">
                        <button className="btn btn-block btn-lg btn-gradient-primary " id="ADDKHEDUT" style={{ position: 'absolute', bottom: 10 }} onClick={() => AddFarmer(Farmers[Farmers.length - 1]?.ID, Farmers?.length)}>
                            + ખેડૂત ઉમેરો
                        </button>
                    </span>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
