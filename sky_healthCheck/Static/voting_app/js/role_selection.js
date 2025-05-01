document.addEventListener('DOMContentLoaded', function () {
    const roleDropdown = document.getElementById('role-select');
    const assignRoleBtn = document.getElementById('assign-role-btn');
    const messageArea = document.getElementById('message');

    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        alert('⚠️ No access token found. Please register/login again.');
        window.location.href = '/register/';
        return;
    }

    // 🎯 Fetch Roles
    async function fetchRoles() {
        try {
            const response = await fetch('http://localhost:8001/api/users/get-roles/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.ok) {
                const roles = await response.json();
                roleDropdown.innerHTML = '<option value="">-- Select a Role --</option>'; // Reset

                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.id;
                    option.textContent = role.name;
                    roleDropdown.appendChild(option);
                });
            } else {
                messageArea.style.color = 'red';
                messageArea.textContent = '❌ Failed to load roles.';
                console.error('Fetch Roles error:', await response.json());
            }
        } catch (error) {
            console.error('❌ Error loading roles:', error);
            messageArea.style.color = 'red';
            messageArea.textContent = '❌ Error fetching roles.';
        }
    }

    fetchRoles(); // ✅ Call immediately

    roleDropdown.addEventListener('change', () => {
        assignRoleBtn.disabled = roleDropdown.value === '';
    });

    // 🚀 Assign Role
    assignRoleBtn.addEventListener('click', async function () {
        const selectedRoleId = roleDropdown.value;

        if (!selectedRoleId) {
            messageArea.style.color = 'red';
            messageArea.textContent = '❌ Please select a role first.';
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/api/users/assign-role/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ role_id: selectedRoleId })
            });

            const result = await response.json();

            if (response.ok) {
                messageArea.style.color = 'green';
                messageArea.textContent = '✅ Role assigned successfully! Redirecting...';
                setTimeout(() => {
                    window.location.href = '/account-verification/'; // ✅ Redirect to account_verification page
                }, 1500);
            } else {
                messageArea.style.color = 'red';
                messageArea.textContent = result.detail || '❌ Failed to assign role.';
                console.error('Assign role error:', result);
            }
        } catch (error) {
            console.error('❌ Error assigning role:', error);
            messageArea.style.color = 'red';
            messageArea.textContent = '❌ Error while assigning role.';
        }
    });
});
