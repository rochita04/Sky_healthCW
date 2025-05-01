document.querySelector('.login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageArea = document.getElementById('message');
    messageArea.textContent = '';  // Clear previous messages

    try {
        const response = await fetch('http://127.0.0.1:8001/api/users/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        console.log('Login Response:', data);

        if (response.ok) {
            const roleId = data.user.role ? data.user.role.id : null;

            // ✅ Store tokens
            localStorage.setItem('access_token', data.token.access);
            localStorage.setItem('refresh_token', data.token.refresh);

            // ✅ Store entire user object globally
            localStorage.setItem('user_info', JSON.stringify(data.user));

            console.log('Stored user info:', localStorage.getItem('user_info'));

            // ✅ Redirect based on role.id
            switch (roleId) {
                case 1:
                    window.location.href = '/dashboard/';                  // Admin
                    break;
                case 2:
                    window.location.href = '/quiz/instruction/';           // Engineer
                    break;
                case 3:
                    window.location.href = '/teamleader/home/';            // Team Leader
                    break;
                case 4:
                    window.location.href = '/departmentleader/home/';      // Department Leader
                    break;
                case 5:
                    window.location.href = '/seniormanager/home/';         // Senior Manager
                    break;
                default:
                    messageArea.style.color = 'red';
                    messageArea.textContent = '❌ Unknown role. Please contact admin.';
                    console.error('Unknown role ID:', roleId);
            }
        } else {
            messageArea.style.color = 'red';
            messageArea.textContent = data.detail || '❌ Invalid email or password.';
        }
    } catch (error) {
        console.error('Login error:', error);
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ Could not connect to the backend. Please check the server.';
    }
});
