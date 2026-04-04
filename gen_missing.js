const fs=require('fs'),p=require('path'),d='H:\\Jeevika Accounting\\html';
const s=`<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div><nav class="sidebar-nav"><div class="nav-item"><a href="dashboard.html"><span class="icon">📊</span> Dashboard</a></div><div class="nav-item"><a href="masters.html"><span class="icon">📋</span> Masters</a></div><div class="nav-item"><a href="transactions.html"><span class="icon">💰</span> Transactions</a></div><div class="nav-item"><a href="reports.html"><span class="icon">📈</span> Reports</a></div><div class="nav-item"><a href="communication.html"><span class="icon">💬</span> Communication</a></div><div class="nav-item"><a href="utilities.html"><span class="icon">🔧</span> Utilities</a></div><div class="nav-item"><a href="billing-utilities.html"><span class="icon">🧾</span> Billing Utilities</a></div><div class="nav-item"><a href="statutory.html"><span class="icon">⚖️</span> Stat. Compliance</a></div><div class="nav-item"><a href="forms-audit.html"><span class="icon">📝</span> Forms &amp; Audit</a></div><div class="nav-item"><a href="access-security.html"><span class="icon">🔐</span> Access &amp; Security</a></div><div class="sidebar-section">───────────</div><div class="sidebar-bottom"><div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div><div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help &amp; Documentation</a></div></div></nav></aside>`;
const t=(t,b)=>`<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">${t}</div><div class="breadcrumb">${b}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div></div></div></header>`;
const m=(f,ti,b,body)=>{fs.writeFileSync(p.join(d,f),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${ti} — Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"></head><body>${s}<div class="main-wrapper">${t(ti,b)}<main class="page-content">${body}</main></div><script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><script src="../js/global.js"></script></body></html>`,'utf8');console.log('OK '+f);};

m('member-master.html','Member Master','Home / Masters / Member Master',`
<div class="page-header"><div><h1>Member Master</h1><p>Flat owners, members and KYC data</p></div>
<div class="btn-group"><button class="btn-secondary">📥 Import</button><button class="btn-primary" onclick="openDrawer('memberDrawer')">+ Add Member</button></div></div>
<div class="card"><div class="table-toolbar"><input type="text" class="search-input" placeholder="Search members..."><div class="btn-group"><button class="btn-secondary">Filter</button><button class="btn-icon" onclick="printSection('memberTable')">🖨️</button></div></div>
<table class="data-table" id="memberTable"><thead><tr><th>Code</th><th>Name</th><th>Flat</th><th>Wing</th><th>Floor</th><th>Contact</th><th>Opening Bal</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<tr><td>M001</td><td style="font-weight:600">Aman Salvi</td><td>A-101</td><td>A</td><td>1</td><td>9876543210</td><td class="amount">₹15,500</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon" onclick="openDrawer('memberDrawer')">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon" onclick="confirmDelete('Delete Aman Salvi?')">🗑️</button></td></tr>
<tr><td>M002</td><td style="font-weight:600">Priya Sharma</td><td>B-205</td><td>B</td><td>2</td><td>9876543211</td><td class="amount">₹85,000</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>M003</td><td style="font-weight:600">Rajesh Patil</td><td>C-302</td><td>C</td><td>3</td><td>9876543212</td><td class="amount">₹42,300</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>M004</td><td style="font-weight:600">Sunita Joshi</td><td>A-404</td><td>A</td><td>4</td><td>9876543213</td><td class="amount">₹2,000</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>M005</td><td style="font-weight:600">Vikram Mehta</td><td>B-106</td><td>B</td><td>1</td><td>9876543214</td><td class="amount">₹5,200</td><td><span class="badge badge-danger">Inactive</span></td><td><button class="btn-icon">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
</tbody></table>
<div class="pagination"><div class="pagination-info">Showing 1-5 of 120</div><div class="pagination-buttons"><button>←</button><button class="active">1</button><button>2</button><button>3</button><button>...</button><button>24</button><button>→</button></div></div></div>
<div class="drawer-overlay" id="memberDrawer-overlay" onclick="closeDrawer('memberDrawer')"></div>
<div class="drawer" id="memberDrawer"><div class="drawer-header"><h3>Add New Member</h3><button class="drawer-close" onclick="closeDrawer('memberDrawer')">✕</button></div>
<div class="drawer-body">
<div class="tabs"><button class="tab-btn active" data-tab-btn="mem" data-tab="tBasic" onclick="switchTab('mem','tBasic')">Basic</button><button class="tab-btn" data-tab-btn="mem" data-tab="tFin" onclick="switchTab('mem','tFin')">Financial</button><button class="tab-btn" data-tab-btn="mem" data-tab="tCon" onclick="switchTab('mem','tCon')">Contact</button><button class="tab-btn" data-tab-btn="mem" data-tab="tPark" onclick="switchTab('mem','tPark')">Parking</button><button class="tab-btn" data-tab-btn="mem" data-tab="tShare" onclick="switchTab('mem','tShare')">Share Cert</button></div>
<div id="tBasic" class="tab-content active" data-tab-group="mem">
<div class="form-group"><label class="form-label">Member Code</label><input type="text" class="form-input" value="M006" disabled></div>
<div class="form-group"><label class="form-label">Name 1 (Primary) *</label><input type="text" class="form-input" required></div>
<div class="form-group"><label class="form-label">Name 2</label><input type="text" class="form-input"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Flat No.</label><select class="form-input select2"><option>A-101</option><option>A-102</option><option>B-201</option></select></div>
<div class="form-group"><label class="form-label">Wing</label><input type="text" class="form-input" placeholder="A"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Floor</label><input type="text" class="form-input"></div>
<div class="form-group"><label class="form-label">Flat Type</label><select class="form-input"><option>1BHK</option><option>2BHK</option><option>3BHK</option><option>Shop</option></select></div></div>
<div class="form-group"><label class="form-label">Area Type</label><select class="form-input"><option>RERA</option><option>MOFA</option><option>CIDCO</option></select></div></div>
<div id="tFin" class="tab-content" data-tab-group="mem">
<div class="form-row"><div class="form-group"><label class="form-label">Opening Bal — Principal</label><input type="number" class="form-input" value="0"></div>
<div class="form-group"><label class="form-label">Opening Bal — Interest</label><input type="number" class="form-input" value="0"></div></div>
<div class="form-group"><label class="form-label">GSTIN</label><input type="text" class="form-input"></div></div>
<div id="tCon" class="tab-content" data-tab-group="mem">
<div class="form-row"><div class="form-group"><label class="form-label">Contact 1</label><input type="tel" class="form-input"></div>
<div class="form-group"><label class="form-label">Contact 2</label><input type="tel" class="form-input"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Email 1</label><input type="email" class="form-input"></div>
<div class="form-group"><label class="form-label">Email 2</label><input type="email" class="form-input"></div></div></div>
<div id="tPark" class="tab-content" data-tab-group="mem">
<table class="data-table" id="pk4"><thead><tr><th>Slot</th><th>Type</th><th>Vehicle No</th><th></th></tr></thead><tbody>
<tr><td><input type="text" class="form-input" style="width:60px" value="P-01"></td><td><select class="form-input" style="width:100px"><option>Stilt</option><option>Open</option></select></td><td><input type="text" class="form-input" style="width:130px"></td><td><button class="btn-icon" onclick="removeTableRow(this)">🗑️</button></td></tr>
</tbody></table><button class="btn-secondary" style="margin-top:8px">+ Add Slot</button></div>
<div id="tShare" class="tab-content" data-tab-group="mem">
<div class="form-group"><label class="form-label">Share Certificate No.</label><input type="text" class="form-input"></div>
<div class="form-row"><div class="form-group"><label class="form-label">No. of Shares</label><input type="number" class="form-input" value="10" id="ns" oninput="document.getElementById('sa').value=this.value*50"></div>
<div class="form-group"><label class="form-label">Total Amount</label><input type="number" class="form-input" value="500" id="sa" disabled></div></div></div>
</div><div class="drawer-footer"><button class="btn-secondary" onclick="closeDrawer('memberDrawer')">Cancel</button><button class="btn-primary" onclick="showToast('Member saved');closeDrawer('memberDrawer')">Save Member</button></div></div>`);

m('account-master.html','Account Master','Home / Masters / Account Master',`
<div class="page-header"><div><h1>Account Master</h1><p>Chart of accounts — 80+ pre-seeded</p></div><button class="btn-primary" onclick="showToast('Use tree to add accounts','info')">+ Add Account</button></div>
<div style="display:grid;grid-template-columns:280px 1fr;gap:24px">
<div class="card" style="max-height:75vh;overflow-y:auto">
<input type="text" class="form-input" placeholder="Search accounts..." style="margin-bottom:12px">
<style>.tl{padding:4px 0}.tl .lb{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:13px;color:var(--text-secondary)}.tl .lb:hover{background:var(--accent-soft)}.tl .lb.ac{background:var(--accent-soft);color:var(--primary);font-weight:600}.tl .ch{padding-left:16px;display:none}.tl .ch.op{display:block}.tg{font-size:10px;color:var(--text-muted)}</style>
<div class="tl"><div class="lb" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span><strong>INCOME</strong></div><div class="ch">
<div class="tl"><div class="lb ac" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span>Maintenance & Service</div><div class="ch"><div class="tl"><div class="lb">1 — Water Charges</div></div><div class="tl"><div class="lb">8 — Maintenance Charges</div></div><div class="tl"><div class="lb">9 — Parking Charges</div></div></div></div>
<div class="tl"><div class="lb" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span>Interest Received</div><div class="ch"><div class="tl"><div class="lb">10 — Interest from Member</div></div><div class="tl"><div class="lb">11 — Interest on SB A/C</div></div><div class="tl"><div class="lb">12 — Interest on FDR</div></div></div></div></div></div>
<div class="tl"><div class="lb" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span><strong>EXPENDITURE</strong></div><div class="ch">
<div class="tl"><div class="lb" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span>Maintenance Exp</div><div class="ch"><div class="tl"><div class="lb">102 — Water Charges Exp</div></div><div class="tl"><div class="lb">103 — Electricity Exp</div></div><div class="tl"><div class="lb">104 — Housekeeping Exp</div></div></div></div></div></div>
<div class="tl"><div class="lb" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span><strong>ASSETS</strong></div><div class="ch">
<div class="tl"><div class="lb">202 — Cash in Hand</div></div><div class="tl"><div class="lb">203 — HDFC Bank A/C</div></div><div class="tl"><div class="lb">204 — SBI Bank A/C</div></div></div></div>
<div class="tl"><div class="lb" onclick="this.nextElementSibling.classList.toggle('op')"><span class="tg">▶</span><strong>LIABILITIES</strong></div><div class="ch">
<div class="tl"><div class="lb">301 — Issued Capital</div></div><div class="tl"><div class="lb">302 — Reserve Fund</div></div></div></div>
</div>
<div class="card">
<h3 style="font-size:18px;font-weight:700;margin-bottom:20px">Account Details</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Code</label><input type="text" class="form-input" value="1" disabled></div>
<div class="form-group"><label class="form-label">Account Name (English)</label><input type="text" class="form-input" value="Water Charges"></div></div>
<div class="form-group"><label class="form-label">Account Name (Marathi)</label><input type="text" class="form-input" value="पाणी शुल्क"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Main Group</label><select class="form-input"><option selected>INCOME</option><option>EXPENDITURE</option><option>ASSETS</option><option>LIABILITIES</option></select></div>
<div class="form-group"><label class="form-label">Sub-Group</label><select class="form-input"><option>Maintenance & Service</option></select></div></div>
<div class="form-group"><label class="form-label">Opening Balance</label><input type="number" class="form-input" value="0"></div>
<div class="btn-group" style="margin-top:16px"><button class="btn-primary" onclick="showToast('Account saved')">Save</button><button class="btn-danger" onclick="confirmDelete('Delete?')">Delete</button></div></div></div>`);

console.log('OK member-master + account-master');
