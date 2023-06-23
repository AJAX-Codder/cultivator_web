import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { selectTraders, removeFarmer, editFarmer, selectId, ModifySelection, selection } from '../../redux/slices/authSlice';
import $ from 'jquery'
import Swal from 'sweetalert2';
import { dataRef } from '../../config/firebase2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const PAGE_SIZE = 10; // Number of records to display per page
function KhedutTable() {
    const { Farmers } = useSelector(selectTraders);
    const [filteredFarmers, setFilteredFarmers] = useState({});
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();
    // const id = useSelector(selectId);
    const selectedIndex = useSelector(selection)
    useEffect(() => {
        if (Farmers != null && Farmers != undefined) {
            let arr = Object.entries(Farmers)
            arr.sort((a, b) => a[1]?.Name.localeCompare(b[1]?.Name));
            setFilteredFarmers(Object.fromEntries(arr));
        }
    }, [Farmers]);
    useEffect(() => {
        // const totalPages = Math.ceil(Object.keys(filteredFarmers).length / PAGE_SIZE);
        // setTotalPages(totalPages);
    }, [filteredFarmers]);
    if (Farmers === null || Farmers === undefined || Object.keys(Farmers).length === 0)
        return (<div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', height: '90%', justifyContent: 'center', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24">
                <path fill="#de3545" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m4.18-12.24l-1.06 1.06l-1.06-1.06L13 8.82l1.06 1.06L13 10.94L14.06 12l1.06-1.06L16.18 12l1.06-1.06l-1.06-1.06l1.06-1.06l-1.06-1.06M7.82 12l1.06-1.06L9.94 12L11 10.94L9.94 9.88L11 8.82L9.94 7.76L8.88 8.82L7.82 7.76L6.76 8.82l1.06 1.06l-1.06 1.06L7.82 12M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5Z" />
            </svg>
            <p className='text-danger'>કોઈ ખેડૂત ઉપલબ્ધ નથી.. </p>
        </div>);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const searchKhedut = (text) => {
        const filter = text?.toUpperCase();
        const filteredData = Object.values(Farmers).filter(
            (farmer) => farmer?.Name?.toUpperCase().indexOf(filter.trim()) > -1
        );
        const filteredFarmers = filteredData.reduce((result, farmer) => {
            result[farmer.FID] = farmer;
            return result;
        }, {});
        setFilteredFarmers(filteredFarmers);
        setCurrentPage(1);
    };

    const paginatedFarmers = Object.values(filteredFarmers)
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .reduce((obj, farmer) => {
            obj[farmer.FID] = farmer;
            return obj;
        }, {});
    // //Delete Farmer
    const DeleteFarmer = (key, farmer) => {
        Swal.fire({
            title: 'ખેડૂત હટાવો',
            text: `શું તમે ${farmer?.Name}ને હટાવવા માંગો છો ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'નાં',
            confirmButtonText: 'હા.!',
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    dataRef.ref(`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${key}`).remove();
                    toast.success(`${farmer?.Name} હટાવાયા.. !`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                    dispatch(removeFarmer(key));
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

    // //Edit Farmer
    const handleEditFarmer = (key, farmer) => {
        Swal.fire({
            title: 'ખેડૂતની માહિતીમાં સુધારો ',
            html: `<hr><br><br><div class="form-group"> 
                                                <input type="text" class="form-control" id="EFName" placeholder="Name" value="${farmer?.Name}"
                                                    required>
                                            </div>
                                            <div class="form-group">

                                                <input type="text" class="form-control" id="EFCity" placeholder="Location" value="${farmer?.Village}"
                                                    required>
                                            </div>
                                            <div class="form-group">

                                                <input type="tel" class="form-control" id="EMNO" placeholder="9876543210" value="${farmer?.Mobile}"
                                                    required pattern="[0-9]{10}">
                                            </div>

                                            </div>
                                            `,
            showCancelButton: true,
            cancelButtonText: 'રદ કરો',
            confirmButtonText: ' સુધારો ',
            focusConfirm: false,
            preConfirm: () => {
                const EditName = Swal.getPopup().querySelector('#EFName').value
                const EditVillage = Swal.getPopup().querySelector('#EFCity').value
                const EditMobile = Swal.getPopup().querySelector('#EMNO').value
                const EditPhoto = ''
                if (!EditName || !EditVillage || !EditMobile) {
                    Swal.showValidationMessage(`Please enter Value `)
                }
                return {
                    Name: EditName,
                    Village: EditVillage,
                    Mobile: EditMobile,
                    Photo: EditPhoto
                }
            }
        }).then((response) => {
            if (response.isConfirmed) {
                const { Name, Village, Mobile } = response.value;
                const updates = {};
                if (farmer.Name !== Name)
                    updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${key}/Name`] = Name;
                if (farmer.Village !== Village)
                    updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${key}/Village`] = Village;
                if (farmer.Mobile !== Mobile)
                    updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${key}/Mobile`] = Mobile;
                if (updates !== {}) {
                    try {
                        dataRef.ref().update(updates);
                        toast.success(`${Name}ની માહિતી સુધારાઈ.. !!`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "dark",
                        });
                        dispatch(editFarmer({ key, Name, Village, Mobile }))
                        return response.value;
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
            }
        })
    }

    const handleFarmerClick = (FarmerIndex) => {
        $("#panelIcon").removeClass("mdi-home");
        $("#panelIcon").removeClass("mdi-account");
        $("#panelIcon").addClass("mdi-folder");
        $("#panelKhedut").css('display', 'block');
        $("#Index").css('display', 'none');
        $("#ViewKhedut").css('display', 'flex');
        $("#FormAddFolder").css('display', 'block');
        $("#VImage").prop('src', 'https://w7.pngwing.com/pngs/534/724/png-transparent-farmer-agriculture-selling-food-food-vertebrate-agriculture-thumbnail.png');
        dispatch(ModifySelection({ ...selectedIndex, FarmerIndex }))
    }
    // return <></>
    return (
        <div className="row" id="Index">
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="card-title">ખેડૂતમિત્ર</h4>
                            <div className="search-field d-md-block">
                                <form className="d-flex align-items-center h-100" action="#">
                                    <div
                                        className="input-group d-flex"
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'rgba(0,0,0,.05)',
                                            borderRadius: 10,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="form-control border-0 bg-transparent"
                                            id="search"
                                            placeholder="ખેડૂત નામ.."
                                            onInput={(e) => searchKhedut(e.target.value)}
                                            style={{
                                                borderRadius: '20px',
                                                fontSize: '14px',
                                                boxShadow: 'none',
                                                outline: 'none',
                                            }}
                                        />
                                        <div className="input-group-prepend">
                                            <span className="input-group-text border-0">
                                                <i className="mdi mdi-magnify"></i>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>ખેડૂત</th>
                                        <th>સ્થિતિ</th>
                                        <th>રકમ</th>
                                        <th>તારીખ</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="KhedutTable">
                                    {Object.keys(filteredFarmers).map((key) => {
                                        const farmer = Farmers[key];
                                        let statuscolor = farmer?.Balance === 0 ? 'info' : farmer?.Balance > 0 ? 'success' : 'danger';
                                        let status = farmer?.Balance === 0 ? 'પૂર્ણ' : farmer?.Balance > 0 ? 'જમા' : 'બાકી';
                                        if (!farmer || !farmer.Name) {
                                            return null;
                                        }
                                        return (
                                            <tr key={key} className='Farmer' style={{ cursor: 'pointer' }}>
                                                <td onClick={() => handleFarmerClick(key)}>{farmer.Name}</td>
                                                <td onClick={() => handleFarmerClick(key)}>
                                                    <label className={`bg-gradient-${statuscolor} text-white rounded-1`} style={{ padding: 5, paddingInline: 10, fontSize: 12 }}>
                                                        {status}
                                                    </label>
                                                </td>
                                                <td className={`text-${statuscolor}`} onClick={() => handleFarmerClick(key)}>₹{farmer.Balance}</td>
                                                <td onClick={() => handleFarmerClick(key)}>{farmer.Date}</td>
                                                <td>
                                                    <span className="bg-gradient-success text-white m-1 rounded-2" style={{ width: "40px", padding: "7px 25px" }} onClick={() => handleEditFarmer(key, farmer)}>
                                                        <i className="mdi mdi-border-color" style={{ fontSize: "large" }}></i>
                                                    </span>
                                                    <span className="bg-gradient-danger text-white rounded-2" style={{ width: "40px", padding: "7px 25px" }} onClick={() => DeleteFarmer(key, farmer)}>
                                                        <i className="mdi mdi-delete" style={{ fontSize: "large" }}></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default KhedutTable;
