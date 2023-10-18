
$(document).ready(function () {
    $("#submit_form_login").click(function () {
        const baseUrl = "https://auth.fxchampionship.com";
        const apiLoginUrl = baseUrl + "/public/login";
        const inpEmail = document.getElementById('email').value;
        const inpPassword = document.getElementById('password').value;
        const inpLoginData = {
            "email": inpEmail,
            "password": inpPassword
        };
        fetch(apiLoginUrl, {
            method: "POST",
            body: JSON.stringify(inpLoginData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parse the response JSON if needed
            })
            .then(responseData => {
                localStorage.setItem('user', JSON.stringify(responseData.user));
                const token = responseData.token;
                const expirationDays = 7; // Adjust this as needed
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + expirationDays);
                const expires = expirationDate.toUTCString();
                const cookieString = `token=${token}; expires=${expires}; path=/`;
                // Set the cookie
                document.cookie = cookieString;

                document.getElementById("messagefailure").classList.add("text-success")
                document.getElementById("messagefailure").innerHTML = "Đăng nhập thành công!"
                setTimeout((window.location.href = "/"), 3000);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    })
})

// Tạo đối tượng JSON từ giá trị thu thập
