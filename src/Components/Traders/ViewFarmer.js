import React from 'react';
import { useSelector } from 'react-redux';
import { selectedFarmer } from '../../redux/slices/FarmerSlice';
import face6 from '../../assets/images/faces/face6.jpg';
const ViewFarmer = () => {
    const FarmerInfo = useSelector(selectedFarmer);
    console.log(FarmerInfo)
    return (
        <div className="row flex-col w-100" id="ViewKhedut">
            <div className="col-4 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body d-flex flex-column align-items-center">
                        <img src={face6} style={{ width: '150px', borderRadius: '50%', marginBottom: '20px' }} alt="" id="VImage" />
                        <h4 className="card-title" id="VName">{FarmerInfo?.Name}</h4>
                        <p className="card-description" id="VVillage">{FarmerInfo?.Village}</p>
                        <p className="card-description" id="VMNO">{FarmerInfo?.Mobile}</p>
                        <h4 id="VRupee">{FarmerInfo?.Balance}</h4>
                        <div className="d-flex" id="Opbtn"></div>
                    </div>
                </div>
            </div>
            <div className="col-8 flex-wrap d-flex" id="FolderContainer">
                {
                    FarmerInfo?.Folder.map((folder, index) => (
                        <div key={index} className="d-flex flex-column align-items-center folder" style={{ cursor: 'pointer' }}>
                            <i className={`mdi mdi-folder text-${folder.Balance == 0 ? 'info' : folder.Balance < 0 ? 'danger' : 'success'}`} style={{ fontSize: '100px' }}></i>
                            <span style={{ position: 'relative', top: '-4%' }}>{folder?.Year}</span>
                            <div className="" style={{ height: '20px', position: 'relative', top: '12%', right: '55px', width: '40px' }}>
                                <span className="rounded-2" style={{ width: '40px', height: '40px', padding: '10px 20px', cursor: 'pointer', color: '#ff5349' }}>
                                    <i className="mdi mdi-delete" style={{ fontSize: '25px' }}></i>
                                </span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );

};

export default ViewFarmer;
