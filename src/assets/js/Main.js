import $ from 'jquery'
import Swal from 'sweetalert2';
Swal.fire({
    title: '',
    imageUrl: "./assets/images/loding.gif",
    showConfirmButton: false
})

let KhedutName = new Array();
$(function () {
    $.ajax({
        type: "post",
        url: "./PHP/KhedutName.php",
        dataType: "json",
        success: function (response) {
            return response
        }
    }).then((response) => KhedutName = response);
    $.ajax({
        type: "post",
        url: "./PHP/All_Khedut.php",
        success: function (response) {
            $("#KhedutTable").append(response)
            Swal.close()
        }
    });
});
export const Oparetion = (Child, value) => {
    $("#" + Child).css('display', value);
}

export const EditEntry = (IID, RUPEE, DATE, DETAILS, Type) => {
    let NewDate = DATE.substring(DATE.length - 4) + "-" + DATE.substring(DATE.indexOf('-') + 1, DATE.length - 4) + DATE.substring(0, 2)

    Swal.fire({
        title: 'નોંધ સુધારો ',
        html: `
        <div class="form-group">
                      <input type="number" class="form-control" id="EditRupee" placeholder="રકમ (₹)" value="${RUPEE}" >
                    </div>
        <div class="form-group">
                      <input type="date" class="form-control" id="EditDate" placeholder="તારીખ" value="${NewDate}">
                    </div>
        <div class="form-group">
                      <textarea id="EditDetail" class="form-control"  placeholder="વિગત" >${DETAILS}</textarea>
                    </div>
        <div class="form-group" style="width:100%">
                        <select id="Type" style="padding:15px;width:100%;border:.5px solid rgba(0,0,0,.1);border-radius:3px">
                            <option value="જમા " ${Type == 'જમા ' ? 'selected' : ''}>જમા </option>
                            <option value="ઉધાર " ${Type != 'જમા ' ? 'selected' : ''}>ઉધાર </option>
                        <select>
                    </div>
                    `,
        confirmButtonText: ' Edit ',
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
    }).then((result) => {
        $.ajax({
            type: "post",
            url: "./PHP/EditEntry.php",
            data: {
                IID: IID,
                RUPEE: result.value.EditRupee,
                DETAIL: result.value.EditDetail,
                DATE: result.value.EditDate,
                TYPE: result.value.EditType
            },
            success: function (response) {
                if (response == 1)
                    location.href = "home.php";
            }
        });
    })
}
export const DeleteEntry = (IID) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "post",
                url: "./PHP/DeleteEntry.php",
                data: {
                    IID: IID
                },
                success: function (response) {
                    if (response == 1) {
                        $("#" + IID).remove();
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        location.href = "home.php";
                    }
                    else
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                }
            });
        }

    });
}

/*Edit Khedut*/
export const EditKhedut = (Index, Name, Image, Rupee, Village, Mobile) => {
    Swal.fire({
        title: 'ખેડૂતની માહિતીમાં સુધારો ',
        html: `<hr><br><br><div class="form-group">
                                            
                                            <input type="text" class="form-control" id="EFName" placeholder="Name" value="${Name}"
                                                required>
                                        </div>
                                        <div class="form-group">
                                            
                                            <input type="text" class="form-control" id="EFCity" placeholder="Location" value="${Village}"
                                                required>
                                        </div>
                                        <div class="form-group">
                                            
                                            <input type="tel" class="form-control" id="EMNO" placeholder="9876543210" value="${Mobile}"
                                                required pattern="[0-9]{10}">
                                        </div>
                                        
                                        </div>
                                        `,
        confirmButtonText: ' Edit ',
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
        let Detail = response.value;
        $.ajax({
            type: "post",
            url: "./PHP/EditKhedut.php",
            data: {
                ID: Index,
                NAME: Detail.Name,
                VILLAGE: Detail.Village,
                MOBILE: Detail.Mobile,
                PHOTO: Detail.Photo
            },
            success: function (response) {
                if (response == 1)
                    location.href = "home.php";
                else
                    alert("Error");
            }
        });
    })
}

