import React, { useState } from 'react';
import AddFarmer from './AddFarmer';
import KhedutTable from './KhedutTable';
import ViewFarmer from './ViewFarmer';

const MainPanel = () => {
    const [khedutTable, setKhedutTable] = useState(true);
    const [ViewFolder, setViewFolder] = useState(false);
    // const []
    const handlePrint = () => {
        // Implement the Print functionality
    };
    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="page-header">
                    <h3 className="page-title w-100 d-flex align-items-center">
                        <span className="page-title-icon bg-gradient-primary text-white">
                            <i className="mdi mdi-home" id="panelIcon"></i>
                        </span>
                        <div className="d-flex" style={{ width: '60%', cursor: 'pointer' }}>
                            <span id="panelName">&nbsp; અનુક્રમણિકા</span>
                            <span id="panelKhedut" style={{ display: 'none' }}> \ ખેડૂત </span>
                            <span id="panelAccount" style={{ display: 'none' }}> \ ખાતાવહી</span>
                        </div>
                        <span className="float-end" style={{ width: '40%' }}>
                            <div className="d-flex justify-content-end" style={{ width: '100%' }}>
                                <button className="bg-gradient-success text-white me-2 border rounded-2" id="NewEntry" style={{ boxShadow: '2px 2px 5px rgba(0,0,0,.1),inset -2px -2px 3px rgba(0,0,0,.2)', padding: '10px', display: 'none' }}>
                                    <i className="mdi mdi-plus"></i>
                                    &nbsp; New &nbsp;
                                </button>
                                <button className="bg-gradient-primary text-white me-2 border rounded-2" id="Printbtn" onClick={handlePrint} style={{ boxShadow: '2px 2px 5px rgba(0,0,0,.1),inset -2px -2px 3px rgba(0,0,0,.2)', padding: '10px', display: 'none' }}>
                                    &nbsp; Print &nbsp;
                                    <i className="mdi mdi-printer"></i>
                                </button>
                            </div>
                            <form action="" id="FormAddFolder" style={{ display: 'none' }}>
                                <input type="text" name="" id="MainFolderName" style={{ margin: '5px', border: 'none', height: '40px', borderRadius: '5px', paddingLeft: '10px', boxShadow: '2px 2px 3px gray,inset -2px -2px 3px rgba(0,0,0,.2)' }} placeholder="Folder Name" required />
                                <button className="bg-gradient-primary text-white me-2 border rounded-2" style={{ boxShadow: '2px 2px 5px rgba(0,0,0,.1),inset -2px -2px 3px rgba(0,0,0,.2)', padding: '10px' }}>
                                    <i className="mdi mdi-plus" id="panelIcon"></i>
                                    Add Folder
                                </button>
                            </form>
                        </span>
                    </h3>
                    <div id="BackUp" className="btn-gradient-info d-flex justify-content-center align-items-center rounded-3 position-fixed float-end" style={{ zIndex: '100000000', fontSize: '24px', top: '90%', right: '20px', width: '55px', height: '55px', padding: '0', boxShadow: '2px 2px 5px rgba(0,0,0,.1),inset -2px -2px 3px rgba(0,0,0,.2)', cursor: 'pointer' }}>
                        <i className="mdi mdi-arrow-upmdi mdi-google-drive" style={{ fontSize: '28px', color: '#fff' }}></i>
                    </div>
                </div>
                <KhedutTable />
                <AddFarmer />
                <ViewFarmer />
            </div>
        </div>
    );
};

export default MainPanel;
