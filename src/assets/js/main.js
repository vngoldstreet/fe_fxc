const baseUrl = "https://auth.fxchampionship.com";
// const baseUrl = "http://localhost:8082";
const urlGreetings = baseUrl + "/auth/greetings";
const redirectLoginURL = "/login";
const urlJoinContest = baseUrl + "/auth/contest/join-contest-by-uid";
const urlDeposit = baseUrl + "/auth/user-wallet/deposit";
const urlWithdrawal = baseUrl + "/auth/user-wallet/withdraw";
const urlLeaderBoard = baseUrl + "/auth/contest/get-leaderboard-by-contestid";
const urlGetPaymentMethob = baseUrl + "/auth/user-wallet/get-payment-method";

//---
const bankName = "acb";
const bankNumber = "966965488";
const bankUserName = "BUI ANH LINH";
const rateGold = 24000;

function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(";");

    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

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

$(function () {
    setChartGreetings()
});

$(document).ready(function () {
    let jwtToken = getCookie("token");
    if (!jwtToken) {
        window.location.href = "/login";
    }
    let headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
    });
    fetch(urlGetPaymentMethob, {
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
            let payment_methob = JSON.stringify(dataResponse.data);
            localStorage.setItem("payment_methob", payment_methob);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    $("#withdraws").on("click", function (e) {
        e.preventDefault()
        // $("#wd_confirmation").prop("disabled", false);
        $("#withdraw_amount").val(0)
        let payment_methob = JSON.parse(localStorage.getItem("payment_methob"));
        $("#msg_withdraw").text("");
        if (payment_methob == null) {
            let html_err = `<span class="text-danger">Please add payment methob first.<a href="https://crm.fxchampionship.com/user">Click
            here!</a></span>`;
            $("#msg_withdraw").html(html_err);
            return;
        }

        let htmlPaymentMethob = "";
        for (let key in payment_methob) {
            htmlPaymentMethob += `
      <option value="${payment_methob[key].ID}">${payment_methob[key].bank_name} - ${payment_methob[key].holder_name} - ${payment_methob[key].holder_number}</option>
      `;
        }

        $("#payment_methob_list").html(htmlPaymentMethob);
        $("#wd_confirmation").prop("disabled", false);

        $("#wd_confirmation").on("click", function (e) {
            e.preventDefault()
            let userInfo = JSON.parse(localStorage.getItem("user"));
            if (userInfo.inreview === "not_yet") {
                $("#msg_withdraw")
                    .addClass("text-danger")
                    .text("Please verify your account first.");
                return;
            }

            let userWallet = parseInt($("#m_wallet_balance").val());
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
                amount: inpAmount, // Use the parsed input value
                payment_methob: Number(payid),
            };

            let headers = new Headers({
                Authorization: `Bearer ${jwtToken}`,
            });
            $("#msg_withdraw").html(
                `<p id='err_message' class='text-warning'>Processing</p>`
            );

            setTimeout(function () {
                $("#msg_withdraw").html(
                    `<p id='err_message' class='text-warning'>Send order to server...</p>`
                );
                fetch(urlWithdrawal, {
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
                        $("#msg_withdraw").html(
                            `<p id='err_message' class='text-success'>You have successfully initiated a withdrawal request: ${inpAmount} Gold.</p>`
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
            }, 3000);
        });
    });
});

function isValidAmount(amount) {
    return amount > 0 && amount !== null && amount !== undefined;
}

//Deposit
$(document).ready(function () {
    $("#deposits").on("click", function (e) {
        e.preventDefault()
        $("#withdraw_amount").val(0)
        $("#qrcode").empty();
        $("#msg_deposit").empty();
    });

    $("#create_qr_code").on("click", function (e) {
        e.preventDefault()
        let userInfo = JSON.parse(localStorage.getItem("user"));
        let inpAmount = parseFloat($("#deposit_amount").val()); // Parse input value to float

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

        let bankNote = encodeURIComponent(
            `${userInfo.ID} ${inpAmount}G ${userInfo.name}`
        );

        let paymentInfo = {
            bank: bankName,
            account: bankNumber,
            name: bankUserName,
            amount: inpAmount * rateGold, // Amount to be transferred
            note: bankNote,
        };

        let imgURL = `https://img.vietqr.io/image/${paymentInfo.bank}-${paymentInfo.account}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${paymentInfo.note}&accountName=${paymentInfo.name}`;

        let htmlPrintToQRCode = `<img id="img_qrcode" class="w-100" src="${imgURL}">`;
        $("#qrcode").html(htmlPrintToQRCode);

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
        setTimeout(function () {
            fetch(urlDeposit, {
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
                    setTimeout(function () {
                        $("#create_qr_code").prop("disabled", false);
                        $("#create_qr_code").text("Confirmation")
                    }, 3000);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }, 1500);
    });
});

// Join a contest
function saveJoinContest(contest_id) {
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
        contest_id: contest_id,
    };

    let headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
    });
    // console.log(JSON.stringify(inpJoinContest));

    fetch(urlJoinContest, {
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
            $("#join_contest_message")
                .removeClass()
                .addClass(`fw-semibold ${dataResponse.class}`);
            $("#join_contest_message").text(dataResponse.message);

            setTimeout(function () {
                $("#confirm_to_join").text("Join this competition")
                window.location.reload()
            }, 5000);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
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
        saveJoinContest(contest_id);
    });
}