export const ViewKhedut = (Index, Name, Image, Rupee, Village, Mobile) => {
    $("#panelIcon").removeClass("mdi-home");
    $("#panelIcon").addClass("mdi-account");

    $("#panelKhedut").css('display', 'block');
    $("#Index").css('display', 'none');
    $("#ViewKhedut").css('display', 'flex');
    $("#FormAddFolder").css('display', 'block');

    $("#VImage").prop('src', "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg");
    $("#VName").html(Name);
    $("#VVillage").html('<b>ગામ : </b >' + Village);
    $("#VMNO").html('<i class="mdi mdi-phone"></i >' + Mobile);
    $("#VRupee").html("₹" + Rupee);
    $("#Opbtn").html('<a class="  bg-gradient-success text-white rounded-2" style="width:70px;height: 40px; display: flex;justify-content: center;align-items: center; margin: 5px;" onclick="EditKhedut(' + Index + ',`' + Name + '`,`' + Image + '`,0,`' + Village + '`,`' + Mobile + '`)"><i class="mdi mdi-border-color" style="font-size:large"></i></a><a class="  bg-gradient-danger text-white rounded-2" style="width:70px;height: 40px; display: flex;justify-content: center;align-items: center; margin: 5px;" onclick="DeleteKhedut(' + Index + ' )"><i class="mdi mdi-delete" style="font-size:large"></i></a>');

    //Folder

    $.ajax({
        type: "post",
        url: "./PHP/ViewFolder.php",
        data: {
            ID: Index
        },
        success: function (response) {
            $("#FolderContainer").html(response)
        }
    });

}

$("#ADDForm").on("submit", function (e) {
    e.preventDefault();
    $("#KhedutAddBtn").html('<img src="./assets/images/loding.gif" alt="" srcset="" style="height:100%">')
    $.ajax({
        type: "post",
        url: "./PHP/Add_Khedut.php",
        data: {
            Name: $("#FName").val(),
            Image: " ",
            Village: $("#FCity").val(),
            Mobile: $("#MNO").val()
        },
        success: function (response) {
            if (response == 1)
                Swal.fire(
                    'Good job!',
                    'ખેડૂત added..!',
                    'success'
                )
            else
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            $("#FName").val('')
            $("#FCity").val('')
            $("#MNO").val('')
            $("#KhedutAddBtn").html('Add')
        }
    });
});

$("#FormAddFolder").submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: "post",
        url: "./PHP/AddFolder.php",
        data: {
            name: $("#MainFolderName").val()
        },
        success: function (response) {
            if (!isNaN(response))
                $("#FolderContainer").append('<div class= "folder d-flex flex-column align-items-center" style = "cursor:pointer" onclick = subfolder(' + response + ') ><i class="mdi mdi-folder text-primary" style="font-size: 100px;"></i><span style="position:relative;top:-2%">' + $("#MainFolderName").val() + '</span></div > ')
            else
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Folder Already Exits..!!!',
                });
            $("#MainFolderName").val('')
        }
    });
});


export const subfolder = (Index) => {
    $("#FormAddFolder").css("display", "none");
    Account(Index);
}


