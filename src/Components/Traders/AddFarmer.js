import React from 'react';

const AddFarmer = () => {
    const handleSubmit = (e) => {
        // e.preventDefault();
    };
    return (
        <div className="row" style={{ display: 'none' }} id="AddFarmer">
            <div className="col-5 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">ખેડૂત</h4>
                        <p className="card-description">નવા ખેડૂતમિત્ર ને ઉમેરો</p>
                        <form className="forms-sample" id="AddFarmer" encType="multipart/form-data" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="FName">Name</label>
                                <input type="text" className="form-control" id="FName" placeholder="Name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="FCity">City</label>
                                <input type="text" className="form-control" id="FCity" placeholder="Location" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="MNO">Mobile Number</label>
                                <input type="tel" className="form-control" id="MNO" placeholder="9876543210" required pattern="[0-9]{10}" />
                            </div>
                            <button type="submit" id="KhedutAddBtn" className="btn btn-gradient-primary me-2" name="submitbtn">
                                Add
                            </button>
                            <button className="btn btn-light" type="reset">
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFarmer;
