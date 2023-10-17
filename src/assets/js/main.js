const baseUrl = "https://auth.fxchampionship.com"
const urlGreetings = baseUrl + "/auth/greetings"
const redirectLoginURL = "/login"
const urlJoinContest = baseUrl + "/auth/contest/join-contest-by-uid"
$(function () {
  const jwtToken = getCookie("token");
  if (!jwtToken) {
    redirectToURL(redirectLoginURL)
  }
  const headers = new Headers({
    'Authorization': `Bearer ${jwtToken}`
  });

  fetch(urlGreetings, {
    method: "GET",
    headers: headers
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response JSON if needed
    })
    .then(dataResponse => {
      const dataToSaveString = JSON.stringify(dataResponse)
      // Save the data to local storage
      localStorage.setItem('data', dataToSaveString);

      //Wallet info
      const wallet = dataResponse.wallet
      setWallet(wallet)

      // Transactions list
      const transactionData = dataResponse.transactions
      setTransactionLists(transactionData)

      //Contest lists by id
      const contestLists = dataResponse.contest_info_list
      setContestLists(contestLists)

      //All contest list
      const allContestListDatas = dataResponse.contest_list
      setAllContestLists(allContestListDatas)
      //Chart options
      const chartGreetings = dataResponse.chart
      setChartGreetings(chartGreetings)

    })
    .catch(error => {
      console.error("Error:", error);
    });

  function setWallet(wallet) {
    const wallet_time = new Date(wallet.UpdatedAt).toLocaleString()
    document.getElementById("wallet_balance").innerHTML = `<i class="ti ti-wallet text-warning"></i> ${wallet.balance} Gold`;
    document.getElementById("wallet_time").innerHTML = `<p class="text-dark me-1 fs-3 mb-0 text-success">Updated: ${wallet_time}</p>`;
  }

  function setAllContestLists(allContestListDatas) {
    const table = document.getElementById("all-contest-list")
    let htmlPrint = ""

    for (let key in allContestListDatas) {
      let text_status = ""
      let text_class = ""
      switch (allContestListDatas[key].status_id) {
        case 0:
          text_status = "Pending"
          text_class = "bg-light"
          break;
        case 1:
          text_status = "Processing"
          text_class = "bg-warning"
          break;
        case 2:
          text_status = "Finished"
          text_class = "bg-success"
          break;
        case 3:
          text_status = "Cancel"
          text_class = "bg-light"
          break;
        default:
          text_status = "Cancel"
          text_class = "bg-danger"
          break;
      }

      const expired_at = new Date(allContestListDatas[key].expired_at).toLocaleString();
      const start_at = new Date(allContestListDatas[key].start_at).toLocaleString();
      let number = Number(key) + 1
      let amount = Number(allContestListDatas[key].amount).toLocaleString()

      htmlPrint += `
              <tr>
                <td class="border-bottom-0">
                    <span class="fw-semibold">${number}</span>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-semibold">${allContestListDatas[key].contest_id}</span> 
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal">${start_at}</span>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal">${expired_at}</span>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal mb-0 fs-4">${amount} G </span>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal mb-0 fs-4">${allContestListDatas[key].current_person}/${allContestListDatas[key].maximum_person}</span>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal mb-0 fs-4">$${allContestListDatas[key].start_balance}</span>
                </td>
                 <td class="border-bottom-0">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge ${text_class} rounded-1 fw-semibold">${text_status}</span>
                    </div>
                </td>
                <td class="border-bottom-0">
                    <button type="button" onclick="joinContest('${allContestListDatas[key].contest_id}')" class="btn btn-success m-1">Join</button>
                </td>
              </tr>
              `
    }
    table.insertAdjacentHTML("beforeend", htmlPrint);
  }

  function setTransactionLists(transactionData) {
    const table = document.getElementById("transaction-list")
    let htmlPrint = ""

    for (let key = 0; key < 10; key++) {
      let text_type = ""
      let text_id_contest = ""
      switch (transactionData[key].type_id) {
        case 1:
          text_type = "Deposit"
          break;
        case 2:
          text_type = "Withdraw"
          break;
        case 3, 5: text_type = "Earning"
          break;
        case 4: {
          text_type = "Join a contest"
          text_id_contest = `${transactionData[key].contest_id}`
          break;
        }

        default:
          break;
      }
      let text_status = ""
      let text_class = ""
      let bg_class = ""
      switch (transactionData[key].status_id) {
        case 1:
          text_status = "Processing"
          text_class = "text-warning"
          bg_class = "bg-warning"
          break;
        case 2:
          text_status = "Success"
          text_class = "text-success"
          bg_class = "bg-success"
          break;
        case 3:
          text_status = "Cancel"
          text_class = "text-danger"
          bg_class = "bg-danger"
          break;
      }
      const updated_at = new Date(transactionData[key].UpdatedAt).toLocaleString();
      const created_at = new Date(transactionData[key].CreatedAt).toLocaleString();
      let number = Number(key) + 1
      let amount = Number(transactionData[key].amount).toLocaleString()
      // (TrID: ${ transactionData[key].ID })
      htmlPrint += `
              <tr>
                <td class="border-bottom-0">
                    <span class="fw-semibold">${number}</span> <br>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-semibold">${text_type}<br>${text_id_contest}</span> 
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal">${created_at}</span> <br>
                    <span class="fw-normal">${updated_at}</span>
                </td>
                <td class="border-bottom-0">
                    <span class="fw-normal mb-0 fs-4">${amount} G </span>
                </td>
                 <td class="border-bottom-0">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge ${bg_class} rounded-1 fw-semibold">${text_status}</span>
                    </div>
                </td>
              </tr>
              `
    }
    table.insertAdjacentHTML("beforeend", htmlPrint);
  }

  function setContestLists(contestLists) {
    const table_contests = document.getElementById("contest-list")
    let htmlPrintToContest = ""
    table_contests.insertAdjacentHTML("beforeend", htmlPrintToContest);
    for (let key in contestLists) {
      let amount = Number(contestLists[key].amount).toLocaleString()
      let balance = Number(contestLists[key].start_balance).toLocaleString()

      htmlPrintToContest += `
              <div class="row align-items-start mt-2">
                <div class="col">
                    ${contestLists[key].contest_id}
                </div>
                <div class="col">
                   ${amount} Gold
                </div>
                <div class="col">
                    $${balance}
                </div>
            </div>
              `
    }

    table_contests.insertAdjacentHTML("beforeend", htmlPrintToContest);
  }

  function setChartGreetings(chartGreetings) {
    const maxdep = Math.max(...chartGreetings.dep);
    const maxearn = Math.max(...chartGreetings.earn);
    const maxwithdraw = Math.max(...chartGreetings.withdraw);
    const array_value = [maxdep, maxearn, maxwithdraw]
    const max_value = Math.max(...array_value);

    var chart = {
      series: [
        { name: "Deposit:", data: chartGreetings.dep },
        { name: "Earn:", data: chartGreetings.earn },
        { name: "Withdraw:", data: chartGreetings.withdraw },
      ],

      chart: {
        type: "bar",
        // height: 345,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: "#adb0bb",
        fontFamily: 'inherit',
        sparkline: { enabled: false },
      },

      colors: ["#004C94", "#FFC83B", "#FF87A1"],

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          borderRadius: [5],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all'
        },
      },
      markers: { size: 0 },

      dataLabels: {
        enabled: false,
      },


      legend: {
        show: false,
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
        max: max_value * 1.1,
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
              }
            },
          }
        }
      ]

    };
    var chart = new ApexCharts(document.querySelector("#chart"), chart);
    chart.render();
  }



  const myButtonLogout = document.getElementById("logout");
  function removeCokkies(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  myButtonLogout.addEventListener("click", function () {
    removeCokkies("token");
    redirectToURL(redirectLoginURL)
  });
})

