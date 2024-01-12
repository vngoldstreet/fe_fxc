let handlePartner = async () => {
    try {
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        // let userInfo = await fetchAsync('api/get-user-info');
        // let html_partner = `https://crm.fxchampionship.com/register?partner=${userInfo.ref_link}`
        // $("#partner-ref").val(html_partner)

        let headers = new Headers({
            'Authorization': `Bearer ${jwtToken}`
        });

        fetch('api/get-customer', {
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
                $("#partner_name").text(owner.user.name)
                $("#partner_email").text(owner.user.email)
                $("#partner_phone").text(owner.user.phone)
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
                    labels: [`Daily joined: ${owner.day}`, `Weekly joined: ${owner.week}`, `Monthly joined: ${owner.month}`]
                };

                // Lựa chọn đối tượng canvas và vẽ biểu đồ doughnut
                var ctx = document.getElementById('myDoughnutChart').getContext('2d');
                var myDoughnutChart = new Chart(ctx, {
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
                    let text_class = ""
                    if (customers[key].customers.in_review == "done") {
                        text_class = "text-secondary"
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

let fetchAsync = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

$(document).ready(function () {
    handlePartner()
})
