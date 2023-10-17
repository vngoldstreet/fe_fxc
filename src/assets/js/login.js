const form = document.getElementById("formlogin");
    form.addEventListener("submit", function (event) {
        const baseUrl = "https://auth.fxchampionship.com"
        const apiLoginUrl = baseUrl + "/public/login"
        event.preventDefault(); // Prevent the default form submission
        const inpEmail = document.getElementById('email').value;
        const inpPassword = document.getElementById('password').value;
    
        // Tạo đối tượng JSON từ giá trị thu thập
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
                document.getElementById("messagefailure").classList.add("text-danger")
                document.getElementById("messagefailure").innerHTML = "Đăng nhập thất bại!"
                return response.json(); // Parse the response JSON if needed
            })
            .then(responseData => {
                // console.log("Response from server:", responseData);
                if (responseData.status == "failure") {
                    document.getElementById("messagefailure").classList.add("text-danger")
                    document.getElementById("messagefailure").innerHTML = "Đăng nhập thất bại!"
                } else {
                    const token = responseData.token;
                    const user = JSON.stringify(responseData.user)
                    const expirationDays = 7; // Adjust this as needed
    
                    // Calculate the expiration date
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    
                    // Convert the expiration date to a string in UTC format
                    const expires = expirationDate.toUTCString();
    
                    // Create the cookie string
                    const cookieString = `token=${token}; expires=${expires}; path=/`;
                    const cookieUser = `user=${user}; expires=${expires}; path=/`;
                    // Set the cookie
                    document.cookie = cookieString;
                    document.cookie = cookieUser;
                    document.getElementById("messagefailure").classList.add("text-success")
                    document.getElementById("messagefailure").innerHTML = "Đăng nhập thành công!"
                    setTimeout((window.location.href = "/"), 500);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });