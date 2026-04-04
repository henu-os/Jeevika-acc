const fs = require('fs');
const path = require('path');
const dir = 'H:\\Jeevika Accounting\\html';

const sidebar = `<aside class="sidebar" id="sidebar"><div class="sidebar-logo"><div class="logo-icon">J</div><div class="logo-text"><h2>jeevika</h2><span>accounting</span></div></div><nav class="sidebar-nav"><div class="nav-item"><a href="dashboard.html"><span class="icon">📊</span> Dashboard</a></div><div class="nav-item"><a href="masters.html"><span class="icon">📋</span> Masters</a></div><div class="nav-item"><a href="transactions.html"><span class="icon">💰</span> Transactions</a></div><div class="nav-item"><a href="reports.html"><span class="icon">📈</span> Reports</a></div><div class="nav-item"><a href="communication.html"><span class="icon">💬</span> Communication</a></div><div class="nav-item"><a href="utilities.html"><span class="icon">🔧</span> Utilities</a></div><div class="nav-item"><a href="billing-utilities.html"><span class="icon">🧾</span> Billing Utilities</a></div><div class="nav-item"><a href="statutory.html"><span class="icon">⚖️</span> Stat. Compliance</a></div><div class="nav-item"><a href="forms-audit.html"><span class="icon">📝</span> Forms &amp; Audit</a></div><div class="nav-item"><a href="access-security.html"><span class="icon">🔐</span> Access &amp; Security</a></div><div class="sidebar-section">───────────</div><div class="sidebar-bottom"><div class="nav-item"><a href="notices.html"><span class="icon">📌</span> Notice Board</a></div><div class="nav-item"><a href="help.html"><span class="icon">❓</span> Help &amp; Documentation</a></div></div></nav></aside>`;
function tb(t,b){return `<header class="topbar"><div class="topbar-left"><button class="hamburger" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><div><div class="page-title">${t}</div><div class="breadcrumb">${b}</div></div></div><div class="topbar-center"><div class="search-wrap"><input type="text" class="search-bar" placeholder="Search..."></div></div><div class="topbar-right"><span class="topbar-date" id="currentDate"></span><button class="topbar-icon">🔔<span class="notif-badge">3</span></button><button class="topbar-icon">⊞</button><button class="topbar-icon">🛡️</button><button class="topbar-icon">✉️</button><button class="topbar-icon">⚙️</button><div class="topbar-profile"><div class="avatar">A</div><div class="profile-info"><div class="name">Admin</div><div class="role">Super Admin</div></div><span style="font-size:10px;color:var(--text-muted)">▼</span></div></div></header>`;}

function mp(f,t,b,body,eh='',ej=''){
fs.writeFileSync(path.join(dir,f),`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${t} — Jeevika Accounting</title><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="../css/global.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet">${eh}</head><body>${sidebar}<div class="main-wrapper">${tb(t,b)}<main class="page-content">${body}</main></div><script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><script src="../js/global.js"></script>${ej}</body></html>`,'utf8');
console.log('OK '+f);}

