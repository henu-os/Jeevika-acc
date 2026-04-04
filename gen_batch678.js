const fs=require('fs'),p=require('path'),d='H:\\Jeevika Accounting\\html';
const s=`<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div><nav class="sidebar-nav"><div class="nav-item"><a href="dashboard.html"><span class="icon">📊</span> Dashboard</a></div><div class="nav-item"><a href="masters.html"><span class="icon">📋</span> Masters</a></div><div class="nav-item"><a href="transactions.html"><span class="icon">💰</span> Transactions</a></div><div class="nav-item"><a href="reports.html"><span class="icon">📈</span> Reports</a></div><div class="nav-item"><a href="communication.html"><span class="icon">💬</span> Communication</a></div><div class="nav-item"><a href="utilities.html"><span class="icon">🔧</span> Utilities</a></div><div class="nav-item"><a href="billing-utilities.html"><span class="icon">🧾</span> Billing Utilities</a></div><div class="nav-item"><a href="statutory.html"><span class="icon">⚖️</span> Stat. Compliance</a></div><div class="nav-item"><a href="forms-audit.html"><span class="icon">📝</span> Forms &amp; Audit</a></div><div class="nav-item"><a href="access-security.html"><span class="icon">🔐</span> Access &amp; Security</a></div><div class="sidebar-section">───────────</div><div class="sidebar-bottom"><div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div><div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help &amp; Documentation</a></div></div></nav></aside>`;
const t=(t,b)=>`<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">${t}</div><div class="breadcrumb">${b}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔</button><button class="topbar-icon">⊞</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div></div></div></header>`;
const m=(f,ti,b,body)=>{fs.writeFileSync(p.join(d,f),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${ti} — Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"></head><body>${s}<div class="main-wrapper">${t(ti,b)}<main class="page-content">${body}</main></div><script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><script src="../js/global.js"></script></body></html>`,'utf8');console.log('OK '+f);};

// BILLING UTILITIES
m('billing-utilities.html','Billing Utilities','Home / Billing Utilities',`
<div class="page-header"><div><h1>Billing Utilities</h1><p>Advanced billing tools</p></div></div>
<div class="module-grid">
<div class="card module-card" onclick="location.href='bill-cancellation.html'"><div class="mc-icon">❌</div><h3>Bill Cancellation</h3><p>Cancel generated bills</p><div class="mc-footer"><a class="mc-link" href="bill-cancellation.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='bill-modification.html'"><div class="mc-icon">✏️</div><h3>Bill Modification</h3><p>Modify bill amounts</p><div class="mc-footer"><a class="mc-link" href="bill-modification.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='bulk-bill-print.html'"><div class="mc-icon">🖨️</div><h3>Bulk Bill Print</h3><p>Print bills in bulk</p><div class="mc-footer"><a class="mc-link" href="bulk-bill-print.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='income-head-setup.html'"><div class="mc-icon">📋</div><h3>Income Head Setup</h3><p>Map income heads to bill</p><div class="mc-footer"><a class="mc-link" href="income-head-setup.html">→ Open</a></div></div>
</div>`);

m('bill-cancellation.html','Bill Cancellation','Home / Billing Utilities / Cancellation',`
<div class="page-header"><div><h1>Bill Cancellation</h1><p>Cancel generated bills</p></div></div>
<div class="card"><div class="form-row"><div class="form-group"><label class="form-label">Bill Type</label><select class="form-input"><option>Maintenance</option></select></div>
<div class="form-group"><label class="form-label">Period</label><select class="form-input"><option>April 2024</option><option>March 2024</option></select></div></div>
<table class="data-table"><thead><tr><th><input type="checkbox"></th><th>Bill No.</th><th>Member</th><th>Flat</th><th>Amount</th><th>Status</th></tr></thead><tbody>
<tr><td><input type="checkbox"></td><td>BILL/2024/089</td><td>Aman Salvi</td><td>A-101</td><td class="amount">₹6,510</td><td><span class="badge badge-success">Active</span></td></tr>
<tr><td><input type="checkbox"></td><td>BILL/2024/090</td><td>Priya Sharma</td><td>B-205</td><td class="amount">₹6,510</td><td><span class="badge badge-success">Active</span></td></tr>
<tr><td><input type="checkbox"></td><td>BILL/2024/091</td><td>Rajesh Patil</td><td>C-302</td><td class="amount">₹6,510</td><td><span class="badge badge-success">Active</span></td></tr></tbody></table>
<div class="form-group" style="margin-top:16px"><label class="form-label">Cancellation Reason *</label><textarea class="form-input" rows="2" required placeholder="Reason for cancellation..."></textarea></div>
<button class="btn-danger" onclick="confirmDelete('Cancel selected bills? This will reverse all entries.')">❌ Cancel Selected Bills</button></div>`);

m('bill-modification.html','Bill Modification','Home / Billing Utilities / Modification',`
<div class="page-header"><div><h1>Bill Modification</h1><p>Modify individual bill amounts</p></div></div>
<div class="card"><div class="form-row">
<div class="form-group"><label class="form-label">Search Bill</label><input type="text" class="form-input" placeholder="Bill No. or Member Name"></div>
<div class="form-group"><label class="form-label">Member</label><select class="form-input select2"><option>M001 — Aman Salvi (A-101)</option></select></div></div>
<h4 style="font-weight:600;margin:16px 0 8px">Bill: BILL/2024/089 — April 2024</h4>
<table class="data-table"><thead><tr><th>Charge Head</th><th>Original (₹)</th><th>Modified (₹)</th></tr></thead><tbody>
<tr><td>Maintenance Charges</td><td class="amount">₹3,500</td><td><input type="number" class="form-input" style="width:120px" value="3500"></td></tr>
<tr><td>Water Charges</td><td class="amount">₹500</td><td><input type="number" class="form-input" style="width:120px" value="500"></td></tr>
<tr><td>Sinking Fund</td><td class="amount">₹700</td><td><input type="number" class="form-input" style="width:120px" value="700"></td></tr>
<tr><td>Parking Charges</td><td class="amount">₹1,000</td><td><input type="number" class="form-input" style="width:120px" value="1000"></td></tr>
</tbody></table>
<div class="form-group" style="margin-top:12px"><label class="form-label">Reason for Modification *</label><textarea class="form-input" rows="2" required></textarea></div>
<button class="btn-primary" onclick="showToast('Bill modified successfully')">Save Changes</button></div>`);

m('bulk-bill-print.html','Bulk Bill Print','Home / Billing Utilities / Bulk Print',`
<div class="page-header"><div><h1>Bulk Bill Print</h1><p>Print bills for multiple members</p></div></div>
<div class="card"><div class="form-row"><div class="form-group"><label class="form-label">Bill Type</label><select class="form-input"><option>Maintenance</option></select></div>
<div class="form-group"><label class="form-label">Period</label><select class="form-input"><option>April 2024</option></select></div>
<div class="form-group"><label class="form-label">Wing</label><select class="form-input"><option>All Wings</option><option>Wing A</option><option>Wing B</option></select></div></div>
<div style="display:flex;gap:12px;margin:16px 0"><label style="display:flex;align-items:center;gap:4px"><input type="radio" name="printFmt" checked> A4 — One per page</label><label style="display:flex;align-items:center;gap:4px"><input type="radio" name="printFmt"> A5 — Two per page</label></div>
<div style="display:flex;gap:12px"><button class="btn-primary" onclick="showToast('Printing 120 bills...')">🖨️ Print All</button><button class="btn-secondary">📄 Download PDF (All)</button></div></div>`);

m('income-head-setup.html','Income Head Setup','Home / Billing Utilities / Income Heads',`
<div class="page-header"><div><h1>Income Head Setup</h1><p>Map income heads to billing</p></div></div>
<div class="card"><table class="data-table"><thead><tr><th>Sr.</th><th>Income Head</th><th>Account Code</th><th>GST</th><th>Default Amount</th><th>Bill Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<tr><td>1</td><td>Maintenance Charges</td><td>8</td><td>18%</td><td class="amount">₹3,500</td><td>Maintenance</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>2</td><td>Water Charges</td><td>1</td><td>0%</td><td class="amount">₹500</td><td>Maintenance</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>3</td><td>Sinking Fund</td><td>5</td><td>0%</td><td class="amount">₹700</td><td>Maintenance</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>4</td><td>Parking Charges</td><td>9</td><td>18%</td><td class="amount">₹1,000</td><td>Maintenance</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
</tbody></table></div>`);

// STATUTORY COMPLIANCE
m('statutory.html','Statutory Compliance','Home / Statutory Compliance',`
<div class="page-header"><div><h1>Statutory Compliance</h1><p>Legal and regulatory compliance</p></div></div>
<div class="module-grid">
<div class="card module-card" onclick="location.href='gst-returns.html'"><div class="mc-icon">📊</div><h3>GST Returns</h3><p>GSTR-1, GSTR-3B filing data</p><div class="mc-footer"><a class="mc-link" href="gst-returns.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='tds-compliance.html'"><div class="mc-icon">📋</div><h3>TDS Compliance</h3><p>TDS deduction & returns</p><div class="mc-footer"><a class="mc-link" href="tds-compliance.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='it-returns.html'"><div class="mc-icon">💼</div><h3>IT Returns</h3><p>Income tax filing data</p><div class="mc-footer"><a class="mc-link" href="it-returns.html">→ Open</a></div></div>
<div class="card module-card" onclick="location.href='society-audit.html'"><div class="mc-icon">🔍</div><h3>Society Audit</h3><p>Audit schedules & annexures</p><div class="mc-footer"><a class="mc-link" href="society-audit.html">→ Open</a></div></div>
</div>`);

m('gst-returns.html','GST Returns','Home / Statutory / GST Returns',`
<div class="page-header"><div><h1>GST Returns</h1><p>GSTR-1 and GSTR-3B filing data</p></div></div>
<div class="tabs" style="margin-bottom:20px"><button class="tab-btn active" data-tab-btn="gst" data-tab="gstr1" onclick="switchTab('gst','gstr1')">GSTR-1</button><button class="tab-btn" data-tab-btn="gst" data-tab="gstr3b" onclick="switchTab('gst','gstr3b')">GSTR-3B</button></div>
<div id="gstr1" class="tab-content active" data-tab-group="gst"><div class="card"><div class="form-row" style="margin-bottom:16px"><div class="form-group"><label class="form-label">Period</label><select class="form-input"><option>April 2024</option></select></div><div class="form-group" style="display:flex;align-items:flex-end"><button class="btn-primary">📊 Generate GSTR-1 Data</button></div></div>
<table class="data-table"><thead><tr><th>Invoice No.</th><th>Date</th><th>Member/Party</th><th>GSTIN</th><th>Taxable Value</th><th>CGST</th><th>SGST</th><th>Total</th></tr></thead><tbody>
<tr><td>BILL/2024/089</td><td>01/04/2024</td><td>Aman Salvi</td><td>—</td><td class="amount">₹4,500</td><td class="amount">₹405</td><td class="amount">₹405</td><td class="amount">₹5,310</td></tr>
<tr><td>BILL/2024/090</td><td>01/04/2024</td><td>Priya Sharma</td><td>—</td><td class="amount">₹4,500</td><td class="amount">₹405</td><td class="amount">₹405</td><td class="amount">₹5,310</td></tr>
<tr style="font-weight:700;background:var(--accent-soft)"><td colspan="4">Total</td><td class="amount">₹5,40,000</td><td class="amount">₹48,600</td><td class="amount">₹48,600</td><td class="amount">₹6,37,200</td></tr>
</tbody></table><button class="btn-secondary" style="margin-top:12px">📤 Export for GST Portal</button></div></div>
<div id="gstr3b" class="tab-content" data-tab-group="gst"><div class="card"><p style="padding:24px;text-align:center;color:var(--text-muted)">GSTR-3B summary with input credit and net tax payable.</p></div></div>`);

m('tds-compliance.html','TDS Compliance','Home / Statutory / TDS',`
<div class="page-header"><div><h1>TDS Compliance</h1><p>TDS deduction tracking & returns</p></div></div>
<div class="stats-row"><div class="card stat-card"><div class="stat-icon purple">💰</div><div class="stat-label">Total TDS Deducted</div><div class="stat-value" data-target="45000">₹0</div></div>
<div class="card stat-card"><div class="stat-icon green">✅</div><div class="stat-label">TDS Deposited</div><div class="stat-value" data-target="38000">₹0</div></div>
<div class="card stat-card"><div class="stat-icon red">⏳</div><div class="stat-label">Pending Deposit</div><div class="stat-value" data-target="7000">₹0</div></div></div>
<div class="card"><table class="data-table"><thead><tr><th>Vendor</th><th>PAN</th><th>Payment</th><th>TDS %</th><th>TDS Amount</th><th>Date</th><th>Deposited</th></tr></thead><tbody>
<tr><td>City Plumber</td><td>AAACF1234P</td><td class="amount">₹1,50,000</td><td>2%</td><td class="amount">₹3,000</td><td>15/04/2024</td><td><span class="badge badge-success">Yes</span></td></tr>
<tr><td>Clean India</td><td>CCCCD9012H</td><td class="amount">₹2,40,000</td><td>1%</td><td class="amount">₹2,400</td><td>20/04/2024</td><td><span class="badge badge-warning">Pending</span></td></tr>
</tbody></table></div>`);

m('it-returns.html','IT Returns','Home / Statutory / IT Returns',`
<div class="page-header"><div><h1>Income Tax Returns</h1><p>IT filing data for the society</p></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">IT Computation — AY 2025-26</h3>
<table class="data-table"><tbody>
<tr><td>Gross Total Income</td><td class="amount text-right">₹8,21,000</td></tr>
<tr><td style="padding-left:24px">— Maintenance Income</td><td class="amount text-right">₹6,00,000</td></tr>
<tr><td style="padding-left:24px">— Interest Income</td><td class="amount text-right">₹2,06,000</td></tr>
<tr><td style="padding-left:24px">— Other Income</td><td class="amount text-right">₹15,000</td></tr>
<tr><td>Less: Expenditure</td><td class="amount text-right">₹4,47,000</td></tr>
<tr style="font-weight:700;background:var(--accent-soft)"><td>Net Taxable Income</td><td class="amount text-right">₹3,74,000</td></tr>
<tr><td>Tax @ Applicable Rate</td><td class="amount text-right">₹18,700</td></tr>
</tbody></table>
<button class="btn-secondary" style="margin-top:12px">📤 Export IT Data</button></div>`);

m('society-audit.html','Society Audit','Home / Statutory / Society Audit',`
<div class="page-header"><div><h1>Society Audit</h1><p>Audit schedules and annexures</p></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">Audit Documents</h3>
<div style="display:flex;flex-direction:column;gap:8px">
<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><span style="font-weight:600">📄 Schedule I — Balance Sheet</span><div class="btn-group"><button class="btn-secondary" style="font-size:11px;padding:4px 10px">Generate</button><button class="btn-icon">📥</button></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><span style="font-weight:600">📄 Schedule II — I&E Statement</span><div class="btn-group"><button class="btn-secondary" style="font-size:11px;padding:4px 10px">Generate</button><button class="btn-icon">📥</button></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><span style="font-weight:600">📄 Schedule III — Member Register</span><div class="btn-group"><button class="btn-secondary" style="font-size:11px;padding:4px 10px">Generate</button><button class="btn-icon">📥</button></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><span style="font-weight:600">📄 Schedule IV — Outstanding Statement</span><div class="btn-group"><button class="btn-secondary" style="font-size:11px;padding:4px 10px">Generate</button><button class="btn-icon">📥</button></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><span style="font-weight:600">📄 Annexure A — FD Details</span><div class="btn-group"><button class="btn-secondary" style="font-size:11px;padding:4px 10px">Generate</button><button class="btn-icon">📥</button></div></div>
</div></div>`);

// FORMS & AUDIT
m('forms-audit.html','Forms & Audit','Home / Forms & Audit',`
<div class="page-header"><div><h1>Forms & Audit</h1><p>Statutory forms, NOC, and audit tools</p></div></div>
<div class="module-grid">
<div class="card module-card"><div class="mc-icon">📝</div><h3>Form I — Application</h3><p>Membership application form</p><div class="mc-footer"><button class="btn-sm" onclick="showToast('Generating Form I...')">Generate</button></div></div>
<div class="card module-card"><div class="mc-icon">📝</div><h3>Form J — NOC</h3><p>No Objection Certificate</p><div class="mc-footer"><button class="btn-sm" onclick="showToast('Generating NOC...')">Generate</button></div></div>
<div class="card module-card"><div class="mc-icon">📝</div><h3>Share Certificate</h3><p>Member share certificate</p><div class="mc-footer"><button class="btn-sm" onclick="showToast('Generating...')">Generate</button></div></div>
<div class="card module-card"><div class="mc-icon">📝</div><h3>Demand Letter</h3><p>Outstanding demand notice</p><div class="mc-footer"><button class="btn-sm" onclick="showToast('Generating...')">Generate</button></div></div>
<div class="card module-card"><div class="mc-icon">🔍</div><h3>Audit Trail</h3><p>Complete system audit log</p><div class="mc-footer"><a class="mc-link" href="audit-trail.html">→ Open</a></div></div>
</div>`);

m('audit-trail.html','Audit Trail','Home / Forms & Audit / Audit Trail',`
<div class="page-header"><div><h1>Audit Trail</h1><p>Complete system audit log</p></div><div class="btn-group"><button class="btn-secondary">📤 Export</button></div></div>
<div class="card" style="margin-bottom:16px"><div class="form-row"><div class="form-group"><label class="form-label">User</label><select class="form-input"><option>All Users</option><option>Admin</option><option>Accountant</option></select></div>
<div class="form-group"><label class="form-label">Action</label><select class="form-input"><option>All Actions</option><option>Create</option><option>Update</option><option>Delete</option><option>Login</option></select></div>
<div class="form-group"><label class="form-label">From</label><input type="text" class="form-input date-picker" value="01/04/2024"></div>
<div class="form-group"><label class="form-label">To</label><input type="text" class="form-input date-picker" value="26/04/2024"></div></div></div>
<div class="card"><table class="data-table"><thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Module</th><th>Details</th><th>IP</th></tr></thead><tbody>
<tr><td>26/04/2024 10:35</td><td>Admin</td><td><span class="badge badge-success">Create</span></td><td>Receipt</td><td>REC/2024/143 — ₹6,510 from Aman Salvi</td><td>192.168.1.10</td></tr>
<tr><td>26/04/2024 09:15</td><td>Admin</td><td><span class="badge badge-warning">Update</span></td><td>Member</td><td>M001 — Updated contact number</td><td>192.168.1.10</td></tr>
<tr><td>25/04/2024 18:00</td><td>Admin</td><td><span class="badge badge-purple">Create</span></td><td>Bill</td><td>Generated 120 bills for Apr 2024</td><td>192.168.1.10</td></tr>
<tr><td>25/04/2024 14:30</td><td>Accountant</td><td><span class="badge badge-danger">Delete</span></td><td>Quick Note</td><td>Deleted note #45</td><td>192.168.1.12</td></tr>
<tr><td>25/04/2024 09:00</td><td>Admin</td><td><span class="badge badge-info">Login</span></td><td>Auth</td><td>Login from Chrome/Windows</td><td>192.168.1.10</td></tr>
</tbody></table></div>`);

// ACCESS & SECURITY
m('access-security.html','Access & Security','Home / Access & Security',`
<div class="page-header"><div><h1>Access & Security</h1><p>Role-based access control</p></div></div>
<div class="tabs" style="margin-bottom:20px"><button class="tab-btn active" data-tab-btn="ac" data-tab="acRoles" onclick="switchTab('ac','acRoles')">Roles</button><button class="tab-btn" data-tab-btn="ac" data-tab="acUsers" onclick="switchTab('ac','acUsers')">Users</button><button class="tab-btn" data-tab-btn="ac" data-tab="acPerms" onclick="switchTab('ac','acPerms')">Permissions</button></div>
<div id="acRoles" class="tab-content active" data-tab-group="ac"><div class="card">
<div class="card-header"><h3>Roles</h3><button class="btn-primary" onclick="openModal('roleModal')">+ Add Role</button></div>
<table class="data-table"><thead><tr><th>Role</th><th>Description</th><th>Users</th><th>Permissions</th><th>Actions</th></tr></thead><tbody>
<tr><td style="font-weight:700"><span class="badge badge-purple">Super Admin</span></td><td>Full system access</td><td>1</td><td>All (125)</td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td style="font-weight:700"><span class="badge badge-info">Accountant</span></td><td>Financial operations</td><td>2</td><td>85</td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td style="font-weight:700"><span class="badge badge-success">Committee</span></td><td>View reports only</td><td>5</td><td>25</td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td style="font-weight:700"><span class="badge badge-warning">Data Entry</span></td><td>Receipt & bill entry</td><td>1</td><td>15</td><td><button class="btn-icon">✏️</button></td></tr>
</tbody></table></div></div>
<div id="acUsers" class="tab-content" data-tab-group="ac"><div class="card">
<div class="card-header"><h3>Users</h3><button class="btn-primary" onclick="openModal('userModal')">+ Add User</button></div>
<table class="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<tr><td style="font-weight:600">Admin</td><td>admin@jeevika.com</td><td><span class="badge badge-purple">Super Admin</span></td><td>26/04/2024 09:00</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td style="font-weight:600">Ramesh (Accountant)</td><td>ramesh@jeevika.com</td><td><span class="badge badge-info">Accountant</span></td><td>25/04/2024 17:00</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
</tbody></table></div></div>
<div id="acPerms" class="tab-content" data-tab-group="ac"><div class="card"><h3 style="font-weight:700;margin-bottom:16px">Permission Matrix</h3>
<table class="data-table"><thead><tr><th>Module</th><th>Super Admin</th><th>Accountant</th><th>Committee</th><th>Data Entry</th></tr></thead><tbody>
<tr><td style="font-weight:600">Masters</td><td>✅ Full</td><td>✅ Full</td><td>👁️ View</td><td>❌</td></tr>
<tr><td style="font-weight:600">Transactions</td><td>✅ Full</td><td>✅ Full</td><td>👁️ View</td><td>✅ Create</td></tr>
<tr><td style="font-weight:600">Reports</td><td>✅ Full</td><td>✅ Full</td><td>✅ Full</td><td>👁️ View</td></tr>
<tr><td style="font-weight:600">Communication</td><td>✅ Full</td><td>✅ Full</td><td>❌</td><td>❌</td></tr>
<tr><td style="font-weight:600">Utilities</td><td>✅ Full</td><td>👁️ View</td><td>❌</td><td>❌</td></tr>
<tr><td style="font-weight:600">Access & Security</td><td>✅ Full</td><td>❌</td><td>❌</td><td>❌</td></tr>
</tbody></table></div></div>
<div class="modal-overlay" id="roleModal"><div class="modal"><div class="modal-header"><h3>Add Role</h3><button class="modal-close" onclick="closeModal('roleModal')">✕</button></div><div class="modal-body"><div class="form-group"><label class="form-label">Role Name</label><input type="text" class="form-input"></div><div class="form-group"><label class="form-label">Description</label><textarea class="form-input" rows="2"></textarea></div></div><div class="modal-footer"><button class="btn-secondary" onclick="closeModal('roleModal')">Cancel</button><button class="btn-primary" onclick="showToast('Role created');closeModal('roleModal')">Save</button></div></div></div>
<div class="modal-overlay" id="userModal"><div class="modal"><div class="modal-header"><h3>Add User</h3><button class="modal-close" onclick="closeModal('userModal')">✕</button></div><div class="modal-body"><div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input"></div><div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input"></div><div class="form-group"><label class="form-label">Role</label><select class="form-input"><option>Accountant</option><option>Committee</option><option>Data Entry</option></select></div><div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input"></div></div><div class="modal-footer"><button class="btn-secondary" onclick="closeModal('userModal')">Cancel</button><button class="btn-primary" onclick="showToast('User created');closeModal('userModal')">Save</button></div></div></div>`);

// NOTICES
m('notices.html','Notice Board','Home / Notice Board',`
<div class="page-header"><div><h1>Notice Board</h1><p>Society announcements and notices</p></div><button class="btn-primary" onclick="openModal('noticeModal')">+ Post Notice</button></div>
<div style="display:flex;flex-direction:column;gap:16px">
<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><span class="badge badge-danger" style="margin-bottom:8px">📌 Pinned</span><h3 style="font-weight:700;color:var(--text-primary)">Annual General Body Meeting</h3><p style="font-size:13px;color:var(--text-secondary);margin:8px 0">The AGM for FY 2024-25 will be held on 30th April 2024 at 6:00 PM in the society hall. All members are requested to attend.</p><div style="font-size:11px;color:var(--text-muted)">Posted by Admin · 20/04/2024</div></div><div class="btn-group"><button class="btn-icon">✏️</button><button class="btn-icon">🗑️</button></div></div></div>
<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><span class="badge badge-info" style="margin-bottom:8px">🔔 Announcement</span><h3 style="font-weight:700;color:var(--text-primary)">Water Tank Cleaning on 28th April</h3><p style="font-size:13px;color:var(--text-secondary);margin:8px 0">Water supply will be interrupted from 9 AM to 3 PM on 28/04/2024 for tank cleaning.</p><div style="font-size:11px;color:var(--text-muted)">Posted by Admin · 22/04/2024</div></div><div class="btn-group"><button class="btn-icon">✏️</button><button class="btn-icon">🗑️</button></div></div></div>
<div class="card"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><span class="badge badge-warning" style="margin-bottom:8px">⚠️ Important</span><h3 style="font-weight:700;color:var(--text-primary)">Maintenance Due Date Reminder</h3><p style="font-size:13px;color:var(--text-secondary);margin:8px 0">All members are requested to pay maintenance dues before 10th of every month to avoid interest charges @ 21% p.a.</p><div style="font-size:11px;color:var(--text-muted)">Posted by Secretary · 25/04/2024</div></div><div class="btn-group"><button class="btn-icon">✏️</button><button class="btn-icon">🗑️</button></div></div></div></div>
<div class="modal-overlay" id="noticeModal"><div class="modal"><div class="modal-header"><h3>Post Notice</h3><button class="modal-close" onclick="closeModal('noticeModal')">✕</button></div><div class="modal-body"><div class="form-group"><label class="form-label">Title</label><input type="text" class="form-input"></div><div class="form-group"><label class="form-label">Category</label><select class="form-input"><option>Announcement</option><option>Important</option><option>Maintenance</option><option>Meeting</option></select></div><div class="form-group"><label class="form-label">Content</label><textarea class="form-input" rows="5"></textarea></div><div class="form-group"><label class="form-label">Pin to Top</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div></div><div class="modal-footer"><button class="btn-secondary" onclick="closeModal('noticeModal')">Cancel</button><button class="btn-primary" onclick="showToast('Notice posted');closeModal('noticeModal')">Post</button></div></div></div>`);

// HELP
m('help.html','Help & Documentation','Home / Help',`
<div class="page-header"><div><h1>Help & Documentation</h1><p>User guides and support</p></div></div>
<div class="card" style="margin-bottom:24px"><input type="text" class="form-input" placeholder="🔍 Search help topics..." style="font-size:16px;padding:14px"></div>
<div class="module-grid">
<div class="card module-card"><div class="mc-icon">📖</div><h3>Getting Started</h3><p>Initial setup guide — society profile, members, accounts</p></div>
<div class="card module-card"><div class="mc-icon">🧾</div><h3>Billing Guide</h3><p>How to generate, modify, and cancel bills</p></div>
<div class="card module-card"><div class="mc-icon">💰</div><h3>Receipts & Payments</h3><p>Recording member receipts and society payments</p></div>
<div class="card module-card"><div class="mc-icon">📊</div><h3>Reports Guide</h3><p>Understanding financial reports</p></div>
<div class="card module-card"><div class="mc-icon">📱</div><h3>Communication</h3><p>WhatsApp, Email & reminder setup</p></div>
<div class="card module-card"><div class="mc-icon">🔐</div><h3>Security & RBAC</h3><p>Managing users, roles and permissions</p></div>
<div class="card module-card"><div class="mc-icon">⚖️</div><h3>Compliance</h3><p>GST, TDS, IT returns guide</p></div>
<div class="card module-card"><div class="mc-icon">📞</div><h3>Contact Support</h3><p>Email: support@jeevika.com<br>📞 1800-123-4567</p></div>
</div>`);

// MEMBER MASTER (account already done in batch2, need this page)
m('receipt-register.html','Receipt Register','Home / Reports / Receipt Register',`
<div class="page-header"><div><h1>Receipt Register</h1><p>All receipts register</p></div><div class="btn-group"><button class="btn-secondary">📤 Export</button><button class="btn-secondary" onclick="printSection('reportTable')">🖨️</button></div></div>
<div class="card" style="margin-bottom:16px"><div class="form-row"><div class="form-group"><label class="form-label">From</label><input type="text" class="form-input date-picker" value="01/04/2024"></div><div class="form-group"><label class="form-label">To</label><input type="text" class="form-input date-picker" value="30/04/2024"></div><div class="form-group"><label class="form-label">Mode</label><select class="form-input"><option>All</option><option>Cash</option><option>Cheque</option><option>NEFT</option><option>UPI</option></select></div></div></div>
<div class="card" id="reportTable"><table class="data-table"><thead><tr><th>Receipt No.</th><th>Date</th><th>Member</th><th>Flat</th><th>Mode</th><th>Amount</th></tr></thead><tbody>
<tr><td>REC/2024/143</td><td>26/04/2024</td><td>Aman Salvi</td><td>A-101</td><td>NEFT</td><td class="amount">₹6,510</td></tr>
<tr><td>REC/2024/142</td><td>26/04/2024</td><td>Sunita Joshi</td><td>A-404</td><td>Cash</td><td class="amount">₹6,510</td></tr>
<tr><td>REC/2024/141</td><td>25/04/2024</td><td>Priya Sharma</td><td>B-205</td><td>Cheque</td><td class="amount">₹6,510</td></tr>
</tbody></table></div>`);

m('payment-register.html','Payment Register','Home / Reports / Payment Register',`
<div class="page-header"><div><h1>Payment Register</h1><p>All payments register</p></div><div class="btn-group"><button class="btn-secondary">📤 Export</button><button class="btn-secondary" onclick="printSection('reportTable')">🖨️</button></div></div>
<div class="card" style="margin-bottom:16px"><div class="form-row"><div class="form-group"><label class="form-label">From</label><input type="text" class="form-input date-picker" value="01/04/2024"></div><div class="form-group"><label class="form-label">To</label><input type="text" class="form-input date-picker" value="30/04/2024"></div></div></div>
<div class="card" id="reportTable"><table class="data-table"><thead><tr><th>Voucher No.</th><th>Date</th><th>Party</th><th>Particulars</th><th>Mode</th><th>Amount</th></tr></thead><tbody>
<tr><td>PV/2024/034</td><td>24/04/2024</td><td>City Plumber</td><td>Plumbing repairs</td><td>Cheque</td><td class="amount">₹12,500</td></tr>
<tr><td>PV/2024/033</td><td>20/04/2024</td><td>Mumbai Electricals</td><td>Electrical work</td><td>NEFT</td><td class="amount">₹8,500</td></tr>
</tbody></table></div>`);

console.log('=== ALL REMAINING BATCHES COMPLETE ===');
