let handlePartner = async () => {
    try {
        let jwtToken = getCookie("token");
        if (!jwtToken) {
            window.location.href = "/login";
        }
        let userInfo = await fetchAsync('api/get-user-info');
        let html_partner = `https://crm.fxchampionship.com/register?partner=${userInfo.ref_link}`
        $("#partner-ref").val(html_partner)
        $("#copy-clipboard").click(function () {
            var copyText = $("#partner-ref");
            copyText.select();
            navigator.clipboard.writeText(copyText.val());
            setTimeout(function () {
                $("#icon-clipboard").removeClass("ti-clipboard").addClass("ti-circle-check fs-6 text-success");
                $("#fb_copy").text("Copied to clipboard!")
            }, 200);
        });
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
                let customers = dataResponse
                let htmlPrint = "";
                for (let key in customers) {
                    let text_class = ""
                    if (customers[key].in_review == "done") {
                        text_class = "text-secondary"
                    }
                    htmlPrint += `
                <tr class="${text_class}">
                    <td class="border-bottom-0">
                    <span class="fw-normal">${Number(key) + 1}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${new Date(customers[key].CreatedAt).toLocaleString()}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${customers[key].email}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal">${customers[key].name}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal mb-0">${customers[key].phone}</span>
                    </td>
                    <td class="border-bottom-0">
                    <span class="fw-normal mb-0">${customers[key].in_review}</span>
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
