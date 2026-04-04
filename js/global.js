/* ════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — GLOBAL JAVASCRIPT v2.0
   Full-featured: Auth, Export, Print, UI
   ════════════════════════════════════════════════ */

// ─── AUTH SYSTEM (localStorage) ───
const JeevikaAuth = {
  USERS_KEY: 'jeevika_users',
  SESSION_KEY: 'jeevika_session',
  init() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([
        { id: 1, name: 'Admin', email: 'admin@jeevika.com', password: 'admin123', role: 'Super Admin', avatar: 'A', lastLogin: null },
        { id: 2, name: 'Ramesh', email: 'ramesh@jeevika.com', password: 'ramesh123', role: 'Accountant', avatar: 'R', lastLogin: null },
        { id: 3, name: 'Suresh', email: 'suresh@jeevika.com', password: 'suresh123', role: 'Data Entry', avatar: 'S', lastLogin: null }
      ]));
    }
  },
  login(email, password) {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      user.lastLogin = new Date().toISOString();
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      localStorage.setItem(this.SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, role: user.role, avatar: user.avatar, loginTime: new Date().toISOString() }));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password' };
  },
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  },
  getSession() {
    const s = localStorage.getItem(this.SESSION_KEY);
    return s ? JSON.parse(s) : null;
  },
  isLoggedIn() { return !!this.getSession(); },
  checkAuth() {
    const page = window.location.pathname.split('/').pop();
    if (page !== 'login.html' && !this.isLoggedIn()) {
      window.location.href = 'login.html';
    }
  },
  updateUI() {
    const session = this.getSession();
    if (!session) return;
    const nameEl = document.querySelector('.topbar-profile .name');
    const roleEl = document.querySelector('.topbar-profile .role');
    const avatarEl = document.querySelector('.topbar-profile .avatar');
    if (nameEl) nameEl.textContent = session.name;
    if (roleEl) roleEl.textContent = session.role;
    if (avatarEl) avatarEl.textContent = session.avatar;

    this.syncSocietyInfo();
  },
  syncSocietyInfo() {
    const activeSoc = JSON.parse(localStorage.getItem('jeevika_active_society') || '{}');
    const breadcrumb = document.querySelector('.breadcrumb');
    if (activeSoc.name && breadcrumb) {
        breadcrumb.innerHTML = `<span style="color:var(--accent); font-weight:700;">\u{1F3E2} ${activeSoc.name}</span> | <span style="font-weight:600;">\u{1F4C5} ${activeSoc.financialYear || 'FY Not Selected'}</span>`;
    }
  }
};
JeevikaAuth.init();

// ─── DATE DISPLAY ───
(function setDate() {
  const el = document.getElementById('currentDate');
  if (el) el.textContent = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
})();

// ─── ACTIVE NAV HIGHLIGHTING ───
document.querySelectorAll('.sidebar-nav a').forEach(link => {
  const href = link.getAttribute('href');
  const page = window.location.pathname.split('/').pop();
  if (href === page) {
    document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  }
});

// ─── SIDEBAR TOGGLE (Mobile) ───
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.getElementById('sidebar');
  if (hamburger && sidebar) hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
});

// ─── NOTIFICATION DROPDOWN ───
function toggleNotifications() { const dd = document.getElementById('notifDropdown'); if (dd) dd.classList.toggle('show'); }
document.addEventListener('click', e => { const dd = document.getElementById('notifDropdown'); if (dd && !e.target.closest('.topbar-icon') && !e.target.closest('.notif-dropdown')) dd.classList.remove('show'); });

// ─── CURRENCY FORMATTING ───
function formatCurrency(amount) { return '\u20B9' + new Intl.NumberFormat('en-IN').format(amount); }

// ─── ANIMATED COUNTERS ───
function animateCounter(el, target, duration = 1500) {
  let start = 0; const step = target / (duration / 16);
  const timer = setInterval(() => { start += step; if (start >= target) { start = target; clearInterval(timer); } el.textContent = formatCurrency(Math.floor(start)); }, 16);
}
function initCounters() { document.querySelectorAll('.stat-value[data-target]').forEach(el => animateCounter(el, parseInt(el.dataset.target))); }

