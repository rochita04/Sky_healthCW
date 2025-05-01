document.addEventListener('DOMContentLoaded', function () {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) return alert('⚠️ Please log in first.');

    const tableBody = document.querySelector('#users-table tbody');
    const updateBtn = document.getElementById('submit-update');
    const updateMsg = document.getElementById('update-message');

    // Track toggle button selections
    let roleApproval = null;
    let quizStatus = null;
    let activeStatus = null;

    // Handle Toggle Buttons and Visual Feedback
    const roleApproveYes = document.getElementById('role-approve-yes');
    const roleApproveNo = document.getElementById('role-approve-no');
    const quizStatusYes = document.getElementById('quiz-status-yes');
    const quizStatusNo = document.getElementById('quiz-status-no');
    const activeYes = document.getElementById('active-yes');
    const activeNo = document.getElementById('active-no');

    function resetButtons() {
        [roleApproveYes, roleApproveNo, quizStatusYes, quizStatusNo, activeYes, activeNo].forEach(btn => {
            btn.style.backgroundColor = '';
            btn.style.color = '';
        });
    }

    roleApproveYes.onclick = () => {
        roleApproval = true;
        resetButtons();
        roleApproveYes.style.backgroundColor = 'black';
        roleApproveYes.style.color = 'white';
    };

    roleApproveNo.onclick = () => {
        roleApproval = false;
        resetButtons();
        roleApproveNo.style.backgroundColor = 'black';
        roleApproveNo.style.color = 'white';
    };

    quizStatusYes.onclick = () => {
        quizStatus = true;
        resetButtons();
        quizStatusYes.style.backgroundColor = 'black';
        quizStatusYes.style.color = 'white';
    };

    quizStatusNo.onclick = () => {
        quizStatus = false;
        resetButtons();
        quizStatusNo.style.backgroundColor = 'black';
        quizStatusNo.style.color = 'white';
    };

    activeYes.onclick = () => {
        activeStatus = true;
        resetButtons();
        activeYes.style.backgroundColor = 'black';
        activeYes.style.color = 'white';
    };

    activeNo.onclick = () => {
        activeStatus = false;
        resetButtons();
        activeNo.style.backgroundColor = 'black';
        activeNo.style.color = 'white';
    };

    // 🔄 Fetch and display all users
    fetch('http://localhost:8001/api/users/customusers/', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    .then(res => res.json())
    .then(users => {
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.name ?? '-'}</td>
                <td>${user.memberID ?? '-'}</td>
                <td>${user.quiz_status ? '✅' : '❌'}</td>
                <td>${user.role_approval ? '✅' : '❌'}</td>
                <td>${user.role?.name ?? '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    });

    // 🔧 Handle Update User Logic
    updateBtn.addEventListener('click', () => {
        const userId = document.getElementById('update-user-id').value.trim();
        if (!userId) return alert('⚠️ User ID is required');

        const payload = {};
        const memberID = document.getElementById('update-member-id').value.trim();
        const teamID = document.getElementById('update-team-id').value.trim();

        if (memberID) payload.memberID = memberID;
        if (roleApproval !== null) payload.role_approval = roleApproval;
        if (quizStatus !== null) payload.quiz_status = quizStatus;
        if (teamID) payload.team = parseInt(teamID);
        if (activeStatus !== null) payload.is_active = activeStatus;

        updateBtn.disabled = true;
        updateBtn.textContent = '⏳ Updating...';

        fetch(`http://localhost:8001/api/users/customusers/${userId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Update failed');
            return res.json();
        })
        .then(data => {
            updateMsg.style.color = 'green';
            updateMsg.textContent = '✅ Update successful!';
            setTimeout(() => location.reload(), 1000);
        })
        .catch(err => {
            updateBtn.disabled = false;
            updateBtn.textContent = 'Update User';
            updateMsg.style.color = 'red';
            updateMsg.textContent = '❌ Update failed.';
            console.error(err);
        });
    });
});
