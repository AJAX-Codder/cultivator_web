import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
export const BackUpData = async (email, Trade) => {
    const backupButton = document.getElementById('BackUp');
    // backupButton.innerHTML = '<img src="https://raw.githubusercontent.com/AJAX-Codder/HalDharak/master/assets/images/loding.gif" alt="" srcset="" style="height:100%">';
    try {
        const response = await fetch('https://cultivator-d9052-default-rtdb.firebaseio.com/Cultivator/Traders/0.json');
        const traders = await response.json();

        const formData = new FormData();
        formData.append('Reciver', "2018bharatmakwana@gmail.com");
        formData.append('Trade', Trade);
        formData.append('JSON', JSON.stringify(traders));
        const backupResponse = await fetch('https://makwana-bharat.000webhostapp.com/PHP/BackUpAPI.php', {
            method: 'POST',
            body: formData
        });

        if (backupResponse.ok) {
            const responseData = await backupResponse.text();
            // backupButton.innerHTML = '<i class="mdi mdi-google-drive" style="font-size: 30px;"></i>';
            if (responseData === 'OTP Send..') {
                toast.success('બેકઅપ સફળતાપૂર્વક લેવાયું.. !', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                });
                return true;
            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};
