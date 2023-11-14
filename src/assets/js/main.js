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

function setAllContestLists(allContestListDatas) {
  let htmlPrint = "";

  for (let key in allContestListDatas) {
    let text_status = "";
    let text_class = "";

    switch (allContestListDatas[key].status_id) {
      case 0:
        text_status = "Pending";
        text_class = "bg-light";
        break;
      case 1:
        text_status = "Processing";
        text_class = "bg-warning";
        break;
      case 2:
        text_status = "Finished";
        text_class = "bg-success";
        break;
      case 3:
        text_status = "Cancelled";
        text_class = "bg-light";
        break;
      default:
        text_status = "Cancelled";
        text_class = "bg-danger";
        break;
    }

    let expired_at = new Date(
      allContestListDatas[key].expired_at
    ).toLocaleString();
    let start_at = new Date(allContestListDatas[key].start_at).toLocaleString();
    let number = Number(key) + 1;
    let amount = Number(allContestListDatas[key].amount).toLocaleString();
    let numberPerson = Number(allContestListDatas[key].current_person);
    let maximumPerson = Number(allContestListDatas[key].maximum_person);

    let current_prize = Number(allContestListDatas[key].amount) * numberPerson;
    let estimate_prize =
      maximumPerson * Number(allContestListDatas[key].amount) * 0.7;
    let totalPrizes = 0.0;
    if (current_prize < estimate_prize) {
      totalPrizes = estimate_prize;
    } else {
      totalPrizes = current_prize;
    }

    htmlPrint += `
      <tr>
        <td class="border-bottom-0">
          <span class="fw-normal">${number}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${allContestListDatas[key].contest_id}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${start_at}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${expired_at}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal mb-0">${amount} G</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal mb-0">${
            allContestListDatas[key].current_person
          }/${allContestListDatas[key].maximum_person}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal mb-0">${totalPrizes.toLocaleString()} G</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal mb-0">$${allContestListDatas[
            key
          ].start_balance.toLocaleString()}</span>
        </td>
        <td class="border-bottom-0">
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${text_class} rounded-1 fw-semibold">${text_status}</span>
          </div>
        </td>
        <td class="border-bottom-0">
          <button id="joinToContest" onclick="joinContest('${
            allContestListDatas[key].contest_id
          }','${start_at}','${expired_at}',${amount},${
      allContestListDatas[key].start_balance
    })" type="button" class="btn btn-secondary w-100 p-1" data-bs-toggle="modal" data-bs-target="#join_contest">Join</button>
        </td>
      </tr>
    `;
  }

  $("#all-contest-list").html(htmlPrint);
}

