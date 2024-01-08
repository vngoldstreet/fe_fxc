function showPassword(param) {
    let id_master = "#master-" + param
    let id_invester = "#invester-" + param
    let btn_id = "#btn-" + param
    var passwordFieldType = $(id_master).attr('type');
    if (passwordFieldType === 'password') {
        $(id_master).attr('type', 'text');
        $(id_invester).attr('type', 'text');
        $(btn_id).text("Hide password")
        setTimeout(function () {
            $(id_master).attr('type', 'password');
            $(id_invester).attr('type', 'password');
            $(btn_id).text("Show Password")
        }, 15000)
    } else {
        $(id_master).attr('type', 'password');
        $(id_invester).attr('type', 'password');
        $(btn_id).text("Show Password")
    }
}


function confirmToReJoin(param_contest_id) {
    $("#this_contest_info").remove();
    $("#fb_rejoin").text('')
    $("#contest_info").val(param_contest_id);
    let jwtToken = getCookie("token");
    let headers = new Headers({
        'Authorization': `Bearer ${jwtToken}`
    });

    fetch("api/get-promotion", {
        method: "GET",
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(dataResponse => {
            if (dataResponse.promo_code) {
                $("#promo_code").val(dataResponse.promo_code);
                $("#fb_promo_code").addClass("text-success").text(`Use the code '${dataResponse.promo_code}' to get ${dataResponse.discount * 100}% discount`);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    $("#confirm_to_re_join").on("click", function (e) {
        e.preventDefault()
        let jwtToken = getCookie("token");
        let headers = new Headers({
            'Authorization': `Bearer ${jwtToken}`
        });
        let promo = $("#promo_code").val()
        if (!promo) {
            promo = ""
        }
        let rejoinContest = {
            "contest_id": param_contest_id,
            "promo_code": promo
        };

        $("#confirm_to_re_join").prop('disabled', true);
        $("#confirm_to_re_join").html(`
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        `)

        fetch("api/rejoin-a-competition", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(rejoinContest),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(dataResponse => {
                if (dataResponse.code === 429) {
                    $("#fb_rejoin").removeClass().addClass(dataResponse.class)
                    startCountdown(15, dataResponse.message, "fb_rejoin");
                    setTimeout(function () {
                        $("#confirm_to_re_join").prop("disabled", false);
                        $("#confirm_to_re_join").text("Re-Join this competition")
                    }, 15000);
                    return
                }
                $("#fb_rejoin").removeClass().addClass('text-success').text(dataResponse.message)
                setTimeout(function () {
                    $("#confirm_to_re_join").text("Re-Join this competition")
                    window.location.reload()
                }, 15000);
            })
            .catch(error => {
                console.error("Error:", error);
                $("#fb_rejoin").addClass('text-danger').text(`Fail to re-join: ${param_contest_id}`)
                setTimeout(function () {
                    $("#confirm_to_re_join").text("Re-Join this competition")
                    window.location.reload()
                }, 3000);
            });
    });
}

function startCountdown(seconds, text, id_element) {
    var countdownElement = $(`#${id_element}`);
    // Bắt đầu đếm ngược
    var countdownInterval = setInterval(function () {
        seconds--;

        // Hiển thị giá trị mới
        countdownElement.text(`${text}. Please try again after ${seconds} seconds.`);

        // Kiểm tra nếu đã đếm ngược đến 0
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countdownElement.text("");
        }
    }, 1000); // Cập nhật mỗi giây
}