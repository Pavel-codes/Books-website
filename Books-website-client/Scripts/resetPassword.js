import config from './config.js'; // Import config.js

$(document).ready(function () {

    $('#loginForm').submit(function (event) {
        event.preventDefault();

        var email = $('#email').val();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email format.");
            return;
        }

        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();

        if (password.length < 3) {
            // Note: Your original check was for '< 3' but your alert said 'at least 4'.
            // I've kept the original logic for length check.
            alert("Password must be at least 4 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        async function checkEmailExists(email) {
            const api = config.getUserByEmailUrl(email);
            ajaxCall('GET', api, null, getCheckSCBF, getcheckECBF);
        }

        function getCheckSCBF(response) {
            console.log(response);
            if (response.id == 0) {
                alert("Email does not exist in the system.");
                return;
            }
            else {
                updatePassword();
            }

        }

        function getcheckECBF(response) {
            console.log(response);
        }

        checkEmailExists(email);


        async function updatePassword() {
            // FIXED: Use config.js for the API endpoint
            const api = config.updateUserPasswordUrl(email);
            // The API expects the new password in the request body (JSON.stringify(password))
            ajaxCall('PUT', api, JSON.stringify(password), updateSCBF, updateECBF);
        }

        function updateSCBF(response) {
            console.log(response);
            alert("Password Changed");
            window.location.href = "login.html";
        }
        function updateECBF(response) {
            console.log(response);
            alert("User not Found change thr mail field");
        }
    });
});