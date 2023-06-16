import Navbar from '../Components/Traders/NavBar';
import Sidebar from '../Components/Traders/Sidebar';
import MainPanel from '../Components/Traders/MainPanel';
import "../assets/css/style.css"
import "../assets/vendors/mdi/css/materialdesignicons.min.css"
import "../assets/vendors/css/vendor.bundle.base.css"
function TraderNav() {
    return (
        <div className="container-scroller">
            <Navbar />
            <div className="container-fluid page-body-wrapper">
                <Sidebar />
                <MainPanel />
            </div>
        </div>
    );
}
export default TraderNav;
