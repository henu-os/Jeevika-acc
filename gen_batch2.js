const fs = require('fs');
const path = require('path');
const dir = 'H:\\Jeevika Accounting\\html';

const sidebar = `<aside class="sidebar" id="sidebar">
<div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div>
<nav class="sidebar-nav">
<div class="nav-item"><a href="dashboard.html"><span class="icon">📊</span> Dashboard</a></div>
<div class="nav-item"><a href="masters.html"><span class="icon">📋</span> Masters</a></div>
<div class="nav-item"><a href="transactions.html"><span class="icon">💰</span> Transactions</a></div>
<div class="nav-item"><a href="reports.html"><span class="icon">📈</span> Reports</a></div>
<div class="nav-item"><a href="communication.html"><span class="icon">💬</span> Communication</a></div>
<div class="nav-item"><a href="utilities.html"><span class="icon">🔧</span> Utilities</a></div>
<div class="nav-item"><a href="billing-utilities.html"><span class="icon">🧾</span> Billing Utilities</a></div>
<div class="nav-item"><a href="statutory.html"><span class="icon">⚖️</span> Stat. Compliance</a></div>
<div class="nav-item"><a href="forms-audit.html"><span class="icon">📝</span> Forms &amp; Audit</a></div>
<div class="nav-item"><a href="access-security.html"><span class="icon">🔐</span> Access &amp; Security</a></div>
<div class="sidebar-section">───────────</div>
<div class="sidebar-bottom">
<div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div>
<div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help &amp; Documentation</a></div>
</div></nav></aside>`;

function topbar(title, bread) {
return `<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">${title}</div><div class="breadcrumb">${bread}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔<span class="notif-badge">3</span></button><button class="topbar-icon">⊞</button><button class="topbar-icon">🛡️</button><button class="topbar-icon">✉️</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">▼</span></div></div></header>`;
}

