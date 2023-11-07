const baseUrl = "https://auth.fxchampionship.com"
// const baseUrl = "http://localhost:8082"
const urlReviews = baseUrl + "/auth/uuser/in-review"
const urlUpdateUser = baseUrl + "/auth/uuser/update-user"
const urlGetPaymentMethob = baseUrl + "/auth/user-wallet/get-payment-method"
const urlPostPaymentMethob = baseUrl + "/auth/user-wallet/create-payment-method"

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



$(document).ready(function () {
    let jwtToken = getCookie("token");
    if (!jwtToken) {
        window.location.href = "/login";
    }
    let userInfo = JSON.parse(localStorage.getItem("user"))
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

    let urlGetCustomer = "https://auth.fxchampionship.com/auth/uuser/get-customer";
    let headers = new Headers({
        'Authorization': `Bearer ${jwtToken}`
    });

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
            console.log(dataResponse.data)
            let customers = dataResponse.data
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
})
