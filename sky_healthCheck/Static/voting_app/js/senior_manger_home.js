// senior_manager_home.js

document.addEventListener('DOMContentLoaded', function () {
    console.log("Senior Manager Dashboard JS Loaded");

    const barChartElement = document.getElementById('barChart');
    const pieChartElement = document.getElementById('pieChart');

    // Ensure both canvas elements exist
    if (!barChartElement || !pieChartElement) {
        console.error("Canvas elements not found in HTML.");
        return;
    }

    // BAR CHART: Performance scores of team leaders
    const barChart = new Chart(barChartElement.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Rochi', 'Test Rochi'],
            datasets: [{
                label: 'Score (%)',
                data: [88, 75],
                backgroundColor: ['#4CAF50', '#2196F3'],
                borderColor: ['#388E3C', '#1976D2'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score %'
                    }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Team Leader Quiz Scores'
                }
            }
        }
    });

    // PIE CHART: Quiz attendance overview
    const pieChart = new Chart(pieChartElement.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['Attended', 'Not Attended'],
            datasets: [{
                data: [2, 1],
                backgroundColor: ['#4CAF50', '#F44336'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Team Leader Quiz Attendance'
                }
            }
        }
    });
});
