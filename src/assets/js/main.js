let bankName = "acb";
let bankFullName = "ACB - Ngân hàng thương mại cổ phần Á Châu";
let bankNumber = "966965488";
let bankUserName = "BUI ANH LINH";
let rateGold = 24000;

function getInformationOfTransaction(amount, type, id, name) {
    if (Number(type) === 1) {
        let bankNote = encodeURIComponent(`${id} ${Number(amount)}G ${name}`);
        let paymentInfo = {
            bank: bankName,
            account: bankNumber,
            name: bankUserName,
            amount: Number(amount) * rateGold, // The amount to transfer
            note: bankNote,
        };
        let imgUrl = `https://img.vietqr.io/image/${paymentInfo.bank}-${paymentInfo.account}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${paymentInfo.note}&accountName=${paymentInfo.name}`;
        let htmlPrintToContest = `<img id="img_qrcode_info_1" class="w-100" src="${imgUrl}">`;
        $("#img_qrcode_info").html(htmlPrintToContest);
    } else if (Number(type) > 1) {
        let textType = "";

        switch (type) {
            case 1:
                textType = "Deposit";
                break;
            case 2:
                textType = "Withdrawal";
                break;
            case 3:
            case 5:
                textType = "Earning";
                break;
            case 4:
                textType = "Join a contest";
                break;
            case 6:
                text_type = "Re-Join a contest";
                text_id_contest = `${transactionData[key].contest_id}`;
                break;
            default:
                break;
        }

        let htmlText = `
        <div id="this_contest_info">
            <h6>Transaction type: ${textType}</h6>
            <h6><span>Amount:</span> $${amount.toLocaleString()}</h6>
        </div>
        `;
        $("#img_qrcode_info").html(htmlText);
    }
}

function splitStringByIndex(inputString, index) {
    if (index >= 0 && index < inputString.length) {
        let firstPart = inputString.substring(0, index); // Get characters from the beginning up to the index
        let secondPart = inputString.substring(index); // Get characters from the index to the end

        return [firstPart, secondPart];
    } else {
        // Index is out of bounds, return an error message or handle the situation as needed.
        return "Invalid index.";
    }
}

function setChartGreetings() {
    let jwtToken = getCookie("token");
    if (!jwtToken) {
        window.location.href = "/login";
    }

    let headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
    });
    fetch("/api/chart", {
        method: "GET",
        headers: headers,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the response JSON if needed
        })
        .then((dataResponse) => {
            let chartGreetings = dataResponse.chart;
            $("#chart").empty();
            let maxdep = Math.max(...chartGreetings.dep);
            let maxearn = Math.max(...chartGreetings.earn);
            let maxwithdraw = Math.max(...chartGreetings.withdraw);
            let array_value = [maxdep, maxearn, maxwithdraw];
            let max_value = Math.max(...array_value);
            let set_high = Math.round(max_value * 0.01 + 1) * 100;
            var chart = {
                series: [
                    { name: "Deposit", data: chartGreetings.dep },
                    { name: "Earn", data: chartGreetings.earn },
                    { name: "Withdrawal", data: chartGreetings.withdraw },
                ],

                chart: {
                    type: "bar",
                    height: 500,
                    offsetX: -15,
                    toolbar: { show: true },
                    foreColor: "#adb0bb",
                    fontFamily: "inherit",
                    sparkline: { enabled: false },
                },

                colors: ["#5D87FF", "#FF8C00", "#49BEFF"],

                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: "35%",
                        borderRadius: [6],
                        borderRadiusApplication: "end",
                        borderRadiusWhenStacked: "all",
                    },
                },
                markers: { size: 0 },

                dataLabels: {
                    enabled: false,
                },

                legend: {
                    show: true,
                },

                grid: {
                    borderColor: "rgba(0,0,0,0.1)",
                    strokeDashArray: 3,
                    xaxis: {
                        lines: {
                            show: false,
                        },
                    },
                },

                xaxis: {
                    type: "category",
                    categories: chartGreetings.date,
                    labels: {
                        style: { cssClass: "grey--text lighten-2--text fill-color" },
                    },
                },

                yaxis: {
                    show: true,
                    min: 0,
                    max: set_high,
                    tickAmount: 4,
                    labels: {
                        style: {
                            cssClass: "grey--text lighten-2--text fill-color",
                        },
                    },
                },
                stroke: {
                    show: true,
                    width: 3,
                    lineCap: "butt",
                    colors: ["transparent"],
                },

                tooltip: { theme: "light" },

                responsive: [
                    {
                        breakpoint: 600,
                        options: {
                            plotOptions: {
                                bar: {
                                    borderRadius: 3,
                                },
                            },
                        },
                    },
                ],
            };

            var chart = new ApexCharts(document.querySelector("#chart"), chart);
            chart.render();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

