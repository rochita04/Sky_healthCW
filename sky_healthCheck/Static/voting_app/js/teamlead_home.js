document.addEventListener('DOMContentLoaded', async function () {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        alert('⚠️ Please log in first.');
        return;
    }

    const tableBody = document.getElementById('engineer-table-body');
    const barCtx = document.getElementById('individual-bar-chart').getContext('2d');
    const pieCtx = document.getElementById('team-pie-chart').getContext('2d');

    try {
        const res = await fetch('http://localhost:8001/api/users/solution-summary/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const summaryData = await res.json();

        if (!Array.isArray(summaryData)) {
            console.error('❌ Unexpected API response format.');
            return;
        }

        const engineers = summaryData.filter(user => user.member_role === 'Engineer');
        const completedCount = engineers.filter(user => user.quiz_status === true).length;
        const pendingCount = engineers.filter(user => user.quiz_status === false).length;

        // ✅ Table Data
        tableBody.innerHTML = '';
        engineers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.member_name ?? '-'}</td>
                <td class="${user.quiz_status ? 'status-completed' : 'status-pending'}">
                    ${user.quiz_status ? 'Completed' : 'Pending'}
                </td>
            `;
            tableBody.appendChild(row);
        });

        // ✅ Bar Chart Data
        const labels = engineers.map(e => e.member_name ?? '-');
        const scores = engineers.map(e => e.total_score ?? 0);

        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Quiz Score',
                    data: scores,
                    backgroundColor: '#2196F3'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // ✅ Pie Chart Data
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [completedCount, pendingCount],
                    backgroundColor: ['#4CAF50', '#F44336'],
                    hoverOffset: 8
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

    } catch (err) {
        console.error('❌ Error fetching solution summary:', err);
    }
});
