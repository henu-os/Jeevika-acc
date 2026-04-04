const fs=require('fs'),p=require('path'),d='H:\\Jeevika Accounting\\html';
const sb=`<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div><nav class="sidebar-nav"><div class="nav-item"><a href="dashboard.html"><span class="icon">\u{1F4CA}</span> Dashboard</a></div><div class="nav-item"><a href="masters.html"><span class="icon">\u{1F4CB}</span> Masters</a></div><div class="nav-item"><a href="transactions.html"><span class="icon">\u{1F4B0}</span> Transactions</a></div><div class="nav-item"><a href="reports.html"><span class="icon">\u{1F4C8}</span> Reports</a></div><div class="nav-item"><a href="communication.html"><span class="icon">\u{1F4AC}</span> Communication</a></div><div class="nav-item"><a href="utilities.html"><span class="icon">\u{1F527}</span> Utilities</a></div><div class="nav-item"><a href="billing-utilities.html"><span class="icon">\u{1F9FE}</span> Billing Utilities</a></div><div class="nav-item"><a href="statutory.html"><span class="icon">\u2696\uFE0F</span> Stat. Compliance</a></div><div class="nav-item"><a href="forms-audit.html"><span class="icon">\u{1F4DD}</span> Forms &amp; Audit</a></div><div class="nav-item"><a href="access-security.html"><span class="icon">\u{1F510}</span> Access &amp; Security</a></div><div class="sidebar-section">\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div><div class="sidebar-bottom"><div class="nav-item"><a href="notices.html"><span class="icon">\u{1F4CC}</span> Notice Board</a></div><div class="nav-item"><a href="help.html"><span class="icon">\u2753</span> Help &amp; Documentation</a></div></div></nav></aside>`;
const tb=(t,b)=>`<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">\u2630</button><div><div class="page-title">${t}</div><div class="breadcrumb">${b}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">\u{1F514}<span class="notif-badge">3</span></button><button class="topbar-icon">\u229E</button><button class="topbar-icon">\u{1F6E1}\uFE0F</button><button class="topbar-icon">\u2709\uFE0F</button><button class="topbar-icon">\u2699\uFE0F</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">\u25BC</span></div></div></header>`;
const m=(f,ti,b,body,eh='',ej='')=>{fs.writeFileSync(p.join(d,f),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${ti} \u2014 Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">${eh}</head><body>${sb}<div class="main-wrapper">${tb(ti,b)}<main class="page-content">${body}</main></div><script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"><\/script><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"><\/script><script src="https://cdn.jsdelivr.net/npm/flatpickr"><\/script><script src="../js/global.js"><\/script>${ej}</body></html>`,{encoding:'utf8'});console.log('OK '+f);};

// MASTERS HUB
const mc=(icon,title,desc,href,badge)=>`<div class="card module-card" onclick="location.href='${href}'"><div class="mc-icon">${icon}</div><h3>${title}</h3><p>${desc}</p><div class="mc-footer"><a class="mc-link" href="${href}">\u2192 Open</a>${badge?`<span class="mc-badge">${badge}</span>`:''}</div></div>`;
m('masters.html','Masters','Home / Masters',`
<div class="page-header"><div><h1>Masters</h1><p>Manage your society's core data</p></div><button class="btn-primary">+ Add New</button></div>
<div class="module-grid">
${mc('\u{1F3E2}','Society / Company Master','Society profile and basic setup','#','Active')}
${mc('\u{1F465}','Member Master','Flat owners, members and KYC data','member-master.html','120 Members')}
${mc('\u{1F4C1}','Account Master','Chart of accounts \u2014 80+ pre-seeded','account-master.html','84 Accounts')}
${mc('\u{1F4D3}','Group Master','Account grouping and sub-groups','group-master.html','24 Groups')}
${mc('\u{1F9FE}','Billing Master','Bill types and charge heads','billing-master.html','5 Bill Types')}
${mc('\u{1F4CD}','Area Master','Flat-wise area setup for billing','area-master.html','120 Flats')}
${mc('%','GST Master','GST slabs and HSN/SAC codes','gst-master.html','Active')}
${mc('\u{1F3E6}','Opening Bank Record','Initial bank account balances','opening-bank.html','3 Banks')}
${mc('\u2696\uFE0F','Opening Balances','Member-wise opening balances','opening-balances.html','FY 2024-25')}
${mc('\u{1F5A8}\uFE0F','Bill Print Setup','Receipt and bill print templates','bill-print-setup.html','3 Templates')}
${mc('\u{1F464}','Servant Master','Servant/helper data entry','servant-master.html','12 Records')}
${mc('\u{1F3E6}','Fixed Deposit','FD details and maturity tracking','fixed-deposit.html','8 FDs')}
${mc('\u{1F465}','Committee Master','Managing committee members','committee-master.html','9 Members')}
${mc('\u{1F468}\u200D\u{1F4BC}','Vendor Master','Vendor directory','vendor-master.html','15 Vendors')}
</div>`);

// TRANSACTIONS HUB
m('transactions.html','Transactions','Home / Transactions',`
<div class="page-header"><div><h1>Transactions</h1><p>Financial transaction entry & management</p></div></div>
<div class="module-grid">
${mc('\u{1F4C4}','Member Bill','Generate maintenance bills','member-bill.html','120 Bills')}
${mc('\u{1F9FE}','Member Receipt','Record member payments','member-receipt.html','+143')}
${mc('\u{1F4DD}','Debit Note','Charge extra to members','debit-note.html','12 Notes')}
${mc('\u{1F4DD}','Credit Note','Credit adjustments & refunds','credit-note.html','8 Notes')}
${mc('\u{1F3E6}','Cheque Adjustment','Handle bounced cheques','cheque-adjustment.html','2 Pending')}
${mc('\u{1F4B5}','Receipt Voucher','Society receipts','receipt-voucher.html','')}
${mc('\u{1F4B3}','Payment Voucher','Society payments','payment-voucher.html','')}
${mc('\u{1F504}','Contra Voucher','Bank-Cash transfers','contra-voucher.html','')}
${mc('\u{1F4D2}','Journal Voucher','General journal entries','journal-voucher.html','')}
${mc('\u{1F4D1}','Member Journal','Member-specific journals','member-journal.html','')}
${mc('\u{1F4E5}','Multi Receipt','Bulk receipt entry','multi-receipt.html','')}
${mc('\u{1F3E6}','Bank Reconciliation','Match bank vs books','bank-reconciliation.html','Match')}
${mc('\u{1F4CC}','Quick Note','Fast memo entry','quick-note.html','')}
</div>`);

// REPORTS HUB
m('reports.html','Reports','Home / Reports',`
<div class="page-header"><div><h1>Reports</h1><p>Financial reports and analytics</p></div></div>
<div class="module-grid">
${mc('\u{1F4B0}','Outstanding List','Member-wise outstanding dues','outstanding-list.html','42 Due')}
${mc('\u{1F4D6}','Member Ledger','Individual member full ledger','member-ledger.html','')}
${mc('\u{1F4CA}','Trial Balance','Complete trial balance','trial-balance.html','Balanced')}
${mc('\u{1F4D1}','Balance Sheet','Statutory balance sheet','balance-sheet.html','')}
${mc('\u{1F4C8}','Income & Expenditure','I&E statement','income-expenditure.html','')}
${mc('\u{1F4B5}','Cash Book','Day-wise cash transactions','cash-book.html','')}
${mc('\u{1F3E6}','Bank Book','Bank account transactions','bank-book.html','')}
${mc('\u{1F4D2}','Account Ledger','Account-wise ledger','account-ledger.html','')}
${mc('\u{1F3E2}','Society Account','Society-level account','society-account.html','')}
${mc('\u{1F4C5}','Monthly Report','Month-wise I&E summary','monthly-report.html','')}
${mc('\u{1F4CB}','Member Register','Complete member directory','member-register.html','')}
${mc('\u{1F9FE}','Receipt Register','All receipts log','receipt-register.html','')}
${mc('\u{1F4B3}','Payment Register','All payments log','payment-register.html','')}
${mc('\u2709\uFE0F','Balance Confirmation','Official balance letter','balance-confirm-letter.html','')}
</div>`);

// DASHBOARD
m('dashboard.html','Dashboard','Home / Dashboard',`
<div class="stats-row">
<div class="card stat-card"><div class="stat-icon green">\u{1F4B0}</div><div class="stat-label">Monthly Income</div><div class="stat-value" data-target="554200">\u20B90</div><div class="stat-sub">\u2191 12.5%</div></div>
<div class="card stat-card"><div class="stat-icon blue">\u{1F3E6}</div><div class="stat-label">Cash in Bank</div><div class="stat-value" data-target="54315">\u20B90</div><div class="stat-sub">\u2191 8.2%</div></div>
<div class="card stat-card"><div class="stat-icon red">\u{1F4CB}</div><div class="stat-label">Pending Invoices</div><div class="stat-value" data-target="150750">\u20B90</div><div class="stat-sub">\u2193 3.1%</div></div>
<div class="card stat-card"><div class="stat-icon purple">\u{1F4C8}</div><div class="stat-label">Monthly Profit</div><div class="stat-value" data-target="182200">\u20B90</div><div class="stat-sub">\u2191 5.4%</div></div></div>

<div style="display:grid;grid-template-columns:1fr 400px;gap:24px">
<div class="card" style="text-align:center;padding:24px"><h3 style="font-weight:700;margin-bottom:20px">Overall System Architecture</h3>
<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:center">
<div style="border:2px solid var(--accent);border-radius:var(--radius-lg);padding:16px;width:180px;text-align:left"><div style="font-weight:700;color:var(--primary)">\u{1F4CB} Masters</div><ul style="font-size:12px;color:var(--text-muted);margin:8px 0 0;padding-left:16px"><li>Member Master</li><li>Account Master</li><li>Billing Setup</li><li>GST Config</li></ul></div>
<div style="border:2px solid var(--accent);border-radius:var(--radius-lg);padding:16px;width:180px;text-align:left"><div style="font-weight:700;color:var(--primary)">\u{1F4B0} Transactions</div><ul style="font-size:12px;color:var(--text-muted);margin:8px 0 0;padding-left:16px"><li>Bills & Receipts</li><li>Vouchers</li><li>Bank Recon</li><li>Multi Receipt</li></ul></div>
<div style="width:100px;height:100px;border-radius:50%;background:var(--primary);display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;margin:8px"><div style="font-size:24px;font-weight:800">J</div><div style="font-size:10px;font-weight:600">JEEVIKA</div><div style="font-size:8px;opacity:0.8">accounting</div></div>
<div style="border:2px solid var(--accent);border-radius:var(--radius-lg);padding:16px;width:180px;text-align:left"><div style="font-weight:700;color:var(--primary)">\u{1F4C8} Reports</div><ul style="font-size:12px;color:var(--text-muted);margin:8px 0 0;padding-left:16px"><li>Trial Balance</li><li>Balance Sheet</li><li>I&E Statement</li><li>Outstanding</li></ul></div>
<div style="border:2px solid var(--accent);border-radius:var(--radius-lg);padding:16px;width:180px;text-align:left"><div style="font-weight:700;color:var(--primary)">\u{1F527} Utilities</div><ul style="font-size:12px;color:var(--text-muted);margin:8px 0 0;padding-left:16px"><li>Transfer</li><li>Import/Export</li><li>Interest Calc</li><li>Rebuild</li></ul></div>
<div style="border:2px solid var(--accent);border-radius:var(--radius-lg);padding:16px;width:180px;text-align:left"><div style="font-weight:700;color:var(--primary)">\u{1F4AC} Communications</div><ul style="font-size:12px;color:var(--text-muted);margin:8px 0 0;padding-left:16px"><li>WhatsApp</li><li>Email</li><li>RCS</li><li>Reminders</li></ul></div>
<div style="border:2px solid var(--accent);border-radius:var(--radius-lg);padding:16px;width:180px;text-align:left"><div style="font-weight:700;color:var(--primary)">\u{1F510} RBAC</div><ul style="font-size:12px;color:var(--text-muted);margin:8px 0 0;padding-left:16px"><li>Roles</li><li>Permissions</li><li>Users</li><li>Audit Trail</li></ul></div>
</div></div>

<div style="display:flex;flex-direction:column;gap:20px">
<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="font-weight:700">Outstanding</h3><a href="outstanding-list.html" style="font-size:12px;color:var(--accent)">Next \u2192</a></div>
<div style="display:flex;flex-direction:column;gap:12px">
<div style="display:flex;align-items:center;gap:12px"><div class="avatar" style="width:36px;height:36px;font-size:11px;background:var(--accent-soft);color:var(--primary)">AS</div><div style="flex:1"><div style="font-weight:600;font-size:13px">Aman Salvi</div><div style="font-size:11px;color:var(--text-muted)">A-101 \u00B7 M001</div></div><div style="text-align:right"><div class="amount" style="color:var(--danger);font-weight:700">\u20B915,500</div><div style="font-size:10px;color:var(--text-muted)">Due: 10 Apr</div></div></div>
<div style="display:flex;align-items:center;gap:12px"><div class="avatar" style="width:36px;height:36px;font-size:11px;background:#FEE2E2;color:var(--danger)">PS</div><div style="flex:1"><div style="font-weight:600;font-size:13px">Priya Sharma</div><div style="font-size:11px;color:var(--text-muted)">B-205 \u00B7 M002</div></div><div style="text-align:right"><div class="amount" style="color:var(--danger);font-weight:700">\u20B985,000</div><div style="font-size:10px;color:var(--text-muted)">Due: 10 Mar</div></div></div>
<div style="display:flex;align-items:center;gap:12px"><div class="avatar" style="width:36px;height:36px;font-size:11px;background:#FEF3C7;color:var(--warning)">RP</div><div style="flex:1"><div style="font-weight:600;font-size:13px">Rajesh Patil</div><div style="font-size:11px;color:var(--text-muted)">C-302 \u00B7 M003</div></div><div style="text-align:right"><div class="amount" style="color:var(--danger);font-weight:700">\u20B942,300</div><div style="font-size:10px;color:var(--text-muted)">Due: 10 Feb</div></div></div>
</div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:12px">Income Sources</h3><canvas id="incChart" height="200"></canvas></div>
</div></div>`,
`<link rel="stylesheet" href="../css/dashboard.css">`,
`<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script><script src="../js/dashboard.js"><\/script>`);

// LOGIN
fs.writeFileSync(p.join(d,'login.html'),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Login \u2014 Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="../css/login.css"></head><body>
<div class="login-container"><div class="login-left"><div class="brand"><div class="logo-icon" style="width:60px;height:60px;font-size:28px">J</div><h1>jeevika</h1><p>accounting</p></div><h2 style="font-size:28px;font-weight:800;color:white;margin-bottom:12px">Housing Society<br>Accounting Software</h2><p style="color:rgba(255,255,255,0.7);font-size:14px">Complete ERP for Co-operative Housing Societies</p></div>
<div class="login-right"><div class="login-form"><h2 style="font-size:24px;font-weight:800;color:var(--text-primary);margin-bottom:8px">Welcome Back</h2><p style="color:var(--text-muted);margin-bottom:24px">Sign in to your account</p>
<div class="tabs" style="margin-bottom:20px"><button class="tab-btn active" data-tab-btn="login" data-tab="loginPwd" onclick="switchTab('login','loginPwd')">Password</button><button class="tab-btn" data-tab-btn="login" data-tab="loginOtp" onclick="switchTab('login','loginOtp')">OTP</button></div>
<div id="loginPwd" class="tab-content active" data-tab-group="login">
<div class="form-group"><label class="form-label">Email / Mobile</label><input type="text" class="form-input" placeholder="admin@society.com"></div>
<div class="form-group"><label class="form-label">Password</label><div style="position:relative"><input type="password" class="form-input" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"><button type="button" onclick="this.previousElementSibling.type=this.previousElementSibling.type==='password'?'text':'password'" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer">\u{1F441}</button></div></div>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer"><input type="checkbox"> Remember me</label><a href="#" style="font-size:13px;color:var(--accent)">Forgot Password?</a></div>
<button class="btn-primary" style="width:100%" onclick="location.href='dashboard.html'">\u{1F512} Sign In</button></div>
<div id="loginOtp" class="tab-content" data-tab-group="login">
<div class="form-group"><label class="form-label">Mobile Number</label><input type="tel" class="form-input" placeholder="+91 98765 43210"></div>
<button class="btn-primary" style="width:100%">\u{1F4F1} Send OTP</button></div>
<div style="text-align:center;margin-top:20px"><p style="font-size:12px;color:var(--text-muted)">Or sign in with</p>
<button class="btn-secondary" style="width:100%;margin-top:8px">G \u00B7 Continue with Google</button></div>
</div></div></div>
<script src="../js/global.js"><\/script><script src="../js/login.js"><\/script></body></html>`,{encoding:'utf8'});
console.log('OK login.html');

console.log('=== HUB PAGES COMPLETE ===');
