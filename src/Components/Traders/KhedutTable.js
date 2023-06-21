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
    const [filteredFarmers, setFilteredFarmers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const dispatch = useDispatch();
    const { Farmers } = useSelector(selectTraders);
    const id = useSelector(selectId);
    const selectedIndex = useSelector(selection)
    useEffect(() => {
        setFilteredFarmers([...Farmers]?.sort((a, b) => {
            const nameA = a?.Name || ''; // Use an empty string as fallback for undefined values
            const nameB = b?.Name || ''; // Use an empty string as fallback for undefined values
            return nameA.localeCompare(nameB);
        }));
    }, [Farmers]);
    useEffect(() => {
        const totalPages = Math.ceil(filteredFarmers.length / PAGE_SIZE);
        setTotalPages(totalPages);
    }, [filteredFarmers]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const searchKhedut = (text) => {
        const filter = text?.toUpperCase();
        const filteredData = Farmers?.filter(
            (farmer) => farmer?.Name?.toUpperCase().indexOf(filter.trim()) > -1
        );
        setFilteredFarmers(filteredData);
        setCurrentPage(1);
    };

    const paginatedFarmers = filteredFarmers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    //Delete Farmer
    const DeleteFarmer = (farmer, Farmers) => {
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
                const farmerIndex = Farmers.findIndex((f) => f?.ID === farmer?.ID);
                if (farmerIndex !== -1) {
                    try {
                        dataRef.ref(`/Cultivator/Traders/${id}/Farmers/${farmerIndex}`).remove();
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
                        dispatch(removeFarmer(farmerIndex));
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
                } else {
                    toast.error('કૃપયા કરી પેજ રિફ્રેશ  કરો .. !', {
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

    //Edit Farmer
    const handleEditFarmer = (farmer, Farmers) => {

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
                const farmerIndex = Farmers.findIndex(f => f?.ID === farmer?.ID);
                const updates = {};
                if (farmer.Name !== Name)
                    updates[`/Cultivator/Traders/${id}/Farmers/${farmerIndex}/Name`] = Name;
                if (farmer.Village !== Village)
                    updates[`/Cultivator/Traders/${id}/Farmers/${farmerIndex}/Village`] = Village;
                if (farmer.Mobile !== Mobile)
                    updates[`/Cultivator/Traders/${id}/Farmers/${farmerIndex}/Mobile`] = Mobile;
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
                        dispatch(editFarmer({ farmerIndex, Name, Village, Mobile }))
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

    const handleFarmerClick = (farmer) => {
        $("#panelIcon").removeClass("mdi-home");
        $("#panelIcon").removeClass("mdi-account");
        $("#panelIcon").addClass("mdi-folder");
        $("#panelKhedut").css('display', 'block');
        $("#Index").css('display', 'none');
        $("#ViewKhedut").css('display', 'flex');
        $("#FormAddFolder").css('display', 'block');
        $("#VImage").prop('src', 'https://w7.pngwing.com/pngs/534/724/png-transparent-farmer-agriculture-selling-food-food-vertebrate-agriculture-thumbnail.png');
        const farmerIndex = Farmers.findIndex(f => f?.ID === farmer?.ID);
        dispatch(ModifySelection({ ...selectedIndex, FarmerIndex: farmerIndex }))
    }
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
                                    {paginatedFarmers.map((farmer, index) => {
                                        let statuscolor = farmer?.Balance === 0 ? 'info' : farmer?.Balance > 0 ? 'success' : 'danger';
                                        let status = farmer?.Balance === 0 ? 'પૂર્ણ' : farmer?.Balance > 0 ? 'જમા' : 'બાકી';
                                        if (farmer == null || farmer === undefined || farmer === "" || farmer?.Name == null || farmer?.Name === "" || farmer?.Name === undefined)
                                            return <></>
                                        return (
                                            <tr key={farmer?.ID} id={farmer?.ID} className='Farmer' style={{ cursor: 'pointer' }}>
                                                <td onClick={() => handleFarmerClick(farmer)}>{farmer?.Name}</td>
                                                <td onClick={() => handleFarmerClick(farmer)}>
                                                    <label
                                                        className={`bg-gradient-${statuscolor} text-white rounded-1`}
                                                        style={{ padding: 5, paddingInline: 10, fontSize: 12 }}
                                                    >
                                                        {status}
                                                    </label>
                                                </td>
                                                <td className={`text-${statuscolor}`} onClick={() => handleFarmerClick(farmer)}>₹{farmer?.Balance}</td>
                                                <td onClick={() => handleFarmerClick(farmer)}>{farmer?.Date}</td>
                                                <td>
                                                    <span className="bg-gradient-success text-white m-1 rounded-2" style={{ width: "40px", padding: "7px 25px" }} onClick={() => handleEditFarmer(farmer, Farmers)}>
                                                        <i className="mdi mdi-border-color" style={{ fontSize: "large" }}></i>
                                                    </span>
                                                    <span className="bg-gradient-danger text-white rounded-2" style={{ width: "40px", padding: "7px 25px" }} onClick={() => DeleteFarmer(farmer, Farmers)}>
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