export const Account = (SFID) => {
    $("#ViewKhedut").css('display', 'none');
    $("#ViewKhedutAccount").css('display', 'flex');
    $("#Printbtn").css('display', 'block');
    $("#NewEntry").css('display', 'block');
    $("#panelAccount").css('display', 'block');
    $.ajax({
        type: "post",
        url: "./PHP/InvoiceKhedut.php",
        success: function (response) {
            $("#InvoiceKhedut").html(response)
        }
    });

    /*Invoice*/
    $.ajax({
        type: "post",
        url: "./PHP/DebitInvoice.php",
        data: {
            SFID: SFID
        },
        success: function (response) {
            $("#leftBody").html(response);
        }
    });
    $.ajax({
        type: "post",
        url: "./PHP/CreditInvoice.php",
        data: {
            SFID: SFID
        },
        success: function (response) {
            $("#rightBody").html(response);
        }
    });

    $.ajax({
        type: "post",
        url: "./PHP/Sum.php",
        data: {
            SFID: SFID
        },
        success: function (response) {
            $("#LeftSum").html(response.substr(0, response.indexOf('/')));
            $("#RightSum").html(response.substr(response.indexOf('/') + 1, response.length));
            if ($("#LeftSum").html() > $("#RightSum").html()) {
                if ($("#LeftSum").html() - $("#RightSum").html() == "0") {
                    $("#GrandLeftSum").html('0000');
                }
                else {
                    $("#GrandLeftSum").html($("#LeftSum").html() - $("#RightSum").html())
                }
                $("#GrandRightSum").html('0000');
            }
            else {
                if ($("#RightSum").html() - $("#LeftSum").html() == "0") {
                    $("#GrandRightSum").html('0000');
                }
                else {

                    $("#GrandRightSum").html($("#RightSum").html() - $("#LeftSum").html())
                }
                $("#GrandLeftSum").html('0000');
            }
        }
    });


}

export const DeleteKhedut = (i) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "post",
                url: "./PHP/DeleteKhedut.php",
                data: { ID: i },
                success: function (response) {
                    if (response == 1) {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        $("#" + i).remove();
                        $("#Index").css('display', 'block');
                        $("#ADDFORM").css('display', 'none');
                        $("#ViewKhedut").css('display', 'none');
                        $("#FormAddFolder").css("display", "none");

                        $("#panelIcon").addClass("mdi-home");
                        $("#panelIcon").removeClass("mdi-account");

                        $("#panelName").html('અનુક્રમણિકા');
                    }
                    else
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                }
            });

        }
    })

}

