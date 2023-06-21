import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTraders, selection } from '../../redux/slices/authSlice';
import $ from 'jquery';
const Bill = () => {
    const [leftSum, setLeftSum] = useState(0);
    const [rightSum, setRightSum] = useState(0);
    const { Trade, Farmers } = useSelector(selectTraders);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const selectedIndex = useSelector(selection)
    const Folder = Farmers[selectedIndex.FarmerIndex]?.Folder[[selectedIndex.FolderIndex]];
    const formattedDate = `${day}/${month}/${year}`;
    useEffect(() => {
        calculateSums();
    }, [Folder]);
    const calculateSums = () => {
        let leftTotal = 0;
        let rightTotal = 0;
        Folder?.Invoice?.forEach(item => {
            if (item.TYPE === "જમા ") {
                leftTotal += parseInt(item.RUPEE);
            } else {
                rightTotal += parseInt(item.RUPEE);
            }
        });
        setLeftSum(leftTotal === 0 ? "0000" : leftTotal);
        setRightSum(rightTotal === 0 ? "0000" : rightTotal);
    };
    const Oparetion = (Child, value) => {
        $("#" + Child).css('display', value);
    };
    return (
        <div className="row flex-row" style={{ display: 'none' }} id="ViewKhedutAccount">
            <div className="col-12 grid-margin">
                <div className="card" id="invoice">
                    <div className="card-body">
                        <h3 className="card-title w-100 text-center">
                            <strong>{Trade}</strong>
                        </h3>
                        <span className="d-flex" id="InvoiceKhedut">
                            <p className="w-75">
                                <b>ખેડૂત નામ: </b>
                                <span id="InvoiceName">{Farmers[selectedIndex.FarmerIndex]?.Name}</span>
                            </p>
                            <p className="w-25 d-flex justify-content-end">
                                <b>ગામ: </b>
                                <span id="InvoiceVillage">{Farmers[selectedIndex.FarmerIndex]?.Village}&nbsp;&nbsp;</span>
                            </p>
                            <p className="w-25 d-flex justify-content-end">
                                <b>તારીખ: </b>
                                <span id="InvoiceDate">&nbsp;{formattedDate}</span>
                            </p>
                        </span>
                        <span className="d-flex">
                            <p className="card-description w-75">જમા</p>
                            <p className="card-description w-25 d-flex justify-content-end">ઉધાર</p>
                        </span>
                        <div className="d-flex">
                            <table className="table" style={{ height: 'fit-content' }}>
                                <thead>
                                    <tr>
                                        <th style={{ fontWeight: 'bold' }}>રકમ (₹)</th>
                                        <th style={{ fontWeight: 'bold' }}>તારીખ</th>
                                        <th
                                            style={{
                                                fontWeight: 'bold',
                                                width: '30%',
                                                borderRight: '1px solid gray',
                                                textAlign: 'right',
                                            }}
                                        >
                                            વિગત
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="leftBody">
                                    {Folder?.Invoice?.map(jama =>
                                        jama.TYPE === 'જમા ' ? (
                                            <tr
                                                key={jama.IID}
                                                id={jama.IID}
                                                onMouseOver={() => Oparetion(`Child${jama.IID}`, '')}
                                                onMouseLeave={() => Oparetion(`Child${jama.IID}`, 'none')}
                                            >
                                                <td>{jama.RUPEE}</td>
                                                <td>{jama.DATE}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {jama.DETAILS}
                                                    <span id={`Child${jama.IID}`} style={{ width: 'fitContent', display: 'none' }}>
                                                        <i className="mdi mdi-lead-pencil text-success" style={{ fontSize: 'large', marginLeft: '10px' }}></i>
                                                        <i className="mdi mdi-delete-outline text-danger" style={{ fontSize: 'large', marginLeft: '10px' }}></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : null
                                    )}
                                </tbody>
                            </table>
                            <table className="table" style={{ height: 'fit-content' }}>
                                <thead>
                                    <tr>
                                        <th style={{ fontWeight: 'bold' }}>રકમ (₹)</th>
                                        <th style={{ fontWeight: 'bold' }}>તારીખ</th>
                                        <th style={{ fontWeight: 'bold', width: '30%', textAlign: 'right' }}>વિગત</th>
                                    </tr>
                                </thead>
                                <tbody id="rightBody">
                                    {Folder?.Invoice?.map(udhar =>
                                        udhar.TYPE !== 'જમા ' ? (
                                            <tr
                                                key={udhar.IID}
                                                id={udhar.IID}
                                                onMouseOver={() => Oparetion(`Child${udhar.IID}`, '')}
                                                onMouseLeave={() => Oparetion(`Child${udhar.IID}`, 'none')}
                                            >
                                                <td>{udhar.RUPEE}</td>
                                                <td>{udhar.DATE}</td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {udhar.DETAILS}
                                                    <span id={`Child${udhar.IID}`} style={{ width: 'fitContent', display: 'none' }}>
                                                        <i className="mdi mdi-lead-pencil text-success" style={{ fontSize: 'large', marginLeft: '10px' }}></i>
                                                        <i className="mdi mdi-delete-outline text-danger" style={{ fontSize: 'large', marginLeft: '10px' }}></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : null
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex">
                            <table className="table" style={{ height: 'fit-content' }}>
                                <thead id="SumRow">
                                    <tr>
                                        <th
                                            id="LeftSum"
                                            style={{
                                                fontWeight: 'bold',
                                                borderTop: '1px groove gray',
                                                borderBottom: '1px groove gray',
                                                width: '10%',
                                            }}
                                        >
                                            {leftSum}
                                        </th>
                                        <th style={{ fontWeight: 'bold' }}></th>
                                        <th
                                            id="RightSum"
                                            style={{
                                                fontWeight: 'bold',
                                                borderTop: '1px groove gray',
                                                borderBottom: '1px groove gray',
                                                width: '10%',
                                            }}
                                        >
                                            {rightSum}
                                        </th>
                                        <th style={{ fontWeight: 'bold' }}></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bill;
