import config from './config.js'; 

var user = JSON.parse(sessionStorage.getItem('user'));

$(document).ready(function () {

    const toggleModeCheckbox = document.getElementById('toggle-mode');
    const currentTheme = localStorage.getItem('theme');

    // Apply the saved theme on load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        toggleModeCheckbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Toggle dark mode and save the theme
    toggleModeCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    $('#loginForm').submit(function (event) {
        event.preventDefault(); // Prevent form submission

        const email = $('#email').val();
        const password = $('#password').val();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //RegEx
        if (!emailPattern.test(email)) {
            alert("Invalid email format.");
            return;
        }

        // Changed validation to be more consistent with the alert message if it's supposed to be 4+
        if (password.length < 4) { 
            alert("Password must be at least 4 characters long.");
            return;
        }

        const loginData = {
            Email: email,
            Password: password
        };

        submitToServer(loginData);

        function submitToServer(loginData) {
            // FIXED: Use config.js to get the login API URL
            let api = config.getLoginUrl();
            ajaxCall('POST', api, JSON.stringify(loginData), postSCBF, postECBF);
        }

        function postSCBF(response) {
            console.log(response);
            if (response) {
                sessionStorage.setItem('user', JSON.stringify(response));
                console.log(response);
                alert("Login successful.");
                if (response.isAdmin) window.location.href = "admin.html";
                else window.location.href = "index.html";
            } else {
                postECBF();
            }
        }

        function postECBF() {
            alert("User not found, Please register!");
        }
    });
});

$('#homeBtn').on('click', function () {
    window.location.href = "../Pages/index.html";
});

$('#forgot-password').on('click', function () {
    window.location.href = "forgotPassword.html";
});

// will become redundant - to be removed later!
const registerPageBtn = document.getElementById("registerPageBtn");

registerPageBtn.addEventListener("click", function () {
    window.location.href = "../Pages/register.html";
});

const authorsBtn = document.getElementById("authorsBtn");
//jquery click event
$(authorsBtn).click(function () {
    window.location.href = "authors.html";
});

const loginBtn = document.getElementById("loginBtn");
$(loginBtn).click(function () {
    window.location.href = "login.html";
});

const logoutbtn = document.getElementById("logoutBtn");

$(logoutbtn).click(function () {
    sessionStorage.clear();
    window.location.reload();
});


const registerbtn = document.getElementById("registerBtn");

$(registerbtn).click(function () {
    window.location.href = "register.html";
});

const myBooks = document.getElementById("myBooksBtn");
$(myBooks).click(function () {
    window.location.href = "myBooks.html";

});


// Check user status and display appropriate buttons
if (user && !user.isAdmin) {
    $('#logoutBtn').show();
    $('#loginBtn').hide();
    $('#registerBtn').hide();
    $('#myBooksBtn').show();
    $('#adminBtn').hide();
} else if (user && user.isAdmin) {
    $('#logoutBtn').show();
    $('#loginBtn').hide();
    $('#registerBtn').hide();
    $('#myBooksBtn').show();
    $('#adminBtn').show();
} else {
    $('#logoutBtn').hide();
    $('#loginBtn').show();
    $('#registerBtn').show();
    $('#myBooksBtn').hide();
    $('#adminBtn').hide();
}