// ═══ MEMBER BILL ═══
mp('member-bill.html','Member Bill','Home / Transactions / Member Bill',`
<div class="page-header"><div><h1>Member Bill</h1><p>Generate maintenance bills</p></div></div>
<div class="card" style="margin-bottom:24px"><h3 style="font-weight:700;margin-bottom:16px">Generate Bills</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Financial Year</label><select class="form-input select2"><option>2024-25</option><option>2023-24</option></select></div>
<div class="form-group"><label class="form-label">Bill Type</label><select class="form-input select2"><option>Maintenance</option><option>Clubhouse</option><option>Major Repair</option></select></div>
<div class="form-group"><label class="form-label">Billing Period</label><div style="display:flex;gap:12px"><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="radio" name="period" checked> Monthly</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="radio" name="period"> Quarterly</label><label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="radio" name="period"> Annual</label></div></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Billing Month</label><input type="text" class="form-input date-picker" placeholder="April 2024"></div>
<div class="form-group"><label class="form-label">Due Date</label><input type="text" class="form-input date-picker" value="10/04/2024"></div>
<div class="form-group"><label class="form-label">Select Members</label><select class="form-input select2"><option>All Members</option><option>Wing A</option><option>Wing B</option><option>Wing C</option></select></div></div>
<div class="btn-group"><button class="btn-secondary">👁️ Preview Bills</button><button class="btn-primary" onclick="showToast('120 bills generated successfully')">📄 Generate Bills</button></div></div>
<div class="card"><div class="card-header"><h3>Generated Bills History</h3></div>
<table class="data-table"><thead><tr><th>Bill No.</th><th>Member</th><th>Period</th><th>Amount</th><th>GST</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead><tbody>
<tr><td>BILL/2024/089</td><td>Aman Salvi (A-101)</td><td>Apr 2024</td><td class="amount">₹5,700</td><td class="amount">₹810</td><td class="amount">₹6,510</td><td><span class="badge badge-success">Sent</span></td><td><button class="btn-icon">👁️</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
<tr><td>BILL/2024/090</td><td>Priya Sharma (B-205)</td><td>Apr 2024</td><td class="amount">₹5,700</td><td class="amount">₹810</td><td class="amount">₹6,510</td><td><span class="badge badge-warning">Pending</span></td><td><button class="btn-icon">👁️</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
<tr><td>BILL/2024/091</td><td>Rajesh Patil (C-302)</td><td>Apr 2024</td><td class="amount">₹5,700</td><td class="amount">₹810</td><td class="amount">₹6,510</td><td><span class="badge badge-success">Sent</span></td><td><button class="btn-icon">👁️</button> <button class="btn-icon">📱</button> <button class="btn-icon">📧</button></td></tr>
</tbody></table></div>`);