$("#NewEntry").click(function (e) {
    e.preventDefault();
    Swal.fire({
        title: 'નવી નોંધ',
        html: `
        <div class="form-group">
                      <input type="number" class="form-control" id="AddRupee" placeholder="રકમ (₹)" >
                    </div>
        <div class="form-group">
                      <textarea id="AddDetail" class="form-control"  placeholder="વિગત"></textarea>
                    </div>
        <div class="form-group" style="width:100%">
                        <select id="Type" style="padding:15px;width:100%;border:.5px solid rgba(0,0,0,.1);border-radius:3px">
                            <option value="જમા ">જમા </option>
                            <option value="ઉધાર ">ઉધાર </option>
                        <select>
                    </div>
                    `,
        confirmButtonText: ' Add ',
        focusConfirm: false,
        preConfirm: () => {
            const AddRupee = Swal.getPopup().querySelector('#AddRupee').value
            const AddDetail = Swal.getPopup().querySelector('#AddDetail').value
            const Type = Swal.getPopup().querySelector('#Type').value
            if (!AddRupee || !AddDetail || !Type) {
                Swal.showValidationMessage(`Please enter AddRupee and AddDate`)
            }
            return { AddRupee: AddRupee, AddDetail: AddDetail, Type: Type }
        }
    }).then((result) => {
        $.ajax({
            type: "post",
            url: "./PHP/NewEntry.php",
            data: {
                RUPEE: result.value.AddRupee,
                DETAIL: result.value.AddDetail,
                TYPE: result.value.Type
            },
            success: function (response) {

                let Folder = (response.substr(response.indexOf('/') + 1, response.indexOf('#')));
                let NewEntry = (response.substr(response.indexOf('#') + 1));
                response = (response.substr(0, response.indexOf('/')));

                let OldRupee = $("#Rupee" + response).val();
                const today = new Date();
                const yyyy = today.getFullYear();
                let mm = today.getMonth() + 1; // Months start at 0!
                let dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                const formattedToday = dd + '-' + mm + '-' + yyyy;
                if (response != 0) {
                    $("#Date" + response).html(formattedToday);
                    if (result.value.Type == "જમા ") {
                        OldRupee = eval(OldRupee + "+" + result.value.AddRupee)
                        $("#leftBody").append('<tr id = "' + NewEntry + '" onmouseover = "Oparetion(`Child' + NewEntry + '`,``)" onmouseleave = "Oparetion(`Child' + NewEntry + '`,`none`)"><td>' + result.value.AddRupee + '</td ><td>' + formattedToday + '</td><td style="border-right: 1px solid gray; text-align:right;">' + result.value.AddDetail + '<span id="Child' + NewEntry + '" style="width:fit-content;display:none"><i class="mdi mdi-lead-pencil text-success" style="font-size:large;margin-left:10px;" onclick="EditEntry(' + NewEntry + ',`' + result.value.AddRupee + '`,`' + formattedToday + '`,`' + result.value.AddDetail + '`,`જમા `)"></i><i class="mdi mdi-delete-outline text-danger" style="font-size:large;margin-left:10px" onclick="DeleteEntry(' + NewEntry + ')"></i></span></td></tr >');
                        $("#LeftSum").html(eval($("#LeftSum").html() + "+" + result.value.AddRupee));
                    }
                    else {
                        OldRupee = eval(OldRupee + "-" + result.value.AddRupee)
                        $("#rightBody").append('<tr id = "' + NewEntry + '" onmouseover = "Oparetion(`Child' + NewEntry + '`,``)" onmouseleave = "Oparetion(`Child' + NewEntry + '`,`none`)"><td>' + result.value.AddRupee + '</td ><td>' + formattedToday + '</td><td style="text-align:right;">' + result.value.AddDetail + '<span id="Child' + NewEntry + '" style="width:fit-content;display:none"><i class="mdi mdi-lead-pencil text-success" style="font-size:large;margin-left:10px;" onclick="EditEntry(' + NewEntry + ',`' + result.value.AddRupee + '`,`' + formattedToday + '`,`' + result.value.AddDetail + '`,`ઉધાર `)"></i><i class="mdi mdi-delete-outline text-danger" style="font-size:large;margin-left:10px" onclick="DeleteEntry(' + NewEntry + ')"></i></span></td></tr >');
                        $("#RightSum").html(eval($("#RightSum").html() + "+" + result.value.AddRupee))
                    }
                    if (OldRupee > "0") {
                        $("#Rupee2" + response).removeClass('text-danger');
                        $("#Rupee2" + response).removeClass('text-info');
                        $("#Rupee2" + response).addClass('text-success');

                        $("#status" + response).removeClass('badge-gradient-danger');
                        $("#status" + response).removeClass('badge-gradient-info');
                        $("#status" + response).addClass('badge-gradient-success');

                        $("#status" + response).html('જમા ');


                        $("#" + Folder).removeClass('text-danger');
                        $("#" + Folder).removeClass('text-info');
                        $("#" + Folder).addClass('text-success');
                    }
                    else if (OldRupee == "0") {
                        $("#Rupee2" + response).removeClass('text-danger');
                        $("#Rupee2" + response).addClass('text-info');
                        $("#Rupee2" + response).removeClass('text-success');

                        $("#status" + response).removeClass('badge-gradient-danger');
                        $("#status" + response).addClass('badge-gradient-info');
                        $("#status" + response).removeClass('badge-gradient-success');

                        $("#status" + response).html('પૂર્ણ ');

                        $("#" + Folder).removeClass('text-danger');
                        $("#" + Folder).addClass('text-info');
                        $("#" + Folder).removeClass('text-success');
                    }
                    else {
                        $("#Rupee2" + response).addClass('text-danger');
                        $("#Rupee2" + response).removeClass('text-info');
                        $("#Rupee2" + response).removeClass('text-success');

                        $("#status" + response).addClass('badge-gradient-danger');
                        $("#status" + response).removeClass('badge-gradient-info');
                        $("#status" + response).removeClass('badge-gradient-success');

                        $("#status" + response).html('બાકી ');

                        $("#" + Folder).addClass('text-danger');
                        $("#" + Folder).removeClass('text-info');
                        $("#" + Folder).removeClass('text-success');
                    }
                    $("#Rupee2" + response).html("₹" + OldRupee)
                    $("#VRupee").html("₹" + OldRupee);
                    $("#Rupee" + response).val(OldRupee)
                    if ($("#LeftSum").html() > $("#RightSum").html()) {
                        if ($("#LeftSum").html() - $("#RightSum").html() == "0") {
                            $("#GrandLeftSum").html('0000');
                        }
                        else {
                            $("#GrandLeftSum").html($("#LeftSum").html() - $("#RightSum").html())
                        }
                        $("#GrandRightSum").html('0000');
                    }
                    else {
                        if ($("#RightSum").html() - $("#LeftSum").html() == "0") {
                            $("#GrandRightSum").html('0000');
                        }
                        else {

                            $("#GrandRightSum").html($("#RightSum").html() - $("#LeftSum").html())
                        }
                        $("#GrandLeftSum").html('0000');
                    }
                }
            }
        });
    })
});


