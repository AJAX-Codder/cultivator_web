import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTraders, removeFarmer, editFarmer, selectId, removeFolder, ModifySelection, selection } from '../../redux/slices/authSlice';
import $ from 'jquery'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { dataRef } from '../../config/firebase2';
const ViewFarmer = () => {
    const dispatch = useDispatch();
    const Traders = useSelector(selectTraders);
    const Farmers = Traders?.Farmers;
    const selectedIndex = useSelector(selection)
    const id = useSelector(selectId);
    const handleContextMenu = async (e, folder, key) => {
        e.preventDefault();
        await Swal.fire({
            title: 'Delete Folder',
            text: `Are you sure you want to delete the ${folder.Year} folder?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const updates = {};
                updates[`/Cultivator/Traders/${selectedIndex?.TraderId}/Farmers/${selectedIndex?.FarmerIndex}/Balance`] = Farmers[selectedIndex?.FarmerIndex]?.Balance - folder.Balance;
                await dataRef.ref(`/Cultivator/Traders/${id}/Farmers/${selectedIndex?.FarmerIndex}/Folder/${key}`).remove().then(() => {
                    dataRef.ref().update(updates)
                    dispatch(removeFolder(key))
                    toast.success(`${folder?.Year} ફોલ્ડર હટાવાયુ.. !`, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "dark",
                    });
                }).catch((error) => {
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
                })
            }
        });
    };
    useEffect(() => {
        $("#VName").html(Farmers[selectedIndex?.FarmerIndex]?.Name);
        $("#VVillage").html('<b>ગામ : </b >' + Farmers[selectedIndex?.FarmerIndex]?.Village);
        $("#VRupee").html("₹" + Farmers[selectedIndex?.FarmerIndex]?.Balance);
        $("#VMNO").html('<i class="mdi mdi-phone"></i >' + Farmers[selectedIndex?.FarmerIndex]?.Mobile);
    }, [Farmers[selectedIndex?.FarmerIndex]])
    const DeleteFarmer = (farmer) => {
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
                    dataRef.ref(`/Cultivator/Traders/${selectedIndex?.TraderId}/Farmers/${selectedIndex?.FarmerIndex}`).remove();
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
                    dispatch(removeFarmer(selectedIndex?.FarmerIndex));
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
    const handleEditFarmer = (farmer) => {
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
                    updates[`/Cultivator/Traders/${selectedIndex?.TraderId}/Farmers/${selectedIndex?.FarmerIndex}/Name`] = Name;
                if (farmer.Village !== Village)
                    updates[`/Cultivator/Traders/${selectedIndex?.TraderId}/Farmers/${selectedIndex?.FarmerIndex}/Village`] = Village;
                if (farmer.Mobile !== Mobile)
                    updates[`/Cultivator/Traders/${selectedIndex?.TraderId}/Farmers/${selectedIndex?.FarmerIndex}/Mobile`] = Mobile;
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
                        let key = selectedIndex?.FarmerIndex;
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

    const ViewInvoice = (FolderIndex) => {
        $("#panelIcon").removeClass("mdi-home");
        $("#panelIcon").removeClass("mdi-folder");
        $("#panelIcon").addClass("mdi-account");
        $("#Index").css('display', 'none');
        //Khedut
        $("#ViewKhedut").css('display', 'none');
        $("#FormAddFolder").css('display', 'none');
        $("#panelKhedut").css('display', 'block');

        //Account
        $("#ViewKhedut").css('display', 'none');
        $("#ViewKhedutAccount").css('display', 'flex');
        $("#Printbtn").css('display', 'block');
        $("#NewEntry").css('display', 'block');
        $("#panelAccount").css('display', 'block');
        dispatch(ModifySelection({ ...selectedIndex, FolderIndex }))
    }
    return (
        <div className="flex-col" id="ViewKhedut" style={{ display: "none" }}>
            <div className="col-3  stretch-card">
                <div className="card">
                    <div className="card-body d-flex flex-column align-items-center">
                        <img src="" style={{ width: '150px', borderRadius: '50%', marginBottom: '20px' }} alt="" id="VImage" />
                        <h3 className="card-title" id="VName" style={{ fontSize: 16 }}></h3>
                        <p className="card-description" id="VVillage"></p>
                        <p className="card-description" id="VMNO"></p>
                        <h4 id="VRupee" style={{ fontFamily: 'Kadwa', fontWeight: 500, fontSize: 18 }}></h4>
                        <div className="d-flex" id="Opbtn">
                            <p className="bg-gradient-success text-white rounded-2" style={{ width: "70px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", margin: "5px" }}
                                onClick={() => handleEditFarmer(Farmers[selectedIndex?.FarmerIndex])}>
                                <i className="mdi mdi-border-color" style={{ fontSize: "large" }}></i>
                            </p>
                            <p className="bg-gradient-danger text-white rounded-2" style={{ width: "70px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", margin: "5px" }}
                                onClick={() => DeleteFarmer(Farmers[selectedIndex?.FarmerIndex])}>
                                <i className="mdi mdi-delete" style={{ fontSize: "large" }}></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-8 flex-wrap d-flex justify-start items-start" style={{ padding: 0 }} id="FolderContainer">
                {Farmers[selectedIndex?.FarmerIndex]?.Folder === undefined || Object.entries(Farmers[selectedIndex?.FarmerIndex]?.Folder || {}).length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 'bold', height: '90%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path fill="#de3545" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8m4.18-12.24l-1.06 1.06l-1.06-1.06L13 8.82l1.06 1.06L13 10.94L14.06 12l1.06-1.06L16.18 12l1.06-1.06l-1.06-1.06l1.06-1.06l-1.06-1.06M7.82 12l1.06-1.06L9.94 12L11 10.94L9.94 9.88L11 8.82L9.94 7.76L8.88 8.82L7.82 7.76L6.76 8.82l1.06 1.06l-1.06 1.06L7.82 12M12 14c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5Z" /></svg>
                        <p className='text-danger'>કોઈ ફોલ્ડર ઉપલબ્ધ નથી.. </p>
                    </div>
                ) : (
                    Object.entries(Farmers[selectedIndex?.FarmerIndex]?.Folder || {}).map(([folderKey, folder], index) => {
                        if (folder == null || folder === undefined) {
                            return <></>;
                        }
                        return (
                            <div
                                key={folderKey}
                                onClick={() => ViewInvoice(folderKey)}
                                className="d-flex flex-column align-items-center"
                                style={{ cursor: 'pointer' }}
                                onContextMenu={(e) => handleContextMenu(e, folder, folderKey)}
                            >
                                <i
                                    className={`mdi mdi-folder p-0 m-0 text-${parseInt(folder?.Balance) === 0 ? 'info' : folder?.Balance < 0 ? 'danger' : 'success'}`}
                                    style={{ fontSize: '80px' }}
                                ></i>
                                <span style={{ position: 'relative', top: '-12%' }}>{folder?.Year}</span>
                            </div>
                        );
                    })
                )}

            </div>
        </div>
    );

};

export default ViewFarmer;
