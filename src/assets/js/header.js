$(document).ready(function () {
    handleHeader()
});

let fetchAsync = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

let handleHeader = async () => {
    try {
        let userInfo = await fetchAsync('api/get-user-info');
        let now = new Date();
        let currentHour = now.getHours();
        let greetingText = "";
        if (currentHour >= 18) {
            greetingText = "Good evening";
        } else if (currentHour >= 12) {
            greetingText = "Good afternoon";
        } else {
            greetingText = "Good morning";
        }
        let greetingMessage = `${greetingText}<br>${userInfo.name} (${userInfo.email})`;
        $("#username").html(greetingMessage);
        if (userInfo.image === '') {
            $("#avata-img").attr("src", "src/assets/images/profile/user-1.jpg")
        } else {
            $("#avata-img").attr("src", userInfo.image)
        }
        $("#submit_logout").on("click", function (e) {
            e.preventDefault()
            // Clear the 'token' cookie and redirect to the login page
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
            localStorage.removeItem("user");
            localStorage.removeItem("data");
            window.location.href = "/login";
        });
    } catch (error) {

    }
}