// ═══ MEMBER RECEIPT ═══
mp('member-receipt.html','Member Receipt','Home / Transactions / Member Receipt',`
<div class="page-header"><div><h1>Member Receipt</h1><p>Record member payments</p></div></div>
<div style="display:grid;grid-template-columns:1fr 340px;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">New Receipt</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Receipt No.</label><input type="text" class="form-input" value="REC/2024/143" disabled></div>
<div class="form-group"><label class="form-label">Receipt Date</label><input type="text" class="form-input date-picker" value="26/04/2024"></div></div>
<div class="form-group"><label class="form-label">Member</label><select class="form-input select2"><option></option><option>M001 — Aman Salvi (A-101)</option><option>M002 — Priya Sharma (B-205)</option><option>M003 — Rajesh Patil (C-302)</option><option>M004 — Sunita Joshi (A-404)</option><option>M005 — Vikram Mehta (B-106)</option></select></div>
<h4 style="font-weight:600;margin:16px 0 8px">Pending Bills</h4>
<table class="data-table"><thead><tr><th><input type="checkbox"></th><th>Bill No.</th><th>Period</th><th>Principal</th><th>Interest</th><th>Total Due</th></tr></thead><tbody>
<tr><td><input type="checkbox" checked></td><td>BILL/2024/089</td><td>Apr 2024</td><td class="amount">₹5,700</td><td class="amount">₹0</td><td class="amount">₹6,510</td></tr>
<tr><td><input type="checkbox"></td><td>BILL/2024/058</td><td>Mar 2024</td><td class="amount">₹5,700</td><td class="amount">₹950</td><td class="amount">₹7,460</td></tr>
</tbody></table>
<div class="form-group" style="margin-top:16px"><label class="form-label">Amount Received (₹)</label><input type="number" class="form-input" value="6510" style="font-size:18px;font-weight:700"></div>
<div class="form-group"><label class="form-label">Payment Mode</label>
<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-secondary" style="background:var(--accent-soft);border-color:var(--accent)">💵 Cash</button><button class="btn-secondary">📝 Cheque</button><button class="btn-secondary">🏦 NEFT</button><button class="btn-secondary">🏦 RTGS</button><button class="btn-secondary">📱 UPI</button><button class="btn-secondary">🌐 Online</button></div></div>
<div class="form-group"><label class="form-label">Narration</label><textarea class="form-input" rows="2" placeholder="Payment notes...">Received maintenance for April 2024</textarea></div>
<div class="btn-group"><button class="btn-primary" onclick="showToast('Receipt saved — REC/2024/143')">💾 Save Receipt</button><button class="btn-secondary" onclick="showToast('Receipt saved & sent to print','info')">🖨️ Save & Print</button></div></div>
<div style="display:flex;flex-direction:column;gap:20px">
<div class="card"><h3 style="font-weight:700;margin-bottom:12px">Member Info</h3><p style="font-size:14px;font-weight:600;color:var(--text-primary)">Aman Salvi</p><p style="font-size:12px;color:var(--text-muted)">Flat A-101 · Wing A · 📞 9876543210</p>
<div style="margin-top:16px;display:flex;flex-direction:column;gap:8px">
<div style="display:flex;justify-content:space-between"><span style="font-size:13px;color:var(--text-secondary)">Principal Outstanding</span><span class="amount" style="color:var(--danger)">₹12,000</span></div>
<div style="display:flex;justify-content:space-between"><span style="font-size:13px;color:var(--text-secondary)">Interest Outstanding</span><span class="amount" style="color:var(--danger)">₹3,500</span></div>
<div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid var(--border)"><span style="font-size:14px;font-weight:700;color:var(--text-primary)">Total Outstanding</span><span style="font-size:16px;font-weight:800;color:var(--danger)">₹15,500</span></div>
<div style="display:flex;justify-content:space-between;margin-top:8px"><span style="font-size:12px;color:var(--text-muted)">Last Payment</span><span style="font-size:12px;color:var(--text-secondary)">₹5,700 on 10/03/2024</span></div></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:12px">Receipt History</h3>
<div style="display:flex;flex-direction:column;gap:8px">
<div style="display:flex;justify-content:space-between;font-size:12px"><span>REC/2024/098 · 10/03/2024</span><span class="amount">₹5,700</span></div>
<div style="display:flex;justify-content:space-between;font-size:12px"><span>REC/2024/055 · 12/02/2024</span><span class="amount">₹5,700</span></div>
<div style="display:flex;justify-content:space-between;font-size:12px"><span>REC/2024/012 · 08/01/2024</span><span class="amount">₹6,200</span></div>
</div></div></div></div>`);

// ═══ DEBIT/CREDIT NOTE ═══
function noteForm(file,title,type,prefix){
mp(file,title,`Home / Transactions / ${title}`,`
<div class="page-header"><div><h1>${title}</h1><p>${type==='Debit'?'Add charges to member account':'Credit adjustments and refunds'}</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">New ${title}</h3>
<div class="form-row"><div class="form-group"><label class="form-label">${title} No.</label><input type="text" class="form-input" value="${prefix}/2024/012" disabled></div>
<div class="form-group"><label class="form-label">Date</label><input type="text" class="form-input date-picker" value="26/04/2024"></div></div>
<div class="form-group"><label class="form-label">Member</label><select class="form-input select2"><option></option><option>M001 — Aman Salvi</option><option>M002 — Priya Sharma</option><option>M003 — Rajesh Patil</option></select></div>
<div class="form-group"><label class="form-label">Account Head</label><select class="form-input select2"><option>Maintenance Charges</option><option>Water Charges</option><option>Parking Charges</option><option>NOC Charges</option><option>Other Income</option></select></div>
<div class="form-group"><label class="form-label">Amount (₹)</label><input type="number" class="form-input" placeholder="0.00"></div>
<div class="form-group"><label class="form-label">GST Applicable</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>
<div class="form-group"><label class="form-label">Narration *</label><textarea class="form-input" rows="3" required placeholder="Enter reason..."></textarea></div>
<button class="btn-primary" onclick="showToast('${title} saved')">Save ${title}</button></div>
<div class="card"><div class="card-header"><h3>Recent ${title}s</h3></div>
<table class="data-table"><thead><tr><th>No.</th><th>Date</th><th>Member</th><th>Amount</th><th>Narration</th></tr></thead><tbody>
<tr><td>${prefix}/2024/011</td><td>23/04/2024</td><td>Vikram Mehta</td><td class="amount">₹1,500</td><td>Late payment penalty</td></tr>
<tr><td>${prefix}/2024/010</td><td>18/04/2024</td><td>Priya Sharma</td><td class="amount">₹2,200</td><td>Window repair charges</td></tr>
</tbody></table></div></div>`);}