function setTransactionLists(transactionData) {
  let htmlPrint = "";
  let userInfo = JSON.parse(localStorage.getItem("user"));

  for (let key in transactionData) {
    let text_type = "";
    let text_id_contest = "";
    switch (transactionData[key].type_id) {
      case 1:
        text_type = "Deposit";
        break;
      case 2:
        text_type = "Withdrawal";
        break;
      case 3:
      case 5:
        text_type = "Earning";
        break;
      case 4:
        text_type = "Join a contest";
        text_id_contest = `${transactionData[key].contest_id}`;
        break;
      case 6:
        text_type = "Re-Join a contest";
        text_id_contest = `${transactionData[key].contest_id}`;
        break;
      default:
        break;
    }
    let text_status = "";
    let text_class = "";
    let bg_class = "";
    switch (transactionData[key].status_id) {
      case 1:
        text_status = "Processing";
        text_class = "text-warning";
        bg_class = "bg-warning";
        break;
      case 2:
        text_status = "Success";
        text_class = "text-success";
        bg_class = "bg-success";
        break;
      case 3:
        text_status = "Cancelled";
        text_class = "text-danger";
        bg_class = "bg-danger";
        break;
    }
    let updated_at = new Date(transactionData[key].UpdatedAt).toLocaleString();
    let created_at = new Date(transactionData[key].CreatedAt).toLocaleString();
    let number = Number(key) + 1;
    let amount = Number(transactionData[key].amount).toLocaleString();

    htmlPrint += `
      <tr>
        <td class="border-bottom-0">
          <span class="fw-semibold">${number}</span> <br>
        </td>
        <td class="border-bottom-0">
          <span class="fw-semibold">${text_type}<br>${text_id_contest}</span> 
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${created_at}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${updated_at}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal mb-0">${amount} G</span>
        </td>
        <td class="border-bottom-0">
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${bg_class} rounded-1 fw-semibold">${text_status}</span>
          </div>
        </td>
        <td class="border-bottom-0">
          <button onclick="getInformationOfTransaction(${transactionData[key].amount},${transactionData[key].type_id},${userInfo.ID},'${userInfo.name}')" type="button" class="btn btn-secondary p-1 w-100" data-bs-toggle="modal" data-bs-target="#modal_transaction_info">Info</button>
        </td>
      </tr>
    `;
  }

  $("#transaction-list").html(htmlPrint);
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

function setTransactionLists(transactionData) {
  let htmlPrint = "";

  for (let key in transactionData) {
    let text_type = "";
    let text_id_contest = "";

    switch (transactionData[key].type_id) {
      case 1:
        text_type = "Deposit";
        break;
      case 2:
        text_type = "Withdrawal";
        break;
      case 3:
      case 5:
        text_type = "Earning";
        break;
      case 4:
        text_type = "Join a contest";
        text_id_contest = `${transactionData[key].contest_id}`;
        break;
      case 6:
        text_type = "Re-Join a contest";
        text_id_contest = `${transactionData[key].contest_id}`;
        break;
      default:
        break;
    }

    let text_status = "";
    let text_class = "";
    let bg_class = "";

    switch (transactionData[key].status_id) {
      case 1:
        text_status = "Processing";
        text_class = "text-warning";
        bg_class = "bg-warning";
        break;
      case 2:
        text_status = "Success";
        text_class = "text-success";
        bg_class = "bg-success";
        break;
      case 3:
        text_status = "Cancel";
        text_class = "text-danger";
        bg_class = "bg-danger";
        break;
    }

    let updated_at = new Date(transactionData[key].UpdatedAt).toLocaleString();
    let created_at = new Date(transactionData[key].CreatedAt).toLocaleString();
    let number = Number(key) + 1;
    let amount = Number(transactionData[key].amount).toLocaleString();

    let userInfo = JSON.parse(localStorage.getItem("user"));

    htmlPrint += `
      <tr>
        <td class="border-bottom-0">
          <span class="fw-semibold">${number}</span> <br>
        </td>
        <td class="border-bottom-0">
          <span class="fw-semibold">${text_type}<br>${text_id_contest}</span> 
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${created_at}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal">${updated_at}</span>
        </td>
        <td class="border-bottom-0">
          <span class="fw-normal mb-0">${amount} G </span>
        </td>
        <td class="border-bottom-0">
          <div class="d-flex align-items-center gap-2">
            <span class="badge ${bg_class} rounded-1 fw-semibold">${text_status}</span>
          </div>
        </td>
        <td class="border-bottom-0">
          <button onclick="getInformationOfTransaction(${transactionData[key].amount},${transactionData[key].type_id},${userInfo.ID},'${userInfo.name}')" type="button" class="btn btn-secondary p-1 w-100" data-bs-toggle="modal" data-bs-target="#modal_transaction_info">Info</button>
        </td>
      </tr>
    `;
  }

  $("#transaction-list").html(htmlPrint);
}

function getInformationOfTransaction(amount, type, id, name) {
  if (Number(type) == 1) {
    let bank_note = encodeURIComponent(`${id} ${Number(amount)}G ${name}`);
    let paymentInfo = {
      bank: bankName,
      account: bankNumber,
      name: bankUserName,
      amount: Number(amount) * rateGold, // Số tiền cần chuyển
      note: bank_note,
    };
    let img_url = `https://img.vietqr.io/image/${paymentInfo.bank}-${paymentInfo.account}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${paymentInfo.note}&accountName=${paymentInfo.name}`;
    let htmlPrintToContest = `<img id="img_qrcode_info_1" class="w-100" src="${img_url}">`;
    $("#img_qrcode_info").html(htmlPrintToContest);
    return;
  }
  if (Number(type) > 1) {
    let text_type = "";
    switch (type) {
      case 1:
        text_type = "Deposit";
        break;
      case 2:
        text_type = "Withdrawal";
        break;
      case (3, 5):
        text_type = "Earning";
        break;
      case 4:
        text_type = "Join a contest";
        break;
      case 6:
        text_type = "Re-Join a contest";
        text_id_contest = `${transactionData[key].contest_id}`;
        break;
      default:
        break;
    }
    let html_text = `
                      <div id="this_contest_info">
                      <h6>Transaction type: ${text_type}</h6>
                      <h6><span>Amount:</span> $${amount.toLocaleString()}</h6>
                      </div>
                    `;
    $("#img_qrcode_info").html(html_text);
    return;
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

function setNotification(notifications) {
  let htmlPrint = `<ul class="timeline-widget mb-0 position-relative mb-n5">`;
  let text_title = "";
  let text_class = "";
  for (let key in notifications) {
    switch (notifications[key].type) {
      case 1:
        text_title = "Deposit";
        text_class = "text-primary";
        break;
      case 2:
        text_title = "Withdrawal";
        text_class = "text-danger";
        break;
      case 3:
        text_title = "Join a contest";
        text_class = "text-primary";
        break;
      case 4:
        text_title = "Re-join a contest";
        text_class = "text-primary";
        break;
      default:
        text_title = "";
        break;
    }

    htmlPrint += `
    <li class="timeline-item d-flex position-relative overflow-hidden">
      <div class="timeline-time text-dark flex-shrink-0 text-end">${new Date(
        notifications[key].CreatedAt
      ).toLocaleDateString()}</div>
        <div class="timeline-badge-wrap d-flex flex-column align-items-center">
            <span class="timeline-badge border-2 border border-primary flex-shrink-0 my-8"></span>
            <span class="timeline-badge-border d-block flex-shrink-0"></span>
        </div>
      <div class="timeline-desc fs-3 text-dark mt-n1">
        <h6 class="${text_class}">${text_title}</h6>
        <p class="fs-3">${notifications[key].message}</p>
      </div>
    </li> 
    `;
  }
  htmlPrint += `</ul>`;
  $("#out_notification").html(htmlPrint);
}

function maskEmail(email) {
  let parts = email.split("@");
  if (parts.length === 2) {
    let [firstPart, secondPart] = splitStringByIndex(parts[0], 3);
    let maskedName = firstPart + secondPart.replace(/./g, "*");
    return maskedName + "@" + parts[1];
  } else {
    return email;
  }
}

function getLeaderBoard(contest_id) {
  let jwtToken = getCookie("token");
  if (!jwtToken) {
    window.location.href = "/login";
  }
  let inpContest = {
    contest_id: contest_id,
  };

  let headers = new Headers({
    Authorization: `Bearer ${jwtToken}`,
  });

  fetch(urlLeaderBoard, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(inpContest),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((dataResponse) => {
      $("#leader_board_title").text(
        `Leader Board of competition: ${contest_id}`
      );
      let myRank = dataResponse.rank;
      let myData = dataResponse.user;
      let curLeaderBoard = dataResponse.leader_board;
      let htmlRender = `
         <tr class="table-secondary fs-3">
          <td class="border-bottom-0">
            <span class="fw-semibold" style="color:#8957FF !important;">${myRank}</span> <br>
          </td>
          <td class="border-bottom-0">
            <span class="fw-semibold" style="color:#8957FF !important;">${contest_id}</span> 
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal" style="color:#8957FF !important;">${maskEmail(
              myData.email
            )}</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal" style="color:#8957FF !important;">$${
              myData.balance
            }</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal mb-0" style="color:#8957FF !important;">$${
              myData.equity
            }</span>
          </td>
          <td class="border-bottom-0">
                                <span class="fw-normal mb-0" style="color:#8957FF !important;">$${
                                  myData.profit
                                }</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0" style="color:#8957FF !important;">$${
                                  myData.estimate_prize
                                }</span>
                            </td>
        </tr>
      `;
      for (let key in curLeaderBoard) {
        if (Number(key) > 11) continue;
        htmlRender += `
        <tr class="fs-3">
          <td class="border-bottom-0">
            <span class="fw-semibold">${Number(key) + 1}</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-semibold">${curLeaderBoard[key].contest_id}</span> 
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal">${maskEmail(
              curLeaderBoard[key].email
            )}</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal">$${curLeaderBoard[key].balance}</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal mb-0">$${curLeaderBoard[key].equity}</span>
          </td>
          <td class="border-bottom-0">
                                <span class="fw-normal mb-0">$${
                                  curLeaderBoard[key].profit
                                }</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0">$${
                                  curLeaderBoard[key].estimate_prize
                                }</span>
                            </td>
        </tr>
        `;
      }
      htmlRender += `
        <tr class="">
          <td class="border-bottom-0">
            <span class="fw-semibold">...</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-semibold">...</span> 
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal">...</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal">...</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal mb-0">...</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal mb-0">...</span>
          </td>
          <td class="border-bottom-0">
            <span class="fw-normal mb-0">...</span>
          </td>
        </tr>
      `;
      $("#leader_board_infor").html(htmlRender);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function setChartGreetings(chartGreetings) {
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
}

function setWallet(wallet) {
  let walletTime = new Date(wallet.UpdatedAt).toLocaleString();
  let walletBalanceHtml = `<i class="ti ti-wallet text-warning"></i> ${wallet.balance.toLocaleString()} Gold`;
  let walletTimeHtml = `<p class="text-dark me-1 fs-3 mb-0 text-success">Updated: ${walletTime}</p>`;

  $("#wallet_balance").html(walletBalanceHtml);
  $("#wallet_time").html(walletTimeHtml);
}

function greetingFunc() {
  let jwtToken = getCookie("token");
  if (!jwtToken) {
    window.location.href = "/login";
  }

  let headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwtToken}`,
  });
  fetch(urlGreetings, {
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
      let dataToSaveString = JSON.stringify(dataResponse);
      localStorage.setItem("data", dataToSaveString);
      console.log(dataResponse);
      // Wallet info
      let wallet = dataResponse.wallet;
      setWallet(wallet);

      let notification = dataResponse.notification;
      setNotification(notification);
      // Transactions list
      let transactionData = dataResponse.transactions;
      setTransactionLists(transactionData);

      // All contest list
      let allContestListDatas = dataResponse.contest_list;
      setAllContestLists(allContestListDatas);

      // Chart options
      let chartGreetings = dataResponse.chart;
      setChartGreetings(chartGreetings);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

$(function () {
  greetingFunc();
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

  $("#withdraws").click(function () {
    $("#wd_confirmation").prop("disabled", false);
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
    $("#wd_confirmation").click(function () {
      let userInfo = JSON.parse(localStorage.getItem("user"));
      if (userInfo.inreview === "not_yet") {
        $("#msg_withdraw")
          .addClass("text-danger")
          .text("Please verify your account first.");
        return;
      }

      let userWallet = JSON.parse(localStorage.getItem("data")).wallet;
      let inpAmount = parseInt($("#withdraw_amount").val()); // Parse input value to float

      if (!isValidAmount(inpAmount)) {
        $("#withdraw_amount").addClass("is-invalid");
        $("#fb_withdraw_amount")
          .addClass("invalid-feedback")
          .text("The amount of Gold to be entered must be greater than 0."); // Display an error message
        return;
      }

      if (inpAmount > userWallet.balance) {
        $("#msg_withdraw").html(
          `<p id='err_message' class='text-danger'>The withdrawal amount must not exceed ${userWallet.balance} Gold.</p>`
        );
        return;
      }

      $("#withdraw_amount").removeClass("is-invalid").addClass("is-valid");
      $("#wd_confirmation").prop("disabled", true);
      $("#msg_withdraw").empty();

      let payid = $("#payment_methob_list").val();
      let jwtToken = getCookie("token");
      if (!jwtToken) {
        window.location.href = "/login";
      }

      let inpWithdraw = {
        amount: inpAmount, // Use the parsed input value
        payment_methob: Number(payid),
      };

      let headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
      });

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
          greetingFunc();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});

function isValidAmount(amount) {
  return amount > 0 && amount !== null && amount !== undefined;
}

//Deposit
$(document).ready(function () {
  $("#deposits").click(function () {
    $("#create_qr_code").prop("disabled", false);
    $("#qrcode").empty();
    $("#msg_deposit").empty();
  });

  $("#create_qr_code").click(function () {
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
        $("#deposit_amount").val(0);
        greetingFunc();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

// Join a contest
function saveJoinContest(contest_id) {
  $("#confirm_to_join").prop("disabled", true);
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
      console.log(dataResponse);
      $("#join_contest_message")
        .removeClass()
        .addClass("fw-semibold text-success");
      $("#join_contest_message").text(dataResponse.message);
      greetingFunc();
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
  $("#confirm_to_join").click(function () {
    saveJoinContest(contest_id);
  });
}
