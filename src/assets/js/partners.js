var currentChart = null;
let handlePartner = async () => {
    try {
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let partnerCommission = await fetchAsync('api/get-commission-level', jwtToken);
        let htmlPrintPartner = "";
        for (let key in partnerCommission) {
            let type_string = ""
            switch (partnerCommission[key].type_id) {
                case 1:
                    type_string = "Silver"
                    break;
                case 2:
                    type_string = "Gold"
                    break;
                case 3:
                    type_string = "Platinum"
                    break;
                default:
                    break;
            }
            htmlPrintPartner += `
                <tr>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${type_string}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal align-center">${partnerCommission[key].level_1} - $${partnerCommission[key].commission_1}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${partnerCommission[key].level_2} - $${partnerCommission[key].commission_2}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${partnerCommission[key].level_3} - $${partnerCommission[key].commission_3}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${partnerCommission[key].level_4} - $${partnerCommission[key].commission_4}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${partnerCommission[key].level_5} - $${partnerCommission[key].commission_5}</span>
                    </td>
                </tr>
                `;
        }
        $("#commission_levels").html(htmlPrintPartner)
        let headers = new Headers({
            'Authorization': `Bearer ${jwtToken}`
        });

        let time_start = $("#inpTimeStart").val()
        let time_end = $("#inpTimeEnd").val()

        let urlGetCustomer = `api/get-customer?time_start=${time_start}&time_end=${time_end}`
        console.log(urlGetCustomer)
        fetch(urlGetCustomer, {
            method: "GET",
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not successful");
                }
                return response.json(); // Parse the response JSON if needed
            })
            .then(dataResponse => {
                let partnerDatas = dataResponse
                let owner = partnerDatas.owner
                let customers = partnerDatas.customers
                let html_partner = `https://crm.fxchampionship.com/register?partner=${owner.user.ref_link}`
                $("#partner-ref").val(html_partner)
                $("#partner_join").text(owner.total_joined)
                $("#copy-clipboard").click(function () {
                    var copyText = $("#partner-ref");
                    copyText.select();
                    navigator.clipboard.writeText(copyText.val());
                    setTimeout(function () {
                        $("#icon-clipboard").removeClass("ti-clipboard").addClass("ti-circle-check fs-6 text-success");
                        // $("#fb_copy").text("Copied to clipboard!")
                    }, 200);
                });
                var data = {
                    datasets: [{
                        data: [owner.day, owner.week, owner.month], // 3 giá trị
                        backgroundColor: ["silver", "gold", "#8f12fd"] // Màu sắc cho từng phần
                    }],
                    labels: [`Silver: ${owner.day}`, `Gold: ${owner.week}`, `Platinum: ${owner.month}`]
                };
                if (currentChart) {
                    currentChart.destroy();
                }
                // Lựa chọn đối tượng canvas và vẽ biểu đồ doughnut
                var ctx = document.getElementById('myDoughnutChart').getContext('2d');

                currentChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: false,
                                text: 'Customer participation count in the competition',
                            }
                        },
                        maintainAspectRatio: false
                    }
                });

                let htmlPrint = "";
                for (let key in customers) {
                    let html_button = ``
                    let text_class = ""
                    if (customers[key].customers.ID != owner.user.ID) {
                        html_button = `<button type="button" onclick="showCommission(${customers[key].customers.ID},'${customers[key].customers.name}')" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modal_partner_commissions"><i class="ti ti-settings"></i></button>`
                    }

                    if (customers[key].customers.in_review == "done") {
                        text_class = "text-secondary"
                    }
                    if (customers[key].customers.ID === owner.user.ID) {
                        text_class = "bg-primary p-2 text-white bg-opacity-75"
                    }
                    htmlPrint += `
                    <tr class="${text_class}">
                        <td class="border-bottom-0">
                        <span class="fw-normal">${Number(key) + 1}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal">${new Date(customers[key].customers.CreatedAt).toLocaleString()}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal">${customers[key].customers.email}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal">${customers[key].customers.name}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal mb-0">${customers[key].customers.phone}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal mb-0">${customers[key].day}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal mb-0">${customers[key].week}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal mb-0">${customers[key].month}</span>
                        </td>
                        <td class="border-bottom-0">
                        <span class="fw-normal mb-0">${customers[key].customers.in_review}</span>
                        </td>
                        <td class="border-bottom-0">
                        ${html_button}
                        </td>
                    </tr>
                `;
                }
                $("#all-customer-list").html(htmlPrint);
            })
            .catch(error => {
                console.error("Error:", error);
            });
        $("#searchInput").on("input", function () {
            var searchTerm = $(this).val().toLowerCase();
            $("table tbody tr").each(function () {
                var rowText = $(this).text().toLowerCase();
                if (rowText.includes(searchTerm)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    } catch (error) {
        console.error('Error during fetch:', error);
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

$(document).ready(function () {
    handlePartner()
    var currentDate = new Date();

    // Đặt ngày đầu tháng
    var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    var formattedFirstDay = formatDate(firstDayOfMonth);
    $("#inpTimeStart").val(formattedFirstDay);

    // Đặt ngày hiện tại + 1
    currentDate.setDate(currentDate.getDate() + 1);
    var formattedNextDay = formatDate(currentDate);
    $("#inpTimeEnd").val(formattedNextDay);

    $("#submit_get_customer_bytime").on("click", function (e) {
        e.preventDefault()
        handlePartner()
    })
})

function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}
async function showCommission(param_id, param_name) {
    try {
        $("#fb_messsage").empty()
        $("#commission_partner_id").empty()
        $("#commisson_table").empty()
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let partnerCommission = await fetchAsync(`api/get-commission-level-by-id?partner_id=${param_id}`, jwtToken);

        if (partnerCommission.code !== 200) {
            $("#fb_messsage").removeClass().addClass("text-danger").text(partnerCommission.message)
            return
        }
        let html_table = `
        <div class="table-responsive table-option">
            <table class="table text-nowrap mb-0 align-middle">
              <thead class="text-dark fs-4">
                <tr>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Type</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Level 1</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Level 2</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Level 3</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Level 4</h6>
                  </th>
                  <th class="border-bottom-0">
                    <h6 class="fw-semibold mb-0">Level 5</h6>
                  </th>
                </tr>
              </thead>
              <tbody id="commission_partner_id">

              </tbody>
            </table>
          </div>
        `
        $("#commisson_table").html(html_table)
        $("#partner_name").text(param_name)
        let htmlPrintPartner = "";
        let parentCommission = await fetchAsync('api/get-commission-level', jwtToken);
        let commission_partner = partnerCommission.data
        for (let key in commission_partner) {
            let type_string = ""
            switch (commission_partner[key].type_id) {
                case 1:
                    type_string = "Silver"
                    break;
                case 2:
                    type_string = "Gold"
                    break;
                case 3:
                    type_string = "Platinum"
                    break;
                default:
                    break;
            }
            htmlPrintPartner += `
                <tr>
                    <td class="border-bottom-0">
                    <span class="fw-bolder">${type_string} <span id="partner_typeid_${commission_partner[key].type_id}">(${commission_partner[key].type_id})</span></span>
                    </td>
                    <td class="border-bottom-0">
                        <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">${commission_partner[key].level_1}</span>
                        <input type="number" id="partner_commission_level_1_${commission_partner[key].type_id}" value="${commission_partner[key].commission_1}" class="form-control is-valid" placeholder="Level 1" aria-label="Level 1" aria-describedby="basic-addon1">
                        <div id="fb_partner_commission_level_1_${commission_partner[key].type_id}" class="valid-feedback">
                        Range: 0 -> ${parentCommission[key].commission_1}
                        </div>
                        </div>
                    </td>
                    <td class="border-bottom-0">
                        <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">${commission_partner[key].level_2}</span>
                        <input type="number" id="partner_commission_level_2_${commission_partner[key].type_id}" value="${commission_partner[key].commission_2}" class="form-control is-valid" placeholder="Level 2" aria-label="Level 2" aria-describedby="basic-addon1">
                        <div id="fb_partner_commission_level_2_${commission_partner[key].type_id}" class="valid-feedback">
                        Range: 0 -> ${parentCommission[key].commission_2}
                        </div>
                        </div>
                    </td>
                    <td class="border-bottom-0">
                        <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">${commission_partner[key].level_3}</span>
                        <input type="number" id="partner_commission_level_3_${commission_partner[key].type_id}" value="${commission_partner[key].commission_3}" class="form-control is-valid" placeholder="Level 3" aria-label="Level 3" aria-describedby="basic-addon1">
                        <div id="fb_partner_commission_level_3_${commission_partner[key].type_id}" class="valid-feedback">
                        Range: 0 -> ${parentCommission[key].commission_3}
                        </div>
                        </div>
                    </td>
                    <td class="border-bottom-0">
                        <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">${commission_partner[key].level_4}</span>
                        <input type="number" id="partner_commission_level_4_${commission_partner[key].type_id}" value="${commission_partner[key].commission_4}" class="form-control is-valid" placeholder="Level 4" aria-label="Level 4" aria-describedby="basic-addon1">
                        <div id="fb_partner_commission_level_4_${commission_partner[key].type_id}" class="valid-feedback">
                        Range: 0 -> ${parentCommission[key].commission_4}
                        </div>
                        </div>
                    </td>
                    <td class="border-bottom-0">
                        <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">${commission_partner[key].level_5}</span>
                        <input type="number" id="partner_commission_level_5_${commission_partner[key].type_id}" value="${commission_partner[key].commission_5}" class="form-control is-valid" placeholder="Level 5" aria-label="Level 5" aria-describedby="basic-addon1">
                        <div id="fb_partner_commission_level_5_${commission_partner[key].type_id}" class="valid-feedback">
                        Range: 0 -> ${parentCommission[key].commission_5}
                        </div>
                        </div>
                    </td>
                </tr>
                `;
        }
        $("#commission_partner_id").html(htmlPrintPartner)

        $("#submit_save_commission").on("click", function (e) {
            e.preventDefault()
            updateCommission(param_id, parentCommission)
        })
    } catch (error) {
        console.error('Error during show commission:', error);
    }
}

async function updateCommission(param_id, parentCommission) {
    try {
        let level_1_1 = $(`#partner_commission_level_1_1`).val()
        if (level_1_1 > parentCommission[0].commission_1 || level_1_1 < 0) {
            $(`#partner_commission_level_1_1`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_1_1`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[0].commission_1}`)
            return
        }
        $(`#partner_commission_level_1_1`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_1_1`).removeClass().addClass("valid-feedback").text(``)

        let level_2_1 = $(`#partner_commission_level_2_1`).val()
        if (level_2_1 > parentCommission[0].commission_2 || level_2_1 < 0) {
            $(`#partner_commission_level_2_1`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_2_1`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[0].commission_2}`)
            return
        }

        $(`#partner_commission_level_2_1`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_2_1`).removeClass().addClass("valid-feedback").text(``)

        let level_3_1 = $(`#partner_commission_level_3_1`).val()
        if (level_3_1 > parentCommission[0].commission_3 || level_3_1 < 0) {
            $(`#partner_commission_level_3_1`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_3_1`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[0].commission_3}`)
            return
        }

        $(`#partner_commission_level_3_1`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_3_1`).removeClass().addClass("valid-feedback").text(``)

        let level_4_1 = $(`#partner_commission_level_4_1`).val()
        if (level_4_1 > parentCommission[0].commission_4 || level_4_1 < 0) {
            $(`#partner_commission_level_4_1`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_4_1`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[0].commission_4}`)
            return
        }

        $(`#partner_commission_level_4_1`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_4_1`).removeClass().addClass("valid-feedback").text(``)
        let level_5_1 = $(`#partner_commission_level_5_1`).val()
        if (level_5_1 > parentCommission[0].commission_5 || level_5_1 < 0) {
            $(`#partner_commission_level_5_1`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_5_1`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[0].commission_5}`)
            return
        }

        $(`#partner_commission_level_5_1`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_5_1`).removeClass().addClass("valid-feedback").text(``)

        //=================================================
        let level_1_2 = $(`#partner_commission_level_1_2`).val()
        if (level_1_2 > parentCommission[1].commission_1 || level_1_2 < 0) {
            $(`#partner_commission_level_1_2`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_1_2`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[1].commission_1}`)
            return
        }
        $(`#partner_commission_level_1_2`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_1_2`).removeClass().addClass("valid-feedback").text(``)

        let level_2_2 = $(`#partner_commission_level_2_2`).val()
        if (level_2_2 > parentCommission[1].commission_2 || level_2_2 < 0) {
            $(`#partner_commission_level_2_2`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_2_2`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[1].commission_2}`)
            return
        }
        $(`#partner_commission_level_2_2`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_2_2`).removeClass().addClass("valid-feedback").text(``)

        let level_3_2 = $(`#partner_commission_level_3_2`).val()
        if (level_3_2 > parentCommission[1].commission_3 || level_3_2 < 0) {
            $(`#partner_commission_level_3_2`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_3_2`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[1].commission_3}`)
            return
        }

        $(`#partner_commission_level_3_2`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_3_2`).removeClass().addClass("valid-feedback").text(``)

        let level_4_2 = $(`#partner_commission_level_4_2`).val()
        if (level_4_2 > parentCommission[1].commission_4 || level_4_2 < 0) {
            $(`#partner_commission_level_4_2`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_4_2`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[1].commission_4}`)
            return
        }
        $(`#partner_commission_level_4_2`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_4_2`).removeClass().addClass("valid-feedback").text(``)

        let level_5_2 = $(`#partner_commission_level_5_2`).val()
        if (level_5_2 > parentCommission[1].commission_5 || level_5_2 < 0) {
            $(`#partner_commission_level_5_2`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_5_2`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[1].commission_5}`)
            return
        }
        $(`#partner_commission_level_5_2`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_5_2`).removeClass().addClass("valid-feedback").text(``)


        let level_1_3 = $(`#partner_commission_level_1_3`).val()
        if (level_1_3 > parentCommission[2].commission_1 || level_1_3 < 0) {
            $(`#partner_commission_level_1_3`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_1_3`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[2].commission_1}`)
            return
        }
        $(`#partner_commission_level_1_3`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_1_3`).removeClass().addClass("valid-feedback").text(``)

        let level_2_3 = $(`#partner_commission_level_2_3`).val()
        if (level_2_3 > parentCommission[2].commission_2 || level_2_3 < 0) {
            $(`#partner_commission_level_2_3`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_2_3`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[2].commission_2}`)
            return
        }

        $(`#partner_commission_level_2_3`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_2_3`).removeClass().addClass("valid-feedback").text(``)

        let level_3_3 = $(`#partner_commission_level_3_3`).val()
        if (level_3_3 > parentCommission[2].commission_3 || level_3_3 < 0) {
            $(`#partner_commission_level_3_3`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_3_3`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[2].commission_3}`)
            return
        }

        $(`#partner_commission_level_3_3`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_3_3`).removeClass().addClass("valid-feedback").text(``)

        let level_4_3 = $(`#partner_commission_level_4_3`).val()
        if (level_4_3 > parentCommission[2].commission_4 || level_4_3 < 0) {
            $(`#partner_commission_level_4_3`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_4_3`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[2].commission_4}`)
            return
        }

        $(`#partner_commission_level_4_3`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_4_3`).removeClass().addClass("valid-feedback").text(``)

        let level_5_3 = $(`#partner_commission_level_5_3`).val()
        if (level_5_3 > parentCommission[2].commission_5 || level_5_3 < 0) {
            $(`#partner_commission_level_5_3`).removeClass("is-valid").addClass("is-invalid")
            $(`#fb_partner_commission_level_5_3`).removeClass().addClass("invalid-feedback").text(`Range: 0 -> ${parentCommission[2].commission_5}`)
            return
        }

        $(`#partner_commission_level_5_3`).removeClass("is-invalid").addClass("is-valid")
        $(`#fb_partner_commission_level_5_3`).removeClass().addClass("valid-feedback").text(``)

        let commissions = [
            {
                "partner_id": param_id,
                "parent_id": Number(parentCommission[0].partner_id),
                "commission_1": Number(level_1_1),
                "commission_2": Number(level_2_1),
                "commission_3": Number(level_3_1),
                "commission_4": Number(level_4_1),
                "commission_5": Number(level_5_1),
                "type_id": 1,
            },
            {
                "partner_id": param_id,
                "parent_id": Number(parentCommission[1].partner_id),
                "commission_1": Number(level_1_2),
                "commission_2": Number(level_2_2),
                "commission_3": Number(level_3_2),
                "commission_4": Number(level_4_2),
                "commission_5": Number(level_5_2),
                "type_id": 2,
            },
            {
                "partner_id": param_id,
                "parent_id": Number(parentCommission[2].partner_id),
                "commission_1": Number(level_1_3),
                "commission_2": Number(level_2_3),
                "commission_3": Number(level_3_3),
                "commission_4": Number(level_4_3),
                "commission_5": Number(level_5_3),
                "type_id": 3,
            },
        ]
        let sendData = {
            "data": commissions,
        }

        $("#submit_save_commission").prop("disabled", true);
        $("#submit_save_commission").html(`
        <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        `)

        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let headers = new Headers({
            Authorization: `Bearer ${jwtToken}`,
        });
        fetch('api/commission-update', {
            method: "POST",
            headers: headers,
            body: JSON.stringify(sendData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((dataResponse) => {
                $("#fb_messsage").html(
                    `<p id='err_message' class='${dataResponse.class}'>${dataResponse.message}</p>`
                );
                setTimeout(function () {
                    $("#submit_save_commission").prop("disabled", false);
                    $("#submit_save_commission").text("Save changes")
                }, 500);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } catch (error) {
        console.error('Error during show commission:', error);
    }
}