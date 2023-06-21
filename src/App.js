// import { temp } from './temp';
import './App.css';
import Navigator from './Navigation/Navigator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
      />
      <Navigator />
    </>
    // <button onClick={temp}>sfdf</button>
  );
}

export default App;