noteForm('debit-note.html','Debit Note','Debit','DN');
noteForm('credit-note.html','Credit Note','Credit','CN');

// ═══ CHEQUE ADJUSTMENT ═══
mp('cheque-adjustment.html','Cheque Adjustment','Home / Transactions / Cheque Adjustment',`
<div class="page-header"><div><h1>Cheque Adjustment</h1><p>Handle bounced/returned cheques</p></div></div>
<div class="card" style="margin-bottom:24px"><div class="card-header"><h3>Pending Cheques</h3></div>
<table class="data-table"><thead><tr><th>Select</th><th>Receipt No.</th><th>Member</th><th>Cheque No.</th><th>Bank</th><th>Date</th><th>Amount</th><th>Action</th></tr></thead><tbody>
<tr><td><input type="radio" name="chq"></td><td>REC/2024/130</td><td>Rajesh Patil</td><td>456789</td><td>SBI</td><td>15/04/2024</td><td class="amount">₹6,510</td><td><button class="btn-danger" style="font-size:11px;padding:4px 10px" onclick="showToast('Cheque marked as bounced','warning')">Mark Bounced</button></td></tr>
<tr><td><input type="radio" name="chq"></td><td>REC/2024/125</td><td>Vikram Mehta</td><td>789012</td><td>HDFC</td><td>12/04/2024</td><td class="amount">₹5,700</td><td><button class="btn-danger" style="font-size:11px;padding:4px 10px">Mark Bounced</button></td></tr>
</tbody></table></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">Adjustment Form</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Receipt No.</label><input type="text" class="form-input" value="REC/2024/130" disabled></div>
<div class="form-group"><label class="form-label">Member</label><input type="text" class="form-input" value="Rajesh Patil (C-302)" disabled></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Amount</label><input type="text" class="form-input" value="₹6,510" disabled></div>
<div class="form-group"><label class="form-label">Bounce Date</label><input type="text" class="form-input date-picker"></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">Return Charges (₹)</label><input type="number" class="form-input" value="500"></div>
<div class="form-group"><label class="form-label">Bounce Reason</label><select class="form-input"><option>Insufficient Funds</option><option>Account Closed</option><option>Signature Mismatch</option><option>Stop Payment</option><option>Other</option></select></div></div>
<div class="form-group"><label class="form-label">Auto-reverse original receipt</label><label class="toggle"><input type="checkbox" checked><span class="toggle-slider"></span></label></div>
<button class="btn-primary" onclick="showToast('Cheque adjustment processed')">Process Adjustment</button></div>`);

