$(document).ready(function () {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    const now = new Date();
    const currentHour = now.getHours();
    let greetingText = "";

    if (currentHour >= 18) {
        greetingText = "Good evening";
    } else if (currentHour >= 12) {
        greetingText = "Good afternoon";
    } else {
        greetingText = "Good morning";
    }
    const greetingMessage = `${greetingText}: ${userInfo.name} (${userInfo.email})!`;
    $("#username").text(greetingMessage);

    $("#submit_logout").click(function () {
        // Clear the 'token' cookie and redirect to the login page
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        window.location.href = "/login";
    });
});