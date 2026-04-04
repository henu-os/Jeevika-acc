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

function Get-Topbar($title, $bread) {
return @"
<header class="topbar">
  <div class="topbar-left">
    <button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button>
    <div><div class="page-title">$title</div><div class="breadcrumb">$bread</div></div>
  </div>
  <div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div>
  <div class="topbar-right">
    <span class="topbar-date" id="currentDate"></span>
    <button class="topbar-icon">🔔<span class="notif-badge">3</span></button>
    <button class="topbar-icon">⊞</button><button class="topbar-icon">🛡️</button><button class="topbar-icon">✉️</button><button class="topbar-icon">⚙️</button>
    <div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">▼</span></div>
  </div>
</header>
"@
}

function Make-Page($file, $title, $bread, $extraCss, $extraHead, $body, $extraJs) {
$css = '<link rel="stylesheet" href="../css/global.css">'
if ($extraCss) { foreach($c in $extraCss){ $css += "`n<link rel=`"stylesheet`" href=`"$c`">" } }
$head2 = if($extraHead){$extraHead}else{""}
$js2 = if($extraJs){$extraJs}else{""}
$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$title — Jeevika Accounting</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
$css
$head2
</head>
<body>
$sidebar
<div class="main-wrapper">
$(Get-Topbar $title $bread)
<main class="page-content">
$body
</main>
</div>
<script src="../js/global.js"></script>
$js2
</body>
</html>
"@
$html | Out-File -FilePath "$dir\$file" -Encoding utf8
Write-Host "Created $file"
}

# ── MASTERS ──
Make-Page "masters.html" "Masters" "Home / Masters" @() "" @'
<div class="page-header"><div><h1>Masters</h1><p>Manage your society's core data</p></div><button class="btn-primary" onclick="showToast('Navigate to a specific master to add new records','info')">+ Add New</button></div>
<div class="module-grid">
  <div class="card module-card" onclick="location.href='member-master.html'"><div class="mc-icon">🏢</div><h3>Society / Company Master</h3><p>Society profile and basic setup</p><div class="mc-footer"><a class="mc-link" href="member-master.html">→ Open</a><span class="mc-badge">Active</span></div></div>
  <div class="card module-card" onclick="location.href='member-master.html'"><div class="mc-icon">👥</div><h3>Member Master</h3><p>Flat owners, members and KYC data</p><div class="mc-footer"><a class="mc-link" href="member-master.html">→ Open</a><span class="mc-badge">120 Members</span></div></div>
  <div class="card module-card" onclick="location.href='account-master.html'"><div class="mc-icon">📖</div><h3>Account Master</h3><p>Chart of accounts — 80+ pre-seeded</p><div class="mc-footer"><a class="mc-link" href="account-master.html">→ Open</a><span class="mc-badge">84 Accounts</span></div></div>
  <div class="card module-card" onclick="location.href='group-master.html'"><div class="mc-icon">📚</div><h3>Group Master</h3><p>Account grouping and sub-groups</p><div class="mc-footer"><a class="mc-link" href="group-master.html">→ Open</a><span class="mc-badge">24 Groups</span></div></div>
  <div class="card module-card" onclick="location.href='billing-master.html'"><div class="mc-icon">🧾</div><h3>Billing Master</h3><p>Bill types and charge heads</p><div class="mc-footer"><a class="mc-link" href="billing-master.html">→ Open</a><span class="mc-badge">5 Bill Types</span></div></div>
  <div class="card module-card" onclick="location.href='area-master.html'"><div class="mc-icon">🗺️</div><h3>Area Master</h3><p>Flat-wise area setup for billing</p><div class="mc-footer"><a class="mc-link" href="area-master.html">→ Open</a><span class="mc-badge">120 Flats</span></div></div>
  <div class="card module-card" onclick="location.href='gst-master.html'"><div class="mc-icon">%</div><h3>GST Master</h3><p>GST slabs and HSN/SAC codes</p><div class="mc-footer"><a class="mc-link" href="gst-master.html">→ Open</a><span class="mc-badge">Active</span></div></div>
  <div class="card module-card" onclick="location.href='opening-bank.html'"><div class="mc-icon">🏦</div><h3>Opening Bank Record</h3><p>Initial bank account balances</p><div class="mc-footer"><a class="mc-link" href="opening-bank.html">→ Open</a><span class="mc-badge">3 Banks</span></div></div>
  <div class="card module-card" onclick="location.href='opening-balances.html'"><div class="mc-icon">⚖️</div><h3>Opening Balances</h3><p>Member-wise opening balances</p><div class="mc-footer"><a class="mc-link" href="opening-balances.html">→ Open</a><span class="mc-badge">FY 2024-25</span></div></div>
  <div class="card module-card" onclick="location.href='bill-print-setup.html'"><div class="mc-icon">🖨️</div><h3>Bill Print Setup</h3><p>Bill template and format config</p><div class="mc-footer"><a class="mc-link" href="bill-print-setup.html">→ Open</a><span class="mc-badge">Configured</span></div></div>
  <div class="card module-card" onclick="location.href='vendor-master.html'"><div class="mc-icon">🤝</div><h3>Vendor Master</h3><p>Vendor and party management</p><div class="mc-footer"><a class="mc-link" href="vendor-master.html">→ Open</a><span class="mc-badge">8 Vendors</span></div></div>
  <div class="card module-card" onclick="location.href='servant-master.html'"><div class="mc-icon">👷</div><h3>Servant Master</h3><p>Society staff records</p><div class="mc-footer"><a class="mc-link" href="servant-master.html">→ Open</a><span class="mc-badge">6 Staff</span></div></div>
  <div class="card module-card" onclick="location.href='fixed-deposit.html'"><div class="mc-icon">💎</div><h3>Fixed Deposit</h3><p>FD investment tracking</p><div class="mc-footer"><a class="mc-link" href="fixed-deposit.html">→ Open</a><span class="mc-badge">4 FDs</span></div></div>
  <div class="card module-card" onclick="location.href='committee-master.html'"><div class="mc-icon">🎩</div><h3>Committee Master</h3><p>Managing committee members</p><div class="mc-footer"><a class="mc-link" href="committee-master.html">→ Open</a><span class="mc-badge">7 Members</span></div></div>
</div>
'@ ""

# ── TRANSACTIONS ──
Make-Page "transactions.html" "Transactions" "Home / Transactions" @() "" @'
<div class="page-header"><div><h1>Transactions</h1><p>Record and manage all financial transactions</p></div></div>
<div class="module-grid">
  <div class="card module-card" onclick="location.href='member-bill.html'"><div class="mc-icon">📄</div><h3>Member Bill</h3><p>Generate maintenance bills</p><div class="mc-footer"><a class="mc-link" href="member-bill.html">→ Open</a><span class="mc-badge">This Month</span></div></div>
  <div class="card module-card" onclick="location.href='member-receipt.html'"><div class="mc-icon">🧾</div><h3>Member Receipt</h3><p>Record member payments</p><div class="mc-footer"><a class="mc-link" href="member-receipt.html">→ Open</a><span class="mc-badge">42 Today</span></div></div>
  <div class="card module-card" onclick="location.href='debit-note.html'"><div class="mc-icon">📕</div><h3>Debit Note</h3><p>Add charges to member account</p><div class="mc-footer"><a class="mc-link" href="debit-note.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='credit-note.html'"><div class="mc-icon">📗</div><h3>Credit Note</h3><p>Credit adjustments and refunds</p><div class="mc-footer"><a class="mc-link" href="credit-note.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='cheque-adjustment.html'"><div class="mc-icon">📋</div><h3>Cheque Adjustment</h3><p>Handle cheque returns/bounces</p><div class="mc-footer"><a class="mc-link" href="cheque-adjustment.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='member-journal.html'"><div class="mc-icon">📓</div><h3>Member Journal</h3><p>Member-specific journal entries</p><div class="mc-footer"><a class="mc-link" href="member-journal.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='receipt-voucher.html'"><div class="mc-icon">📥</div><h3>Receipt Voucher</h3><p>Society-level receipts</p><div class="mc-footer"><a class="mc-link" href="receipt-voucher.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='payment-voucher.html'"><div class="mc-icon">📤</div><h3>Payment Voucher</h3><p>Society-level payments</p><div class="mc-footer"><a class="mc-link" href="payment-voucher.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='contra-voucher.html'"><div class="mc-icon">🔄</div><h3>Contra Voucher</h3><p>Bank/cash transfers</p><div class="mc-footer"><a class="mc-link" href="contra-voucher.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='journal-voucher.html'"><div class="mc-icon">📔</div><h3>Journal Voucher</h3><p>General journal entries</p><div class="mc-footer"><a class="mc-link" href="journal-voucher.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='multi-receipt.html'"><div class="mc-icon">📑</div><h3>Multi Receipt</h3><p>Bulk receipt entry (Flat/Society/Blank)</p><div class="mc-footer"><a class="mc-link" href="multi-receipt.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='bank-reconciliation.html'"><div class="mc-icon">🏦</div><h3>Bank Reconciliation</h3><p>Match bank statements</p><div class="mc-footer"><a class="mc-link" href="bank-reconciliation.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='quick-note.html'"><div class="mc-icon">📝</div><h3>Quick Note</h3><p>Fast memo entry</p><div class="mc-footer"><a class="mc-link" href="quick-note.html">→ Open</a></div></div>
</div>
<div class="card" style="margin-top:24px;animation-delay:0.7s">
  <div class="card-header"><h3>Recent Transactions</h3></div>
  <table class="data-table"><thead><tr><th>Voucher No.</th><th>Type</th><th>Date</th><th>Member/Account</th><th>Amount</th><th>Status</th></tr></thead>
  <tbody>
    <tr><td>REC/2024/142</td><td><span class="badge badge-success">Receipt</span></td><td>26/04/2024</td><td>Aman Salvi (A-101)</td><td class="amount">₹6,000</td><td><span class="badge badge-success">Posted</span></td></tr>
    <tr><td>BILL/2024/089</td><td><span class="badge badge-purple">Bill</span></td><td>25/04/2024</td><td>All Members</td><td class="amount">₹5,54,200</td><td><span class="badge badge-success">Generated</span></td></tr>
    <tr><td>PV/2024/034</td><td><span class="badge badge-warning">Payment</span></td><td>24/04/2024</td><td>City Plumber Services</td><td class="amount">₹12,500</td><td><span class="badge badge-success">Posted</span></td></tr>
    <tr><td>DN/2024/011</td><td><span class="badge badge-danger">Debit Note</span></td><td>23/04/2024</td><td>Vikram Mehta (B-106)</td><td class="amount">₹1,500</td><td><span class="badge badge-success">Posted</span></td></tr>
    <tr><td>CV/2024/008</td><td><span class="badge badge-info">Contra</span></td><td>22/04/2024</td><td>HDFC → Cash</td><td class="amount">₹25,000</td><td><span class="badge badge-success">Posted</span></td></tr>
  </tbody></table>
</div>
'@ ""

# ── REPORTS ──
Make-Page "reports.html" "Reports" "Home / Reports" @() "" @'
<div class="page-header"><div><h1>Reports</h1><p>Financial reports and analytics</p></div></div>
<h2 style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:16px">📊 Member Reports</h2>
<div class="module-grid" style="margin-bottom:32px">
  <div class="card module-card" onclick="location.href='outstanding-list.html'"><div class="mc-icon">📋</div><h3>Outstanding List</h3><p>Member-wise outstanding dues</p><div class="mc-footer"><a class="mc-link" href="outstanding-list.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='member-ledger.html'"><div class="mc-icon">📖</div><h3>Member Ledger</h3><p>Individual member full ledger</p><div class="mc-footer"><a class="mc-link" href="member-ledger.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='member-register.html'"><div class="mc-icon">👥</div><h3>Member Register</h3><p>Complete member list</p><div class="mc-footer"><a class="mc-link" href="member-register.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='balance-confirm-letter.html'"><div class="mc-icon">✉️</div><h3>Balance Confirmation</h3><p>Official balance letter</p><div class="mc-footer"><a class="mc-link" href="balance-confirm-letter.html">→ Open</a></div></div>
</div>
<h2 style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:16px">📈 Account Reports</h2>
<div class="module-grid">
  <div class="card module-card" onclick="location.href='trial-balance.html'"><div class="mc-icon">⚖️</div><h3>Trial Balance</h3><p>Complete trial balance</p><div class="mc-footer"><a class="mc-link" href="trial-balance.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='balance-sheet.html'"><div class="mc-icon">📊</div><h3>Balance Sheet</h3><p>Statutory balance sheet</p><div class="mc-footer"><a class="mc-link" href="balance-sheet.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='income-expenditure.html'"><div class="mc-icon">💹</div><h3>Income & Expenditure</h3><p>I&E account statement</p><div class="mc-footer"><a class="mc-link" href="income-expenditure.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='cash-book.html'"><div class="mc-icon">💵</div><h3>Cash Book</h3><p>Day-wise cash log</p><div class="mc-footer"><a class="mc-link" href="cash-book.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='bank-book.html'"><div class="mc-icon">🏦</div><h3>Bank Book</h3><p>Bank transaction log</p><div class="mc-footer"><a class="mc-link" href="bank-book.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='account-ledger.html'"><div class="mc-icon">📖</div><h3>Account Ledger</h3><p>Account-wise ledger</p><div class="mc-footer"><a class="mc-link" href="account-ledger.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='society-account.html'"><div class="mc-icon">🏛️</div><h3>Society Account</h3><p>Society-level account view</p><div class="mc-footer"><a class="mc-link" href="society-account.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='monthly-report.html'"><div class="mc-icon">📅</div><h3>Monthly Report</h3><p>Month-wise I&E summary</p><div class="mc-footer"><a class="mc-link" href="monthly-report.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='receipt-register.html'"><div class="mc-icon">📥</div><h3>Receipt Register</h3><p>All receipts register</p><div class="mc-footer"><a class="mc-link" href="receipt-register.html">→ Open</a></div></div>
  <div class="card module-card" onclick="location.href='payment-register.html'"><div class="mc-icon">📤</div><h3>Payment Register</h3><p>All payments register</p><div class="mc-footer"><a class="mc-link" href="payment-register.html">→ Open</a></div></div>
</div>
'@ ""

Write-Host "--- Foundation pages done ---"
