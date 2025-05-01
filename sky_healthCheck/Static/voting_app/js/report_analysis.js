document.addEventListener('DOMContentLoaded', async function () {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        alert('⚠️ Please log in first.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8001/api/users/solution-summary/', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const summaryData = await response.json();
        console.log('✅ API Response:', summaryData);

        // ✅ Prepare data for chart
        const labels = summaryData.map(item => item.member_name || `ID ${item.member_id}`);
        const scores = summaryData.map(item => item.total_score);

        // ✅ Team Performance Chart
        const teamCtx = document.getElementById('teamPerformanceChart').getContext('2d');
        new Chart(teamCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Score',
                    data: scores,
                    backgroundColor: '#00d1b2'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Overall Member Scores'
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // ✅ Department Performance Chart (same data reused)
        const deptCtx = document.getElementById('departmentPerformanceChart').getContext('2d');
        new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Score',
                    data: scores,
                    backgroundColor: '#ff6384'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Department Performance'
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // ✅ Update the report table
        const tableBody = document.querySelector('.report-table tbody');
        tableBody.innerHTML = ''; // Clear old rows first
        summaryData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.member_id}</td>
                <td>${item.member_name || 'Unnamed'}</td>
                <td>Engineer</td>
                <td class="status-completed">Completed</td>
                <td>Team A</td>
                <td><strong>${item.total_score}</strong></td> <!-- ✅ Correct Score here -->
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('❌ Error loading summary:', error);
        alert('❌ Failed to load report data. Please try again.');
    }
});
