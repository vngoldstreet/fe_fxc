// Tạo đối tượng JSON từ giá trị thu thập
$(document).ready(function () {
    let jwtToken = getCookie("token");
    if (jwtToken) {
        window.location.href = "/";
        return
    }

    $("#submit_form_login").on("click", function (e) {
        e.preventDefault()
        let inpEmail = $('#email').val();

        let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // Regular expression for email validation
        if (!inpEmail.match(emailRegex)) {
            // Invalid email format
            $('#email').addClass('is-invalid');
            return;
        } else {
            // Valid email format
            $('#email').removeClass('is-invalid').addClass('is-valid');
        }

        let inpPassword = $('#password').val();
        if (inpPassword) {
            // Password is valid
            $('#password').removeClass('is-invalid').addClass('is-valid');
        } else {
            // Password is invalid
            $('#password').addClass('is-invalid');
            return;
        }
        $("#submit_form_login").prop("disabled", true);
        $("#submit_form_login").html(`
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `)
        let inpLoginData = {
            "email": inpEmail,
            "password": inpPassword
        };
        let requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure data is sent as JSON
            },
            body: JSON.stringify(inpLoginData),
        };

        fetch("api/login", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parse the response JSON if needed
            })
            .then(responseData => {
                localStorage.setItem('user', JSON.stringify(responseData.user));
                let token = responseData.token;

                // Enhanced security: Use HttpOnly and Secure flags for the cookie
                let expirationDays = 7; // Adjust as needed
                let expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + expirationDays);
                let expires = expirationDate.toUTCString();
                let cookieString = `token=${token}; expires=${expires}; path=/`;
                // Set the cookie
                document.cookie = cookieString;
                // Instead of immediately redirecting the user, provide a success message and then redirect
                $("#messagefailure").removeClass("text-danger").addClass("text-success").html("Success! Redirecting...");
                $("#submit_form_login").prop("disabled", false);
                $("#submit_form_login").text("Login")
                setTimeout(function () {
                    window.location.href = "/";
                }, 2000);
            })
            .catch(error => {
                console.error("Error:", error);
                $("#submit_form_login").prop("disabled", false);
                $("#submit_form_login").text("Login")
                // Enhanced security: Consider not displaying detailed error information to the user
                $("#messagefailure").addClass("text-danger").html("Login failed. Please try again.");
            });
    });

    $("#submit_resetpassword").on("click", function (e) {
        e.preventDefault()
        let inpEmail = $('#email_reset').val(); // Use jQuery to get the input value

        let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // Regular expression for email validation
        if (!inpEmail.match(emailRegex)) {
            // Invalid email format
            $('#email_reset').addClass('is-invalid');
            $('#fb_email_reset').addClass('invalid-feedback').text('Invalid email format'); // Display an error message
            return;
        } else {
            // Valid email format
            $('#email_reset').removeClass('is-invalid').addClass('is-valid');
            $('#fb_email_reset').removeClass('invalid-feedback').addClass('valid-feedback').text('Looks good!');// Clear the error message
        }

        $("#submit_resetpassword").prop("disabled", true);
        $("#submit_resetpassword").html(`
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            `)

        let inpResetPassword = {
            "email": inpEmail,
        };
        // console.log(inpLoginData)
        // Create a custom request object for the fetch
        let requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Ensure data is sent as JSON
            },
            body: JSON.stringify(inpResetPassword),
        };
        // console.log(JSON.stringify(inpResetPassword))
        fetch("/api/reset-password", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parse the response JSON if needed
            })
            .then(responseData => {
                $("#messagefailure").removeClass("text-danger").addClass("text-success").html("A new password has been sent to your email! Please check your email and proceed to log in! Redirecting...");
                $("#submit_resetpassword").text("Reset your password")
                setTimeout(function () {
                    window.location.href = "/login";
                }, 5000);
            })
            .catch(error => {
                console.error("Error:", error);
                $("#submit_resetpassword").prop("disabled", false);
                $("#submit_resetpassword").text("Reset your password")
                $("#messagefailure").addClass("text-danger").html("Please contact the support department. Thank you!");
            });
    });
});

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