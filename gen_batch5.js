const fs=require('fs'),path=require('path'),dir='H:\\Jeevika Accounting\\html';
const sb=`<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div><nav class="sidebar-nav"><div class="nav-item"><a href="dashboard.html"><span class="icon">📊</span> Dashboard</a></div><div class="nav-item"><a href="masters.html"><span class="icon">📋</span> Masters</a></div><div class="nav-item"><a href="transactions.html"><span class="icon">💰</span> Transactions</a></div><div class="nav-item"><a href="reports.html"><span class="icon">📈</span> Reports</a></div><div class="nav-item"><a href="communication.html"><span class="icon">💬</span> Communication</a></div><div class="nav-item"><a href="utilities.html"><span class="icon">🔧</span> Utilities</a></div><div class="nav-item"><a href="billing-utilities.html"><span class="icon">🧾</span> Billing Utilities</a></div><div class="nav-item"><a href="statutory.html"><span class="icon">⚖️</span> Stat. Compliance</a></div><div class="nav-item"><a href="forms-audit.html"><span class="icon">📝</span> Forms &amp; Audit</a></div><div class="nav-item"><a href="access-security.html"><span class="icon">🔐</span> Access &amp; Security</a></div><div class="sidebar-section">───────────</div><div class="sidebar-bottom"><div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div><div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help &amp; Documentation</a></div></div></nav></aside>`;
function tb(t,b){return `<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">${t}</div><div class="breadcrumb">${b}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔<span class="notif-badge">3</span></button><button class="topbar-icon">⊞</button><button class="topbar-icon">🛡️</button><button class="topbar-icon">✉️</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">▼</span></div></div></header>`;}
function mp(f,t,b,body,eh='',ej=''){fs.writeFileSync(path.join(dir,f),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${t} — Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">${eh}</head><body>${sb}<div class="main-wrapper">${tb(t,b)}<main class="page-content">${body}</main></div><script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><script src="../js/global.js"></script>${ej}</body></html>`,'utf8');console.log('OK '+f);}

// ═══ COMMUNICATION HUB ═══
mp('communication.html','Communication','Home / Communication',`
<div class="page-header"><div><h1>Communication</h1><p>WhatsApp, Email & RCS messaging</p></div></div>
<div class="module-grid">
<div class="card module-card" onclick="location.href='whatsapp.html'"><div class="mc-icon">📱</div><h3>WhatsApp</h3><p>Send bills, receipts & reminders via WhatsApp</p><div class="mc-footer"><a class="mc-link" href="whatsapp.html">→ Open</a><span class="mc-badge badge-success">Connected</span></div></div>
<div class="card module-card" onclick="location.href='email.html'"><div class="mc-icon">📧</div><h3>Email</h3><p>Email bills, reports & notices</p><div class="mc-footer"><a class="mc-link" href="email.html">→ Open</a><span class="mc-badge badge-success">Active</span></div></div>
<div class="card module-card" onclick="location.href='rcs.html'"><div class="mc-icon">💬</div><h3>RCS Messaging</h3><p>Rich Communication Services</p><div class="mc-footer"><a class="mc-link" href="rcs.html">→ Open</a><span class="mc-badge badge-warning">Beta</span></div></div>
<div class="card module-card" onclick="location.href='reminders.html'"><div class="mc-icon">⏰</div><h3>Auto Reminders</h3><p>Schedule automatic payment reminders</p><div class="mc-footer"><a class="mc-link" href="reminders.html">→ Open</a><span class="mc-badge">5 Active</span></div></div>
</div>`);

// ═══ WHATSAPP ═══
mp('whatsapp.html','WhatsApp','Home / Communication / WhatsApp',`
<div class="page-header"><div><h1>WhatsApp Messaging</h1><p>Send bills, receipts & reminders</p></div></div>
<div style="display:grid;grid-template-columns:300px 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">Templates</h3>
<div style="display:flex;flex-direction:column;gap:8px">
<div style="padding:10px;border:2px solid var(--accent);border-radius:var(--radius-md);background:var(--accent-soft);cursor:pointer"><div style="font-weight:600;font-size:13px;color:var(--primary)">📄 Bill Reminder</div><div style="font-size:11px;color:var(--text-muted)">Monthly bill with amount details</div></div>
<div style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer"><div style="font-weight:600;font-size:13px">🧾 Receipt Confirmation</div><div style="font-size:11px;color:var(--text-muted)">Payment received acknowledgement</div></div>
<div style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer"><div style="font-weight:600;font-size:13px">⚠️ Overdue Notice</div><div style="font-size:11px;color:var(--text-muted)">Outstanding payment warning</div></div>
<div style="padding:10px;border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer"><div style="font-weight:600;font-size:13px">📌 General Notice</div><div style="font-size:11px;color:var(--text-muted)">Society announcements</div></div>
</div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">Compose Message</h3>
<div class="form-group"><label class="form-label">Recipients</label><select class="form-input select2" multiple><option>All Members</option><option>Wing A Members</option><option>M001 — Aman Salvi</option><option>M002 — Priya Sharma</option><option>Outstanding Members Only</option></select></div>
<div class="form-group"><label class="form-label">Message Preview</label>
<div style="background:#DCF8C6;padding:16px;border-radius:12px 12px 0 12px;font-size:13px;line-height:1.6;max-width:400px">
<p>🏢 <strong>Shree Sai Usha Complex</strong></p>
<p>Dear <strong>{{member_name}}</strong>,</p>
<p>Your maintenance bill for <strong>April 2024</strong> has been generated.</p>
<p>📋 Bill No: <strong>BILL/2024/089</strong><br>💰 Amount: <strong>₹6,510</strong><br>📅 Due Date: <strong>10/04/2024</strong></p>
<p>Kindly pay before the due date to avoid interest.</p>
<p style="font-size:11px;color:#666;margin-top:8px">— Jeevika Accounting</p></div></div>
<div class="form-group"><label class="form-label">Attach Bill PDF</label><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
<div class="btn-group"><button class="btn-primary" onclick="showToast('Messages queued — 120 members')">📱 Send to All</button><button class="btn-secondary">⏰ Schedule</button></div>
<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border)"><h4 style="font-weight:600;margin-bottom:8px">Send Log</h4>
<table class="data-table"><thead><tr><th>Member</th><th>Status</th><th>Time</th></tr></thead><tbody>
<tr><td>Aman Salvi</td><td><span class="badge badge-success">Delivered ✓✓</span></td><td>10:30 AM</td></tr>
<tr><td>Priya Sharma</td><td><span class="badge badge-success">Delivered ✓✓</span></td><td>10:30 AM</td></tr>
<tr><td>Rajesh Patil</td><td><span class="badge badge-warning">Sent ✓</span></td><td>10:31 AM</td></tr>
</tbody></table></div></div></div>`);

// ═══ EMAIL ═══
mp('email.html','Email','Home / Communication / Email',`
<div class="page-header"><div><h1>Email Communication</h1><p>Send bills, reports & notices via email</p></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">Compose Email</h3>
<div class="form-group"><label class="form-label">To</label><select class="form-input select2" multiple><option>All Members</option><option>aman@email.com</option><option>priya@email.com</option></select></div>
<div class="form-group"><label class="form-label">Subject</label><input type="text" class="form-input" value="Maintenance Bill — April 2024 | Shree Sai Usha Complex"></div>
<div class="form-group"><label class="form-label">Body</label><textarea class="form-input" rows="10" style="font-family:inherit">Dear Member,

Please find attached your maintenance bill for April 2024.

Bill Amount: ₹6,510
Due Date: 10/04/2024

Kindly make the payment before due date.

Regards,
Shree Sai Usha Complex
Jeevika Accounting</textarea></div>
<div class="form-group"><label class="form-label">Attachments</label><div style="display:flex;gap:8px;flex-wrap:wrap"><span class="badge badge-purple">📄 BILL_APR_2024.pdf</span><button class="btn-secondary" style="font-size:11px;padding:4px 10px">+ Add File</button></div></div>
<div class="btn-group"><button class="btn-primary" onclick="showToast('Emails sent to 120 members')">📧 Send Email</button><button class="btn-secondary">⏰ Schedule</button></div></div>`);

// ═══ RCS ═══
mp('rcs.html','RCS Messaging','Home / Communication / RCS',`
<div class="page-header"><div><h1>RCS Messaging</h1><p>Rich Communication Services — Interactive messages</p></div><span class="badge badge-warning">Beta Feature</span></div>
<div class="card" style="text-align:center;padding:60px"><div style="font-size:48px;margin-bottom:16px">💬</div>
<h3 style="font-weight:700;margin-bottom:8px">RCS Messaging — Coming Soon</h3>
<p style="color:var(--text-muted);max-width:400px;margin:0 auto">Rich Communication Services will enable interactive bill payments, carousels, and branded messaging directly in member's default messaging app.</p>
<div style="margin-top:24px;display:flex;gap:12px;justify-content:center"><div class="card" style="padding:16px;width:140px;text-align:center"><div style="font-size:24px">🖼️</div><div style="font-size:12px;font-weight:600;margin-top:4px">Rich Cards</div></div>
<div class="card" style="padding:16px;width:140px;text-align:center"><div style="font-size:24px">💳</div><div style="font-size:12px;font-weight:600;margin-top:4px">Pay Buttons</div></div>
<div class="card" style="padding:16px;width:140px;text-align:center"><div style="font-size:24px">📊</div><div style="font-size:12px;font-weight:600;margin-top:4px">Carousels</div></div></div></div>`);

// ═══ REMINDERS ═══
mp('reminders.html','Auto Reminders','Home / Communication / Reminders',`
<div class="page-header"><div><h1>Auto Reminders</h1><p>Schedule automatic payment reminders</p></div><button class="btn-primary" onclick="openModal('reminderModal')">+ Create Reminder</button></div>
<div class="card"><table class="data-table"><thead><tr><th>Name</th><th>Type</th><th>Channel</th><th>Schedule</th><th>Target</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<tr><td style="font-weight:600">Bill Due Reminder</td><td><span class="badge badge-purple">Auto</span></td><td>📱 WhatsApp</td><td>5 days before due</td><td>All Members</td><td><span class="badge badge-success">Active</span></td><td><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></td></tr>
<tr><td style="font-weight:600">Overdue Notice — 30 Days</td><td><span class="badge badge-warning">Auto</span></td><td>📧 Email</td><td>30 days after due</td><td>Overdue Members</td><td><span class="badge badge-success">Active</span></td><td><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></td></tr>
<tr><td style="font-weight:600">Receipt Confirmation</td><td><span class="badge badge-info">Trigger</span></td><td>📱 WhatsApp</td><td>On receipt entry</td><td>Paying Member</td><td><span class="badge badge-success">Active</span></td><td><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></td></tr>
<tr><td style="font-weight:600">Monthly Bill Generated</td><td><span class="badge badge-info">Trigger</span></td><td>📱+📧 Both</td><td>On bill generation</td><td>All Members</td><td><span class="badge badge-success">Active</span></td><td><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></td></tr>
<tr><td style="font-weight:600">Final Warning — 90 Days</td><td><span class="badge badge-danger">Auto</span></td><td>📧 Email</td><td>90 days after due</td><td>Overdue Members</td><td><span class="badge badge-danger">Paused</span></td><td><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></td></tr>
</tbody></table></div>
<div class="modal-overlay" id="reminderModal"><div class="modal"><div class="modal-header"><h3>Create Reminder</h3><button class="modal-close" onclick="closeModal('reminderModal')">✕</button></div><div class="modal-body">
<div class="form-group"><label class="form-label">Reminder Name</label><input type="text" class="form-input" placeholder="e.g. Monthly Bill Reminder"></div>
<div class="form-group"><label class="form-label">Channel</label><select class="form-input"><option>WhatsApp</option><option>Email</option><option>Both</option></select></div>
<div class="form-group"><label class="form-label">Trigger</label><select class="form-input"><option>X days before due date</option><option>X days after due date</option><option>On bill generation</option><option>On receipt entry</option></select></div>
<div class="form-group"><label class="form-label">Days</label><input type="number" class="form-input" value="5"></div>
<div class="form-group"><label class="form-label">Target</label><select class="form-input"><option>All Members</option><option>Overdue Members Only</option><option>Specific Wing</option></select></div>
</div><div class="modal-footer"><button class="btn-secondary" onclick="closeModal('reminderModal')">Cancel</button><button class="btn-primary" onclick="showToast('Reminder created');closeModal('reminderModal')">Save</button></div></div></div>`);

// ═══ UTILITIES HUB ═══
mp('utilities.html','Utilities','Home / Utilities',`
<div class="page-header"><div><h1>Utilities</h1><p>System utilities and tools</p></div></div>
<div class="module-grid">
<div class="card module-card" onclick="location.href='transfer-members.html'"><div class="mc-icon">🔄</div><h3>Transfer Members</h3><p>Transfer flat ownership</p><div class="mc-footer"><a class="mc-link" href="transfer-members.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='import-export.html'"><div class="mc-icon">📥</div><h3>Import / Export</h3><p>Excel data import/export</p><div class="mc-footer"><a class="mc-link" href="import-export.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='interest-calc.html'"><div class="mc-icon">📐</div><h3>Interest Calculation</h3><p>Calculate interest on dues</p><div class="mc-footer"><a class="mc-link" href="interest-calc.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='rebuild-balances.html'"><div class="mc-icon">🔨</div><h3>Rebuild Balances</h3><p>Recalculate all balances</p><div class="mc-footer"><a class="mc-link" href="rebuild-balances.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='year-end.html'"><div class="mc-icon">📅</div><h3>Year End Process</h3><p>Close FY & carry forward</p><div class="mc-footer"><a class="mc-link" href="year-end.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='data-backup.html'"><div class="mc-icon">💾</div><h3>Data Backup</h3><p>Backup & restore data</p><div class="mc-footer"><a class="mc-link" href="data-backup.html">→ Open</a></div></div>
</div>`);

// ═══ UTILITIES INNER PAGES ═══
mp('transfer-members.html','Transfer Members','Home / Utilities / Transfer',`
<div class="page-header"><div><h1>Transfer Members</h1><p>Transfer flat ownership between members</p></div></div>
<div class="card" style="max-width:700px"><h3 style="font-weight:700;margin-bottom:20px">Flat Transfer</h3>
<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin-bottom:20px">
<div style="padding:20px;border:2px solid var(--border);border-radius:var(--radius-lg);text-align:center"><div style="font-size:24px;margin-bottom:8px">👤</div><div style="font-weight:700;color:var(--text-primary)">Current Owner</div>
<div class="form-group" style="margin-top:12px"><select class="form-input select2"><option>M001 — Aman Salvi (A-101)</option></select></div>
<div style="font-size:12px;color:var(--text-muted)">Outstanding: <strong style="color:var(--danger)">₹15,500</strong></div></div>
<div style="font-size:28px;color:var(--accent)">→</div>
<div style="padding:20px;border:2px solid var(--accent);border-radius:var(--radius-lg);text-align:center;background:var(--accent-soft)"><div style="font-size:24px;margin-bottom:8px">👤</div><div style="font-weight:700;color:var(--primary)">New Owner</div>
<div class="form-group" style="margin-top:12px"><input type="text" class="form-input" placeholder="New member name"></div>
<div class="form-group"><input type="tel" class="form-input" placeholder="Contact number"></div></div></div>
<div class="form-group"><label class="form-label">Transfer Date</label><input type="text" class="form-input date-picker"></div>
<div class="form-group"><label class="form-label">Transfer Outstanding to New Owner</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>
<div class="form-group"><label class="form-label">NOC Required</label><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
<div class="form-group"><label class="form-label">Remarks</label><textarea class="form-input" rows="2"></textarea></div>
<button class="btn-primary" onclick="showToast('Transfer processed successfully')">Process Transfer</button></div>`);

mp('import-export.html','Import / Export','Home / Utilities / Import Export',`
<div class="page-header"><div><h1>Import / Export</h1><p>Excel data import and export</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">📥 Import Data</h3>
<div class="form-group"><label class="form-label">Import Type</label><select class="form-input"><option>Member Master</option><option>Account Master</option><option>Opening Balances</option><option>Vendor Master</option><option>Area Master</option></select></div>
<div class="form-group"><label class="form-label">Upload File</label><div style="border:2px dashed var(--border-dark);border-radius:var(--radius-md);padding:40px;text-align:center;cursor:pointer;color:var(--text-muted)">📁 Drop Excel file here or click to browse<br><small>.xlsx, .xls — Max 10MB</small></div></div>
<div class="form-group"><label class="form-label">Skip first row (header)</label><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
<div class="btn-group"><button class="btn-secondary">📋 Download Template</button><button class="btn-primary" onclick="showToast('Import started... 120 records processed')">📥 Import</button></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">📤 Export Data</h3>
<div class="form-group"><label class="form-label">Export Type</label><select class="form-input"><option>Member Master</option><option>Outstanding Report</option><option>Trial Balance</option><option>All Transactions</option><option>Receipt Register</option><option>Payment Register</option></select></div>
<div class="form-group"><label class="form-label">Format</label><div style="display:flex;gap:12px"><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="radio" name="fmt" checked> Excel (.xlsx)</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="radio" name="fmt"> CSV</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="radio" name="fmt"> PDF</label></div></div>
<div class="form-group"><label class="form-label">Date Range</label><div class="form-row"><div class="form-group"><input type="text" class="form-input date-picker" value="01/04/2024"></div><div class="form-group"><input type="text" class="form-input date-picker" value="31/03/2025"></div></div></div>
<button class="btn-primary" onclick="showToast('Export downloading...')">📤 Export</button></div></div>`);

mp('interest-calc.html','Interest Calculation','Home / Utilities / Interest Calc',`
<div class="page-header"><div><h1>Interest Calculation</h1><p>Calculate interest on member dues (Max 21% p.a.)</p></div></div>
<div class="card" style="margin-bottom:20px"><div class="form-row">
<div class="form-group"><label class="form-label">Interest Rate (% p.a.)</label><input type="number" class="form-input" value="21" max="21" id="intRate" oninput="if(this.value>21){this.value=21;showToast('Max interest rate is 21% per annum as per MCS Act','warning')}"></div>
<div class="form-group"><label class="form-label">Calculation Method</label><select class="form-input"><option>Simple Interest</option><option>Compound (Monthly)</option><option>Compound (Quarterly)</option></select></div>
<div class="form-group"><label class="form-label">Calculate From</label><input type="text" class="form-input date-picker" value="01/04/2024"></div>
<div class="form-group"><label class="form-label">Calculate To</label><input type="text" class="form-input date-picker" value="26/04/2024"></div></div>
<div class="form-group"><label class="form-label">Apply To</label><select class="form-input"><option>All Outstanding Members</option><option>Specific Members</option></select></div>
<div class="btn-group"><button class="btn-secondary">👁️ Preview</button><button class="btn-primary" onclick="showToast('Interest calculated for 42 members')">📐 Calculate & Post</button></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:12px">Preview — Interest Charges</h3>
<table class="data-table"><thead><tr><th>Member</th><th>Flat</th><th>Outstanding</th><th>Days</th><th>Rate</th><th>Interest</th></tr></thead><tbody>
<tr><td>Priya Sharma</td><td>B-205</td><td class="amount">₹70,000</td><td>106</td><td>21%</td><td class="amount" style="color:var(--danger)">₹4,268</td></tr>
<tr><td>Rajesh Patil</td><td>C-302</td><td class="amount">₹35,000</td><td>74</td><td>21%</td><td class="amount" style="color:var(--danger)">₹1,490</td></tr>
<tr><td>Aman Salvi</td><td>A-101</td><td class="amount">₹12,000</td><td>16</td><td>21%</td><td class="amount" style="color:var(--danger)">₹110</td></tr>
<tr style="font-weight:700;background:var(--accent-soft)"><td colspan="5">Total Interest</td><td class="amount" style="color:var(--danger)">₹5,868</td></tr>
</tbody></table></div>`);

mp('rebuild-balances.html','Rebuild Balances','Home / Utilities / Rebuild',`
<div class="page-header"><div><h1>Rebuild Balances</h1><p>Recalculate all member & account balances</p></div></div>
<div class="card" style="max-width:600px;text-align:center;padding:40px">
<div style="font-size:48px;margin-bottom:16px">🔨</div>
<h3 style="font-weight:700;margin-bottom:8px">Rebuild All Balances</h3>
<p style="color:var(--text-muted);margin-bottom:24px">This will recalculate all member outstanding balances, account balances, and running totals from opening balances + all posted transactions.</p>
<div style="background:#FEF3C7;padding:12px;border-radius:var(--radius-md);margin-bottom:24px;font-size:13px;color:#92400E">⚠️ This process may take a few minutes. Do not close the browser.</div>
<div class="form-group"><label class="form-label">Financial Year</label><select class="form-input"><option>2024-25</option><option>2023-24</option></select></div>
<div class="form-group"><label class="form-label">Rebuild Scope</label>
<div style="display:flex;flex-direction:column;gap:8px;text-align:left"><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" checked> Member Balances</label><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox" checked> Account Balances</label><label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="checkbox"> Voucher Numbering</label></div></div>
<button class="btn-primary" onclick="showToast('Rebuild complete — 120 members, 84 accounts recalculated')">🔨 Start Rebuild</button></div>`);

mp('year-end.html','Year End Process','Home / Utilities / Year End',`
<div class="page-header"><div><h1>Year End Process</h1><p>Close financial year & carry forward balances</p></div></div>
<div class="card" style="max-width:700px">
<div style="display:flex;align-items:center;gap:16px;padding:16px;background:var(--accent-soft);border-radius:var(--radius-md);margin-bottom:20px"><div style="font-size:32px">📅</div><div><div style="font-weight:700;color:var(--primary)">Current FY: 2024-25</div><div style="font-size:12px;color:var(--text-muted)">Closing → New FY: 2025-26</div></div></div>
<h3 style="font-weight:700;margin-bottom:16px">Pre-Closure Checklist</h3>
<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:24px">
<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md)"><input type="checkbox"> All bills for March generated</label>
<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md)"><input type="checkbox"> All receipts entered</label>
<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md)"><input type="checkbox"> Bank reconciliation completed</label>
<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md)"><input type="checkbox"> Interest calculated</label>
<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md)"><input type="checkbox"> Trial balance is balanced</label>
<label style="display:flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md)"><input type="checkbox"> Data backup taken</label></div>
<div style="background:#FEF3C7;padding:12px;border-radius:var(--radius-md);margin-bottom:20px;font-size:13px;color:#92400E">⚠️ Year-end process is irreversible. Ensure all entries are finalized.</div>
<div class="form-group"><label class="form-label">25% Reserve Fund Transfer</label><input type="text" class="form-input" value="₹93,500" disabled></div>
<button class="btn-primary" onclick="showToast('Year-end process completed. FY 2025-26 opened.')">🔒 Close FY 2024-25 & Open 2025-26</button></div>`);

mp('data-backup.html','Data Backup','Home / Utilities / Backup',`
<div class="page-header"><div><h1>Data Backup & Restore</h1><p>Protect your society data</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">💾 Create Backup</h3>
<div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
<label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="radio" name="bkp" checked> Full Backup (All Data)</label>
<label style="display:flex;align-items:center;gap:8px;cursor:pointer"><input type="radio" name="bkp"> Current FY Only</label></div>
<button class="btn-primary" onclick="showToast('Backup created — jeevika_backup_26042024.zip')">💾 Create Backup Now</button>
<h4 style="font-weight:600;margin:20px 0 8px">Recent Backups</h4>
<div style="display:flex;flex-direction:column;gap:6px">
<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:6px 0;border-bottom:1px solid var(--border)"><span>jeevika_bkp_25042024.zip (12.4MB)</span><button class="btn-icon">📥</button></div>
<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:6px 0;border-bottom:1px solid var(--border)"><span>jeevika_bkp_20042024.zip (12.1MB)</span><button class="btn-icon">📥</button></div>
</div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">🔄 Restore Data</h3>
<div style="border:2px dashed var(--border-dark);border-radius:var(--radius-md);padding:40px;text-align:center;cursor:pointer;color:var(--text-muted);margin-bottom:16px">📁 Drop backup file here<br><small>.zip — Jeevika backup file</small></div>
<div style="background:#FEE2E2;padding:12px;border-radius:var(--radius-md);font-size:13px;color:#991B1B">🚨 Restore will replace ALL current data. This cannot be undone.</div>
<button class="btn-danger" style="margin-top:16px" onclick="confirmDelete('This will replace ALL current data. Continue?')">🔄 Restore</button></div></div>`);

console.log('=== BATCH 5 COMPLETE ===');
