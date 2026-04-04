/* ════════════════════════════════════════
   DASHBOARD PAGE JAVASCRIPT
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Load Real Stats
  const stats = DashboardSummary.getStats();
  const statContainers = document.querySelectorAll('.stat-card');
  
  if (statContainers[0]) { // Income
    const el = statContainers[0].querySelector('.stat-value');
    el.textContent = formatCurrency(stats.profit);
  }
  if (statContainers[1]) { // Bank
    const el = statContainers[1].querySelector('.stat-value');
    el.textContent = formatCurrency(stats.bankBal);
  }
  if (statContainers[2]) { // Pending
    const el = statContainers[2].querySelector('.stat-value');
    el.textContent = formatCurrency(stats.pending);
  }
  if (statContainers[3]) { // Members
    const el = statContainers[3].querySelector('.stat-value');
    const label = statContainers[3].querySelector('.stat-label');
    label.textContent = 'Total Members';
    el.textContent = stats.members;
  }

  // 2. Sample Charts (Keep as they are for visual demo but using stats)
  if (document.getElementById('sparkline')) {
    new Chart(document.getElementById('sparkline'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          data: [42000, 38000, 51000, 48000, 55000, 62000],
          fill: true,
          backgroundColor: 'rgba(124,92,191,0.1)',
          borderColor: '#7C5CBF',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }

  // Income Doughnut Chart
  if (document.getElementById('incChart')) {
    new Chart(document.getElementById('incChart'), {
      type: 'doughnut',
      data: {
        labels: ['Flats', 'Parking', 'Others'],
        datasets: [{
          data: [85000, 3515, 3500],
          backgroundColor: ['#7C5CBF', '#22C55E', '#F59E0B'],
          borderWidth: 0,
          cutout: '65%'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
});