function makePage(file, title, bread, body, extraHead='', extraJs='') {
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title} — Jeevika Accounting</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/global.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
${extraHead}
</head>
<body>
${sidebar}
<div class="main-wrapper">
${topbar(title, bread)}
<main class="page-content">
${body}
</main>
</div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="../js/global.js"></script>
${extraJs}
</body></html>`;
fs.writeFileSync(path.join(dir, file), html, 'utf8');
console.log('OK ' + file);
}

// Helper for simple table+form pages
function tableFormPage(file, title, bread, thCols, rows, formFields) {
const ths = thCols.map(c => `<th>${c}</th>`).join('');
const trs = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('\n');
const fields = formFields.map(f => {
  if (f.type === 'select') return `<div class="form-group"><label class="form-label">${f.label}</label><select class="form-input select2">${f.options.map(o=>`<option>${o}</option>`).join('')}</select></div>`;
  if (f.type === 'textarea') return `<div class="form-group"><label class="form-label">${f.label}</label><textarea class="form-input" rows="3" placeholder="${f.ph||''}"></textarea></div>`;
  if (f.type === 'toggle') return `<div class="form-group"><label class="form-label">${f.label}</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>`;
  if (f.type === 'date') return `<div class="form-group"><label class="form-label">${f.label}</label><input type="text" class="form-input date-picker" placeholder="dd/mm/yyyy"></div>`;
  return `<div class="form-group"><label class="form-label">${f.label}</label><input type="${f.type||'text'}" class="form-input" placeholder="${f.ph||''}" ${f.req?'required':''}></div>`;
}).join('\n');

const body = `<div class="page-header"><div><h1>${title}</h1><p>${bread.split('/').pop().trim()}</p></div>
<div class="btn-group"><button class="btn-secondary">📤 Export</button><button class="btn-primary" onclick="openModal('addModal')">+ Add New</button></div></div>
<div class="card"><table class="data-table"><thead><tr>${ths}<th>Actions</th></tr></thead><tbody>${trs}</tbody></table></div>
<div class="modal-overlay" id="addModal"><div class="modal"><div class="modal-header"><h3>Add ${title.split(' ')[0]}</h3><button class="modal-close" onclick="closeModal('addModal')">✕</button></div>
<div class="modal-body">${fields}</div>
<div class="modal-footer"><button class="btn-secondary" onclick="closeModal('addModal')">Cancel</button><button class="btn-primary" onclick="showToast('Saved successfully');closeModal('addModal')">Save</button></div></div></div>`;
makePage(file, title, bread, body);
}

// ═══ BATCH 2: MASTERS ═══

// group-master
tableFormPage('group-master.html', 'Group Master', 'Home / Masters / Group Master',
['Main Group','Group Name','Primary Group','Type','Status'],
[['INCOME','Maintenance & Service','Income','Revenue','<span class="badge badge-success">Active</span>'],
 ['INCOME','Interest Received','Income','Revenue','<span class="badge badge-success">Active</span>'],
 ['EXPENDITURE','Maintenance Exp','Expenditure','Expense','<span class="badge badge-success">Active</span>'],
 ['ASSETS','Cash & Bank','Assets','Asset','<span class="badge badge-success">Active</span>'],
 ['LIABILITIES','Reserve Fund','Liabilities','Liability','<span class="badge badge-success">Active</span>']],
[{label:'Main Group',type:'select',options:['INCOME','EXPENDITURE','ASSETS','LIABILITIES']},
 {label:'Group Name (English)',ph:'Enter group name'},{label:'Group Name (Marathi)',ph:'मराठी नाव'},
 {label:'Parent Group',type:'select',options:['None','Income','Expenditure','Assets','Liabilities']},
 {label:'Is Fixed Asset Group?',type:'toggle'}]);

// area-master
tableFormPage('area-master.html', 'Area Master', 'Home / Masters / Area Master',
['Flat No.','Wing','Floor','Building','Area Type','Sq.ft','Sq.mtr'],
[['A-101','A','1','Shree Sai Usha','RERA','650','60.39'],
 ['B-205','B','2','Shree Sai Usha','RERA','850','78.97'],
 ['C-302','C','3','Shree Sai Usha','MOFA','750','69.68'],
 ['A-404','A','4','Shree Sai Usha','RERA','650','60.39'],
 ['B-106','B','1','Shree Sai Usha','RERA','1050','97.55']],
[{label:'Flat No.',ph:'A-101'},{label:'Wing',ph:'A'},{label:'Floor',type:'number',ph:'1'},
 {label:'Building',ph:'Building name'},{label:'Area Type',type:'select',options:['RERA','MOFA','CIDCO','MHADA']},
 {label:'Built-up Area (Sq.ft)',type:'number',ph:'650'},{label:'Carpet Area (Sq.mtr)',type:'number',ph:'60.39'}]);

// gst-master
tableFormPage('gst-master.html', 'GST Master', 'Home / Masters / GST Master',
['Account Head','GST %','CGST %','SGST %','IGST %','HSN/SAC','Auto-Compute','Status'],
[['Maintenance Charges','18%','9%','9%','18%','9972','<span class="badge badge-success">Yes</span>','<span class="badge badge-success">Active</span>'],
 ['Parking Charges','18%','9%','9%','18%','9972','<span class="badge badge-success">Yes</span>','<span class="badge badge-success">Active</span>'],
 ['Water Charges','0%','0%','0%','0%','—','<span class="badge badge-info">No</span>','<span class="badge badge-success">Active</span>']],
[{label:'Account Head',type:'select',options:['Maintenance Charges','Parking Charges','Water Charges','Electricity Charges','NOC Charges']},
 {label:'GST %',type:'select',options:['0','5','12','18','28']},{label:'HSN/SAC Code',ph:'9972'},
 {label:'Auto-Compute',type:'toggle'}]);

// billing-master
makePage('billing-master.html', 'Billing Master', 'Home / Masters / Billing Master',
`<div class="page-header"><div><h1>Billing Master</h1><p>Bill types and charge heads</p></div></div>
<div style="display:grid;grid-template-columns:280px 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">Bill Types</h3>
<div style="display:flex;flex-direction:column;gap:8px">
<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--accent-soft);border-radius:var(--radius-md);cursor:pointer;border:2px solid var(--accent)"><span style="font-weight:600;color:var(--primary)">📄 Bill 1: Maintenance</span><span class="badge badge-purple">Default</span></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer"><span style="font-weight:500">📄 Bill 2: Clubhouse</span><button class="btn-icon">✏️</button></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer"><span style="font-weight:500">📄 Bill 3: Major Repair</span><button class="btn-icon">✏️</button></div>
</div>
<button class="btn-primary" style="margin-top:12px;width:100%">+ Add New Bill Type</button></div>
<div class="card"><div class="card-header"><h3>Charge Heads — Maintenance Bill</h3><button class="btn-primary" onclick="showToast('Add charge head row','info')">+ Add Charge Head</button></div>
<table class="data-table"><thead><tr><th>Head Name</th><th>Amount (₹)</th><th>GST</th><th>GST %</th><th>Account Head</th><th>Status</th><th>Actions</th></tr></thead>
<tbody>
<tr><td>Maintenance Charges</td><td class="amount">₹3,500</td><td><span class="badge badge-success">Yes</span></td><td>18%</td><td>Maintenance Charges</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>Water Charges</td><td class="amount">₹500</td><td><span class="badge badge-info">No</span></td><td>0%</td><td>Water Charges</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>Sinking Fund</td><td class="amount">₹700</td><td><span class="badge badge-info">No</span></td><td>0%</td><td>Sinking Fund</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>Parking Charges</td><td class="amount">₹1,000</td><td><span class="badge badge-success">Yes</span></td><td>18%</td><td>Parking Charges</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
</tbody></table>
<div class="form-group" style="margin-top:16px"><label class="form-label">Bill Notes</label><textarea class="form-input" rows="2" placeholder="Notes shown on the bill...">Kindly pay before the due date to avoid interest charges.</textarea></div>
<button class="btn-primary" style="margin-top:8px" onclick="showToast('Bill master saved')">Save Changes</button></div></div>`);

// vendor-master
makePage('vendor-master.html', 'Vendor Master', 'Home / Masters / Vendor Master',
`<div class="page-header"><div><h1>Vendor Master</h1><p>Vendor and party management</p></div>
<div class="btn-group"><button class="btn-secondary">📥 Import</button><button class="btn-secondary">📤 Export</button><button class="btn-primary" onclick="openDrawer('vendorDrawer')">+ Add Vendor</button></div></div>
<div class="card"><table class="data-table"><thead><tr><th>Sr.</th><th>Vendor Name</th><th>PAN</th><th>GSTIN</th><th>Contact</th><th>TDS</th><th>Contract Amt</th><th>Actions</th></tr></thead>
<tbody>
<tr><td>1</td><td style="font-weight:600;color:var(--text-primary)">City Plumber Services</td><td>AAACF1234P</td><td>27AAACF1234P1ZX</td><td>9876543220</td><td><span class="badge badge-success">2%</span></td><td class="amount">₹1,50,000</td><td><button class="btn-icon" onclick="openDrawer('vendorDrawer')">✏️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>2</td><td style="font-weight:600;color:var(--text-primary)">Mumbai Electricals</td><td>BBBCE5678G</td><td>27BBBCE5678G1ZY</td><td>9876543221</td><td><span class="badge badge-info">No</span></td><td class="amount">₹75,000</td><td><button class="btn-icon" onclick="openDrawer('vendorDrawer')">✏️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>3</td><td style="font-weight:600;color:var(--text-primary)">Clean India Solutions</td><td>CCCCD9012H</td><td>27CCCCD9012H1ZA</td><td>9876543222</td><td><span class="badge badge-success">1%</span></td><td class="amount">₹2,40,000</td><td><button class="btn-icon" onclick="openDrawer('vendorDrawer')">✏️</button> <button class="btn-icon">🗑️</button></td></tr>
</tbody></table></div>
<div class="drawer-overlay" id="vendorDrawer-overlay" onclick="closeDrawer('vendorDrawer')"></div>
<div class="drawer" id="vendorDrawer"><div class="drawer-header"><h3>Add Vendor</h3><button class="drawer-close" onclick="closeDrawer('vendorDrawer')">✕</button></div>
<div class="drawer-body">
<div class="form-group"><label class="form-label">Vendor Name *</label><input type="text" class="form-input" required placeholder="Vendor name"></div>
<div class="form-row"><div class="form-group"><label class="form-label">PAN No.</label><input type="text" class="form-input" placeholder="AAACF1234P"></div>
<div class="form-group"><label class="form-label">GSTIN</label><input type="text" class="form-input" placeholder="27AAACF1234P1ZX"></div></div>
<div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" placeholder="vendor@email.com"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Contact 1</label><input type="tel" class="form-input" placeholder="9876543220"></div>
<div class="form-group"><label class="form-label">Contact 2</label><input type="tel" class="form-input"></div></div>
<div class="form-group"><label class="form-label">Address</label><textarea class="form-input" rows="2" placeholder="Full address"></textarea></div>
<div class="form-row"><div class="form-group"><label class="form-label">Contract From</label><input type="text" class="form-input date-picker" placeholder="dd/mm/yyyy"></div>
<div class="form-group"><label class="form-label">Contract To</label><input type="text" class="form-input date-picker" placeholder="dd/mm/yyyy"></div></div>
<div class="form-group"><label class="form-label">Contract Amount (₹)</label><input type="number" class="form-input" placeholder="0"></div>
<div class="form-group"><label class="form-label">TDS Applicable</label><label class="toggle"><input type="checkbox" id="tdsToggle" onchange="document.getElementById('tdsRate').style.display=this.checked?'block':'none'"><span class="toggle-slider"></span></label></div>
<div class="form-group" id="tdsRate" style="display:none"><label class="form-label">TDS %</label><select class="form-input"><option>1%</option><option>2%</option><option>10%</option></select></div>
<div class="form-group"><label class="form-label">Remarks</label><textarea class="form-input" rows="2"></textarea></div>
</div>
<div class="drawer-footer"><button class="btn-secondary" onclick="closeDrawer('vendorDrawer')">Cancel</button><button class="btn-primary" onclick="showToast('Vendor saved');closeDrawer('vendorDrawer')">Save Vendor</button></div></div>`);

// opening-bank
tableFormPage('opening-bank.html', 'Opening Bank', 'Home / Masters / Opening Bank',
['Bank Name','Account No.','IFSC','Branch','Opening Balance'],
[['HDFC Bank','XXXX4521','HDFC0001234','Andheri West','<span class="amount">₹3,25,000</span>'],
 ['SBI','XXXX8912','SBIN0005678','Goregaon','<span class="amount">₹1,85,000</span>'],
 ['ICICI Bank','XXXX3456','ICIC0009012','Malad','<span class="amount">₹92,500</span>']],
[{label:'Bank Name',ph:'HDFC Bank'},{label:'Account No.',ph:'XXXX1234'},{label:'IFSC Code',ph:'HDFC0001234'},
 {label:'Branch',ph:'Andheri West'},{label:'Opening Balance (₹)',type:'number',ph:'0'},
 {label:'Effective Date',type:'date'}]);

// opening-balances
makePage('opening-balances.html', 'Opening Balances', 'Home / Masters / Opening Balances',
`<div class="page-header"><div><h1>Opening Balances</h1><p>Member-wise opening balances</p></div>
<div class="btn-group"><select class="form-input" style="width:180px"><option>FY 2024-25</option><option>FY 2023-24</option></select><button class="btn-secondary">📥 Import from Excel</button><button class="btn-primary" onclick="showToast('All balances saved')">💾 Save All</button></div></div>
<div class="card"><table class="data-table"><thead><tr><th>Code</th><th>Name</th><th>Flat</th><th>Principal Balance (₹)</th><th>Interest Balance (₹)</th><th>Total</th><th>Last Modified</th></tr></thead>
<tbody>
<tr><td>M001</td><td>Aman Salvi</td><td>A-101</td><td><input type="number" class="form-input" style="width:120px" value="12000"></td><td><input type="number" class="form-input" style="width:120px" value="3500"></td><td class="amount">₹15,500</td><td>15/04/2024</td></tr>
<tr><td>M002</td><td>Priya Sharma</td><td>B-205</td><td><input type="number" class="form-input" style="width:120px" value="70000"></td><td><input type="number" class="form-input" style="width:120px" value="15000"></td><td class="amount">₹85,000</td><td>15/04/2024</td></tr>
<tr><td>M003</td><td>Rajesh Patil</td><td>C-302</td><td><input type="number" class="form-input" style="width:120px" value="35000"></td><td><input type="number" class="form-input" style="width:120px" value="7300"></td><td class="amount">₹42,300</td><td>15/04/2024</td></tr>
<tr><td>M004</td><td>Sunita Joshi</td><td>A-404</td><td><input type="number" class="form-input" style="width:120px" value="2000"></td><td><input type="number" class="form-input" style="width:120px" value="0"></td><td class="amount">₹2,000</td><td>15/04/2024</td></tr>
<tr><td>M005</td><td>Vikram Mehta</td><td>B-106</td><td><input type="number" class="form-input" style="width:120px" value="4000"></td><td><input type="number" class="form-input" style="width:120px" value="1200"></td><td class="amount">₹5,200</td><td>15/04/2024</td></tr>
</tbody></table></div>`);

// bill-print-setup
makePage('bill-print-setup.html', 'Bill Print Setup', 'Home / Masters / Bill Print Setup',
`<div class="page-header"><div><h1>Bill Print Setup</h1><p>Bill template and format configuration</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:20px">Configuration</h3>
<div class="form-group"><label class="form-label">Society Logo</label><div style="border:2px dashed var(--border-dark);border-radius:var(--radius-md);padding:32px;text-align:center;cursor:pointer;color:var(--text-muted)">📁 Drag & drop logo or click to upload<br><small>PNG, JPG — Max 2MB</small></div></div>
<div class="form-group"><label class="form-label">Header Line 1</label><input type="text" class="form-input" value="Shree Sai Usha Complex Co-op Housing Society Ltd."></div>
<div class="form-group"><label class="form-label">Header Line 2</label><input type="text" class="form-input" value="Regd. No. BOM/HSG/4567 of 2010"></div>
<div class="form-group"><label class="form-label">Header Line 3</label><input type="text" class="form-input" value="Andheri West, Mumbai - 400058"></div>
<div class="form-group"><label class="form-label">Footer Notes</label><textarea class="form-input" rows="3">Interest @ 21% p.a. will be charged on overdue amount. Cheques to be drawn in favour of society.</textarea></div>
<div class="form-row"><div class="form-group"><label class="form-label">Paper Size</label><div style="display:flex;gap:12px"><label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="radio" name="paper" checked> A4</label><label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="radio" name="paper"> A5</label></div></div>
<div class="form-group"><label class="form-label">Bill Prefix</label><input type="text" class="form-input" value="BILL/2024/"></div></div>
<div class="form-group"><label class="form-label">Show GST Breakup</label><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
<div class="form-group"><label class="form-label">Show Interest Separately</label><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
<button class="btn-primary" onclick="showToast('Print setup saved')">Save Configuration</button></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:20px">📄 Live Bill Preview</h3>
<div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:24px;background:#FAFAFA;font-size:12px">
<div style="text-align:center;margin-bottom:16px"><strong style="font-size:14px">Shree Sai Usha Complex Co-op Housing Society Ltd.</strong><br>Regd. No. BOM/HSG/4567 of 2010<br>Andheri West, Mumbai - 400058</div>
<div style="display:flex;justify-content:space-between;margin-bottom:12px"><span><strong>Bill No:</strong> BILL/2024/089</span><span><strong>Date:</strong> 01/04/2024</span></div>
<div style="margin-bottom:12px"><strong>Member:</strong> Aman Salvi | <strong>Flat:</strong> A-101 | <strong>Wing:</strong> A</div>
<table style="width:100%;border-collapse:collapse;margin-bottom:12px"><tr style="background:#f0f0f0"><th style="border:1px solid #ddd;padding:6px;text-align:left">Particulars</th><th style="border:1px solid #ddd;padding:6px;text-align:right">Amount</th></tr>
<tr><td style="border:1px solid #ddd;padding:6px">Maintenance Charges</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹3,500</td></tr>
<tr><td style="border:1px solid #ddd;padding:6px">Water Charges</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹500</td></tr>
<tr><td style="border:1px solid #ddd;padding:6px">Sinking Fund</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹700</td></tr>
<tr><td style="border:1px solid #ddd;padding:6px">Parking Charges</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹1,000</td></tr>
<tr><td style="border:1px solid #ddd;padding:6px">CGST (9%)</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹405</td></tr>
<tr><td style="border:1px solid #ddd;padding:6px">SGST (9%)</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹405</td></tr>
<tr style="background:#f0f0f0;font-weight:700"><td style="border:1px solid #ddd;padding:6px">Total</td><td style="border:1px solid #ddd;padding:6px;text-align:right">₹6,510</td></tr></table>
<p style="font-size:10px;color:#666">Interest @ 21% p.a. will be charged on overdue amount.</p>
</div>
<button class="btn-secondary" style="margin-top:12px" onclick="showToast('Opening print dialog...','info')">🖨️ Print Sample</button></div></div>`);

// servant-master
tableFormPage('servant-master.html', 'Servant Master', 'Home / Masters / Servant Master',
['Sr.','Name','Role','Contact','Salary (₹)','Join Date','Status'],
[['1','Ramesh Kumar','Watchman','9876543230','<span class="amount">₹15,000</span>','01/02/2020','<span class="badge badge-success">Active</span>'],
 ['2','Suresh Yadav','Cleaner','9876543231','<span class="amount">₹12,000</span>','15/06/2021','<span class="badge badge-success">Active</span>'],
 ['3','Meena Devi','Sweeper','9876543232','<span class="amount">₹10,000</span>','01/01/2022','<span class="badge badge-success">Active</span>']],
[{label:'Name',ph:'Full name',req:true},{label:'Role / Designation',type:'select',options:['Watchman','Cleaner','Sweeper','Gardener','Plumber','Other']},
 {label:'Contact No.',ph:'9876543210'},{label:'Address',type:'textarea',ph:'Full address'},
 {label:'Salary (₹)',type:'number',ph:'15000'},{label:'Join Date',type:'date'},{label:'Status',type:'select',options:['Active','Inactive']}]);

// fixed-deposit
makePage('fixed-deposit.html', 'Fixed Deposit', 'Home / Masters / Fixed Deposit',
`<div class="page-header"><div><h1>Fixed Deposit</h1><p>FD investment tracking</p></div><button class="btn-primary" onclick="openModal('fdModal')">+ Add FD</button></div>
<div class="stats-row">
<div class="card stat-card"><div class="stat-icon purple">💎</div><div class="stat-label">Total FD Amount</div><div class="stat-value" data-target="2500000">₹0</div></div>
<div class="card stat-card"><div class="stat-icon green">📈</div><div class="stat-label">Accrued Interest</div><div class="stat-value" data-target="187500">₹0</div></div>
<div class="card stat-card"><div class="stat-icon yellow">📅</div><div class="stat-label">Maturing This Month</div><div class="stat-value" style="font-size:24px;font-weight:800;color:var(--text-primary)">1</div></div>
<div class="card stat-card"><div class="stat-icon blue">🏦</div><div class="stat-label">Active FDs</div><div class="stat-value" style="font-size:24px;font-weight:800;color:var(--text-primary)">4</div></div>
</div>
<div class="card"><table class="data-table"><thead><tr><th>Bank</th><th>FD No.</th><th>Principal</th><th>Rate %</th><th>Start Date</th><th>Maturity</th><th>Accrued Interest</th><th>Status</th><th>Actions</th></tr></thead>
<tbody>
<tr><td>HDFC Bank</td><td>FD-2024-001</td><td class="amount">₹10,00,000</td><td>7.5%</td><td>01/04/2024</td><td>01/04/2025</td><td class="amount">₹75,000</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>SBI</td><td>FD-2024-002</td><td class="amount">₹5,00,000</td><td>7.1%</td><td>15/06/2024</td><td>15/06/2025</td><td class="amount">₹35,500</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>ICICI</td><td>FD-2023-003</td><td class="amount">₹7,50,000</td><td>6.9%</td><td>01/01/2023</td><td>01/01/2025</td><td class="amount">₹51,750</td><td><span class="badge badge-warning">Maturing</span></td><td><button class="btn-icon">✏️</button></td></tr>
<tr><td>BOB</td><td>FD-2024-004</td><td class="amount">₹2,50,000</td><td>7.0%</td><td>01/08/2024</td><td>01/08/2025</td><td class="amount">₹25,250</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon">✏️</button></td></tr>
</tbody></table></div>
<div class="modal-overlay" id="fdModal"><div class="modal"><div class="modal-header"><h3>Add Fixed Deposit</h3><button class="modal-close" onclick="closeModal('fdModal')">✕</button></div>
<div class="modal-body">
<div class="form-group"><label class="form-label">Bank Name</label><input type="text" class="form-input" placeholder="HDFC Bank"></div>
<div class="form-group"><label class="form-label">FD Number</label><input type="text" class="form-input" placeholder="FD-2024-005"></div>
<div class="form-group"><label class="form-label">Principal Amount (₹)</label><input type="number" class="form-input" placeholder="0"></div>
<div class="form-group"><label class="form-label">Interest Rate %</label><input type="number" class="form-input" step="0.1" max="15" placeholder="7.5"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Start Date</label><input type="text" class="form-input date-picker"></div>
<div class="form-group"><label class="form-label">Maturity Date</label><input type="text" class="form-input date-picker"></div></div>
<div class="form-group"><label class="form-label">Linked Account Head</label><select class="form-input select2"><option>Investment in FDR</option></select></div>
</div><div class="modal-footer"><button class="btn-secondary" onclick="closeModal('fdModal')">Cancel</button><button class="btn-primary" onclick="showToast('FD added');closeModal('fdModal')">Save FD</button></div></div></div>`);

// committee-master
makePage('committee-master.html', 'Committee Master', 'Home / Masters / Committee Master',
`<div class="page-header"><div><h1>Committee Master</h1><p>Managing committee member details</p></div><button class="btn-primary" onclick="openModal('cmModal')">+ Add Member</button></div>
<div class="grid-3">
<div class="card" style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px">👤</div><h3 style="font-size:16px;font-weight:700;color:var(--text-primary)">Ramesh Desai</h3><span class="badge badge-purple" style="margin:8px 0">Chairman</span><p style="font-size:12px;color:var(--text-muted)">📞 9876543250</p><p style="font-size:11px;color:var(--text-muted)">Term: Apr 2023 — Mar 2028</p></div>
<div class="card" style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px">👤</div><h3 style="font-size:16px;font-weight:700;color:var(--text-primary)">Sunita Joshi</h3><span class="badge badge-info" style="margin:8px 0">Secretary</span><p style="font-size:12px;color:var(--text-muted)">📞 9876543213</p><p style="font-size:11px;color:var(--text-muted)">Term: Apr 2023 — Mar 2028</p></div>
<div class="card" style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px">👤</div><h3 style="font-size:16px;font-weight:700;color:var(--text-primary)">Priya Sharma</h3><span class="badge badge-success" style="margin:8px 0">Treasurer</span><p style="font-size:12px;color:var(--text-muted)">📞 9876543211</p><p style="font-size:11px;color:var(--text-muted)">Term: Apr 2023 — Mar 2028</p></div>
<div class="card" style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px">👤</div><h3 style="font-size:16px;font-weight:700;color:var(--text-primary)">Aman Salvi</h3><span class="badge badge-warning" style="margin:8px 0">Member</span><p style="font-size:12px;color:var(--text-muted)">📞 9876543210</p><p style="font-size:11px;color:var(--text-muted)">Term: Apr 2023 — Mar 2028</p></div>
<div class="card" style="text-align:center"><div style="width:64px;height:64px;border-radius:50%;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px">👤</div><h3 style="font-size:16px;font-weight:700;color:var(--text-primary)">Rajesh Patil</h3><span class="badge badge-warning" style="margin:8px 0">Member</span><p style="font-size:12px;color:var(--text-muted)">📞 9876543212</p><p style="font-size:11px;color:var(--text-muted)">Term: Apr 2023 — Mar 2028</p></div>
</div>
<div class="modal-overlay" id="cmModal"><div class="modal"><div class="modal-header"><h3>Add Committee Member</h3><button class="modal-close" onclick="closeModal('cmModal')">✕</button></div>
<div class="modal-body">
<div class="form-group"><label class="form-label">Name</label><input type="text" class="form-input" required></div>
<div class="form-group"><label class="form-label">Role</label><select class="form-input"><option>Chairman</option><option>Secretary</option><option>Treasurer</option><option>Member</option></select></div>
<div class="form-group"><label class="form-label">Contact No.</label><input type="tel" class="form-input"></div>
<div class="form-group"><label class="form-label">Address</label><textarea class="form-input" rows="2"></textarea></div>
<div class="form-row"><div class="form-group"><label class="form-label">Term Start</label><input type="text" class="form-input date-picker"></div>
<div class="form-group"><label class="form-label">Term End</label><input type="text" class="form-input date-picker"></div></div>
</div><div class="modal-footer"><button class="btn-secondary" onclick="closeModal('cmModal')">Cancel</button><button class="btn-primary" onclick="showToast('Member added');closeModal('cmModal')">Save</button></div></div></div>`);

console.log('=== BATCH 2 COMPLETE ===');
