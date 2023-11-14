const baseUrl = "https://auth.fxchampionship.com";
const urlLeaderBoard = baseUrl + "/auth/contest/get-leaderboard-by-contestid";
const urlCompetition = baseUrl + "/auth/contest/get-contest-by-uid";

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

$(document).ready(function () {
  let jwtToken = getCookie("token");
  if (!jwtToken) {
    window.location.href = "/login";
  }
  let headers = new Headers({
    Authorization: `Bearer ${jwtToken}`,
  });
  fetch(urlCompetition, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((dataResponse) => {
      let contest_list = dataResponse.data;
      let listContestRender = "";
      let contest_id = "";
      for (let key in contest_list) {
        let class_active = "";
        if (key == 0) {
          class_active = "active";
          contest_id = contest_list[key].contest_id;
        }
        listContestRender += `
            <button class="nav-link ${class_active} fs-4 fw-bolder" onclick="setLeaderBoard('${contest_list[key].contest_id}')" id="${contest_list[key].contest_id}" data-bs-toggle="tab" data-bs-target="#${contest_list[key].contest_id}}"
              type="button" role="tab" aria-controls="${contest_list[key].contest_id}" aria-selected="true">${contest_list[key].contest_id}</button>
        `;
      }

      $("#nav-tab-contest").html(listContestRender);
      setLeaderBoard(contest_id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function setLeaderBoard(params) {
  let jwtToken = getCookie("token");
  if (!jwtToken) {
    window.location.href = "/login";
  }
  let headers = new Headers({
    Authorization: `Bearer ${jwtToken}`,
  });
  let inpContest = {
    contest_id: params,
  };

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
      $("#leader_board_title").text(`Leader Board of competition: ${params}`);
      let myRank = dataResponse.rank;
      let myData = dataResponse.user;
      let curLeaderBoard = dataResponse.leader_board;
      //   console.log(curLeaderBoard);
      let htmlRender = `
                            <tr class="table-secondary fs-3">
                            <td class="border-bottom-0">
                                <span class="fw-semibold" style="color:#8957FF !important;">${myRank}</span> <br>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-semibold" style="color:#8957FF !important;">${params}</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-semibold" style="color:#8957FF !important;">${
                                  myData.login
                                }</span> 
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
                                <span class="fw-normal">${
                                  Number(key) + 1
                                }</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal">${
                                  curLeaderBoard[key].contest_id
                                }</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-semibold">${
                                  curLeaderBoard[key].login
                                }</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal">${maskEmail(
                                  curLeaderBoard[key].email
                                )}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal">$${
                                  curLeaderBoard[key].balance
                                }</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0">$${
                                  curLeaderBoard[key].equity
                                }</span>
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
                            <span class="fw-normal">...</span>
                        </td>
                        <td class="border-bottom-0">
                            <span class="fw-normal">...</span>
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
