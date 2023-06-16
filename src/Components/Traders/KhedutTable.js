import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { selectTraders } from '../../redux/slices/authSlice';
import { selectFarmer } from '../../redux/slices/FarmerSlice';
import $ from 'jquery'
const PAGE_SIZE = 10; // Number of records to display per page

function KhedutTable() {
    const [filteredFarmers, setFilteredFarmers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const dispatch = useDispatch();
    let { Farmers } = useSelector(selectTraders);
    Farmers = [...Farmers].sort((a, b) => a.Name.localeCompare(b.Name));
    useEffect(() => {
        setFilteredFarmers(Farmers);
    }, []);

    useEffect(() => {
        const totalPages = Math.ceil(filteredFarmers.length / PAGE_SIZE);
        setTotalPages(totalPages);
    }, [filteredFarmers]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const searchKhedut = (text) => {
        const filter = text.toUpperCase();
        const filteredData = Farmers.filter(
            (farmer) => farmer.Name.toUpperCase().indexOf(filter.trim()) > -1
        );
        setFilteredFarmers(filteredData);
        setCurrentPage(1);
    };

    const paginatedFarmers = filteredFarmers.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );



    const handleFarmerClick = (farmer) => {

        // var HOME = $('#HOME');
        // var AddKedhut = $("#ADDKHEDUT");
        var Index = $("#Index");
        var ADDFORM = $("#AddFarmer");
        var ViewKhedut = $("#ViewKhedut");
        var FormAddFolder = $("#FormAddFolder");
        // var panelName = $("#panelName");
        // var traders = $("#Traders");
        // var tdImg = $("#tdImg");
        // var Farmer = $(".Farmer");
        Index.css('display', 'none');
        ADDFORM.css('display', 'none');
        ViewKhedut.css('display', 'block');
        FormAddFolder.css("display", "block");
        dispatch(selectFarmer(farmer));
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
                                    {paginatedFarmers.map((farmer) => {
                                        let statuscolor = farmer.Balance === 0 ? 'info' : farmer.Balance > 0 ? 'success' : 'danger';
                                        let status = farmer.Balance === 0 ? 'પૂર્ણ' : farmer.Balance > 0 ? 'જમા' : 'બાકી';
                                        return (
                                            <tr key={farmer.ID} id={farmer.ID} className='Farmer' style={{ cursor: 'pointer' }} onClick={() => handleFarmerClick(farmer)}>
                                                <td>{farmer.Name}</td>
                                                <td>
                                                    <label
                                                        className={`bg-gradient-${statuscolor} text-white rounded-1`}
                                                        style={{ padding: 5, paddingInline: 10, fontSize: 12 }}
                                                    >
                                                        {status}
                                                    </label>
                                                </td>
                                                <td className={`text-${statuscolor}`}>₹{farmer.Balance}</td>
                                                <td>{farmer.Date}</td>
                                                <td>
                                                    <span className="bg-gradient-success text-white m-1 rounded-2" style={{ width: "40px", padding: "10px 20px" }}>
                                                        <i className="mdi mdi-border-color" style={{ fontSize: "large" }}></i>
                                                    </span>
                                                    <span className="bg-gradient-danger text-white rounded-2" style={{ width: "40px", padding: "10px 20px" }}>
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
