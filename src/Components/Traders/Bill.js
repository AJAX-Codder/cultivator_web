import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTraders, selection, ModifySelection, removeEntry, editEntry } from '../../redux/slices/authSlice';
import Swal from 'sweetalert2';
import $ from 'jquery';
import { dataRef } from '../../config/firebase2';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { showHeding } from '../../redux/slices/setting';
export const Bill = React.forwardRef((props, ref) => {
    const [leftSum, setLeftSum] = useState(0);
    const [rightSum, setRightSum] = useState(0);
    const { Trade, Farmers } = useSelector(selectTraders);
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const selectedIndex = useSelector(selection)
    const dispatch = useDispatch();
    const formattedDate = `${day}/${month}/${year}`;
    const show = useSelector(showHeding);
    useEffect(() => {
        calculateSums();
    }, [Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice]);
    const calculateSums = () => {
        let leftTotal = 0;
        let rightTotal = 0;
        const invoice = Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice;
        if (invoice !== null && invoice !== undefined) {
            Object.values(invoice).forEach(item => {
                if (item.TYPE === "જમા ") {
                    leftTotal += parseInt(item.RUPEE);
                } else {
                    rightTotal += parseInt(item.RUPEE);
                }
            });
        }

        setLeftSum(leftTotal === 0 ? "0000" : leftTotal);
        setRightSum(rightTotal === 0 ? "0000" : rightTotal);
    };
    const Oparetion = (Child, value) => {
        $("#" + Child).css('display', value);
    };
    function convertDateFormat(dateString) {
        if (!dateString) {
            return '';
        }

        const parts = dateString.split('-');
        if (parts.length !== 3) {
            return '';
        }

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        return `${year}-${month}-${day}`;
    }

    const EditEntry = (Entry) => {
        dispatch(ModifySelection({ ...selectedIndex, InvoiceIndex: Entry?.IID }))
        Swal.fire({
            title: 'નોંધ સુધારો ',
            html: `
        <div class="form-group">
  <input type="number" class="form-control" id="EditRupee" placeholder="રકમ (₹)" value="${Entry?.RUPEE}">
</div>
<div class="form-group">
  <input type="date" class="form-control" id="EditDate" placeholder="તારીખ" value="${convertDateFormat(Entry?.DATE)}">
</div>
<div class="form-group">
  <textarea id="EditDetail" class="form-control" placeholder="વિગત">${Entry?.DETAILS}</textarea>
</div>
<div class="form-group" style="width:100%">
  <select id="Type" style="padding:15px;width:100%;border:.5px solid rgba(0,0,0,.1);border-radius:3px">
    <option value="જમા " ${Entry?.TYPE === 'જમા' ? 'selected' : ''}>જમા</option>
    <option value="ઉધાર" ${Entry?.TYPE !== 'જમા ' ? 'selected' : ''}>ઉધાર</option>
  </select>
</div>
            `,
            confirmButtonText: 'સુધારો ',
            focusConfirm: false,
            preConfirm: () => {
                const EditRupee = Swal.getPopup().querySelector('#EditRupee').value
                const EditDetail = Swal.getPopup().querySelector('#EditDetail').value
                const EditDate = Swal.getPopup().querySelector('#EditDate').value
                const EditType = Swal.getPopup().querySelector('#Type').value
                if (!EditRupee || !EditDetail || !EditDate) {
                    Swal.showValidationMessage(`Please enter AddRupee and AddDate`)
                }
                return { EditRupee: EditRupee, EditDetail: EditDetail, EditDate: EditDate, EditType: EditType }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                let updates = {};
                let updates2 = {};
                let updates3 = {};
                updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Invoice/${Entry?.IID}/DATE`] = new Date(result.value.EditDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace("/", "-").replace("/", "-");
                updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Invoice/${Entry?.IID}/DETAILS`] = result.value.EditDetail;
                updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Invoice/${Entry?.IID}/RUPEE`] = result.value.EditRupee;
                updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Invoice/${Entry?.IID}/TYPE`] = result.value.EditType;
                await toast.promise(
                    dataRef.ref().update(updates),
                    {
                        pending: `એન્ટ્રી સુધારાઈ છે.. `, // Optional pending message
                        success: `એન્ટ્રી સફળતાપૂર્વક સુધારાઈ ગઈ.. `,
                        error: 'કૈંક વાંધો છે.. !',
                    }
                ).then(() => {
                    let balance = Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex].Balance;
                    let balance2 = Farmers[selectedIndex?.FarmerIndex]?.Balance;
                    balance -= (Entry?.TYPE === "જમા ") ? parseInt(Entry.RUPEE) : -parseInt(Entry.RUPEE);
                    balance += (result.value?.EditType === "જમા ") ? parseInt(result.value.EditRupee) : -parseInt(result.value.EditRupee);
                    balance2 -= (Entry?.TYPE === "જમા ") ? parseInt(Entry.RUPEE) : -parseInt(Entry.RUPEE);
                    balance2 += (result.value?.EditType === "જમા ") ? parseInt(result.value.EditRupee) : -parseInt(result.value.EditRupee);
                    updates2[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Balance`] = balance2;
                    updates3[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Balance`] = balance;
                    dataRef.ref().update(updates2);
                    dataRef.ref().update(updates3);
                    dispatch(editEntry({
                        ...Entry, DATE: new Date(result.value.EditDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace("/", "-").replace("/", "-"),
                        DETAILS: result.value.EditDetail,
                        RUPEE: result.value.EditRupee,
                        TYPE: result.value.EditType
                    }));
                })

            }
        });

    }

    const DeleteEntry = async (IID) => {
        dispatch(ModifySelection({ ...selectedIndex, InvoiceIndex: IID }))
        await Swal.fire({
            title: 'નોંધ હટાવો',
            text: `શું આ નોંધ તમે હટાવા માંગો છો.. ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'હા. હટાવો',
            cancelButtonText: 'નાં '
        }).then(async (result) => {
            if (result.isConfirmed) {
                let updates = {};
                let updates2 = {}
                let invoice = Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice[IID];
                await dataRef.ref(`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Invoice/${IID}`).remove().then(() => {
                    if (invoice.TYPE !== "જમા ") {
                        updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Balance`] = eval(Farmers[selectedIndex?.FarmerIndex]?.Balance + "+" + invoice.RUPEE);
                        updates2[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Balance`] = eval(Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex].Balance + "+" + invoice.RUPEE);
                    }
                    else {
                        updates[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Balance`] = eval(Farmers[selectedIndex?.FarmerIndex]?.Balance + "-" + Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice[IID].RUPEE);
                        updates2[`/Cultivator/Traders/${selectedIndex.TraderId}/Farmers/${selectedIndex.FarmerIndex}/Folder/${selectedIndex?.FolderIndex}/Balance`] = eval(Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex].Balance + "-" + invoice.RUPEE);
                    }
                    dataRef.ref().update(updates);
                    dataRef.ref().update(updates2);
                    dispatch(removeEntry(IID));
                    toast.success(`નોંધ હટાવાઈ.. !`, {
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
                })
            }

        })
    }
    return (
        <div className="row flex-row print-content" style={{ display: 'none' }} id="ViewKhedutAccount" >
            <div className="col-12 grid-margin">
                <div className="card" id="invoice">
                    <div className="card-body">
                        <div ref={ref} style={{
                            padding: !props.PrintStyle ? "10px" : "0"
                        }}>
                            {show === "true" && <h3 className="card-title w-100 text-center">
                                <strong>{Trade}</strong>
                            </h3>}
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
                                        {Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice !== undefined ?
                                            Object.keys(Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice).map((key, index) => {
                                                const entry = Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice[key];
                                                if (entry.TYPE === 'જમા ') {
                                                    return (
                                                        <tr
                                                            key={key}
                                                            id={key}
                                                            onMouseOver={() => Oparetion(`Child${entry.IID}`, '')}
                                                            onMouseLeave={() => Oparetion(`Child${entry.IID}`, 'none')}
                                                        >
                                                            <td >{entry.RUPEE}</td>
                                                            <td >{entry.DATE}</td>
                                                            <td style={{ textAlign: 'right', }}>
                                                                {entry.DETAILS}
                                                                <span id={`Child${entry.IID}`} style={{ width: 'fitContent', display: 'none' }}>
                                                                    <i className="mdi mdi-lead-pencil text-success" style={{ fontSize: 'large', marginLeft: '10px' }} onClick={() => EditEntry({ ...entry, IID: key })}></i>
                                                                    <i className="mdi mdi-delete-outline text-danger" style={{ fontSize: 'large', marginLeft: '10px' }} onClick={() => DeleteEntry(key)}></i>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            }) : null}

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
                                        {Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice !== undefined ?
                                            Object.keys(Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice).map((key, index) => {
                                                const entry = Farmers[selectedIndex?.FarmerIndex]?.Folder[selectedIndex?.FolderIndex]?.Invoice[key];
                                                if (entry.TYPE !== 'જમા ') {
                                                    return (
                                                        <tr
                                                            key={key}
                                                            id={key}
                                                            onMouseOver={() => Oparetion(`Child${entry.IID}`, '')}
                                                            onMouseLeave={() => Oparetion(`Child${entry.IID}`, 'none')}
                                                        >
                                                            <td >{entry.RUPEE}</td>
                                                            <td >{entry.DATE}</td>
                                                            <td style={{ textAlign: 'right' }}>
                                                                {entry.DETAILS}
                                                                <span id={`Child${entry.IID}`} style={{ width: 'fitContent', display: 'none' }}>
                                                                    <i className="mdi mdi-lead-pencil text-success" style={{ fontSize: 'large', marginLeft: '10px' }} onClick={() => EditEntry({ ...entry, IID: key })}></i>
                                                                    <i className="mdi mdi-delete-outline text-danger" style={{ fontSize: 'large', marginLeft: '10px' }} onClick={() => DeleteEntry(key)}></i>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            }) : null}
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
        </div>
    );
});
