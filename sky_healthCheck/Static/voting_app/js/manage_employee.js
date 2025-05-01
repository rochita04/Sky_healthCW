document.addEventListener('DOMContentLoaded', function () {
    const roleTypeSelect = document.getElementById('role-type');
    const dynamicFields = document.getElementById('dynamic-fields');
    const messageArea = document.getElementById('message');
    const accessToken = localStorage.getItem('access_token');

    const addRoleBtn = document.getElementById('add-role-btn');
    const newRoleInput = document.getElementById('new-role-name');
    const updateBtn = document.getElementById('update-btn');
    const addBtn = document.getElementById('add-btn');

    let currentMode = '';

    const roleNameToId = {
        engineer: 2,
        team_leader: 3,
        department_leader: 4,
        senior_manager: 5
    };

    function showMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.className = type === 'error' ? 'error-message' : 'success-message';
        setTimeout(() => {
            messageArea.textContent = '';
            messageArea.className = '';
        }, 3000);
    }

    async function loadRoles() {
        try {
            const response = await fetch('http://127.0.0.1:8001/api/users/get-roles/', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const roles = await response.json();
            if (response.ok) {
                populateRoleOptions(roles);
            } else {
                showMessage('❌ Failed to load roles.', 'error');
            }
        } catch (error) {
            console.error('Error loading roles:', error);
            showMessage('❌ Could not connect to server.', 'error');
        }
    }

    function populateRoleOptions(roles) {
        roleTypeSelect.innerHTML = '<option value="">-- Choose Role --</option>';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.name.toLowerCase().replace(/\s+/g, '_');
            option.textContent = role.name;
            roleTypeSelect.appendChild(option);
        });
    }

    function renderFields(role) {
        dynamicFields.classList.add('hide');
        setTimeout(() => {
            dynamicFields.innerHTML = `
                <h2>🛠️ Update User Details</h2>
                <input type="text" id="user-id" class="input-box" placeholder="User ID">
                <input type="text" id="user-name" class="input-box" placeholder="Full Name">
                <input type="email" id="user-email" class="input-box" placeholder="Email ID">
                <input type="text" id="user-member-id" class="input-box" placeholder="Member ID">
                <input type="text" id="user-team-id" class="input-box" placeholder="Team ID">
                <label><input type="checkbox" id="user-quiz-status"> Quiz Completed</label>
                <label><input type="checkbox" id="user-role-approval"> Role Approved</label>
                <input type="text" id="user-role-id" class="input-box" placeholder="Role ID (Optional)">
            `;
            dynamicFields.classList.remove('hide');
            dynamicFields.classList.add('show');
        }, 200);
    }

    if (addRoleBtn) {
        addRoleBtn.addEventListener('click', async function () {
            const newRoleName = newRoleInput.value.trim();
            if (!newRoleName) {
                showMessage('⚠️ Please enter a role name.', 'error');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:8001/api/users/create-roles/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ name: newRoleName })
                });

                if (response.ok) {
                    showMessage(`✅ Role "${newRoleName}" created successfully!`, 'success');
                    newRoleInput.value = '';
                    loadRoles();
                } else {
                    const data = await response.json();
                    showMessage(data.detail || '❌ Failed to create role.', 'error');
                }
            } catch (error) {
                console.error('Error creating role:', error);
                showMessage('❌ Could not connect to server.', 'error');
            }
        });
    }

    if (addBtn) {
        addBtn.addEventListener('click', function () {
            currentMode = 'add';
            roleTypeSelect.value = '';
            dynamicFields.innerHTML = `
                <h2>🔵 Add New User</h2>
                <input type="text" id="add-name" class="input-box" placeholder="Full Name">
                <input type="email" id="add-email" class="input-box" placeholder="Email Address">
                <select id="add-role" class="input-box">
                    <option value="">-- Select Role --</option>
                    <option value="engineer">Engineer</option>
                    <option value="team_leader">Team Leader</option>
                    <option value="department_leader">Department Leader</option>
                    <option value="senior_manager">Senior Manager</option>
                </select>
                <input type="password" id="add-password" class="input-box" placeholder="Password">
                <input type="password" id="add-confirm-password" class="input-box" placeholder="Confirm Password">
                <button id="submit-add-user" class="btn-primary-custom">Submit User</button>
            `;

            const submitAddUserBtn = document.getElementById('submit-add-user');
            if (submitAddUserBtn) {
                submitAddUserBtn.addEventListener('click', handleAddUser);
            }
        });
    }

    async function handleAddUser() {
        const name = document.getElementById('add-name')?.value.trim();
        const email = document.getElementById('add-email')?.value.trim();
        const role = document.getElementById('add-role')?.value.trim();
        const password = document.getElementById('add-password')?.value.trim();
        const confirmPassword = document.getElementById('add-confirm-password')?.value.trim();

        if (password !== confirmPassword) {
            showMessage('⚠️ Passwords do not match.', 'error');
            return;
        }

        const roleId = roleNameToId[role];
        if (!roleId) {
            showMessage('⚠️ Invalid role selected.', 'error');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8001/api/users/signup/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role_id: roleId
                })
            });

            if (response.ok) {
                showMessage('✅ User registered successfully!', 'success');
                dynamicFields.innerHTML = '';
            } else {
                const data = await response.json();
                showMessage(data.detail || '❌ Failed to register user.', 'error');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            showMessage('❌ Could not connect to server.', 'error');
        }
    }

    if (updateBtn) {
        updateBtn.addEventListener('click', async function () {
            const id = document.getElementById('user-id')?.value.trim();
            const name = document.getElementById('user-name')?.value.trim();
            const email = document.getElementById('user-email')?.value.trim();
            const memberID = document.getElementById('user-member-id')?.value.trim();
            const teamID = document.getElementById('user-team-id')?.value.trim();
            const quizStatus = document.getElementById('user-quiz-status')?.checked;
            const roleApproval = document.getElementById('user-role-approval')?.checked;
            const roleId = document.getElementById('user-role-id')?.value.trim();

            if (!id) {
                showMessage('⚠️ User ID is mandatory to update.', 'error');
                return;
            }

            const bodyData = {
                id: parseInt(id),
                quiz_status: quizStatus,
                role_approval: roleApproval
            };

            if (name) bodyData.name = name;
            if (email) bodyData.email = email;
            if (memberID) bodyData.memberID = memberID;
            if (teamID) bodyData.team_id = teamID;
            if (roleId) bodyData.role_id = parseInt(roleId);

            try {
                const response = await fetch(`http://127.0.0.1:8001/api/users/update-profile/?user_id=${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyData)
                });

                if (response.ok) {
                    showMessage('✅ User updated successfully!', 'success');
                } else {
                    const data = await response.json();
                    showMessage(data.detail || '❌ Failed to update user.', 'error');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                showMessage('❌ Could not connect to server.', 'error');
            }
        });
    }

    if (roleTypeSelect) {
        roleTypeSelect.addEventListener('change', function () {
            if (!roleTypeSelect.value) {
                dynamicFields.innerHTML = '';
                dynamicFields.classList.remove('show');
                dynamicFields.classList.add('hide');
                return;
            }
            currentMode = 'update';
            renderFields(roleTypeSelect.value);
        });
    }

    loadRoles();
});
