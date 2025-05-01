// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {

    // Bar Chart Configuration
    const barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['rochi', 'rochi', 'rochi'],
            datasets: [{
                label: 'Quiz Score (%)',
                data: [85, 78, 92],
                backgroundColor: [
                    '#4CAF50',  // Green
                    '#FFC107',  // Amber
                    '#2196F3'   // Blue
                ],
                borderColor: [
                    '#388E3C',
                    '#FFA000',
                    '#1976D2'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Pie Chart Configuration
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Attended', 'Not Attended'],
            datasets: [{
                data: [3, 1],
                backgroundColor: [
                    '#4CAF50', // Green
                    '#F44336'  // Red
                ],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

});
