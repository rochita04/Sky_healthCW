document.querySelector('.register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm_password').value.trim();
    const termsAccepted = document.getElementById('terms').checked;
    const messageArea = document.getElementById('message');

    messageArea.textContent = '';

    if (!name || !email || !password || !confirmPassword) {
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ All fields are required.';
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ Please enter a valid email address.';
        return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
        return;
    }

    if (password !== confirmPassword) {
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ Passwords do not match!';
        return;
    }

    if (!termsAccepted) {
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ Please agree to the terms and conditions.';
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8001/api/users/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        console.log('Response from backend:', data);

        if (response.ok) {
            // ✅ Save access token for later use (like fetching roles)
            localStorage.setItem('access_token', data.token.access);
            localStorage.setItem('refresh_token', data.token.refresh);
            localStorage.setItem('available_roles', JSON.stringify(data.available_roles));

            // ✅ Redirect to Role Selection
            window.location.href = roleSelectionURL; // already passed from Django
        } else {
            messageArea.style.color = 'red';
            messageArea.textContent = data.detail || '❌ Registration failed. Please try again.';
        }
    } catch (error) {
        console.error('❌ Error during registration:', error);
        messageArea.style.color = 'red';
        messageArea.textContent = '❌ Could not connect to backend.';
    }
});
