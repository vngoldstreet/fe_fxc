let fetchAsync = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
};

$(document).ready(function () {
    handlePaymentMethob()
})

async function handlePaymentMethob() {
    try {
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let userInfo = await fetchAsync('api/get-user-info');

        $("#userinfo_name").html(userInfo.name)
        $("#userinfo_email").html(userInfo.email)
        if (userInfo.image === '') {
            $("#avatarImage").attr("src", "src/assets/images/profile/user-1.jpg")
        } else {
            $("#avatarImage").attr("src", userInfo.image)
        }
        // console.log(userInfo)
        let checkInreview = await fetchAsync('api/get-indentify');
        if (userInfo.in_review === 'not_yet') {
            $("#indentify_status").addClass('text-danger').html(`<i class="ti ti-ban"></i> Account has not been verified!.`)
            $("#indentify_form").html(` <div class="col">
                    <div class="mb-3">
                      <label for="formFile" class="form-label">Front side of the national ID card</label>
                      <input class="form-control" type="file" id="front_formFile">
                      <img id="front_selectedImage">
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-3">
                      <label for="formFile" class="form-label">Back side of the national ID card</label>
                      <input class="form-control" type="file" id="back_formFile">
                      <img id="back_selectedImage">
                    </div>
                  </div>
                  <div class="col-12">
                    <button id="indentify_update" type="submit" class="btn btn-secondary w-100">Submit</button>
                  </div>`)
        } else {
            $("#indentify_status").removeClass('text-danger').addClass('text-success').html(`
            <i class="ti ti-circle-check-filled"></i>Account has been verified!
            `)
            $("#indentify_form").html(`<div class="col">
                    <div class="mb-3">
                      <label for="formFile" class="form-label">Front side of the national ID card</label>
                      <img class="w-100 indentify-img" id="front_selectedImage" src="${checkInreview.image_front}">
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-3">
                      <label for="formFile" class="form-label">Back side of the national ID card</label>
                      <img class="w-100 indentify-img" id="back_selectedImage" src="${checkInreview.image_back}">
                    </div>
                  </div>
                  `)
            $("#indentify_update").addClass("disabled")
        }
        if (userInfo.description == '') {
            $("#userinfo_description").html(`<p id="existing_description" class="card-text">Please introduce something about yourself!<br>Click here to edit.</p>`)
        } else {
            $("#userinfo_description").html(`<p id="existing_description" class="card-text">${userInfo.description}</p>`)
        }

        if (checkInreview.status === "uploaded") {
            $("#front_selectedImage").addClass("w-100 indentify-img").attr("src", checkInreview.image_front)
            $("#back_selectedImage").addClass("w-100 indentify-img").attr("src", checkInreview.image_back)
            $("#indentify_status").removeClass('text-danger').addClass('text-warning').html(`<i class="ti ti-circle-check-filled"></i>Your information is being verified, please contact support via email: support@fxchampionship.com or hotline: +84 919 720 567. Thank you!`)
            $("#indentify_update").addClass("disabled")
            $("#front_formFile").hide()
            $("#back_formFile").hide()
        }
        var img_front = ""
        var img_back = ""
        $("#front_formFile").on("change", function (event) {
            var file = event.target.files[0];
            var selectedImage = $("#front_selectedImage");

            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    selectedImage.attr("src", e.target.result);
                    selectedImage.addClass("indentify-img w-100 mt-3 rounded border border-secondary")
                    img_front = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        $("#back_formFile").on("change", function (event) {
            var file = event.target.files[0];
            var selectedImage = $("#back_selectedImage");
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    selectedImage.attr("src", e.target.result);
                    selectedImage.addClass("indentify-img w-100 mt-3 rounded border border-secondary")
                    img_back = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        $("#indentify_update").on("click", function (e) {
            e.preventDefault()
            if (img_front === '' || img_back === '') {
                window.alert("Please upload the front and back images of the national ID card first.");
                return;
            }
            let inpReview = {
                "image_front": img_front,
                "image_back": img_back
            };
            console.log(inpReview)
            let jwtToken = getCookie("token");
            if (!jwtToken) {
                window.location.href = "/login";
            }
            let headers = new Headers({
                'Authorization': `Bearer ${jwtToken}`
            });
            $("#indentify_update").addClass("disabled")
            fetch('api/indentify-update', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(inpReview),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then(dataResponse => {
                    localStorage.setItem('indentify', JSON.stringify(inpReview));
                    window.alert("Success!")
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })
    } catch (error) {

    }
}

$(document).ready(function () {
    handleUser()
})

async function handleUser() {
    try {
        let userInfo = await fetchAsync('api/get-user-info');
        let img_avata = userInfo.image
        let inpDescription = userInfo.description

        $("#avatarInput").on("change", function (event) {
            var file = event.target.files[0];
            var selectedImage = $("#avatarImage");
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    selectedImage.attr("src", e.target.result);
                    img_avata = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        $("#existing_description").on("click", function (e) {
            e.preventDefault()
            $("#userinfo_description").html(`<textarea id="inp_description" class="form-control" rows="7" aria-label="With textarea">`)
            $("#inp_description").val(userInfo.description)
        })

        $("#user_info_updated").on("click", function (e) {
            e.preventDefault()
            inpDescription = $("#inp_description").val()
            if (inpDescription === undefined) {
                inpDescription = userInfo.description
            }
            let jwtToken = getCookie("token");
            if (!jwtToken) {
                window.location.href = "/login";
            }
            let headers = new Headers({
                'Authorization': `Bearer ${jwtToken}`
            });
            let inpUserUpdate = {
                "image": img_avata,
                "description": inpDescription
            };
            // console.log(inpUserUpdate)
            fetch('https://auth.fxchampionship.com/auth/uuser/update-user', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(inpUserUpdate),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json(); // Parse the response JSON if needed
                })
                .then(dataResponse => {
                    userInfo.image = img_avata;
                    userInfo.description = inpDescription;
                    let user = JSON.stringify(userInfo)
                    localStorage.setItem('user', JSON.stringify(userInfo));
                    // window.alert("Success!")
                    window.location.reload()
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        })
    } catch (error) {
        console.error("Error:", error);
    }
}

$(document).ready(function () {
    getPaymentMethob()
    $("#submit_payment_methob").on("click", function (e) {
        e.preventDefault()
        $("#create_payment_methob_msg").removeClass().text("")
        let bank_name = $("#bank_name").val()
        let is_card = $("#is_card").val()
        let account_number = $("#account_number").val()
        let account_name = $("#account_name").val()

        if (bank_name === '') {
            $('#bank_name').addClass('is-invalid');
            $('#fb_bank_name').addClass('invalid-feedback').text('Bank Name is required'); // Display an error message
            return;
        } else {
            // Valid email format
            $('#bank_name').removeClass('is-invalid').addClass('is-valid');
            $('#fb_bank_name').removeClass('invalid-feedback').addClass('invalid-feedback').text('Look good'); // Clear the error message
        }

        if (account_number === '') {
            $('#account_number').addClass('is-invalid');
            $('#fb_account_number').addClass('invalid-feedback').text('Bank Account No is required'); // Display an error message
            return;
        } else {
            // Valid email format
            $('#account_number').removeClass('is-invalid').addClass('is-valid');
            $('#fb_account_number').removeClass('invalid-feedback').addClass('invalid-feedback').text('Look good'); // Clear the error message
        }

        if (account_name === '') {
            $('#account_name').addClass('is-invalid');
            $('#fb_account_name').addClass('invalid-feedback').text('Account Name is required'); // Display an error message
            return;
        } else {
            // Valid email format
            $('#account_name').removeClass('is-invalid').addClass('is-valid');
            $('#fb_account_name').removeClass('invalid-feedback').addClass('invalid-feedback').text('Look good'); // Clear the error message
        }
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let headers = new Headers({
            'Authorization': `Bearer ${jwtToken}`
        });

        let inpPaymentMethob = {
            "holder_name": account_name,
            "holder_number": account_number,
            "bank_name": bank_name,
            "is_card": Number(is_card),
        };
        console.log(inpPaymentMethob)
        fetch('api/create-payment-method', {
            method: "POST",
            headers: headers,
            body: JSON.stringify(inpPaymentMethob),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parse the response JSON if needed
            })
            .then(dataResponse => {
                $("#create_payment_methob_msg").removeClass().addClass("text-success").text(dataResponse.message)
                getPaymentMethob()
            })
            .catch(error => {
                console.error("Error:", error);
            });
    })
})

async function getPaymentMethob() {
    try {
        $("#payment_methob_msg").text('')
        let paymentMethob = await fetchAsync('api/get-payment-methob');
        if (paymentMethob.length == 0) {
            $("#payment_methob_msg").addClass("text-danger").text("You haven't registered any bank accounts yet.")
            return;
        }
        let dataPaymentMethob = paymentMethob
        let htmlRender = `
            <div class="row">
            `
        for (let key in dataPaymentMethob) {
            htmlRender += `
                             <div class="col-sm-6 mb-3 mb-sm-0">
                                <div class="card">
                                 <h5 class="card-header text-violet-fxc">${dataPaymentMethob[key].bank_name}</h5>
                                <div class="card-body">
                                    <h5 class="card-title text-violet-fxc">${dataPaymentMethob[key].holder_name}</h5>
                                    <p class="card-text">${dataPaymentMethob[key].holder_number}</p>
                                    <p class="card-text text-success">Confirmed</p>
                                </div>
                                </div>
                            </div>
                            `
        }
        htmlRender += `</div>`
        $("#payment_methob_list").html(htmlRender)
    } catch (error) {
        console.error("Error:", error);
    }
}

