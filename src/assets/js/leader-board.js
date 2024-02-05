$(document).ready(function () {
    var current_contest_id = ""
    let jwtToken = getCookie("token");
    if (!jwtToken) {
        window.location.href = "/login";
    }
    let headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
    });
    fetch("api/get-contest-by-uid", {
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
            let contest_list = dataResponse;
            let listContestRender = "";
            let contest_id = "";
            for (let key in contest_list) {
                let class_active = "";
                if (key == 0) {
                    class_active = "active";
                    contest_id = contest_list[key].contest_id;
                }
                listContestRender += `
                <button class="nav-link ${class_active} fs-4 fw-bolder" onclick="setLeaderBoard('${contest_list[key].contest_id}','balance')" id="${contest_list[key].contest_id}" data-bs-toggle="tab" data-bs-target="#${contest_list[key].contest_id}}"
                type="button" role="tab" aria-controls="${contest_list[key].contest_id}" aria-selected="true">${contest_list[key].contest_id}</button>
                `;
            }

            $("#nav-tab-contest").html(listContestRender);
            setLeaderBoard(contest_id, "balance");
            current_contest_id = contest_id
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

function setLeaderBoard(params, sort_type) {
    current_contest_id = params
    let jwtToken = getCookie("token");
    if (!jwtToken) {
        window.location.href = "/login";
    }
    let headers = new Headers({
        Authorization: `Bearer ${jwtToken}`,
    });
    let inpContest = {
        contest_id: params,
        sort_type: sort_type
    };

    fetch("api/get-leaderboard-by-contestid", {
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
            // console.log(curLeaderBoard);
            let htmlRender = `
                            <tr class="table-secondary fs-3">
                            <td class="border-bottom-0">
                                <span class="fw-semibold" style="color:#8957FF !important;">${myRank}</span> <br>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-semibold" style="color:#8957FF !important;">${params}</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-semibold" style="color:#8957FF !important;">${myData.login}</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span id="leaderboard_investor_password_${myData.login}" class="fw-normal" style="color:#8957FF !important;">******** <i onclick="ShowInvestorPassword(${myData.login})" class="ti ti-eye border-0 fs-5 leaderboard-eye-hover p-3"></i></span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal" style="color:#8957FF !important;">${maskEmail(myData.email)}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal" style="color:#8957FF !important;">$${myData.balance}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0" style="color:#8957FF !important;">$${myData.equity}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0" style="color:#8957FF !important;">$${myData.profit}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0" style="color:#8957FF !important;">$${myData.estimate_prize}</span>
                            </td>
                            </tr>
                        `;
            for (let key in curLeaderBoard) {
                if (Number(key) > 12) continue;
                htmlRender += `
                            <tr class="fs-3">
                            <td class="border-bottom-0">
                                <span class="fw-normal">${Number(key) + 1}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal">${curLeaderBoard[key].contest_id}</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-semibold">${curLeaderBoard[key].login}</span> 
                            </td>
                            <td class="border-bottom-0">
                                <span id="leaderboard_investor_password_${curLeaderBoard[key].login}" class="fw-normal">******** <i onclick="ShowInvestorPassword(${curLeaderBoard[key].login})" class="ti ti-eye border-0 fs-5 leaderboard-eye-hover p-3"></i></span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal">${maskEmail(curLeaderBoard[key].email)}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal">$${curLeaderBoard[key].balance}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0">$${curLeaderBoard[key].equity}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0">$${curLeaderBoard[key].profit}</span>
                            </td>
                            <td class="border-bottom-0">
                                <span class="fw-normal mb-0">$${curLeaderBoard[key].estimate_prize}</span>
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

function SortBy(params) {
    if (params === "sort_balance") {
        $("#sort_equity").removeClass()
        $("#sort_balance").removeClass().addClass("ti ti-sort-descending border-0")
        setLeaderBoard(current_contest_id, "balance");
    } else {
        $("#sort_balance").removeClass()
        $("#sort_equity").removeClass().addClass("ti ti-sort-descending border-0")
        setLeaderBoard(current_contest_id, "equity");
    }
}

async function ShowInvestorPassword(params) {
    try {
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let data = await fetchAsync(`api/get-investor-password?login_id=${params}`, jwtToken);
        $(`#leaderboard_investor_password_${params}`).text(data.password)
    } catch (error) {
        console.log(error)
    }
}

let fetchAsync = async (url, token) => {
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data;
};