// ═══ VOUCHERS ═══
function voucherForm(file,title,prefix,extra=''){
mp(file,title,`Home / Transactions / ${title}`,`
<div class="page-header"><div><h1>${title}</h1><p>${title} entry</p></div></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">${title}</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Voucher No.</label><input type="text" class="form-input" value="${prefix}/2024/001" disabled></div>
<div class="form-group"><label class="form-label">Date</label><input type="text" class="form-input date-picker" value="26/04/2024"></div></div>
${extra}
<h4 style="font-weight:600;margin:16px 0 8px">Ledger Entries</h4>
<table class="data-table" id="voucherTable"><thead><tr><th>Account Head</th><th>Dr Amount (₹)</th><th>Cr Amount (₹)</th><th>Narration</th><th></th></tr></thead><tbody>
<tr><td><select class="form-input select2" style="width:200px"><option>Cash in Hand</option><option>HDFC Bank A/C</option><option>Maintenance Charges</option><option>Water Charges</option></select></td><td><input type="number" class="form-input" style="width:120px" value="5000"></td><td><input type="number" class="form-input" style="width:120px" value="0"></td><td><input type="text" class="form-input" style="width:160px"></td><td><button class="btn-icon" onclick="removeTableRow(this)">🗑️</button></td></tr>
<tr><td><select class="form-input select2" style="width:200px"><option>Maintenance Charges</option><option>Cash in Hand</option><option>HDFC Bank A/C</option></select></td><td><input type="number" class="form-input" style="width:120px" value="0"></td><td><input type="number" class="form-input" style="width:120px" value="5000"></td><td><input type="text" class="form-input" style="width:160px"></td><td><button class="btn-icon" onclick="removeTableRow(this)">🗑️</button></td></tr>
</tbody></table>
<div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">
<button class="btn-secondary" onclick="showToast('Row added','info')">+ Add Row</button>
<div style="display:flex;gap:24px;font-size:13px;font-weight:700"><span>Total Dr: <span style="color:var(--success)">₹5,000</span></span><span>Total Cr: <span style="color:var(--danger)">₹5,000</span></span><span style="color:var(--success)">✓ Balanced</span></div></div>
<div class="form-group" style="margin-top:16px"><label class="form-label">Narration</label><textarea class="form-input" rows="2" placeholder="Overall narration..."></textarea></div>
<div class="btn-group" style="margin-top:16px"><button class="btn-primary" onclick="showToast('Voucher saved — ${prefix}/2024/001')">💾 Save</button><button class="btn-secondary">🖨️ Save & Print</button></div></div>`);}

voucherForm('receipt-voucher.html','Receipt Voucher','RV',
`<div class="form-group"><label class="form-label">Receipt from</label><input type="text" class="form-input" placeholder="Party name"></div>
<div class="form-group"><label class="form-label">Mode</label><select class="form-input"><option>Cash</option><option>Cheque</option><option>NEFT</option><option>UPI</option></select></div>`);

voucherForm('payment-voucher.html','Payment Voucher','PV',
`<div class="form-group"><label class="form-label">Pay to</label><select class="form-input select2"><option>City Plumber Services</option><option>Mumbai Electricals</option><option>Clean India Solutions</option></select></div>
<div class="form-group"><label class="form-label">TDS Applicable</label><label class="toggle"><input type="checkbox"><span class="toggle-slider"></span></label></div>
<div class="form-group"><label class="form-label">Payment Mode</label><select class="form-input"><option>Cheque</option><option>NEFT</option><option>RTGS</option><option>Cash</option></select></div>`);