$(document).ready(function () {
    setChartGreetings()
    $("#withdrawls").on("click", function (e) {
        e.preventDefault()
        handleWithDrawls()
    })

    $("#deposits").on("click", function (e) {
        e.preventDefault()
        $("#create_qr_code").show()
        $("#create_qr_code").prop("disabled", false);
        $("#qrcode").empty();
        $("#msg_deposit").empty();
        handleDeposit()
    });
});

let fetchAsync = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

let handleWithDrawls = async () => {
    try {
        $("#wd_confirmation").prop("disabled", true);
        let paymentMethob = await fetchAsync('api/get-payment-methob');
        $("#msg_withdrawl").text("");
        if (!paymentMethob) {
            let html_err = `<span class="text-danger">Please add payment methob first.<a href="https://crm.fxchampionship.com/user">Click
                here!</a></span>`;
            $("#msg_withdrawl").html(html_err);
            return;
        }

        let htmlPaymentMethob = "";
        for (let key in paymentMethob) {
            htmlPaymentMethob += `
            <option value="${paymentMethob[key].ID}">${paymentMethob[key].bank_name} - ${paymentMethob[key].holder_name} - ${paymentMethob[key].holder_number}</option>
            `;
        }

        $("#payment_methob_list").html(htmlPaymentMethob);

        let userInfo = await fetchAsync('api/get-user-info');
        if (userInfo.in_review === "not_yet") {
            $("#msg_withdrawl").removeClass()
                .addClass("text-danger")
                .text("Please verify your account first.");
            return;
        }

        let userWallet = await fetchAsync('api/get-wallet');
        if (!userWallet) {
            $("#msg_withdrawl").removeClass()
                .addClass("text-danger")
                .text("Insufficient balance in the wallet to perform the withdrawal.");
            return;
        }
        $("#wd_confirmation").prop("disabled", false);
        $("#wd_confirmation").on("click", function (e) {
            e.preventDefault()
            let inpAmount = parseInt($("#withdraw_amount").val()); // Parse input value to float

            if (!isValidAmount(inpAmount)) {
                $("#withdraw_amount").addClass("is-invalid");
                $("#fb_withdraw_amount")
                    .addClass("invalid-feedback")
                    .text("The amount of Gold to be entered must be greater than 0."); // Display an error message
                setTimeout(function () {
                    $("#wd_confirmation").prop("disabled", false);
                }, 3000);
                return;
            } else {
                $("#withdraw_amount").addClass("is-valid");
            }

            if (inpAmount > userWallet.balance) {
                $("#msg_withdraw").html(
                    `<p id='err_message' class='text-danger'>The withdrawal amount must not exceed ${userWallet.balance} Gold.</p>`
                );
                return;
            }

            $("#withdraw_amount").removeClass("is-invalid").addClass("is-valid");
            $("#msg_withdraw").empty();

            let payid = $("#payment_methob_list").val();
            let jwtToken = getCookie("token");
            if (!jwtToken) {
                window.location.href = "/login";
            }

            $("#wd_confirmation").prop("disabled", true);
            $("#wd_confirmation").html(`
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                `)

            let inpWithdraw = {
                "amount": inpAmount, // Use the parsed input value
                "payment_methob": Number(payid),
            };

            $("#msg_withdraw").html(
                `<p id='err_message' class='text-warning'>Processing</p>`
            );
            console.log(inpWithdraw)
            let headers = new Headers({
                Authorization: `Bearer ${jwtToken}`,
            });

            fetch('api/withdrawal', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(inpWithdraw),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((dataResponse) => {
                    if (dataResponse.code === 429) {
                        $("#msg_withdrawl").removeClass().addClass(dataResponse.class)
                        startCountdown(15, dataResponse.message, "msg_withdrawl");
                        setTimeout(function () {
                            $("#wd_confirmation").prop("disabled", false);
                            $("#wd_confirmation").text("Confirmation")
                        }, 3000);
                        return
                    }
                    $("#msg_withdrawl").html(
                        `<p id='err_message' class='${dataResponse.class}'>${dataResponse.message}</p>`
                    );
                    setTimeout(function () {
                        $("#wd_confirmation").prop("disabled", false);
                        $("#wd_confirmation").text("Confirmation")
                        window.location.reload()
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
    } catch (error) {
        console.error('Error during fetch:', error);
    }
};

function isValidAmount(amount) {
    return amount > 0 && amount !== null && amount !== undefined;
}

let handleDeposit = async () => {
    try {
        let userInfo = await fetchAsync('api/get-user-info');
        let checkDeposit = await fetchAsync('api/check-deposit');
        if (!checkDeposit.deposit_accept) {
            $("#msg_deposit").html(
                "<p id='err_message' class='text-danger'>Please complete your previous transaction before initiating a new one or contact support via email: support@fxchampionship.com or hotline: +84 919 720 567. Thank you!</p>"
            );
            return
        }

        $("#create_qr_code").on("click", function (e) {
            e.preventDefault()
            let inpAmount = parseInt($("#deposit_amount").val()); // Parse input value to float

            if (!isValidAmount(inpAmount)) {
                $("#msg_deposit").html(
                    "<p id='err_message' class='text-danger'>The amount must be greater than 0.</p>"
                );
                return;
            }

            $("#qrcode").empty();
            $("#msg_deposit").empty();

            $("#create_qr_code").prop("disabled", true);
            $("#create_qr_code").html(`
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `)

            let jwtToken = getCookie("token");
            if (!jwtToken) {
                window.location.href = "/login";
            }
            let inpDeposit = {
                amount: inpAmount,
            };

            let headers = new Headers({
                Authorization: `Bearer ${jwtToken}`,
            });

            fetch('api/deposit', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(inpDeposit),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((dataResponse) => {
                    if (dataResponse.code == 429) {
                        $("#msg_deposit").removeClass().addClass(dataResponse.class)
                        startCountdown(15, dataResponse.message, "msg_deposit");
                        setTimeout(function () {
                            $("#create_qr_code").text("Confirmation")
                            $("#create_qr_code").prop("disabled", false);
                        }, 1000);
                        return
                    }

                    $("#create_qr_code").hide()
                    $("#create_qr_code").text("Confirmation")
                    $("#msg_deposit").removeClass().addClass(dataResponse.class).text(dataResponse.message)
                    let bankNote = encodeURIComponent(
                        `${dataResponse.ID} ${userInfo.email}`
                    );

                    let paymentInfo = {
                        bank: bankName,
                        account: bankNumber,
                        name: bankUserName,
                        amount: inpAmount * rateGold, // Amount to be transferred
                        note: bankNote,
                    };

                    let imgURL = `https://img.vietqr.io/image/${paymentInfo.bank}-${paymentInfo.account}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${paymentInfo.note}&accountName=${paymentInfo.name}`;

                    let htmlPrintToQRCode = `
                        <div class="row mt-5">
                            <div class="col-lg-6">
                                <img id="img_qrcode" class="w-100" src="${imgURL}">
                            </div>
                            <div class="col-lg-6">
                                <h3 class="fs-5">
                                Transfer information
                                </h3>
                                <p>
                                    Account holder: ${paymentInfo.name}
                                </p>
                                <p>
                                    Account number: ${paymentInfo.account}
                                </p>
                                <p>
                                    Bank name: ${bankFullName}
                                </p>
                                <p>
                                    Note: ${dataResponse.data.ID}_${userInfo.email}
                                </p>
                            </div>
                        </div>
                    `;
                    $("#qrcode").html(htmlPrintToQRCode);

                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        })
    } catch (error) {
        console.error('Error during fetch:', error);
    }
};

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

// Join a contest
async function saveJoinContest(contest_id, amount) {
    try {
        let userWallet = await fetchAsync('api/get-wallet');
        if (amount > userWallet.balance) {
            $("#join_contest_message").removeClass().addClass(`text-danger`).text("Insufficient funds to complete this transaction.")
            return
        }
        $("#confirm_to_join").prop("disabled", true);
        $("#confirm_to_join").html(`
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        `)
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }

        let inpJoinContest = {
            "contest_id": contest_id,
        };

        let headers = new Headers({
            Authorization: `Bearer ${jwtToken}`,
        });
        // console.log(JSON.stringify(inpJoinContest));

        fetch('api/join-contest', {
            method: "POST",
            headers: headers,
            body: JSON.stringify(inpJoinContest),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not successful");
                }
                return response.json(); // Parse the response JSON if needed
            })
            .then((dataResponse) => {
                if (dataResponse.code == 429) {
                    $("#join_contest_message").removeClass().addClass(`fw-semibold ${dataResponse.class}`)
                    startCountdown(15, dataResponse.message, "join_contest_message");
                    setTimeout(function () {
                        $("#confirm_to_join").text("Join this competition")
                        $("#confirm_to_join").prop("disabled", false);
                    }, 1000);
                    return
                }

                $("#confirm_to_join").text("Join this competition")
                $("#join_contest_message").removeClass().addClass(`fw-semibold ${dataResponse.class}`).text(dataResponse.message)
                setTimeout(function () {
                    window.location.reload()
                }, 3000);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } catch (error) {
        console.log(error)
    }
}

function joinContest(contest_id, start_at, expired_at, amount, start_balance) {
    $("#confirm_to_join").prop("disabled", false);
    $("#this_contest_info").remove();
    let html_text = `
        <div id="this_contest_info">
        <h6><span class="fw-semibold">ID:</span> ${contest_id}</h6>
        <p><span class="fw-semibold">StartAt:</span> ${start_at}</p>
        <p><span class="fw-semibold">ExpireAt:</span> ${expired_at}</p>
        <p><span class="fw-semibold">Amount:</span> ${amount} G</p>
        <p><span class="fw-semibold">Start Balance:</span> $${start_balance.toLocaleString()}</p>
        <p id="join_contest_message" class="fw-semibold"></p>
        </div>
    `;
    $("#contest_info").html(html_text);
    $("#confirm_to_join").on("click", function (e) {
        e.preventDefault()
        saveJoinContest(contest_id, amount);
    });
}
