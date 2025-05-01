document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return alert('⚠️ Please log in first.');

    try {
        const response = await fetch('http://localhost:8001/api/users/solution-detailed/', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const rawData = await response.json();
        console.log("✅ Data fetched:", rawData);

        // Filter only engineers (role ID = 2)
        const engineerData = rawData.filter(item => item.member === 2); // Update if multiple IDs for role ID 2

        // Overall Color Count
        let overallColors = { green: 0, yellow: 0, red: 0 };

        // Per-Question Color Count
        let questionMap = {};

        // Per-Member Score Summary
        let memberScores = {};

        engineerData.forEach(item => {
            const qText = item.question_text;
            const color = item.color_state.toLowerCase();

            overallColors[color] = (overallColors[color] || 0) + 1;

            if (!questionMap[qText]) {
                questionMap[qText] = { green: 0, yellow: 0, red: 0 };
            }
            questionMap[qText][color] += 1;

            if (!memberScores[item.member]) {
                memberScores[item.member] = {
                    name: item.member_name || 'Unnamed',
                    total: 0,
                    quiz_status: 'Completed' // assume completed if data exists
                };
            }
            memberScores[item.member].total += item.value;
        });

        // ✅ Pie Chart for overall colors
        new Chart(document.getElementById('colorDistributionChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Green', 'Yellow', 'Red'],
                datasets: [{
                    label: 'Overall Responses',
                    data: [overallColors.green, overallColors.yellow, overallColors.red],
                    backgroundColor: ['green', 'yellow', 'red']
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Overall Engineer Response Distribution'
                    }
                }
            }
        });

        // ✅ Color Table
        const colorTable = document.getElementById('color-table-body');
        Object.entries(questionMap).forEach(([question, colors]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${question}</td>
                <td>${colors.green}</td>
                <td>${colors.yellow}</td>
                <td>${colors.red}</td>
            `;
            colorTable.appendChild(row);
        });

        // ✅ Member Score Table
        const scoreTable = document.getElementById('score-summary-body');
        Object.entries(memberScores).forEach(([memberId, info]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${memberId}</td>
                <td>${info.name}</td>
                <td>${info.quiz_status}</td>
                <td><strong>${info.total}</strong></td>
            `;
            scoreTable.appendChild(row);
        });

    } catch (err) {
        console.error("❌ Failed to load data:", err);
        alert('Failed to load summary data. Please check API or access token.');
    }
});
