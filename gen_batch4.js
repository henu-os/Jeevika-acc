const fs=require('fs'),path=require('path'),dir='H:\\Jeevika Accounting\\html';
const sb=`<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div><nav class="sidebar-nav"><div class="nav-item"><a href="dashboard.html"><span class="icon">📊</span> Dashboard</a></div><div class="nav-item"><a href="masters.html"><span class="icon">📋</span> Masters</a></div><div class="nav-item"><a href="transactions.html"><span class="icon">💰</span> Transactions</a></div><div class="nav-item"><a href="reports.html"><span class="icon">📈</span> Reports</a></div><div class="nav-item"><a href="communication.html"><span class="icon">💬</span> Communication</a></div><div class="nav-item"><a href="utilities.html"><span class="icon">🔧</span> Utilities</a></div><div class="nav-item"><a href="billing-utilities.html"><span class="icon">🧾</span> Billing Utilities</a></div><div class="nav-item"><a href="statutory.html"><span class="icon">⚖️</span> Stat. Compliance</a></div><div class="nav-item"><a href="forms-audit.html"><span class="icon">📝</span> Forms &amp; Audit</a></div><div class="nav-item"><a href="access-security.html"><span class="icon">🔐</span> Access &amp; Security</a></div><div class="sidebar-section">───────────</div><div class="sidebar-bottom"><div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div><div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help &amp; Documentation</a></div></div></nav></aside>`;
function tb(t,b){return `<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">${t}</div><div class="breadcrumb">${b}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔<span class="notif-badge">3</span></button><button class="topbar-icon">⊞</button><button class="topbar-icon">🛡️</button><button class="topbar-icon">✉️</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">▼</span></div></div></header>`;}
function mp(f,t,b,body,eh='',ej=''){fs.writeFileSync(path.join(dir,f),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${t} — Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">${eh}</head><body>${sb}<div class="main-wrapper">${tb(t,b)}<main class="page-content">${body}</main></div><script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><script src="../js/global.js"></script>${ej}</body></html>`,'utf8');console.log('OK '+f);}

// ═══ OUTSTANDING LIST ═══
mp('outstanding-list.html','Outstanding List','Home / Reports / Outstanding List',`
<div class="page-header"><div><h1>Outstanding List</h1><p>Member-wise outstanding dues</p></div><div class="btn-group"><button class="btn-secondary">📱 Send Reminders</button><button class="btn-secondary">📄 PDF</button><button class="btn-secondary">📊 Excel</button></div></div>
<div class="stats-row"><div class="card stat-card"><div class="stat-icon red">💰</div><div class="stat-label">Total Outstanding</div><div class="stat-value" data-target="1505000">₹0</div></div>
<div class="card stat-card"><div class="stat-icon yellow">👥</div><div class="stat-label">Members with Dues</div><div class="stat-value" style="font-size:24px;font-weight:800;color:var(--text-primary)">42</div></div>
<div class="card stat-card"><div class="stat-icon blue">📊</div><div class="stat-label">Average Outstanding</div><div class="stat-value" data-target="35833">₹0</div></div>
<div class="card stat-card"><div class="stat-icon purple">🏆</div><div class="stat-label">Highest Outstanding</div><div class="stat-value" data-target="85000">₹0</div><div class="stat-sub">Priya Sharma</div></div></div>
<div class="card"><div class="filter-bar"><select class="form-input" style="width:140px"><option>FY 2024-25</option></select><select class="form-input" style="width:120px"><option>All Wings</option><option>Wing A</option><option>Wing B</option><option>Wing C</option></select><select class="form-input" style="width:120px"><option>All Types</option><option>1BHK</option><option>2BHK</option><option>3BHK</option></select><select class="form-input" style="width:140px"><option>Sort: Amount ↓</option><option>Sort: Name</option><option>Sort: Days Overdue</option></select></div>
<table class="data-table" id="outstandingTable"><thead><tr><th>Code</th><th>Name</th><th>Flat</th><th>Wing</th><th>Principal</th><th>Interest</th><th>Total</th><th>Last Payment</th><th>Days Overdue</th><th>Actions</th></tr></thead><tbody>
<tr style="background:#FEE2E2"><td>M002</td><td style="font-weight:600">Priya Sharma</td><td>B-205</td><td>B</td><td class="amount">₹70,000</td><td class="amount">₹15,000</td><td class="amount" style="color:var(--danger);font-weight:800">₹85,000</td><td>10/01/2024</td><td><span class="badge badge-danger">106 days</span></td><td><button class="btn-icon">📖</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
<tr style="background:#FEF3C7"><td>M003</td><td style="font-weight:600">Rajesh Patil</td><td>C-302</td><td>C</td><td class="amount">₹35,000</td><td class="amount">₹7,300</td><td class="amount" style="color:var(--warning);font-weight:800">₹42,300</td><td>12/02/2024</td><td><span class="badge badge-warning">74 days</span></td><td><button class="btn-icon">📖</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
<tr><td>M001</td><td style="font-weight:600">Aman Salvi</td><td>A-101</td><td>A</td><td class="amount">₹12,000</td><td class="amount">₹3,500</td><td class="amount" style="font-weight:700">₹15,500</td><td>10/03/2024</td><td><span class="badge badge-info">16 days</span></td><td><button class="btn-icon">📖</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
<tr><td>M005</td><td style="font-weight:600">Vikram Mehta</td><td>B-106</td><td>B</td><td class="amount">₹4,000</td><td class="amount">₹1,200</td><td class="amount" style="font-weight:700">₹5,200</td><td>08/03/2024</td><td><span class="badge badge-info">18 days</span></td><td><button class="btn-icon">📖</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
<tr><td>M004</td><td style="font-weight:600">Sunita Joshi</td><td>A-404</td><td>A</td><td class="amount">₹2,000</td><td class="amount">₹0</td><td class="amount" style="font-weight:700">₹2,000</td><td>20/03/2024</td><td><span class="badge badge-success">6 days</span></td><td><button class="btn-icon">📖</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
</tbody></table></div>`);

// ═══ MEMBER LEDGER ═══
mp('member-ledger.html','Member Ledger','Home / Reports / Member Ledger',`
<div class="page-header"><div><h1>Member Ledger</h1><p>Individual member full ledger</p></div><div class="btn-group"><button class="btn-secondary" onclick="printSection('ledgerTable')">🖨️ Print</button><button class="btn-secondary">📄 PDF</button><button class="btn-secondary">📱 WhatsApp</button></div></div>
<div class="card" style="margin-bottom:20px"><div class="form-row"><div class="form-group"><label class="form-label">Select Member</label><select class="form-input select2"><option>M001 — Aman Salvi (A-101)</option><option>M002 — Priya Sharma (B-205)</option><option>M003 — Rajesh Patil (C-302)</option></select></div>
<div class="form-group"><label class="form-label">From Date</label><input type="text" class="form-input date-picker" value="01/04/2024"></div>
<div class="form-group"><label class="form-label">To Date</label><input type="text" class="form-input date-picker" value="31/03/2025"></div></div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:12px;padding:12px;background:var(--accent-soft);border-radius:var(--radius-md)">
<div><span style="font-size:11px;color:var(--text-muted)">Name</span><div style="font-weight:700;color:var(--text-primary)">Aman Salvi</div></div>
<div><span style="font-size:11px;color:var(--text-muted)">Flat</span><div style="font-weight:700;color:var(--text-primary)">A-101, Wing A</div></div>
<div><span style="font-size:11px;color:var(--text-muted)">Contact</span><div style="font-weight:700;color:var(--text-primary)">9876543210</div></div>
<div><span style="font-size:11px;color:var(--text-muted)">Opening Balance</span><div style="font-weight:700;color:var(--danger)">₹15,500 (Due)</div></div></div></div>
<div class="card" id="ledgerTable"><table class="data-table"><thead><tr><th>Date</th><th>Particulars</th><th>Voucher No.</th><th>Dr (₹)</th><th>Cr (₹)</th><th>Balance (₹)</th></tr></thead><tbody>
<tr style="background:var(--accent-soft)"><td>01/04/2024</td><td style="font-weight:600">Opening Balance</td><td>—</td><td>—</td><td>—</td><td class="amount" style="color:var(--danger)">₹15,500</td></tr>
<tr style="background:#FEE2E2"><td>01/04/2024</td><td>Maintenance Bill — Apr 2024</td><td>BILL/2024/089</td><td class="amount">₹6,510</td><td>—</td><td class="amount" style="color:var(--danger)">₹22,010</td></tr>
<tr style="background:#DCFCE7"><td>10/04/2024</td><td>Receipt — Cash</td><td>REC/2024/135</td><td>—</td><td class="amount">₹6,000</td><td class="amount" style="color:var(--danger)">₹16,010</td></tr>
<tr style="background:#FEE2E2"><td>15/04/2024</td><td>Interest Charged</td><td>INT/2024/042</td><td class="amount">₹950</td><td>—</td><td class="amount" style="color:var(--danger)">₹16,960</td></tr>
<tr style="background:#DCFCE7"><td>26/04/2024</td><td>Receipt — NEFT</td><td>REC/2024/143</td><td>—</td><td class="amount">₹6,510</td><td class="amount" style="color:var(--danger)">₹10,450</td></tr>
<tr style="background:var(--accent-soft)"><td colspan="3" style="font-weight:700">Closing Balance</td><td class="amount" style="font-weight:700">₹7,460</td><td class="amount" style="font-weight:700">₹12,510</td><td class="amount" style="font-weight:800;color:var(--danger)">₹10,450</td></tr>
</tbody></table></div>`);

// ═══ LEDGER-STYLE REPORTS (reusable) ═══
function ledgerReport(f,t,br,desc,cols,rows){mp(f,t,br,`
<div class="page-header"><div><h1>${t}</h1><p>${desc}</p></div><div class="btn-group"><button class="btn-secondary" onclick="printSection('reportTable')">🖨️</button><button class="btn-secondary">📄 PDF</button><button class="btn-secondary">📊 Excel</button></div></div>
<div class="card" style="margin-bottom:20px"><div class="form-row"><div class="form-group"><label class="form-label">Financial Year</label><select class="form-input"><option>2024-25</option><option>2023-24</option></select></div>
<div class="form-group"><label class="form-label">From Date</label><input type="text" class="form-input date-picker" value="01/04/2024"></div>
<div class="form-group"><label class="form-label">To Date</label><input type="text" class="form-input date-picker" value="31/03/2025"></div></div></div>
<div class="card" id="reportTable"><table class="data-table"><thead><tr>${cols.map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`);}

// TRIAL BALANCE
mp('trial-balance.html','Trial Balance','Home / Reports / Trial Balance',`
<div class="page-header"><div><h1>Trial Balance</h1><p>Complete trial balance</p></div><div class="btn-group"><button class="btn-secondary" onclick="printSection('tbTable')">🖨️</button><button class="btn-secondary">📄 PDF</button><button class="btn-secondary">📊 Excel</button></div></div>
<div class="card" style="margin-bottom:20px"><div class="form-row"><div class="form-group"><label class="form-label">Financial Year</label><select class="form-input"><option>2024-25</option></select></div>
<div class="form-group"><label class="form-label">As of Date</label><input type="text" class="form-input date-picker" value="26/04/2024"></div>
<div class="form-group"><label class="form-label">Show Zero Balances</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div></div></div>
<div class="card" id="tbTable"><table class="data-table"><thead><tr><th>Code</th><th>Account Name</th><th style="text-align:right">Debit (₹)</th><th style="text-align:right">Credit (₹)</th></tr></thead><tbody>
<tr style="background:var(--accent-soft);font-weight:700"><td colspan="2">INCOME</td><td></td><td></td></tr>
<tr><td>1</td><td>Water Charges</td><td></td><td class="amount text-right">₹60,000</td></tr>
<tr><td>8</td><td>Maintenance Charges</td><td></td><td class="amount text-right">₹4,20,000</td></tr>
<tr><td>9</td><td>Parking Charges</td><td></td><td class="amount text-right">₹1,20,000</td></tr>
<tr><td>10</td><td>Interest from Member</td><td></td><td class="amount text-right">₹18,500</td></tr>
<tr style="background:var(--accent-soft);font-weight:700"><td colspan="2">EXPENDITURE</td><td></td><td></td></tr>
<tr><td>102</td><td>Water Charges Exp</td><td class="amount text-right">₹45,000</td><td></td></tr>
<tr><td>103</td><td>Electricity Exp</td><td class="amount text-right">₹1,25,000</td><td></td></tr>
<tr><td>104</td><td>Housekeeping Exp</td><td class="amount text-right">₹72,000</td><td></td></tr>
<tr style="background:var(--accent-soft);font-weight:700"><td colspan="2">ASSETS</td><td></td><td></td></tr>
<tr><td>202</td><td>Cash in Hand</td><td class="amount text-right">₹35,000</td><td></td></tr>
<tr><td>203</td><td>HDFC Bank A/C</td><td class="amount text-right">₹3,25,000</td><td></td></tr>
<tr><td>205</td><td>Investment in FDR</td><td class="amount text-right">₹25,00,000</td><td></td></tr>
<tr style="background:var(--accent-soft);font-weight:700"><td colspan="2">LIABILITIES</td><td></td><td></td></tr>
<tr><td>301</td><td>Issued Capital</td><td></td><td class="amount text-right">₹2,50,000</td></tr>
<tr><td>302</td><td>Reserve Fund</td><td></td><td class="amount text-right">₹8,20,480</td></tr>
<tr><td>309</td><td>Sinking Fund</td><td></td><td class="amount text-right">₹12,45,000</td></tr>
<tr style="background:var(--success);color:white;font-weight:800"><td colspan="2">TOTAL</td><td class="text-right">₹30,02,000</td><td class="text-right">₹30,02,000</td></tr>
</tbody></table><p style="text-align:center;margin-top:12px;font-weight:700;color:var(--success)">✓ Trial Balance is Balanced</p></div>`);

// BALANCE SHEET
mp('balance-sheet.html','Balance Sheet','Home / Reports / Balance Sheet',`
<div class="page-header"><div><h1>Balance Sheet</h1><p>Statutory balance sheet</p></div><div class="btn-group"><button class="btn-secondary">T-Format</button><button class="btn-primary">Vertical</button><button class="btn-secondary">Marathi</button><button class="btn-secondary" onclick="printSection('bsTable')">🖨️</button><button class="btn-secondary">📄 PDF</button></div></div>
<div class="card" id="bsTable"><div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div><h3 style="font-weight:700;color:var(--primary);margin-bottom:16px;text-align:center;padding:8px;background:var(--accent-soft);border-radius:var(--radius-md)">LIABILITIES</h3>
<table class="data-table"><tbody>
<tr style="font-weight:600"><td>Issued & Paid-up Capital</td><td class="amount text-right">₹2,50,000</td></tr>
<tr style="font-weight:600"><td>Reserve Fund</td><td class="amount text-right">₹8,20,480</td></tr>
<tr><td style="padding-left:24px">— General Reserve</td><td class="amount text-right">₹6,50,480</td></tr>
<tr><td style="padding-left:24px">— 25% Reserve</td><td class="amount text-right">₹1,70,000</td></tr>
<tr style="font-weight:600"><td>Sinking Fund</td><td class="amount text-right">₹12,45,000</td></tr>
<tr style="font-weight:600"><td>Building Repair Fund</td><td class="amount text-right">₹3,50,000</td></tr>
<tr style="font-weight:600"><td>I&E Surplus</td><td class="amount text-right">₹1,85,000</td></tr>
<tr style="font-weight:600"><td>Current Liabilities</td><td class="amount text-right">₹95,000</td></tr>
<tr style="background:var(--accent-soft);font-weight:800"><td>TOTAL</td><td class="amount text-right">₹29,45,480</td></tr>
</tbody></table></div>
<div><h3 style="font-weight:700;color:var(--primary);margin-bottom:16px;text-align:center;padding:8px;background:var(--accent-soft);border-radius:var(--radius-md)">ASSETS</h3>
<table class="data-table"><tbody>
<tr style="font-weight:600"><td>Fixed Assets</td><td class="amount text-right">₹1,50,000</td></tr>
<tr style="font-weight:600"><td>Investments (FDR)</td><td class="amount text-right">₹25,00,000</td></tr>
<tr style="font-weight:600"><td>Cash & Bank Balances</td><td class="amount text-right">₹3,60,000</td></tr>
<tr><td style="padding-left:24px">— Cash in Hand</td><td class="amount text-right">₹35,000</td></tr>
<tr><td style="padding-left:24px">— HDFC Bank</td><td class="amount text-right">₹3,25,000</td></tr>
<tr style="font-weight:600"><td>Dues from Members</td><td class="amount text-right">₹1,50,480</td></tr>
<tr style="font-weight:600"><td>Advance & Deposits</td><td class="amount text-right">₹35,000</td></tr>
<tr style="background:var(--accent-soft);font-weight:800"><td>TOTAL</td><td class="amount text-right">₹29,45,480</td></tr>
</tbody></table></div></div></div>`);

// INCOME & EXPENDITURE
mp('income-expenditure.html','Income & Expenditure','Home / Reports / Income & Expenditure',`
<div class="page-header"><div><h1>Income & Expenditure Account</h1><p>For the year ended 31st March 2025</p></div><div class="btn-group"><button class="btn-secondary" onclick="printSection('ieTable')">🖨️</button><button class="btn-secondary">📄</button><button class="btn-secondary">📊</button></div></div>
<div class="card" id="ieTable">
<h3 style="font-weight:700;color:var(--success);margin-bottom:12px">📈 INCOME</h3>
<table class="data-table" style="margin-bottom:24px"><tbody>
<tr><td>Maintenance Charges</td><td class="amount text-right">₹4,20,000</td></tr>
<tr><td>Water Charges</td><td class="amount text-right">₹60,000</td></tr>
<tr><td>Parking Charges</td><td class="amount text-right">₹1,20,000</td></tr>
<tr><td>Interest from Members</td><td class="amount text-right">₹18,500</td></tr>
<tr><td>Interest on FDR</td><td class="amount text-right">₹1,87,500</td></tr>
<tr><td>Other Income</td><td class="amount text-right">₹15,000</td></tr>
<tr style="background:#DCFCE7;font-weight:800"><td>Total Income</td><td class="amount text-right">₹8,21,000</td></tr>
</tbody></table>
<h3 style="font-weight:700;color:var(--danger);margin-bottom:12px">📉 EXPENDITURE</h3>
<table class="data-table" style="margin-bottom:24px"><tbody>
<tr><td>Water Charges Expense</td><td class="amount text-right">₹45,000</td></tr>
<tr><td>Electricity Expense</td><td class="amount text-right">₹1,25,000</td></tr>
<tr><td>Housekeeping Expense</td><td class="amount text-right">₹72,000</td></tr>
<tr><td>Repairs & Maintenance</td><td class="amount text-right">₹85,000</td></tr>
<tr><td>Insurance</td><td class="amount text-right">₹35,000</td></tr>
<tr><td>Office Expenses</td><td class="amount text-right">₹28,000</td></tr>
<tr><td>Professional Fees</td><td class="amount text-right">₹45,000</td></tr>
<tr><td>Depreciation</td><td class="amount text-right">₹12,000</td></tr>
<tr style="background:#FEE2E2;font-weight:800"><td>Total Expenditure</td><td class="amount text-right">₹4,47,000</td></tr>
</tbody></table>
<div style="padding:16px;background:var(--accent-soft);border-radius:var(--radius-md);display:flex;justify-content:space-between;align-items:center">
<span style="font-size:18px;font-weight:800;color:var(--primary)">SURPLUS (Income - Expenditure)</span>
<span style="font-size:24px;font-weight:800;color:var(--success)">₹3,74,000</span></div>
<div style="margin-top:12px;padding:12px;background:#DCFCE7;border-radius:var(--radius-md)"><span style="font-size:13px;font-weight:600">25% Transfer to Reserve Fund: <strong>₹93,500</strong></span></div></div>`);

// CASH BOOK & BANK BOOK
function bookPage(f,t,br,extra=''){
mp(f,t,br,`
<div class="page-header"><div><h1>${t}</h1><p>${t} — day-wise transaction log</p></div><div class="btn-group"><button class="btn-secondary" onclick="printSection('bookTable')">🖨️</button><button class="btn-secondary">📄</button><button class="btn-secondary">📊</button></div></div>
<div class="card" style="margin-bottom:20px"><div class="form-row"><div class="form-group"><label class="form-label">Financial Year</label><select class="form-input"><option>2024-25</option></select></div>
${extra}
<div class="form-group"><label class="form-label">From</label><input type="text" class="form-input date-picker" value="01/04/2024"></div>
<div class="form-group"><label class="form-label">To</label><input type="text" class="form-input date-picker" value="30/04/2024"></div></div></div>
<div class="card" id="bookTable"><table class="data-table"><thead><tr><th>Date</th><th>Particulars</th><th>Voucher No.</th>${f.includes('bank')?'<th>Cheque No.</th>':''}<th>Receipt (₹)</th><th>Payment (₹)</th><th>Balance (₹)</th></tr></thead><tbody>
<tr style="background:var(--accent-soft);font-weight:600"><td>01/04/2024</td><td>Opening Balance</td><td>—</td>${f.includes('bank')?'<td>—</td>':''}<td>—</td><td>—</td><td class="amount">₹${f.includes('bank')?'3,25,000':'35,000'}</td></tr>
<tr><td>05/04/2024</td><td>Maintenance Receipt — Aman Salvi</td><td>REC/2024/135</td>${f.includes('bank')?'<td>—</td>':''}<td class="amount">₹6,000</td><td>—</td><td class="amount">₹${f.includes('bank')?'3,31,000':'41,000'}</td></tr>
<tr><td>10/04/2024</td><td>Electricity Bill Payment — MSEB</td><td>PV/2024/031</td>${f.includes('bank')?'<td>456123</td>':''}<td>—</td><td class="amount">₹12,500</td><td class="amount">₹${f.includes('bank')?'3,18,500':'28,500'}</td></tr>
<tr><td>15/04/2024</td><td>Parking Receipt — Rajesh Patil</td><td>REC/2024/138</td>${f.includes('bank')?'<td>—</td>':''}<td class="amount">₹1,000</td><td>—</td><td class="amount">₹${f.includes('bank')?'3,19,500':'29,500'}</td></tr>
<tr style="background:var(--accent-soft);font-weight:600"><td>30/04/2024</td><td>Closing Balance</td><td>—</td>${f.includes('bank')?'<td>—</td>':''}<td class="amount" style="font-weight:700">₹7,000</td><td class="amount" style="font-weight:700">₹12,500</td><td class="amount" style="font-weight:800">₹${f.includes('bank')?'3,19,500':'29,500'}</td></tr>
</tbody></table></div>`);}

bookPage('cash-book.html','Cash Book','Home / Reports / Cash Book');
bookPage('bank-book.html','Bank Book','Home / Reports / Bank Book',`<div class="form-group"><label class="form-label">Bank Account</label><select class="form-input"><option>HDFC Bank — XXXX4521</option><option>SBI — XXXX8912</option></select></div>`);

// ACCOUNT LEDGER, SOCIETY ACCOUNT
['account-ledger.html','society-account.html'].forEach(f=>{
const t=f==='account-ledger.html'?'Account Ledger':'Society Account';
ledgerReport(f,t,`Home / Reports / ${t}`,`${t} — account-wise ledger`,
['Date','Particulars','Voucher','Dr (₹)','Cr (₹)','Balance (₹)'],
`<tr style="background:var(--accent-soft)"><td>01/04/2024</td><td style="font-weight:600">Opening Balance</td><td>—</td><td>—</td><td>—</td><td class="amount">₹0</td></tr>
<tr><td>01/04/2024</td><td>Maintenance Bill — All Members</td><td>BILL/2024/089</td><td class="amount">₹5,54,200</td><td>—</td><td class="amount">₹5,54,200</td></tr>
<tr><td>10/04/2024</td><td>Receipt — Aman Salvi</td><td>REC/2024/135</td><td>—</td><td class="amount">₹6,000</td><td class="amount">₹5,48,200</td></tr>
<tr><td>26/04/2024</td><td>Receipt — Aman Salvi</td><td>REC/2024/143</td><td>—</td><td class="amount">₹6,510</td><td class="amount">₹5,41,690</td></tr>`);});

// MONTHLY REPORT
mp('monthly-report.html','Monthly Report','Home / Reports / Monthly Report',`
<div class="page-header"><div><h1>Monthly Report</h1><p>Month-wise income/expenditure summary</p></div><select class="form-input" style="width:140px"><option>FY 2024-25</option></select></div>
<div class="grid-4" style="margin-bottom:24px">
<div class="card" style="text-align:center"><div style="font-size:13px;font-weight:600;color:var(--text-primary)">April</div><div style="font-size:11px;color:var(--success);margin:4px 0">Income: ₹5,54,200</div><div style="font-size:11px;color:var(--danger)">Expense: ₹3,72,000</div><div style="font-size:14px;font-weight:800;color:var(--success);margin-top:8px">+₹1,82,200</div></div>
<div class="card" style="text-align:center"><div style="font-size:13px;font-weight:600;color:var(--text-primary)">May</div><div style="font-size:11px;color:var(--success);margin:4px 0">Income: ₹5,48,000</div><div style="font-size:11px;color:var(--danger)">Expense: ₹3,95,000</div><div style="font-size:14px;font-weight:800;color:var(--success);margin-top:8px">+₹1,53,000</div></div>
<div class="card" style="text-align:center"><div style="font-size:13px;font-weight:600;color:var(--text-primary)">June</div><div style="font-size:11px;color:var(--success);margin:4px 0">Income: ₹5,62,000</div><div style="font-size:11px;color:var(--danger)">Expense: ₹4,10,000</div><div style="font-size:14px;font-weight:800;color:var(--success);margin-top:8px">+₹1,52,000</div></div>
<div class="card" style="text-align:center;border:2px solid var(--border-dark)"><div style="font-size:13px;font-weight:600;color:var(--text-muted)">July</div><div style="font-size:11px;color:var(--text-muted);margin:4px 0">Upcoming</div></div>
</div>
<div class="card"><div style="height:300px;display:flex;align-items:center;justify-content:center;color:var(--text-muted)">📊 Bar chart — Income vs Expenditure per month (Chart.js)</div></div>`,
`<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>`);

// RECEIPT & PAYMENT REGISTER
['receipt-register.html','payment-register.html'].forEach(f=>{
const t=f.includes('receipt')?'Receipt Register':'Payment Register';
const type=f.includes('receipt')?'Receipt':'Payment';
ledgerReport(f,t,`Home / Reports / ${t}`,`All ${type.toLowerCase()}s register`,
[`${type} No.`,'Date','Member/Party','Particulars','Mode','Amount (₹)','Posted By'],
`<tr><td>${type==='Receipt'?'REC':'PV'}/2024/143</td><td>26/04/2024</td><td>Aman Salvi</td><td>Maintenance — Apr 2024</td><td>NEFT</td><td class="amount">₹6,510</td><td>Admin</td></tr>
<tr><td>${type==='Receipt'?'REC':'PV'}/2024/142</td><td>26/04/2024</td><td>${type==='Receipt'?'Priya Sharma':'City Plumber'}</td><td>${type==='Receipt'?'Maintenance — Apr 2024':'Plumbing repairs'}</td><td>${type==='Receipt'?'Cash':'Cheque'}</td><td class="amount">₹${type==='Receipt'?'6,510':'12,500'}</td><td>Admin</td></tr>`);});

// BALANCE CONFIRM LETTER
mp('balance-confirm-letter.html','Balance Confirmation','Home / Reports / Balance Confirmation Letter',`
<div class="page-header"><div><h1>Balance Confirmation Letter</h1><p>Generate official balance confirmation for member</p></div></div>
<div style="display:grid;grid-template-columns:300px 1fr;gap:24px">
<div class="card"><div class="form-group"><label class="form-label">Select Member</label><select class="form-input select2"><option>M001 — Aman Salvi</option><option>M002 — Priya Sharma</option></select></div>
<div class="form-group"><label class="form-label">As of Date</label><input type="text" class="form-input date-picker" value="26/04/2024"></div>
<div class="btn-group" style="flex-direction:column;gap:8px"><button class="btn-primary" onclick="printSection('letterPreview')">🖨️ Print</button><button class="btn-secondary">📄 Download PDF</button><button class="btn-secondary">📱 Send WhatsApp</button></div></div>
<div class="card" id="letterPreview" style="font-size:13px;line-height:1.8">
<div style="text-align:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid var(--primary)"><div style="font-size:16px;font-weight:800;color:var(--primary)">Shree Sai Usha Complex Co-op Housing Society Ltd.</div><div style="font-size:12px;color:var(--text-muted)">Regd. No. BOM/HSG/4567 of 2010 | Andheri West, Mumbai - 400058</div></div>
<h3 style="text-align:center;font-size:15px;margin-bottom:16px;text-decoration:underline">CERTIFICATE OF OUTSTANDING BALANCE</h3>
<p>Date: 26/04/2024</p><p style="margin-top:12px">To,<br><strong>Mr. Aman Salvi</strong><br>Flat No. A-101, Wing A<br>Shree Sai Usha Complex</p>
<p style="margin-top:16px">Dear Member,</p>
<p>This is to certify that as per our records, the following balance is outstanding in your name as on <strong>26th April 2024</strong>:</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0"><tr style="background:var(--accent-soft)"><th style="padding:8px 12px;text-align:left;border:1px solid var(--border)">Particulars</th><th style="padding:8px 12px;text-align:right;border:1px solid var(--border)">Amount (₹)</th></tr>
<tr><td style="padding:8px 12px;border:1px solid var(--border)">Principal Outstanding</td><td style="padding:8px 12px;text-align:right;border:1px solid var(--border)">₹12,000</td></tr>
<tr><td style="padding:8px 12px;border:1px solid var(--border)">Interest Outstanding</td><td style="padding:8px 12px;text-align:right;border:1px solid var(--border)">₹3,500</td></tr>
<tr style="font-weight:700;background:var(--accent-soft)"><td style="padding:8px 12px;border:1px solid var(--border)">Total Outstanding Balance</td><td style="padding:8px 12px;text-align:right;border:1px solid var(--border)">₹15,500</td></tr></table>
<p>Kindly verify the above balance and confirm. In case of any discrepancy, please contact the society office within 15 days.</p>
<div style="margin-top:40px;display:flex;justify-content:space-between"><div><div style="border-top:1px solid var(--text-primary);padding-top:4px;width:200px;text-align:center">Member Signature</div></div>
<div><div style="border-top:1px solid var(--text-primary);padding-top:4px;width:200px;text-align:center">Authorised Signatory</div></div></div></div></div>`);

// MEMBER REGISTER
mp('member-register.html','Member Register','Home / Reports / Member Register',`
<div class="page-header"><div><h1>Member Register</h1><p>Complete member list with full details</p></div><div class="btn-group"><button class="btn-secondary">📊 Export Excel</button><button class="btn-secondary" onclick="printSection('memReg')">🖨️ Print</button></div></div>
<div class="card" id="memReg" style="overflow-x:auto"><table class="data-table"><thead><tr><th>Code</th><th>Name</th><th>Flat</th><th>Wing</th><th>Floor</th><th>Type</th><th>Area (sqft)</th><th>Contact</th><th>Email</th><th>Opening Bal</th><th>Share Cert</th><th>Status</th></tr></thead><tbody>
<tr><td>M001</td><td style="font-weight:600">Aman Salvi</td><td>A-101</td><td>A</td><td>1</td><td>2BHK</td><td>650</td><td>9876543210</td><td>aman@email.com</td><td class="amount">₹15,500</td><td>SC-001</td><td><span class="badge badge-success">Active</span></td></tr>
<tr><td>M002</td><td style="font-weight:600">Priya Sharma</td><td>B-205</td><td>B</td><td>2</td><td>3BHK</td><td>850</td><td>9876543211</td><td>priya@email.com</td><td class="amount">₹85,000</td><td>SC-002</td><td><span class="badge badge-success">Active</span></td></tr>
<tr><td>M003</td><td style="font-weight:600">Rajesh Patil</td><td>C-302</td><td>C</td><td>3</td><td>2BHK</td><td>750</td><td>9876543212</td><td>rajesh@email.com</td><td class="amount">₹42,300</td><td>SC-003</td><td><span class="badge badge-success">Active</span></td></tr>
<tr><td>M004</td><td style="font-weight:600">Sunita Joshi</td><td>A-404</td><td>A</td><td>4</td><td>2BHK</td><td>650</td><td>9876543213</td><td>sunita@email.com</td><td class="amount">₹2,000</td><td>SC-004</td><td><span class="badge badge-success">Active</span></td></tr>
<tr><td>M005</td><td style="font-weight:600">Vikram Mehta</td><td>B-106</td><td>B</td><td>1</td><td>3BHK</td><td>1050</td><td>9876543214</td><td>vikram@email.com</td><td class="amount">₹5,200</td><td>SC-005</td><td><span class="badge badge-danger">Inactive</span></td></tr>
</tbody></table></div>`);

console.log('=== BATCH 4 COMPLETE ===');