$("#panelName").click(function (e) {
    e.preventDefault();
    $("#panelIcon").addClass("mdi-home");
    $("#panelIcon").removeClass("mdi-account");

    $("#Index").css('display', 'block');

    //Khedut
    $("#ViewKhedut").css('display', 'none');
    $("#FormAddFolder").css('display', 'none');
    $("#panelKhedut").css('display', 'none');

    //Account
    $("#ViewKhedutAccount").css('display', 'none');
    $("#Printbtn").css('display', 'none');
    $("#NewEntry").css('display', 'none');
    $("#panelAccount").css('display', 'none');
});


$("#panelKhedut").click(function (e) {
    e.preventDefault();

    //Khedut
    $("#ViewKhedut").css('display', 'flex');
    $("#FormAddFolder").css('display', 'block');

    //Account
    $("#ViewKhedutAccount").css('display', 'none');
    $("#Printbtn").css('display', 'none');
    $("#NewEntry").css('display', 'none');
    $("#panelAccount").css('display', 'none');
});

/*=== Print ===*/

// const Print = () => {
//     html2pdf(document.getElementById("invoice").innerHTML).from().save();
// }

/*=== Backup ===*/
$("#BackUp").click(function (e) {
    $("#BackUp").html('<img src="./assets/images/loding.gif" alt="" srcset="" style="height:100%">');
    e.preventDefault();
    $.ajax({
        type: "post",
        url: "./PHP/BackUpFiles.php",
        success: function (response) {
            $("#BackUp").html('<i class= "mdi mdi-google-drive" style = "font-size: 30px;" ></i > ')
            if (response == "OTP Send..")
                Swal.fire(
                    'Backup Completed',
                    'Check Your Mail..!',
                    'success'
                )
            else
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
        }
    });
});

/**  LogOut */

export const LogOut = () => {
    $.ajax({
        type: "post",
        url: "./PHP/LogOut.php",
        success: function (response) {
            if (response == 1)
                location.href = "./index.php";
        }
    });
}



/** Search */

export const SearchKhedut = () => {

    let filter = document.querySelector("#search").value.toUpperCase();
    KhedutName.forEach(element => {
        if ((element.NAME.toUpperCase()).indexOf(filter.trim()) > -1) {
            $("#" + element.ID).css('display', '');
        }
        else
            $("#" + element.ID).css('display', 'none');
    })
}


/** Delete Folder  */
export const DeleteFolder = (Folder) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "post",
                url: "./PHP/DeleteFolder.php",
                data: { MFID: Folder },
                success: function (response) {
                    if (response == 1) {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                        $(".folder-" + Folder).remove();
                        $(".folder-" + Folder).remove();
                    }
                    else
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                        });
                }
            });
        }
    })
}