// ─── TOAST NOTIFICATIONS ───
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '\u2705' : type === 'warning' ? '\u26A0\uFE0F' : type === 'error' ? '\u274C' : '\u2139\uFE0F'}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ─── CONFIRM DIALOG ───
function confirmDelete(message = 'Are you sure you want to delete this?') {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay open';
    overlay.innerHTML = `<div class="confirm-dialog"><h3>\u26A0\uFE0F Confirm</h3><p>${message}</p><div class="btn-group" style="justify-content:center"><button class="btn-secondary" id="confirmCancel">Cancel</button><button class="btn-danger" id="confirmOk">Confirm</button></div></div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#confirmCancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#confirmOk').onclick = () => { overlay.remove(); resolve(true); };
    overlay.onclick = e => { if (e.target === overlay) { overlay.remove(); resolve(false); } };
  });
}

// ═══════════════════════════════════════════════
// EXPORT SYSTEM — PDF, Excel, CSV, XML, XLSX
// ═══════════════════════════════════════════════
const JeevikaExport = {
  // Get table data as array of arrays
  getTableData(tableEl) {
    if (typeof tableEl === 'string') tableEl = document.querySelector(tableEl);
    if (!tableEl) return { headers: [], rows: [] };
    const headers = []; const rows = [];
    tableEl.querySelectorAll('thead th').forEach(th => headers.push(th.textContent.trim()));
    tableEl.querySelectorAll('tbody tr').forEach(tr => {
      const row = [];
      tr.querySelectorAll('td').forEach(td => row.push(td.textContent.trim()));
      if (row.length > 0) rows.push(row);
    });
    return { headers, rows };
  },

  // CSV Export
  toCSV(tableEl, filename = 'jeevika_export') {
    const { headers, rows } = this.getTableData(tableEl);
    let csv = '\uFEFF'; // BOM for Excel UTF-8
    csv += headers.map(h => `"${h}"`).join(',') + '\n';
    rows.forEach(r => { csv += r.map(c => `"${c.replace(/"/g, '""')}"`).join(',') + '\n'; });
    this.download(csv, filename + '.csv', 'text/csv;charset=utf-8');
    showToast('CSV downloaded: ' + filename + '.csv');
  },

  // XML Export
  toXML(tableEl, filename = 'jeevika_export') {
    const { headers, rows } = this.getTableData(tableEl);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
    rows.forEach(r => {
      xml += '  <record>\n';
      headers.forEach((h, i) => { const tag = h.replace(/[^a-zA-Z0-9]/g, '_'); xml += `    <${tag}>${this.escapeXml(r[i] || '')}</${tag}>\n`; });
      xml += '  </record>\n';
    });
    xml += '</data>';
    this.download(xml, filename + '.xml', 'application/xml');
    showToast('XML downloaded: ' + filename + '.xml');
  },

  // Excel/XLSX Export (HTML-based .xls that Excel can open)
  toExcel(tableEl, filename = 'jeevika_export') {
    if (typeof tableEl === 'string') tableEl = document.querySelector(tableEl);
    if (!tableEl) { showToast('No data table found', 'error'); return; }
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>td,th{border:1px solid #ccc;padding:6px 10px;font-size:12px;font-family:Calibri}th{background:#2D1B69;color:white;font-weight:bold}.amount{text-align:right}</style></head><body><table>${tableEl.innerHTML}</table></body></html>`;
    const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel' });
    this.downloadBlob(blob, filename + '.xls');
    showToast('Excel downloaded: ' + filename + '.xls');
  },

  // XLSX Export (via simple HTML table)
  toXLSX(tableEl, filename = 'jeevika_export') {
    this.toExcel(tableEl, filename); // Same approach, opens in Excel
  },

  // PDF Export (print-to-PDF approach)
  toPDF(elementId, filename = 'jeevika_export') {
    const el = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
    if (!el) { showToast('No content to export', 'error'); return; }
    const pw = window.open('', '_blank');
    pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename} - Jeevika Accounting</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:"Plus Jakarta Sans",sans-serif;padding:30px;color:#1A0F4F;font-size:13px}
      .print-header{text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #2D1B69}
      .print-header h1{font-size:18px;color:#2D1B69;font-weight:800}
      .print-header p{font-size:11px;color:#666}
      table{width:100%;border-collapse:collapse;margin:12px 0}
      th{background:#2D1B69;color:white;padding:10px 12px;text-align:left;font-weight:700;font-size:12px}
      td{padding:8px 12px;border-bottom:1px solid #e0e0e0;font-size:12px}
      tr:nth-child(even){background:#f8f7ff}
      .amount{text-align:right;font-variant-numeric:tabular-nums}
      .badge{padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600}
      .print-footer{margin-top:24px;padding-top:12px;border-top:1px solid #ccc;display:flex;justify-content:space-between;font-size:10px;color:#999}
      @media print{body{padding:15px}.print-header{margin-bottom:16px}}
    </style></head><body>
    <div class="print-header"><h1>Shree Sai Usha Complex Co-op Housing Society Ltd.</h1><p>Regd. No. BOM/HSG/4567 of 2010 | Andheri West, Mumbai - 400058</p><p style="margin-top:8px;font-size:14px;font-weight:700;color:#2D1B69">${document.querySelector('.page-title')?.textContent || filename}</p></div>
    ${el.innerHTML}
    <div class="print-footer"><span>Generated by Jeevika Accounting</span><span>Date: ${new Date().toLocaleDateString('en-IN')}</span><span>Page 1</span></div>
    </body></html>`);
    pw.document.close();
    setTimeout(() => { pw.print(); }, 500);
    showToast('PDF ready for print/save');
  },

  // Utility: Download text content
  download(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  },
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  },
  escapeXml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },

  // Show export dropdown menu
  showMenu(event, tableSelector, filenameBase) {
    event.stopPropagation();
    document.querySelectorAll('.export-dropdown').forEach(d => d.remove());
    const btn = event.currentTarget;
    const dd = document.createElement('div');
    dd.className = 'export-dropdown';
    dd.innerHTML = `
      <div class="export-dropdown-header">Export / Download</div>
      <button onclick="JeevikaExport.toPDF('${tableSelector}','${filenameBase}')"><span>\u{1F4C4}</span> PDF (Print)</button>
      <button onclick="JeevikaExport.toExcel('${tableSelector}','${filenameBase}')"><span>\u{1F4CA}</span> Excel (.xls)</button>
      <button onclick="JeevikaExport.toXLSX('${tableSelector}','${filenameBase}')"><span>\u{1F4CA}</span> XLSX</button>
      <button onclick="JeevikaExport.toCSV('${tableSelector}','${filenameBase}')"><span>\u{1F4CB}</span> CSV</button>
      <button onclick="JeevikaExport.toXML('${tableSelector}','${filenameBase}')"><span>\u{1F4C1}</span> XML</button>
      <div class="export-dropdown-sep"></div>
      <button onclick="printSection('${tableSelector}')"><span>\u{1F5A8}\uFE0F</span> Print Preview</button>`;
    btn.style.position = 'relative';
    btn.appendChild(dd);
    setTimeout(() => dd.classList.add('show'), 10);
    const close = (e) => { if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('click', close); } };
    setTimeout(() => document.addEventListener('click', close), 50);
  }
};

// Shortcuts
function exportCSV(t, f) { JeevikaExport.toCSV(t, f); }
function exportExcel(t, f) { JeevikaExport.toExcel(t, f); }
function exportPDF(id, f) { JeevikaExport.toPDF(id, f); }
function exportXML(t, f) { JeevikaExport.toXML(t, f); }

// ─── ENHANCED PRINT ───
function printSection(elementId) {
  JeevikaExport.toPDF(elementId, document.querySelector('.page-title')?.textContent || 'report');
}

// ─── TABS ───
function switchTab(tabGroup, tabId) {
  document.querySelectorAll(`[data-tab-group="${tabGroup}"]`).forEach(t => t.classList.remove('active'));
  document.querySelectorAll(`[data-tab-btn="${tabGroup}"]`).forEach(b => b.classList.remove('active'));
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  const ab = document.querySelector(`[data-tab-btn="${tabGroup}"][data-tab="${tabId}"]`);
  if (ab) ab.classList.add('active');
}

// ─── DRAWER ───
function openDrawer(id) { const o = document.getElementById(id + '-overlay'), d = document.getElementById(id); if (o) o.classList.add('open'); if (d) d.classList.add('open'); }
function closeDrawer(id) { const o = document.getElementById(id + '-overlay'), d = document.getElementById(id); if (o) o.classList.remove('open'); if (d) d.classList.remove('open'); }

// ─── MODAL ───
function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

// ─── DYNAMIC TABLE ROW ───
function addTableRow(tableId, template) { const tb = document.querySelector(`#${tableId} tbody`); if (!tb) return; const tr = document.createElement('tr'); tr.innerHTML = template; tb.appendChild(tr); showToast('Row added', 'info'); }
function removeTableRow(btn) { const tr = btn.closest('tr'); if (tr) { tr.style.opacity = '0'; tr.style.transform = 'translateX(20px)'; setTimeout(() => tr.remove(), 200); } }

// ─── INIT SELECT2 ───
function initSelect2() { if (typeof $ !== 'undefined' && $.fn.select2) $('select.select2').select2({ placeholder: 'Select...', allowClear: true, width: '100%' }); }

// ─── INIT FLATPICKR ───
function initFlatpickr() {
  if (typeof flatpickr !== 'undefined') {
    document.querySelectorAll('.date-picker').forEach(el => flatpickr(el, { dateFormat: 'd/m/Y', allowInput: true }));
    document.querySelectorAll('.month-picker').forEach(el => flatpickr(el, { dateFormat: 'F Y' }));
  }
}

// ─── FORM VALIDATION ───
function validateRequired(formId) {
  const form = document.getElementById(formId); if (!form) return false;
  let valid = true;
  form.querySelectorAll('[required]').forEach(f => { if (!f.value.trim()) { f.classList.add('error'); valid = false; } else f.classList.remove('error'); });
  if (!valid) showToast('Please fill all required fields', 'error');
  return valid;
}

// ─── SEARCH TABLE ───
function searchTable(inputEl, tableId) {
  const filter = inputEl.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(filter) ? '' : 'none';
  });
}

// ─── PROFILE DROPDOWN ───
function toggleProfileMenu() {
  let dd = document.getElementById('profileDropdown');
  if (dd) { dd.remove(); return; }
  dd = document.createElement('div');
  dd.id = 'profileDropdown';
  dd.className = 'profile-dropdown show';
  const session = JeevikaAuth.getSession();
  dd.innerHTML = `
    <div class="pd-header"><div class="avatar" style="width:40px;height:40px">${session?.avatar || 'A'}</div><div><div style="font-weight:700">${session?.name || 'Admin'}</div><div style="font-size:11px;color:var(--text-muted)">${session?.role || 'Super Admin'}</div></div></div>
    <div class="pd-sep"></div>
    <button onclick="location.href='access-security.html'"><span>\u{1F464}</span> My Profile</button>
    <button onclick="location.href='access-security.html'"><span>\u2699\uFE0F</span> Settings</button>
    <button onclick="location.href='help.html'"><span>\u2753</span> Help</button>
    <div class="pd-sep"></div>
    <button onclick="JeevikaAuth.logout()" style="color:var(--danger)"><span>\u{1F6AA}</span> Logout</button>`;
  document.querySelector('.topbar-profile').appendChild(dd);
  setTimeout(() => document.addEventListener('click', function cl(e) { if (!dd.contains(e.target) && !e.target.closest('.topbar-profile')) { dd.remove(); document.removeEventListener('click', cl); } }), 50);
}

// ─── DOMContentLoaded INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initSelect2();
  initFlatpickr();
  JeevikaAuth.updateUI();

  // Auth check (skip login page)
  const page = window.location.pathname.split('/').pop();
  if (page !== 'login.html') JeevikaAuth.checkAuth();

  // Profile click handler
  const profile = document.querySelector('.topbar-profile');
  if (profile) profile.style.cursor = 'pointer', profile.addEventListener('click', toggleProfileMenu);

  // Auto-inject export toolbar on pages with data-tables
  document.querySelectorAll('.data-table').forEach((tbl, i) => {
    if (tbl.id) {
      const toolbar = tbl.closest('.card')?.querySelector('.card-header');
      if (toolbar && !toolbar.querySelector('.export-btn')) {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary export-btn';
        btn.innerHTML = '\u{1F4E5} Export';
        btn.onclick = (e) => JeevikaExport.showMenu(e, tbl.id, tbl.id);
        toolbar.appendChild(btn);
      }
    }
  });

  // --- GLOBAL KEYBOARD SHORTCUTS ---
  window.addEventListener('keydown', e => {
    if (e.ctrlKey) {
      const key = e.key.toLowerCase();
      if (key === 'i') { e.preventDefault(); location.href = 'member-receipt.html'; }
      if (key === 'p') { e.preventDefault(); location.href = 'payment-voucher.html'; }
      if (key === 'c') { e.preventDefault(); location.href = 'contra-voucher.html'; }
      if (key === 'k') { e.preventDefault(); location.href = 'bank-reconciliation.html'; }
    }
  });
});