$(function () {
  function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');

    for (var i = 0; i < cookieArray.length; i++) {
      var cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  }

  const myButtonLogout = document.getElementById("create_qr_code");
  myButtonLogout.addEventListener("click", function () {
    const userInfo = JSON.parse(getCookie("user"))
    const inpAmount = document.getElementById('deposit_amount').value;
    let bank_note = `${userInfo.ID} ${userInfo.name}`
    const paymentInfo = {
      bank: 'tpbank',
      account: '08096868999',
      name: 'VU DINH VIET',
      amount: inpAmount, // Số tiền cần chuyển
      note: bank_note,
    };
    let img_url = `https://img.vietqr.io/image/${paymentInfo.bank}-${paymentInfo.account}-compact2.jpg?amount=${paymentInfo.amount}&addInfo=${paymentInfo.note}n&accountName=${paymentInfo.name}`
    const img = document.getElementById("qrcode")
    let htmlPrintToContest = `<img class="w-100" src="${img_url}">`
    img.insertAdjacentHTML("beforeend", htmlPrintToContest);
  });
})

function joinContest(params) {
  console.log("Giá trị truyền vào là: " + params)
  const jwtToken = getCookie("token");
  const inpJoinContest = {
    "contest_id": params
  };

  const headers = new Headers({
    'Authorization': `Bearer ${jwtToken}`
  });

  fetch(urlJoinContest, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(inpJoinContest),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the response JSON if needed
    })
    .then(dataResponse => {
      console.log(dataResponse)
    })
    .catch(error => {
      console.error("Error:", error);
    });

}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');

  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

function redirectToURL(targetUrl) {
  window.location.href = targetUrl;
}