// CONTRA VOUCHER
mp('contra-voucher.html','Contra Voucher','Home / Transactions / Contra Voucher',`
<div class="page-header"><div><h1>Contra Voucher</h1><p>Bank ↔ Cash transfers</p></div></div>
<div class="card" style="max-width:640px"><h3 style="font-weight:700;margin-bottom:16px">Contra Entry</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Voucher No.</label><input type="text" class="form-input" value="CV/2024/009" disabled></div>
<div class="form-group"><label class="form-label">Date</label><input type="text" class="form-input date-picker" value="26/04/2024"></div></div>
<div class="form-group"><label class="form-label">Transfer Type</label>
<div style="display:flex;gap:12px"><button class="btn-primary" id="c2b" onclick="this.className='btn-primary';document.getElementById('b2c').className='btn-secondary'">💵→🏦 Cash to Bank</button><button class="btn-secondary" id="b2c" onclick="this.className='btn-primary';document.getElementById('c2b').className='btn-secondary'">🏦→💵 Bank to Cash</button></div></div>
<div class="form-row"><div class="form-group"><label class="form-label">From Account</label><select class="form-input select2"><option>Cash in Hand</option><option>HDFC Bank A/C</option><option>SBI Bank A/C</option></select></div>
<div class="form-group"><label class="form-label">To Account</label><select class="form-input select2"><option>HDFC Bank A/C</option><option>SBI Bank A/C</option><option>Cash in Hand</option></select></div></div>
<div class="form-group"><label class="form-label">Amount (₹)</label><input type="number" class="form-input" placeholder="0.00" style="font-size:18px;font-weight:700"></div>
<div class="form-group"><label class="form-label">Reference No.</label><input type="text" class="form-input" placeholder="Deposit slip / ref number"></div>
<div class="form-group"><label class="form-label">Narration</label><textarea class="form-input" rows="2" placeholder="Transfer details..."></textarea></div>
<div class="btn-group"><button class="btn-primary" onclick="showToast('Contra voucher saved')">💾 Save</button><button class="btn-secondary">🖨️ Save & Print</button></div></div>`);

voucherForm('journal-voucher.html','Journal Voucher','JV',
`<div class="form-group"><label class="form-label">Voucher Type</label><select class="form-input select2"><option>General</option><option>Adjustment</option><option>Provision</option></select></div>`);

// MEMBER JOURNAL
mp('member-journal.html','Member Journal','Home / Transactions / Member Journal',`
<div class="page-header"><div><h1>Member Journal</h1><p>Member-specific journal entries</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:16px">New Entry</h3>
<div class="form-row"><div class="form-group"><label class="form-label">Journal No.</label><input type="text" class="form-input" value="MJ/2024/005" disabled></div>
<div class="form-group"><label class="form-label">Date</label><input type="text" class="form-input date-picker"></div></div>
<div class="form-group"><label class="form-label">Member</label><select class="form-input select2"><option></option><option>M001 — Aman Salvi</option><option>M002 — Priya Sharma</option></select></div>
<div class="form-row"><div class="form-group"><label class="form-label">Dr Account Head</label><select class="form-input select2"><option>Maintenance Charges</option><option>Water Charges</option></select></div>
<div class="form-group"><label class="form-label">Cr Account Head</label><select class="form-input select2"><option>Interest from Member</option><option>Other Income</option></select></div></div>
<div class="form-group"><label class="form-label">Amount (₹)</label><input type="number" class="form-input" placeholder="0"></div>
<div class="form-group"><label class="form-label">Narration</label><textarea class="form-input" rows="2"></textarea></div>
<button class="btn-primary" onclick="showToast('Journal entry saved')">Save</button></div>
<div class="card"><div class="card-header"><h3>Recent Journals</h3></div>
<table class="data-table"><thead><tr><th>No.</th><th>Date</th><th>Member</th><th>Dr</th><th>Cr</th><th>Amount</th></tr></thead><tbody>
<tr><td>MJ/2024/004</td><td>20/04/2024</td><td>Priya Sharma</td><td>Maintenance</td><td>Interest</td><td class="amount">₹2,500</td></tr>
<tr><td>MJ/2024/003</td><td>15/04/2024</td><td>Aman Salvi</td><td>Water Charges</td><td>Other Income</td><td class="amount">₹800</td></tr>
</tbody></table></div></div>`);

