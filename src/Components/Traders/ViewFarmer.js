import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTraders, removeFarmer, editFarmer, selectId, removeFolderAuth, ModifySelection, selection } from '../../redux/slices/authSlice';
import $ from 'jquery'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { dataRef } from '../../config/firebase2';
const ViewFarmer = () => {
    const dispatch = useDispatch();
    const { Farmers } = useSelector(selectTraders);
    const selectedIndex = useSelector(selection)
    const id = useSelector(selectId);
    const handleContextMenu = async (e, folder) => {
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
                const folderIndex = Farmers[selectedIndex.FarmerIndex]?.Folder?.findIndex((f) => f?.MFID === folder?.MFID);
                await dataRef.ref(`/Cultivator/Traders/${id}/Farmers/${selectedIndex.FarmerIndex}/Folder/${folderIndex}`).remove().then(() => {
                    dispatch(removeFolderAuth({ index: selectedIndex.FarmerIndex, FolderIndex: folderIndex }))
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
        $("#VName").html(Farmers[selectedIndex.FarmerIndex]?.Name);
        $("#VVillage").html('<b>ગામ : </b >' + Farmers[selectedIndex.FarmerIndex]?.Village);
        $("#VRupee").html("₹" + Farmers[selectedIndex.FarmerIndex]?.Balance);
        $("#VMNO").html('<i class="mdi mdi-phone"></i >' + Farmers[selectedIndex.FarmerIndex]?.Mobile);
    }, [Farmers[selectedIndex.FarmerIndex]])
    const DeleteFarmer = () => {
        Swal.fire({
            title: 'ખેડૂત હટાવો',
            text: `શું તમે ${Farmers[selectedIndex.FarmerIndex]?.Name}ને હટાવવા માંગો છો ??`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'નાં',
            confirmButtonText: 'હા.!',
        }).then((result) => {
            if (result.isConfirmed) {
                if (selectedIndex.FarmerIndex !== null) {
                    try {
                        dataRef.ref(`/Cultivator/Traders/0/Farmers/${selectedIndex.FarmerIndex}`).remove();
                        toast.success(`${Farmers[selectedIndex.FarmerIndex]?.Name} હટાવાયા.. !`, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: false,
                            progress: undefined,
                            theme: "dark",
                        });
                        dispatch(removeFarmer(selectedIndex.FarmerIndex));
                        $("#panelIcon").addClass("mdi-home");
                        $("#panelIcon").removeClass("mdi-folder");
                        $("#panelIcon").removeClass("mdi-account");
                        $("#Index").css('display', 'flex');
                        //Khedut
                        $("#ViewKhedut").css('display', 'none');
                        $("#FormAddFolder").css('display', 'none');
                        $("#panelKhedut").css('display', 'block');

                        //Account
                        $("#ViewKhedut").css('display', 'none');
                        $("#ViewKhedutAccount").css('display', 'none');
                        $("#Printbtn").css('display', 'none');
                        $("#NewEntry").css('display', 'none');
                        $("#panelAccount").css('display', 'none');
                        dispatch(removeFarmer(selectedIndex.FarmerIndex));
                        dispatch(ModifySelection({ ...selectedIndex, FarmerIndex: null }));
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
    const handleEditFarmer = () => {

        Swal.fire({
            title: 'ખેડૂતની માહિતીમાં સુધારો ',
            html: `<hr><br><br><div class="form-group"> 
                                            <input type="text" class="form-control" id="EFName" placeholder="Name" value="${Farmers[selectedIndex.FarmerIndex]?.Name}"
                                                required>
                                        </div>
                                        <div class="form-group">
                                            
                                            <input type="text" class="form-control" id="EFCity" placeholder="Location" value="${Farmers[selectedIndex.FarmerIndex]?.Village}"
                                                required>
                                        </div>
                                        <div class="form-group">
                                            
                                            <input type="tel" class="form-control" id="EMNO" placeholder="9876543210" value="${Farmers[selectedIndex.FarmerIndex]?.Mobile}"
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
                if (Farmers[selectedIndex.FarmerIndex].Name !== Name)
                    updates[`/Cultivator/Traders/0/Farmers/${selectedIndex.FarmerIndex}/Name`] = Name;
                if (Farmers[selectedIndex.FarmerIndex].Village !== Village)
                    updates[`/Cultivator/Traders/0/Farmers/${selectedIndex.FarmerIndex}/Village`] = Village;
                if (Farmers[selectedIndex.FarmerIndex].Mobile !== Mobile)
                    updates[`/Cultivator/Traders/0/Farmers/${selectedIndex.FarmerIndex}/Mobile`] = Mobile;
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
                        let farmerIndex = selectedIndex.FarmerIndex;
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
                        throw error;
                    }
                }
            }
        })
    }

    const ViewInvoice = (folder) => {
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
        const folderIndex = Farmers[selectedIndex.FarmerIndex]?.Folder?.findIndex((f) => f?.MFID === folder?.MFID);
        dispatch(ModifySelection({ ...selectedIndex, FolderIndex: folderIndex, }))
    }
    return (
        <div className="flex-col" id="ViewKhedut" style={{ display: "none" }}>
            <div className="col-3  stretch-card">
                <div className="card">
                    <div className="card-body d-flex flex-column align-items-center">
                        <img src="" style={{ width: '150px', borderRadius: '50%', marginBottom: '20px' }} alt="" id="VImage" />
                        <h4 className="card-title" id="VName"></h4>
                        <p className="card-description" id="VVillage"></p>
                        <p className="card-description" id="VMNO"></p>
                        <h4 id="VRupee" style={{ fontFamily: 'Kadwa', fontWeight: 500, fontSize: 18 }}></h4>
                        <div className="d-flex" id="Opbtn">
                            <p className="bg-gradient-success text-white rounded-2" style={{ width: "70px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", margin: "5px" }}
                                onClick={() => handleEditFarmer()}>
                                <i className="mdi mdi-border-color" style={{ fontSize: "large" }}></i>
                            </p>
                            <p className="bg-gradient-danger text-white rounded-2" style={{ width: "70px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center", margin: "5px" }}
                                onClick={() => DeleteFarmer()}>
                                <i className="mdi mdi-delete" style={{ fontSize: "large" }}></i>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-8 flex-wrap d-flex justify-start items-start" style={{ padding: 0 }} id="FolderContainer">
                {
                    Farmers[selectedIndex.FarmerIndex]?.Folder?.map((folder, index) => {
                        if (folder == null || folder === undefined)
                            return <></>
                        return (
                            <div
                                key={index}
                                onClick={() => ViewInvoice(folder)}
                                className="d-flex flex-column align-items-center"
                                style={{ cursor: 'pointer' }}
                                onContextMenu={(e) => handleContextMenu(e, folder)}
                            >
                                <i
                                    className={`mdi mdi-folder  p-0 m-0 text-${folder?.Balance === 0 ? 'info' : folder?.Balance < 0 ? 'danger' : 'success'
                                        }`}
                                    style={{ fontSize: '80px', }}
                                ></i>
                                <span style={{ position: 'relative', top: '-12%' }}>{folder?.Year}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );

};

export default ViewFarmer;
