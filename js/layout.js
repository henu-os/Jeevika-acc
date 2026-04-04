/* ════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — DYNAMIC LAYOUT ENGINE
   Ensures all pages have a consistent premium feel.
   ════════════════════════════════════════════════ */

const JeevikaLayout = {
  // Common Nav items
  navItems: [
    { name: 'Dashboard', icon: '📊', url: 'dashboard.html' },
    { name: 'Masters', icon: '📋', url: 'masters.html' },
    { name: 'Transactions', icon: '💰', url: 'transactions.html' },
    { name: 'Reports', icon: '📈', url: 'reports.html' },
    { name: 'Communication', icon: '💬', url: 'communication.html' },
    { name: 'Utilities', icon: '🔧', url: 'utilities.html' },
    { name: 'Billing Utilities', icon: '🧾', url: 'billing-utilities.html' },
    { name: 'Stat. Compliance', icon: '⚖️', url: 'statutory.html' },
    { name: 'Forms & Audit', icon: '📝', url: 'forms-audit.html' },
    { name: 'Access & Security', icon: '🔐', url: 'access-security.html' }
  ],

  injectSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const page = window.location.pathname.split('/').pop() || 'dashboard.html';
    
    let html = `
      <div class="sidebar-logo">
        <div class="logo-icon">J</div>
        <div class="logo-text"><h2>jeevika</h2><span>accounting</span></div>
      </div>
      <nav class="sidebar-nav">`;

    this.navItems.forEach(item => {
      const active = (item.url === page) ? 'active' : '';
      html += `<div class="nav-item"><a href="${item.url}" class="${active}"><span class="icon">${item.icon}</span> ${item.name}</a></div>`;
    });

    html += `
        <div class="sidebar-section">───────────</div>
        <div class="sidebar-bottom">
          <div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div>
          <div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help & Documentation</a></div>
        </div>
      </nav>`;

    sidebar.innerHTML = html;
  },

  injectTopbar() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const session = JeevikaAuth.getSession() || { name: 'Admin', role: 'Super Admin', avatar: 'A' };
    const pageTitle = document.title.split(' — ')[0];

    topbar.innerHTML = `
      <div class="topbar-left">
        <button class="hamburger">☰</button>
        <div>
          <div class="page-title">${pageTitle}</div>
          <div class="breadcrumb">Home / ${pageTitle}</div>
        </div>
      </div>
      <div class="topbar-center">
        <div class="search-wrap"><input type="text" class="search-bar" placeholder="Search system..."></div>
      </div>
      <div class="topbar-right">
        <span class="topbar-date" id="currentDate">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <button class="topbar-icon">🔔<span class="notif-badge">3</span></button>
        <button class="topbar-icon" title="Switch Year" onclick="location.href='select-year.html'">\u{1F4C2}</button>
        <div class="topbar-profile" onclick="toggleProfileMenu()">
          <div class="avatar">${session.avatar}</div>
          <div class="profile-info"><div class="name">${session.name}</div><div class="role">${session.role}</div></div>
          <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">▼</span>
        </div>
      </div>
    `;

    const breadcrumb = topbar.querySelector('.breadcrumb');
    const activeSoc = JSON.parse(localStorage.getItem('jeevika_active_society') || '{}');
    if (activeSoc.name && breadcrumb) {
        breadcrumb.innerHTML = `<span style="color:var(--accent); font-weight:700;">\u{1F3E2} ${activeSoc.name}</span> | <span style="font-weight:600;">\u{1F4C5} ${activeSoc.financialYear || 'FY Not Selected'}</span>`;
    }
  },

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.injectSidebar();
      this.injectTopbar();
    });
  }
};

JeevikaLayout.init();