// MULTI RECEIPT
mp('multi-receipt.html','Multi Receipt','Home / Transactions / Multi Receipt',`
<div class="page-header"><div><h1>Multi Receipt</h1><p>Bulk receipt entry</p></div></div>
<div class="card"><div class="tabs">
<button class="tab-btn active" data-tab-btn="mr" data-tab="mrFlat" onclick="switchTab('mr','mrFlat')">Flat-wise</button>
<button class="tab-btn" data-tab-btn="mr" data-tab="mrSociety" onclick="switchTab('mr','mrSociety')">Society-wise</button>
<button class="tab-btn" data-tab-btn="mr" data-tab="mrBlank" onclick="switchTab('mr','mrBlank')">Blank</button></div>
<div id="mrFlat" class="tab-content active" data-tab-group="mr">
<div class="form-row" style="margin-bottom:16px"><div class="form-group"><label class="form-label">Bill Type</label><select class="form-input"><option>Maintenance</option></select></div>
<div class="form-group"><label class="form-label">Period</label><select class="form-input"><option>April 2024</option></select></div>
<div class="form-group" style="display:flex;align-items:flex-end"><button class="btn-primary" onclick="showToast('All receipts saved')">💾 Save All</button></div></div>
<table class="data-table"><thead><tr><th>Flat</th><th>Member</th><th>Bill Amount</th><th>Received (₹)</th><th>Mode</th><th>Reference</th></tr></thead><tbody>
<tr><td>A-101</td><td>Aman Salvi</td><td class="amount">₹6,510</td><td><input type="number" class="form-input" style="width:100px" value="6510"></td><td><select class="form-input" style="width:100px"><option>Cash</option><option>Cheque</option><option>NEFT</option></select></td><td><input type="text" class="form-input" style="width:100px"></td></tr>
<tr><td>B-205</td><td>Priya Sharma</td><td class="amount">₹6,510</td><td><input type="number" class="form-input" style="width:100px"></td><td><select class="form-input" style="width:100px"><option>Cash</option><option>Cheque</option></select></td><td><input type="text" class="form-input" style="width:100px"></td></tr>
<tr><td>C-302</td><td>Rajesh Patil</td><td class="amount">₹6,510</td><td><input type="number" class="form-input" style="width:100px"></td><td><select class="form-input" style="width:100px"><option>Cash</option><option>Cheque</option></select></td><td><input type="text" class="form-input" style="width:100px"></td></tr>
</tbody></table></div>
<div id="mrSociety" class="tab-content" data-tab-group="mr"><p style="padding:24px;text-align:center;color:var(--text-muted)">Single receipt against a society-level income — same as Receipt Voucher form.</p></div>
<div id="mrBlank" class="tab-content" data-tab-group="mr"><p style="padding:24px;text-align:center;color:var(--text-muted)">Open-format: Member + Amount + Mode + Narration per row. Add/remove rows dynamically.</p></div></div>`);

