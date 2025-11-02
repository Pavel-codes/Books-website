import config from './config.js'; // Adjust the path as necessary

// 2. Use the config helper method to get the correct endpoint URL
const apiMailUrl = config.getEndpoint('mails');

var userMail = JSON.parse(sessionStorage.getItem('mail'));

$(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        const forgotPasswordData = {
            EmailToId: userMail,
            EmailToName: '',
            EmailSubject: 'PLC Reset Password',
            EmailBody: 'Click on the link to reset your password: https://proj.ruppin.ac.il/cgroup85/test2/tar1/Client/Pages/resetPassword.html'

        };

        async function sendEmailToUser(forgotPasswordData) {

            // FIXED: Using the variable apiMailUrl which now uses config.getEndpoint('mails')
            await ajaxCall('POST', apiMailUrl, JSON.stringify(forgotPasswordData), postSCBF, postECBF);
        }

        function postSCBF(response) {
            
            console.log(response);
            alert("Mail Sent");
        }

        function postECBF(response) {
            console.log(response);
        }

        sendEmailToUser(forgotPasswordData);

    });

    $('#login').click(function () {

        window.location.href = "login.html";
    });
});