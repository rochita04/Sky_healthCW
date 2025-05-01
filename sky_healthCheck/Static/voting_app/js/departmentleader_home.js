{% extends 'voting_app/base.html' %}
{% load static %}

{% block title %}Department Summary - Sky Health Check{% endblock %}

{% block content %}
<!-- Header Section -->
<div class="instruction-header-row">
    <div class="logo-left">
        <img src="{% static 'voting_app/images/sky_logo.png' %}" alt="Sky Logo" class="logo-small">
    </div>
    <div class="page-title-center">
        <h1 class="welcome-title">Department Summary</h1>
    </div>
</div>

<!-- Main Content -->
<div class="department-summary-container">

    <!-- Department Info -->
    <h2 class="instruction-title">
        🏢 <strong>Department: Department 1</strong>
    </h2>

    <!-- Table of TL Quiz Attendance -->
    <div class="summary-section">
        <h3>📋 Team Leaders Quiz Participation</h3>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Team Leader Name</th>
                    <th>Team Name</th>
                    <th>Quiz Status</th>
                    <th>Score (%)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>John Doe</td>
                    <td>Team Alpha</td>
                    <td><span class="status-attended">Attended</span></td>
                    <td>85%</td>
                </tr>
                <tr>
                    <td>Jane Smith</td>
                    <td>Team Beta</td>
                    <td><span class="status-not-attended">Not Attended</span></td>
                    <td>—</td>
                </tr>
                <tr>
                    <td>Mike Johnson</td>
                    <td>Team Gamma</td>
                    <td><span class="status-attended">Attended</span></td>
                    <td>78%</td>
                </tr>
                <tr>
                    <td>Emily Davis</td>
                    <td>Team Delta</td>
                    <td><span class="status-attended">Attended</span></td>
                    <td>92%</td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
        <h3>📊 Overall Quiz Performance</h3>

        <!-- Bar Chart -->
        <canvas id="barChart" class="summary-chart"></canvas>

        <!-- Pie Chart -->
        <canvas id="pieChart" class="summary-chart"></canvas>
    </div>
</div>

<!-- Chart.js Library -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Charts Script -->
<script>
    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['John Doe', 'Mike Johnson', 'Emily Davis'],
            datasets: [{
                label: 'Quiz Score (%)',
                data: [85, 78, 92],
                backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Attended', 'Not Attended'],
            datasets: [{
                data: [3, 1],
                backgroundColor: ['#4CAF50', '#F44336'],
                hoverOffset: 4
            }]
        }
    });
</script>

<!-- Link to your existing CSS -->
<link rel="stylesheet" href="{% static 'voting_app/css/style.css' %}">
{% endblock %}