// BANK RECONCILIATION
mp('bank-reconciliation.html','Bank Reconciliation','Home / Transactions / Bank Reconciliation',`
<div class="page-header"><div><h1>Bank Reconciliation</h1><p>Match bank statements with books</p></div></div>
<div class="card" style="margin-bottom:20px"><div class="form-row">
<div class="form-group"><label class="form-label">Bank Account</label><select class="form-input select2"><option>HDFC Bank A/C — XXXX4521</option><option>SBI — XXXX8912</option></select></div>
<div class="form-group"><label class="form-label">From Date</label><input type="text" class="form-input date-picker" value="01/04/2024"></div>
<div class="form-group"><label class="form-label">To Date</label><input type="text" class="form-input date-picker" value="30/04/2024"></div>
<div class="form-group" style="display:flex;align-items:flex-end;gap:8px"><button class="btn-primary">🔄 Auto Match</button><button class="btn-secondary">📥 Upload Statement</button></div></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><h3 style="font-weight:700;margin-bottom:12px">📚 Book Entries</h3>
<table class="data-table"><thead><tr><th>Date</th><th>Particulars</th><th>Dr</th><th>Cr</th></tr></thead><tbody>
<tr><td>05/04</td><td>Maintenance Receipt</td><td class="amount">₹6,510</td><td>—</td></tr>
<tr><td>10/04</td><td>Electricity Payment</td><td>—</td><td class="amount">₹12,500</td></tr>
<tr><td>15/04</td><td>FD Maturity</td><td class="amount">₹5,00,000</td><td>—</td></tr>
<tr style="background:#FEF3C7"><td>20/04</td><td>Cheque Deposit</td><td class="amount">₹6,510</td><td>—</td></tr>
</tbody></table></div>
<div class="card"><h3 style="font-weight:700;margin-bottom:12px">🏦 Bank Statement</h3>
<table class="data-table"><thead><tr><th>Date</th><th>Description</th><th>Dr</th><th>Cr</th></tr></thead><tbody>
<tr><td>05/04</td><td>NEFT CR-MAINT</td><td class="amount">₹6,510</td><td>—</td></tr>
<tr><td>10/04</td><td>NEFT DR-MSEB</td><td>—</td><td class="amount">₹12,500</td></tr>
<tr><td>15/04</td><td>FD MAT CR</td><td class="amount">₹5,00,000</td><td>—</td></tr>
<tr style="background:#FEF3C7"><td>22/04</td><td>CHQ DEP</td><td class="amount">₹6,510</td><td>—</td></tr>
</tbody></table></div></div>
<div class="card" style="margin-top:20px"><h3 style="font-weight:700;margin-bottom:12px">Reconciliation Summary</h3>
<div class="grid-3"><div><span style="font-size:13px;color:var(--text-muted)">Book Balance</span><div style="font-size:20px;font-weight:800;color:var(--text-primary)">₹5,00,520</div></div>
<div><span style="font-size:13px;color:var(--text-muted)">Bank Balance</span><div style="font-size:20px;font-weight:800;color:var(--text-primary)">₹5,00,520</div></div>
<div><span style="font-size:13px;color:var(--text-muted)">Difference</span><div style="font-size:20px;font-weight:800;color:var(--success)">₹0.00 ✓</div></div></div></div>`);

// QUICK NOTE
mp('quick-note.html','Quick Note','Home / Transactions / Quick Note',`
<div class="page-header"><div><h1>Quick Note</h1><p>Fast memo entry</p></div></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
<div class="card"><div class="form-group"><label class="form-label">Account Head</label><select class="form-input select2"><option>Maintenance Charges</option><option>Water Charges</option><option>Other Income</option></select></div>
<div class="form-group"><label class="form-label">Date</label><input type="text" class="form-input date-picker"></div>
<div class="form-group"><label class="form-label">Note</label><textarea class="form-input" rows="6" placeholder="Type your note here..."></textarea></div>
<div class="form-group"><label class="form-label">Attach to Member</label><label class="toggle"><input type="checkbox" id="attachMem" onchange="document.getElementById('memSelect').style.display=this.checked?'block':'none'"><span class="toggle-slider"></span></label></div>
<div class="form-group" id="memSelect" style="display:none"><label class="form-label">Member</label><select class="form-input select2"><option>M001 — Aman Salvi</option><option>M002 — Priya Sharma</option></select></div>
<button class="btn-primary" onclick="showToast('Note saved')">Save Note</button></div>
<div class="card"><div class="card-header"><h3>Recent Notes</h3></div>
<div style="display:flex;flex-direction:column;gap:12px">
<div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;font-weight:600;color:var(--primary)">Maintenance Charges</span><span style="font-size:11px;color:var(--text-muted)">25/04/2024</span></div><p style="font-size:13px;color:var(--text-secondary)">Pending water tank cleaning payment with vendor</p><button class="btn-icon" style="margin-top:8px">🗑️</button></div>
<div style="padding:12px;border:1px solid var(--border);border-radius:var(--radius-md)"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;font-weight:600;color:var(--primary)">Other Income</span><span style="font-size:11px;color:var(--text-muted)">20/04/2024</span></div><p style="font-size:13px;color:var(--text-secondary)">Hall booking deposit received from Flat B-205</p><button class="btn-icon" style="margin-top:8px">🗑️</button></div>
</div></div></div>`);

console.log('=== BATCH 3 COMPLETE ===');
