document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', function () {
        // Redirect to the login page
        window.location.href = '/login/';  // Update if your login page URL is different
    });
});
