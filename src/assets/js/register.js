const redirectURL = "/";
const baseUrl = "https://auth.fxchampionship.com"
const apiRegisterUrl = baseUrl + "/public/register";
// Get a reference to the HTML form element
const form = document.getElementById("formreg");
// Add a submit event listener to the form
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const inpName = document.getElementById('name').value;
    const inpEmail = document.getElementById('email').value;
    const inpPassword = document.getElementById('password').value;
    const inpPhone = document.getElementById('phone').value;
    const inpPasscode = document.getElementById('parnercode').value;
    // Tạo đối tượng JSON từ giá trị thu thập
    const inpLoginData = {
        "email": inpEmail,
        "password": inpPassword,
        "name": inpName,
        "phone": inpPhone,
        "parnercode": inpPasscode
    };

    fetch(apiRegisterUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Set the content type to JSON
        },
        body: JSON.stringify(inpLoginData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json(); // Parse the response JSON if needed
        })
        .then(responseData => {
            console.log("Response from server:", responseData);
            if (responseData.status == "failure") {
                document.getElementById("messagefailure").classList.add("text-danger")
                document.getElementById("messagefailure").innerHTML = responseData.message;
            } else {
                document.getElementById("messagefailure").classList.add("text-success")
                document.getElementById("messagefailure").innerHTML = responseData.message;
                setTimeout((window.location.href = "/login"), 500);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});