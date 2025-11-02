import config from './config.js'; // Adjust the path as necessary

var user = JSON.parse(sessionStorage.getItem('user'));

$(document).ready(function () {

    //prevent the form from submitting defaultly
    $('#loginForm').submit(function (event) {
        event.preventDefault();

        const email = $('#email').val();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email format.");
            return;
        }

        const forgotPasswordData = {
            EmailToId: email,
            EmailToName: '',
            EmailSubject: 'PLC Reset Password',
            // It's best practice to also configure the base URL for the reset link if it changes across environments
            EmailBody: 'Click on the link to reset your password: placeholder_for_reset_link'
        };

        async function checkEmailExists(email) {
            const url = config.getUserByEmailUrl(email);
            ajaxCall('GET', url, null, getCheckSCBF, getcheckECBF);
        }

        function getCheckSCBF(response) {
            console.log(response);
            if (response.id == 0) {
                alert("Email does not exist in the system.");
                return;
            }
            else {
                sendEmailToUser(forgotPasswordData);
            }
        }

        function getcheckECBF(response) {
            console.log(response);
        }
        
        checkEmailExists(email);


        async function sendEmailToUser(forgotPasswordData) {
            const url = config.getEndpoint('mails');
            await ajaxCall('POST', url, JSON.stringify(forgotPasswordData), postSCBF, postECBF);
        }

        function postSCBF(response) {
            console.log(response);
            window.location.href = "afterSendingMail.html";
        }

        function postECBF(response) {
            console.log(response);
        }
    });


    $('#homeBtn').on('click', function () {
        window.location.href = "../Pages/index.html";
    });
});