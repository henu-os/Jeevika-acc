$dir = "H:\Jeevika Accounting\html"

$sidebar = @'
<aside class="sidebar" id="sidebar">
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
    </div>
  </nav>
</aside>
'@

function TB($t,$b){return @"
<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">$t</div><div class="breadcrumb">$b</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔<span class="notif-badge">3</span></button><button class="topbar-icon">⊞</button><button class="topbar-icon">🛡️</button><button class="topbar-icon">✉️</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">▼</span></div></div></header>
"@}

function MP($f,$t,$b,$body,$xh,$xj){
$h2=if($xh){$xh}else{""}
$j2=if($xj){$xj}else{""}
@"
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>$t — Jeevika Accounting</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/global.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">
$h2
</head><body>$sidebar
<div class="main-wrapper">$(TB $t $b)<main class="page-content">$body</main></div>
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script src="../js/global.js"></script>$j2</body></html>
"@ | Out-File "$dir\$f" -Encoding utf8; Write-Host "OK $f"}

# ── MEMBER MASTER ──
MP "member-master.html" "Member Master" "Home / Masters / Member Master" @'
<div class="page-header"><div><h1>Member Master</h1><p>Flat owners, members and KYC data</p></div>
<div class="btn-group"><button class="btn-secondary">📥 Import from Excel</button><button class="btn-primary" onclick="openDrawer('memberDrawer')">+ Add Member</button></div></div>
<div class="card"><div class="table-toolbar"><input type="text" class="search-input" placeholder="Search members..." id="memberSearch"><div class="btn-group"><button class="btn-secondary">Filter</button><button class="btn-icon" onclick="printSection('memberTable')">🖨️</button></div></div>
<table class="data-table" id="memberTable"><thead><tr><th>Code</th><th>Name</th><th>Flat No.</th><th>Wing</th><th>Floor</th><th>Contact</th><th>Opening Bal</th><th>Status</th><th>Actions</th></tr></thead>
<tbody>
<tr><td>M001</td><td style="font-weight:600;color:var(--text-primary)">Aman Salvi</td><td>A-101</td><td>A</td><td>1</td><td>9876543210</td><td class="amount">₹15,500</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon" onclick="openDrawer('memberDrawer')">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon" onclick="confirmDelete('Delete Aman Salvi?')">🗑️</button></td></tr>
<tr><td>M002</td><td style="font-weight:600;color:var(--text-primary)">Priya Sharma</td><td>B-205</td><td>B</td><td>2</td><td>9876543211</td><td class="amount">₹85,000</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon" onclick="openDrawer('memberDrawer')">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>M003</td><td style="font-weight:600;color:var(--text-primary)">Rajesh Patil</td><td>C-302</td><td>C</td><td>3</td><td>9876543212</td><td class="amount">₹42,300</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon" onclick="openDrawer('memberDrawer')">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>M004</td><td style="font-weight:600;color:var(--text-primary)">Sunita Joshi</td><td>A-404</td><td>A</td><td>4</td><td>9876543213</td><td class="amount">₹2,000</td><td><span class="badge badge-success">Active</span></td><td><button class="btn-icon" onclick="openDrawer('memberDrawer')">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
<tr><td>M005</td><td style="font-weight:600;color:var(--text-primary)">Vikram Mehta</td><td>B-106</td><td>B</td><td>1</td><td>9876543214</td><td class="amount">₹5,200</td><td><span class="badge badge-danger">Inactive</span></td><td><button class="btn-icon" onclick="openDrawer('memberDrawer')">✏️</button> <button class="btn-icon">👁️</button> <button class="btn-icon">🗑️</button></td></tr>
</tbody></table>
<div class="pagination"><div class="pagination-info">Showing 1-5 of 120 members</div><div class="pagination-buttons"><button>←</button><button class="active">1</button><button>2</button><button>3</button><button>...</button><button>24</button><button>→</button></div></div></div>
<!-- DRAWER -->
<div class="drawer-overlay" id="memberDrawer-overlay" onclick="closeDrawer('memberDrawer')"></div>
<div class="drawer" id="memberDrawer">
<div class="drawer-header"><h3>Add New Member</h3><button class="drawer-close" onclick="closeDrawer('memberDrawer')">✕</button></div>
<div class="drawer-body">
<div class="tabs"><button class="tab-btn active" data-tab-btn="mem" data-tab="tabBasic" onclick="switchTab('mem','tabBasic')">Basic Info</button><button class="tab-btn" data-tab-btn="mem" data-tab="tabFinance" onclick="switchTab('mem','tabFinance')">Financial</button><button class="tab-btn" data-tab-btn="mem" data-tab="tabContact" onclick="switchTab('mem','tabContact')">Contact</button><button class="tab-btn" data-tab-btn="mem" data-tab="tabParking" onclick="switchTab('mem','tabParking')">Parking</button><button class="tab-btn" data-tab-btn="mem" data-tab="tabShare" onclick="switchTab('mem','tabShare')">Share Cert</button></div>
<div id="tabBasic" class="tab-content active" data-tab-group="mem">
<div class="form-group"><label class="form-label">Member Code</label><input type="text" class="form-input" value="M006" disabled></div>
<div class="form-group"><label class="form-label">Group</label><select class="form-input select2"><option>Dues from Members</option></select></div>
<div class="form-group"><label class="form-label">Name 1 (Primary)</label><input type="text" class="form-input" required placeholder="Enter primary name"></div>
<div class="form-group"><label class="form-label">Name 2</label><input type="text" class="form-input" placeholder="Optional"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Flat/Unit No.</label><select class="form-input select2"><option>Select flat</option><option>A-101</option><option>A-102</option><option>B-201</option></select></div>
<div class="form-group"><label class="form-label">Wing No.</label><input type="text" class="form-input" placeholder="A"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Floor No.</label><input type="text" class="form-input" placeholder="1"></div>
<div class="form-group"><label class="form-label">Flat Type</label><select class="form-input"><option>1BHK</option><option>2BHK</option><option>3BHK</option><option>1RK</option><option>Shop</option><option>Office</option></select></div></div>
<div class="form-group"><label class="form-label">Building Name</label><input type="text" class="form-input" value="Shree Sai Usha Complex"></div>
<div class="form-group"><label class="form-label">Area Type</label><select class="form-input"><option>RERA</option><option>MOFA</option><option>CIDCO</option><option>MHADA</option></select></div>
</div>
<div id="tabFinance" class="tab-content" data-tab-group="mem">
<div class="form-row"><div class="form-group"><label class="form-label">Opening Balance — Principal (₹)</label><input type="number" class="form-input" placeholder="0.00"></div>
<div class="form-group"><label class="form-label">Opening Balance — Interest (₹)</label><input type="number" class="form-input" placeholder="0.00"></div></div>
<div class="form-group"><label class="form-label">GSTIN No.</label><input type="text" class="form-input" placeholder="22AAAAA0000A1Z5"></div>
<div class="form-group"><label class="form-label">Bank & Branch Name</label><input type="text" class="form-input" placeholder="HDFC Bank, Andheri"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Loan Amount</label><input type="number" class="form-input" placeholder="0"></div>
<div class="form-group"><label class="form-label">Loan Period (months)</label><input type="number" class="form-input" placeholder="0"></div></div>
<div class="form-group"><label class="form-label">NOC Application</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>
</div>
<div id="tabContact" class="tab-content" data-tab-group="mem">
<div class="form-row"><div class="form-group"><label class="form-label">Contact No. 1</label><input type="tel" class="form-input" placeholder="9876543210"></div>
<div class="form-group"><label class="form-label">Contact No. 2</label><input type="tel" class="form-input" placeholder="Optional"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Email 1</label><input type="email" class="form-input" placeholder="member@email.com"></div>
<div class="form-group"><label class="form-label">Email 2</label><input type="email" class="form-input" placeholder="Optional"></div></div>
</div>
<div id="tabParking" class="tab-content" data-tab-group="mem">
<h4 style="font-weight:700;color:var(--text-primary);margin-bottom:12px">🚗 4-Wheeler Parking</h4>
<table class="data-table" id="parking4Table"><thead><tr><th>Slot No</th><th>Type</th><th>Vehicle No</th><th></th></tr></thead>
<tbody><tr><td><input type="text" class="form-input" style="width:80px" value="P-01"></td><td><select class="form-input" style="width:120px"><option>Stilt</option><option>Podium</option><option>Open</option><option>Basement</option></select></td><td><input type="text" class="form-input" style="width:140px" placeholder="MH-01-XX-1234"></td><td><button class="btn-icon" onclick="removeTableRow(this)">🗑️</button></td></tr></tbody></table>
<button class="btn-secondary" style="margin-top:8px" onclick="addTableRow('parking4Table','<td><input type=text class=form-input style=width:80px></td><td><select class=form-input style=width:120px><option>Stilt</option><option>Podium</option><option>Open</option><option>Basement</option></select></td><td><input type=text class=form-input style=width:140px placeholder=MH-01-XX-1234></td><td><button class=btn-icon onclick=removeTableRow(this)>🗑️</button></td>')">+ Add Slot</button>
<h4 style="font-weight:700;color:var(--text-primary);margin:20px 0 12px">🏍️ 2-Wheeler Parking</h4>
<table class="data-table" id="parking2Table"><thead><tr><th>Slot No</th><th>Type</th><th>Vehicle No</th><th></th></tr></thead><tbody></tbody></table>
<button class="btn-secondary" style="margin-top:8px" onclick="addTableRow('parking2Table','<td><input type=text class=form-input style=width:80px></td><td><select class=form-input style=width:120px><option>Stilt</option><option>Open</option><option>Basement</option></select></td><td><input type=text class=form-input style=width:140px></td><td><button class=btn-icon onclick=removeTableRow(this)>🗑️</button></td>')">+ Add Slot</button>
</div>
<div id="tabShare" class="tab-content" data-tab-group="mem">
<div class="form-group"><label class="form-label">Share Certificate No.</label><input type="text" class="form-input" placeholder="SC-001"></div>
<div class="form-group"><label class="form-label">Membership No.</label><input type="text" class="form-input" placeholder="MEM-001"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Distinctive From</label><input type="number" class="form-input" placeholder="1"></div>
<div class="form-group"><label class="form-label">Distinctive To</label><input type="number" class="form-input" placeholder="10"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">No. of Shares</label><input type="number" class="form-input" id="numShares" value="10" oninput="document.getElementById('totalShareAmt').value=this.value*50"></div>
<div class="form-group"><label class="form-label">Total Share Amount (₹)</label><input type="number" class="form-input" id="totalShareAmt" value="500" disabled></div></div>
<div class="form-group"><label class="form-label">Special Remark</label><textarea class="form-input" rows="2" placeholder="Any remarks..."></textarea></div>
</div>
</div>
<div class="drawer-footer"><button class="btn-secondary" onclick="closeDrawer('memberDrawer')">Cancel</button><button class="btn-primary" onclick="showToast('Member saved successfully');closeDrawer('memberDrawer')">Save Member</button></div>
</div>
'@ "" ""

# ── ACCOUNT MASTER ──
MP "account-master.html" "Account Master" "Home / Masters / Account Master" @'
<div class="page-header"><div><h1>Account Master</h1><p>Chart of accounts — 80+ pre-seeded</p></div><div class="btn-group"><button class="btn-secondary">📥 Import</button><button class="btn-secondary">📤 Export</button><button class="btn-primary" onclick="showToast('Click + in tree to add','info')">+ Add Account</button></div></div>
<div style="display:grid;grid-template-columns:300px 1fr;gap:24px">
<div class="card" style="max-height:75vh;overflow-y:auto">
<input type="text" class="form-input" placeholder="Search accounts..." style="margin-bottom:12px">
<div class="tree-item"><div class="tree-label active" onclick="this.nextElementSibling.classList.toggle('open');this.querySelector('.tree-toggle').textContent=this.nextElementSibling.classList.contains('open')?'▼':'▶'"><span class="tree-toggle">▼</span> <strong>INCOME</strong></div>
<div class="tree-children open">
  <div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> Maintenance & Service</div><div class="tree-children"><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">1 — Water Charges</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">2 — Electricity Charges</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">3 — Housekeeping Charges</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">8 — Maintenance Charges</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">9 — Parking Charges</div></div></div></div>
  <div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> Interest Received</div><div class="tree-children"><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">10 — Interest from Member</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">11 — Interest on SB A/C</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">12 — Interest on FDR</div></div></div></div>
</div></div>
<div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> <strong>EXPENDITURE</strong></div><div class="tree-children">
  <div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> Maintenance Exp</div><div class="tree-children"><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">102 — Water Charges Exp</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">103 — Electricity Exp</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">104 — Housekeeping Exp</div></div></div></div>
</div></div>
<div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> <strong>ASSETS</strong></div><div class="tree-children">
  <div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> Cash & Bank</div><div class="tree-children"><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">202 — Cash in Hand</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">203 — HDFC Bank A/C</div></div><div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">204 — SBI Bank A/C</div></div></div></div>
</div></div>
<div class="tree-item"><div class="tree-label" onclick="this.nextElementSibling.classList.toggle('open')"><span class="tree-toggle">▶</span> <strong>LIABILITIES</strong></div><div class="tree-children">
  <div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">301 — Issued Capital</div></div>
  <div class="tree-item"><div class="tree-label" onclick="selectAccount(this)">302 — Reserve Fund</div></div>
</div></div>
</div>
<div class="card" id="accountDetail">
<h3 style="font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:20px">Account Details</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Code</label><input type="text" class="form-input" value="1" disabled></div>
<div class="form-group"><label class="form-label">Account Name (English)</label><input type="text" class="form-input" value="Water Charges"></div></div>
<div class="form-group"><label class="form-label">Account Name (Marathi)</label><input type="text" class="form-input" value="पाणी शुल्क"></div>
<div class="form-row"><div class="form-group"><label class="form-label">Main Group</label><select class="form-input"><option selected>INCOME</option><option>EXPENDITURE</option><option>ASSETS</option><option>LIABILITIES</option></select></div>
<div class="form-group"><label class="form-label">Sub-Group</label><select class="form-input"><option>Maintenance & Service Charges</option></select></div></div>
<div class="form-group"><label class="form-label">Opening Balance (₹)</label><input type="number" class="form-input" value="0"></div>
<div class="btn-group" style="margin-top:16px"><button class="btn-primary" onclick="showToast('Account updated')">Save</button><button class="btn-danger" onclick="confirmDelete('Delete this account?')">Delete</button></div>
</div></div>
'@ "" '<script>function selectAccount(el){document.querySelectorAll(".tree-label").forEach(l=>l.classList.remove("active"));el.classList.add("active")}</script>'

Write-Host "--- Batch 2a done ---"
