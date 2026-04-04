/* ════════════════════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — MASTERS MODULE BRAIN v1.0
   Scope: Masters Module ONLY
   Stack: Vanilla JS — localStorage — Non-blocking Popups
   Rule: DO NOT change any HTML/CSS. This is PURE ENGINE.
   ════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════
// SECTION 1 — DATA STORAGE ARCHITECTURE
// ═══════════════════════════════════════════════════════════

const DB = {
  SOCIETIES:        'jeevika_societies',
  ACTIVE_SOCIETY:   'jeevika_active_society',
  GROUPS:           'jeevika_groups',
  ACCOUNTS:         'jeevika_accounts',
  MEMBERS:          'jeevika_members',
  BILL_SETTINGS:    'jeevika_bill_settings',
  AUTO_MASTER:      'jeevika_auto_master',
  MEMBER_BILLS:     'jeevika_member_bills',
  OPENING_BALANCES: 'jeevika_opening_balances',
  OPENING_BANK_RECO:'jeevika_opening_bank_reco',
  BILL_PRINT_CONFIG:'jeevika_bill_print_config',
  GST_MASTER:       'jeevika_gst_master',
  FINANCIAL_YEARS:  'jeevika_financial_years',
  INVOICES:         'jeevika_member_bills_issued',
  LEDGER:           'jeevika_ledger_entries',
  VOUCHER_TYPES:    'jeevika_voucher_types',
};

function dbRead(key)        { return JSON.parse(localStorage.getItem(key) || '[]'); }
function dbReadObj(key)     { return JSON.parse(localStorage.getItem(key) || '{}'); }
function dbWrite(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

const EventBus = {
  listeners: {},
  on(event, fn)     { (this.listeners[event] = this.listeners[event] || []).push(fn); },
  emit(event, data) { (this.listeners[event] || []).forEach(fn => fn(data)); }
};

// ═══════════════════════════════════════════════════════════
// SECTION 2 — POPUP ENGINE (NON-BLOCKING, STACKABLE)
// ═══════════════════════════════════════════════════════════

const PopupManager = {
  zBase: 1000,
  activePopups: [],

  open(id, title, contentHTML, options = {}) {
    const existing = document.getElementById('popup_' + id);
    if (existing) { this.focus(id); return existing; }

    const popup = document.createElement('div');
    popup.id = 'popup_' + id;
    popup.className = 'jv-popup';
    popup.style.cssText = `
      position: fixed;
      top: ${80 + this.activePopups.length * 30}px;
      left: ${200 + this.activePopups.length * 30}px;
      width: ${options.width || '520px'};
      min-height: ${options.minHeight || '300px'};
      max-height: 90vh;
      z-index: ${this.zBase + this.activePopups.length};
      background: var(--bg-card, #fff);
      border-radius: var(--radius-lg, 12px);
      box-shadow: 0 8px 40px rgba(45,27,105,0.22);
      border: 1px solid var(--border, #E2DCF5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    popup.innerHTML = `
      <div class="jv-popup-header" style="
        background: var(--primary, #2D1B69);
        color: #fff;
        padding: 12px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: move;
        user-select: none;
        flex-shrink: 0;
      ">
        <span style="font-weight:700;font-size:14px;">${title}</span>
        <button onclick="PopupManager.close('${id}')" style="
          background:none;border:none;color:#fff;cursor:pointer;
          font-size:20px;line-height:1;padding:0 4px;
        ">&times;</button>
      </div>
      <div class="jv-popup-body" style="
        padding: 20px;
        overflow-y: auto;
        flex: 1;
      ">${contentHTML}</div>
    `;

    document.body.appendChild(popup);
    this.activePopups.push(id);
    this.makeDraggable(popup);
    this.focus(id);
    return popup;
  },

  close(id) {
    const popup = document.getElementById('popup_' + id);
    if (popup) popup.remove();
    this.activePopups = this.activePopups.filter(p => p !== id);
  },

  focus(id) {
    const popup = document.getElementById('popup_' + id);
    if (!popup) return;
    const maxZ = Math.max(this.zBase, ...this.activePopups.map(pid => {
      const p = document.getElementById('popup_' + pid);
      return p ? parseInt(p.style.zIndex) : 0;
    }));
    popup.style.zIndex = maxZ + 1;
  },

  makeDraggable(popup) {
    const header = popup.querySelector('.jv-popup-header');
    let isDragging = false, startX, startY, origLeft, origTop;
    header.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseInt(popup.style.left) || 0;
      origTop  = parseInt(popup.style.top)  || 0;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      popup.style.left = (origLeft + e.clientX - startX) + 'px';
      popup.style.top  = (origTop  + e.clientY - startY) + 'px';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
    popup.addEventListener('mousedown', () => this.focus(popup.id.replace('popup_','')));
  }
};

// ═══════════════════════════════════════════════════════════
// SCHEMAS
// ═══════════════════════════════════════════════════════════

const SocietySchema = {
  code:'', name:'', registrationNo:'', address:'', email:'', contactNo:'',
  gstin:'', pan:'', tan:'', ptNo:'', areaUnit:'sqft',
  financialYearStart:'', financialYearEnd:'',
  interestMethod:'monthly', interestType:'simple', interestRate:21,
  interestPriority:'interest_first', roundedUpto:0,
  billingMethod:'monthly', billDate:1, dueDate:20, noOfMonths:1,
  period:'', particular:'', message:'',
  gstEnabled:false,
  // Parking / NOC
  parking:'', nocCharges:'',
  // Contact Persons
  contactPerson1:'', contactPerson2:'',
  // Share Capital (right panel)
  shareCapital: { name: '2000 Shares Of Rs. 50/- Each', totalShares:2000, valuePerShare:50, totalAmount:100000, paidUpShares:0, paidUpAmount:0 },
  // Balance Sheet Footer (6 lines)
  balanceSheetFooter: [],
  // Billing Remarks Column 1 (6 lines)
  billingRemarksCol1: [],
  linewiseRemark: true,
  // Billing Remarks Column 2 (6 lines)
  billingRemarksCol2: { lines:[], notPrintOnHalfPageBill:true, printIn2Columns:false },
  // Signatures
  signatures: {
    chairmanName:'', chairmanLabel:'Hon.Chairman',
    secretaryName:'', secretaryLabel:'Hon.Secretary',
    treasurerName:'', treasurerLabel:'Hon.Treasurer',
    showOnBills:true, showOnReports:true, showOnReceipts:true
  },
  // Blast Panel
  blastPanel: {
    enabled:false, whatsappEnabled:false, emailEnabled:false,
    smsEnabled:false, pushEnabled:false, defaultMessage:''
  },
  // Bank Details
  bankDetails:'', bankName:'', bankBranch:'', bankAccountNo:'', bankIFSC:'', upiId:'',
  chequeInstructions:'',
  // Legacy compat
  chairmanName:'', secretaryName:'', treasurerName:'',
  billingRemarks:''
};

const GroupSchema = {
  code:'', name:'', nameMarathi:'', mainGroup:'', isTotal:false
};

const MAIN_GROUPS = [
  { code:'IN', label:'Income',      numCode:'001' },
  { code:'EX', label:'Expenditure', numCode:'101' },
  { code:'AS', label:'Assets',      numCode:'201' },
  { code:'LI', label:'Liabilities', numCode:'301' },
];

const AccountSchema = {
  code:'', name:'', nameBSheet:'', nameSecondLang:'',
  groupCode:'', mainGroup:'',
  openingBalance:0, openingBalanceType:'Dr', prevYearBalance:0,
  address:'', contactNo:'', email:'', pan:'', tan:'', gstin:''
};

const MemberSchema = {
  code:'', groupName:'Dues from Members',
  names:['','','',''], building:'', wing:'', flatNo:'', sqft:0,
  areaType:'RERA', openingPrincipal:0, openingInterest:0,
  contactNo:'', email:'', gstin:'', pan:'', loanDetails:'',
  bankName:'', nocApplicable:false,
  parkingDetails:[], defaultRemarks:''
};

const BILLING_HEADS = [
  { id:'property_tax',   name:'Property Tax',              gstApplicable:false, gstExempt:false },
  { id:'water',          name:'Water Charges',              gstApplicable:false, gstExempt:false },
  { id:'electricity',    name:'Electricity Charges',        gstApplicable:false, gstExempt:false },
  { id:'na_tax',         name:'N.A. Tax',                   gstApplicable:false, gstExempt:false },
  { id:'service',        name:'Service Charges',            gstApplicable:true,  gstExempt:false },
  { id:'sinking_fund',   name:'Sinking Fund',               gstApplicable:false, gstExempt:true  },
  { id:'repair_fund',    name:'Repair & Maintenance Fund',   gstApplicable:false, gstExempt:true  },
  { id:'noc',            name:'NOC Charges',                gstApplicable:true,  gstExempt:false },
  { id:'social_welfare', name:'Social Welfare',             gstApplicable:false, gstExempt:false },
  { id:'parking',        name:'Parking Charges',            gstApplicable:false, gstExempt:false },
  { id:'clubhouse',      name:'Club House Account',         gstApplicable:true,  gstExempt:false },
  { id:'compound',       name:'Compound Account',           gstApplicable:false, gstExempt:false },
];

// ═══════════════════════════════════════════════════════════
// SECTION 3 — MODULE 1: SOCIETY MASTER
// ═══════════════════════════════════════════════════════════

const SocietyMaster = {
  init() {
    this.render();
    document.addEventListener('click', e => {
      if (e.target.matches('.society-select-btn')) {
        this.setActive(e.target.dataset.code);
      }
    });
  },
  getAll() { return dbRead(DB.SOCIETIES); },
  getActive() {
    const code = localStorage.getItem(DB.ACTIVE_SOCIETY);
    return this.getAll().find(s => s.code === code) || null;
  },
  setActive(code) {
    const society = this.getAll().find(s => s.code === code);
    if (!society) return;
    localStorage.setItem(DB.ACTIVE_SOCIETY, code);
    this.applyGSTSwitch(society.gstEnabled);
    EventBus.emit('society:updated', society);
    this.render();
    showToast('Society "' + society.name + '" loaded', 'success');
  },
  applyGSTSwitch(gstEnabled) {
    const gstNavItem = document.querySelector('[data-module="gst-master"]');
    if (gstNavItem) gstNavItem.style.display = gstEnabled ? '' : 'none';
    localStorage.setItem('jeevika_gst_enabled', gstEnabled ? '1' : '0');
    EventBus.emit('gst:switched', { enabled: gstEnabled });
  },
  isGSTEnabled() {
    return localStorage.getItem('jeevika_gst_enabled') === '1';
  },
  add(data) {
    const societies = this.getAll();
    if (societies.find(s => s.code === data.code)) {
      showToast('Society code already exists', 'error'); return false;
    }
    societies.push({ ...SocietySchema, ...data });
    dbWrite(DB.SOCIETIES, societies);
    EventBus.emit('society:updated', data);
    return true;
  },
  update(code, data) {
    const societies = this.getAll();
    const idx = societies.findIndex(s => s.code === code);
    if (idx === -1) { showToast('Society not found', 'error'); return false; }
    const wasGST = societies[idx].gstEnabled;
    societies[idx] = { ...societies[idx], ...data };
    dbWrite(DB.SOCIETIES, societies);
    if (wasGST !== data.gstEnabled) this.applyGSTSwitch(data.gstEnabled);
    EventBus.emit('society:updated', societies[idx]);
    return true;
  },
  delete(code) {
    const active = localStorage.getItem(DB.ACTIVE_SOCIETY);
    if (active === code) { showToast('Cannot delete active society', 'error'); return false; }
    const societies = this.getAll().filter(s => s.code !== code);
    dbWrite(DB.SOCIETIES, societies);
    return true;
  },
  collectForm(form) {
    const data = {};
    form.querySelectorAll('[name]').forEach(el => {
      if (el.type === 'checkbox') data[el.name] = el.checked;
      else if (el.type === 'number') data[el.name] = parseFloat(el.value) || 0;
      else data[el.name] = el.value.trim();
    });
    return data;
  },
  openAddForm() {
    // Use full two-panel form
    if (typeof SocietyMasterFull !== 'undefined') {
      SocietyMasterFull.openForm(null);
    } else {
      PopupManager.open('society_add', 'Add Society', this.buildForm(), { width:'600px' });
      this.bindFormEvents('society_add', null);
    }
  },
  openEditForm(code) {
    const society = this.getAll().find(s => s.code === code);
    if (!society) return;
    // Use full two-panel form
    if (typeof SocietyMasterFull !== 'undefined') {
      SocietyMasterFull.openForm(code);
    } else {
      PopupManager.open('society_edit_' + code, 'Edit Society — ' + society.name,
        this.buildForm(society), { width:'600px' });
      this.bindFormEvents('society_edit_' + code, code);
    }
  },
  buildForm(data) {
    data = data || {};
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">' +
      '<div class="form-group"><label class="form-label">Society Code *</label>' +
      '<input class="form-input" name="code" value="' + (data.code||'') + '" ' + (data.code?'readonly':'') + '></div>' +
      '<div class="form-group"><label class="form-label">Society Name *</label>' +
      '<input class="form-input" name="name" value="' + (data.name||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Registration No.</label>' +
      '<input class="form-input" name="registrationNo" value="' + (data.registrationNo||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">GSTIN</label>' +
      '<input class="form-input" name="gstin" value="' + (data.gstin||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">PAN</label>' +
      '<input class="form-input" name="pan" value="' + (data.pan||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">TAN</label>' +
      '<input class="form-input" name="tan" value="' + (data.tan||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Email</label>' +
      '<input class="form-input" name="email" type="email" value="' + (data.email||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Contact No.</label>' +
      '<input class="form-input" name="contactNo" value="' + (data.contactNo||'') + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Address</label>' +
      '<textarea class="form-input" name="address" rows="2">' + (data.address||'') + '</textarea></div>' +
      '<div class="form-group"><label class="form-label">Area Unit</label>' +
      '<select class="form-input" name="areaUnit"><option value="sqft" ' + (data.areaUnit==='sqft'?'selected':'') + '>Sq.ft</option>' +
      '<option value="sqmtr" ' + (data.areaUnit==='sqmtr'?'selected':'') + '>Sq.mtr</option></select></div>' +
      '<div class="form-group"><label class="form-label">Financial Year Start</label>' +
      '<input class="form-input" name="financialYearStart" type="date" value="' + (data.financialYearStart||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Financial Year End</label>' +
      '<input class="form-input" name="financialYearEnd" type="date" value="' + (data.financialYearEnd||'') + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><div style="font-weight:700;font-size:13px;color:var(--primary);margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:4px;">Interest Settings</div></div>' +
      '<div class="form-group"><label class="form-label">Interest Type</label>' +
      '<select class="form-input" name="interestType"><option value="simple" ' + (data.interestType==='simple'?'selected':'') + '>Simple</option>' +
      '<option value="compound" ' + (data.interestType==='compound'?'selected':'') + '>Compound</option></select></div>' +
      '<div class="form-group"><label class="form-label">Interest Rate (max 21%)</label>' +
      '<input class="form-input" name="interestRate" type="number" min="0" max="21" value="' + (data.interestRate||21) + '"></div>' +
      '<div class="form-group"><label class="form-label">Interest Priority</label>' +
      '<select class="form-input" name="interestPriority"><option value="interest_first" ' + (data.interestPriority==='interest_first'?'selected':'') + '>Interest First</option>' +
      '<option value="principal_first" ' + (data.interestPriority==='principal_first'?'selected':'') + '>Principal First</option></select></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><div style="font-weight:700;font-size:13px;color:var(--primary);margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:4px;">Billing Cycle</div></div>' +
      '<div class="form-group"><label class="form-label">Billing Method</label>' +
      '<select class="form-input" name="billingMethod"><option value="monthly" ' + (data.billingMethod==='monthly'?'selected':'') + '>Monthly</option>' +
      '<option value="quarterly" ' + (data.billingMethod==='quarterly'?'selected':'') + '>Quarterly</option>' +
      '<option value="annual" ' + (data.billingMethod==='annual'?'selected':'') + '>Annual</option></select></div>' +
      '<div class="form-group"><label class="form-label">Bill Date (day)</label>' +
      '<input class="form-input" name="billDate" type="number" min="1" max="28" value="' + (data.billDate||1) + '"></div>' +
      '<div class="form-group"><label class="form-label">Due Date (day)</label>' +
      '<input class="form-input" name="dueDate" type="number" min="1" max="28" value="' + (data.dueDate||20) + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><div style="font-weight:700;font-size:13px;color:var(--primary);margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:4px;">GST Configuration</div>' +
      '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;">' +
      '<input type="checkbox" name="gstEnabled" ' + (data.gstEnabled?'checked':'') + ' style="width:18px;height:18px;accent-color:var(--primary);">' +
      '<span class="form-label" style="margin:0;">GST Enabled<span style="color:var(--danger);font-size:11px;display:block;">⚠ Affects billing, accounts, GST Master visibility system-wide</span></span></label></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Billing Remarks</label>' +
      '<textarea class="form-input" name="billingRemarks" rows="2">' + (data.billingRemarks||'') + '</textarea></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Bank Details</label>' +
      '<textarea class="form-input" name="bankDetails" rows="2">' + (data.bankDetails||'') + '</textarea></div>' +
      '<div class="form-group"><label class="form-label">Chairman Name</label>' +
      '<input class="form-input" name="chairmanName" value="' + (data.chairmanName||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Secretary Name</label>' +
      '<input class="form-input" name="secretaryName" value="' + (data.secretaryName||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Treasurer Name</label>' +
      '<input class="form-input" name="treasurerName" value="' + (data.treasurerName||'') + '"></div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="society_save_btn">Save Society</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(this.closest(\'.jv-popup\').id.replace(\'popup_\',\'\'))">Cancel</button></div>';
  },
  bindFormEvents(popupId, editCode) {
    const popup = document.getElementById('popup_' + popupId);
    if (!popup) return;
    popup.querySelector('#society_save_btn').addEventListener('click', () => {
      const form = popup.querySelector('.jv-popup-body');
      const data = this.collectForm(form);
      if (!data.code || !data.name) { showToast('Code and Name are required', 'error'); return; }
      const ok = editCode ? this.update(editCode, data) : this.add(data);
      if (ok) { showToast('Society saved', 'success'); PopupManager.close(popupId); this.render(); }
    });
  },
  render() {
    const tbody = document.querySelector('#society-table-body');
    if (!tbody) return;
    const active = localStorage.getItem(DB.ACTIVE_SOCIETY);
    tbody.innerHTML = this.getAll().map(s =>
      '<tr class="' + (s.code === active ? 'active-row' : '') + '">' +
      '<td>' + s.code + '</td><td>' + s.name + '</td>' +
      '<td>' + (s.financialYearStart || '—') + ' to ' + (s.financialYearEnd || '—') + '</td>' +
      '<td><span class="badge ' + (s.gstEnabled ? 'badge-success' : 'badge-info') + '">' +
      (s.gstEnabled ? 'GST ON' : 'GST OFF') + '</span></td>' +
      '<td style="text-align:center;"><button class="btn-icon society-select-btn" data-code="' + s.code + '">Select</button>' +
      '<button class="btn-icon" onclick="SocietyMaster.openEditForm(\'' + s.code + '\')">Edit</button>' +
      '<button class="btn-icon" onclick="SocietyMaster.delete(\'' + s.code + '\');SocietyMaster.render();">Delete</button></td></tr>'
    ).join('');
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 4 — MODULE 2: GROUP MASTER
// ═══════════════════════════════════════════════════════════

// Society-required guard helper — blocks module if no active society
function requireSociety(label) {
  if (!SocietyMaster.getActive()) {
    showToast('Select a society first before using ' + (label||'this module'), 'warning');
    return false;
  }
  return true;
}

const GroupMaster = {
  getAll()           { return dbRead(DB.GROUPS); },
  getByMainGroup(mg) { return this.getAll().filter(g => g.mainGroup === mg); },
  getNextCode(mainGroup) {
    const existing = this.getAll().filter(g => g.mainGroup === mainGroup);
    return mainGroup + String(existing.length + 1).padStart(2, '0');
  },
  add(data) {
    const groups = this.getAll();
    if (data.code && groups.find(g => g.code === data.code)) {
      showToast('Group code already exists', 'error'); return false;
    }
    if (!data.code) data.code = this.getNextCode(data.mainGroup);
    groups.push({ ...GroupSchema, ...data });
    dbWrite(DB.GROUPS, groups);
    EventBus.emit('group:updated', groups);
    if (typeof AccountMaster !== 'undefined') AccountMaster.refreshGroupDropdowns();
    return true;
  },
  update(code, data) {
    const groups = this.getAll();
    const idx = groups.findIndex(g => g.code === code);
    if (idx === -1) { showToast('Group not found', 'error'); return false; }
    groups[idx] = { ...groups[idx], ...data };
    dbWrite(DB.GROUPS, groups);
    EventBus.emit('group:updated', groups);
    if (typeof AccountMaster !== 'undefined') AccountMaster.refreshGroupDropdowns();
    return true;
  },
  delete(code) {
    const accounts = AccountMaster.getAll();
    if (accounts.find(a => a.groupCode === code)) {
      showToast('Cannot delete: accounts exist under this group', 'error'); return false;
    }
    const groups = this.getAll().filter(g => g.code !== code);
    dbWrite(DB.GROUPS, groups);
    EventBus.emit('group:updated', groups);
    return true;
  },
  openAddForm() {
    if (!requireSociety('Group Master')) return;
    PopupManager.open('group_add', 'Add Group', this.buildForm(), { width:'440px' });
    this.bindFormEvents('group_add', null);
  },
  openEditForm(code) {
    const group = this.getAll().find(g => g.code === code);
    if (!group) return;
    PopupManager.open('group_edit_' + code, 'Edit Group — ' + group.name,
      this.buildForm(group), { width:'440px' });
    this.bindFormEvents('group_edit_' + code, code);
  },
  buildForm(data) {
    data = data || {};
    const opts = MAIN_GROUPS.map(mg =>
      '<option value="' + mg.code + '" ' + (data.mainGroup===mg.code?'selected':'') + '>' +
      mg.label + ' (' + mg.numCode + ')</option>').join('');
    return '<div style="display:flex;flex-direction:column;gap:24px; padding: 10px 40px;">' +
      '<div class="form-group" style="display: flex; align-items: center; gap: 20px;">' +
        '<label class="form-label" style="width: 140px; margin-bottom: 0;">Group Name</label>' +
        '<input class="form-input" name="name" value="' + (data.name||'') + '" style="flex: 1;">' +
      '</div>' +
      '<div class="form-group" style="display: flex; align-items: center; gap: 20px;">' +
        '<label class="form-label" style="width: 140px; margin-bottom: 0;">Main Group Name</label>' +
        '<select class="form-input" name="mainGroup" style="flex: 1;"><option value="">-- Select --</option>' + opts + '</select>' +
      '</div>' +
      '<div class="form-group" style="display: flex; align-items: center; gap: 20px;">' +
        '<label class="form-label" style="width: 140px; margin-bottom: 0;">Group Total</label>' +
        '<input type="checkbox" name="isTotal" ' + (data.isTotal?'checked':'') + ' style="width:18px;height:18px;accent-color:var(--primary);">' +
      '</div>' +
      '</div>' +
      '<div style="display:flex;gap:20px;margin-top:40px;justify-content:center; padding-bottom: 20px;">' +
      '<button class="btn-secondary" id="group_save_btn" style="min-width: 100px;">Save</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(this.closest(\'.jv-popup\').id.replace(\'popup_\',\'\'))" style="min-width: 100px;">Exit</button></div>';
  },
  bindFormEvents(popupId, editCode) {
    const popup = document.getElementById('popup_' + popupId);
    if (!popup) return;
    popup.querySelector('#group_save_btn').addEventListener('click', () => {
      const data = SocietyMaster.collectForm(popup.querySelector('.jv-popup-body'));
      if (!data.name || !data.mainGroup) { showToast('Group Name and Main Group are required', 'error'); return; }
      const ok = editCode ? this.update(editCode, data) : this.add(data);
      if (ok) { showToast('Group saved', 'success'); PopupManager.close(popupId); GroupMaster.render(); }
    });
  },
  printList() {
    const groups = this.getAll();
    const rows = MAIN_GROUPS.map(mg => {
      const mgGroups = groups.filter(g => g.mainGroup === mg.code);
      return '<tr style="background:#f5f5f5;font-weight:bold;"><td colspan="3">' + mg.label + ' (' + mg.numCode + ')</td></tr>' +
        mgGroups.map(g => '<tr><td>' + g.code + '</td><td>' + g.name + '</td><td>' + (g.nameMarathi||'—') + '</td></tr>').join('');
    }).join('');
    const w = window.open('','_blank');
    w.document.write('<html><body style="font-family:sans-serif;"><h2>Group Master List</h2><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;"><thead><tr><th>Code</th><th>Group Name</th><th>Name (Marathi)</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>');
    w.document.close(); w.print();
  },
  render() {
    const tbody = document.querySelector('#group-table-body');
    if (!tbody) return;
    tbody.innerHTML = this.getAll().map(g => {
      const mg = MAIN_GROUPS.find(m => m.code === g.mainGroup);
      return '<tr><td>' + g.code + '</td><td>' + g.name + (g.nameMarathi ? ' / ' + g.nameMarathi : '') + '</td>' +
        '<td>' + (mg ? mg.label : '—') + '</td>' +
        '<td><button class="btn-icon" onclick="GroupMaster.openEditForm(\'' + g.code + '\')">Alter</button>' +
        '<button class="btn-icon" onclick="GroupMaster.delete(\'' + g.code + '\');GroupMaster.render();">Delete</button></td></tr>';
    }).join('');
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 5 — MODULE 3: ACCOUNT MASTER
// ═══════════════════════════════════════════════════════════

const AccountMaster = {
  getAll()        { return dbRead(DB.ACCOUNTS); },
  getByCode(code) { return this.getAll().find(a => a.code === code); },
  getByGroup(gc)  { return this.getAll().filter(a => a.groupCode === gc); },
  getByMainGroup(mg) { return this.getAll().filter(a => a.mainGroup === mg); },
  deriveMainGroup(groupCode) {
    const group = GroupMaster.getAll().find(g => g.code === groupCode);
    return group ? group.mainGroup : '';
  },
  refreshGroupDropdowns() {
    document.querySelectorAll('select[name="groupCode"]').forEach(sel => {
      const current = sel.value;
      sel.innerHTML = '<option value="">-- Select Group --</option>' + this.buildGroupOptions(current);
    });
  },
  buildGroupOptions(selected) {
    selected = selected || '';
    const groups = GroupMaster.getAll();
    const byMain = {}; MAIN_GROUPS.forEach(mg => { byMain[mg.code] = []; });
    groups.forEach(g => { if (byMain[g.mainGroup]) byMain[g.mainGroup].push(g); });
    return MAIN_GROUPS.map(mg =>
      '<optgroup label="' + mg.label + ' (' + mg.numCode + ')">' +
      byMain[mg.code].map(g =>
        '<option value="' + g.code + '" ' + (g.code===selected?'selected':'') + '>' + g.name + '</option>'
      ).join('') + '</optgroup>'
    ).join('');
  },
  add(data) {
    const accounts = this.getAll();
    if (accounts.find(a => a.code === data.code)) {
      showToast('Account code already exists', 'error'); return false;
    }
    data.mainGroup = this.deriveMainGroup(data.groupCode);
    accounts.push({ ...AccountSchema, ...data });
    dbWrite(DB.ACCOUNTS, accounts);
    EventBus.emit('account:updated', accounts);
    OpeningBalanceMaster.onAccountAdded(data);
    BillSetting.onAccountAdded(data);
    return true;
  },
  update(code, data) {
    const accounts = this.getAll();
    const idx = accounts.findIndex(a => a.code === code);
    if (idx === -1) { showToast('Account not found', 'error'); return false; }
    data.mainGroup = this.deriveMainGroup(data.groupCode);
    accounts[idx] = { ...accounts[idx], ...data };
    dbWrite(DB.ACCOUNTS, accounts);
    EventBus.emit('account:updated', accounts);
    return true;
  },
  delete(code) {
    const billSettings = BillSetting.getAll();
    if (billSettings.find(b => b.accountCode === code)) {
      showToast('Cannot delete: account is used in Bill Settings', 'error'); return false;
    }
    const accounts = this.getAll().filter(a => a.code !== code);
    dbWrite(DB.ACCOUNTS, accounts);
    EventBus.emit('account:updated', accounts);
    return true;
  },
  openAddForm() {
    if (!requireSociety('Account Master')) return;
    PopupManager.open('account_add', 'Add Account', this.buildForm(), { width:'560px' });
    this.bindFormEvents('account_add', null);
  },
  openEditForm(code) {
    const acc = this.getByCode(code);
    if (!acc) return;
    PopupManager.open('account_edit_' + code, 'Edit Account — ' + acc.name,
      this.buildForm(acc), { width:'560px' });
    this.bindFormEvents('account_edit_' + code, code);
  },
  openLedger(code) {
    const acc = this.getByCode(code);
    if (!acc) return;
    PopupManager.open('ledger_' + code, 'Ledger — ' + acc.name,
      this.buildLedgerView(code), { width:'700px', minHeight:'400px' });
  },
  buildLedgerView(code) {
    const acc = this.getByCode(code);
    if (!acc) return '';
    var obAmt = (acc.openingBalance || 0).toLocaleString('en-IN');
    return '<div style="margin-bottom:12px;"><strong>' + acc.name + '</strong> | Code: ' + acc.code +
      ' | Group: ' + acc.groupCode + ' | Opening: ' + acc.openingBalanceType + ' ₹' + obAmt + '</div>' +
      '<table class="data-table"><thead><tr><th>Date</th><th>Particulars</th><th>Voucher</th><th>Dr (₹)</th><th>Cr (₹)</th><th>Balance</th></tr></thead>' +
      '<tbody><tr><td>Opening</td><td>Opening Balance</td><td>—</td>' +
      '<td>' + (acc.openingBalanceType==='Dr'?obAmt:'') + '</td>' +
      '<td>' + (acc.openingBalanceType==='Cr'?obAmt:'') + '</td>' +
      '<td>' + acc.openingBalanceType + ' ₹' + obAmt + '</td></tr></tbody></table>' +
      '<p style="color:var(--text-muted);font-size:12px;margin-top:8px;">Full transaction history in Reports → Account Ledger</p>';
  },
  buildForm(data) {
    data = data || {};
    const groups = GroupMaster.getAll();
    const selectedGroup = groups.find(g => g.code === data.groupCode);
    const groupNameDisp = selectedGroup ? selectedGroup.name : (data.groupCode ? 'Unknown Group' : 'None Selected');

    return '<div style="display:flex;flex-direction:column;gap:12px; padding: 10px 40px;">' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Code</label>' +
        '<input class="form-input" name="code" value="' + (data.code||'') + '" ' + (data.code?'readonly':'') + '>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Account Name</label>' +
        '<input class="form-input" name="name" value="' + (data.name||'') + '">' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Name in B/Sheet</label>' +
        '<input class="form-input" name="nameBSheet" value="' + (data.nameBSheet||'') + '">' +
      '</div>' +

      '<div style="display:flex; align-items:center; gap:20px; margin-top:10px;">' +
        '<div style="width:140px; display:flex; justify-content:flex-end;"><button type="button" class="btn-secondary" id="open_group_list" style="padding:4px 12px; font-size:12px;">Group List</button></div>' +
        '<div style="flex:1;"><span id="selected_group_name" style="font-weight:600; color:var(--text-primary);">' + groupNameDisp + '</span>' +
        '<input type="hidden" name="groupCode" id="hidden_group_code" value="' + (data.groupCode||'') + '"></div>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:140px 1fr 80px; gap:20px; align-items:center; margin-top:10px;">' +
        '<label class="form-label" style="margin:0;">Opening Balance</label>' +
        '<input class="form-input" name="openingBalance" type="number" step="0.01" value="' + (data.openingBalance||0) + '" style="text-align:right;">' +
        '<select class="form-input" name="openingBalanceType" style="padding:10px 5px;"><option value="Dr" ' + (data.openingBalanceType==='Dr'?'selected':'') + '>Dr.</option><option value="Cr" ' + (data.openingBalanceType==='Cr'?'selected':'') + '>Cr.</option></select>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr 80px; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Previous Year Bal.</label>' +
        '<input class="form-input" name="prevYearBalance" type="number" step="0.01" value="' + (data.prevYearBalance||0) + '" style="text-align:right;">' +
        '<select class="form-input" name="prevYearBalanceType" style="padding:10px 5px;"><option value="Dr">Dr.</option><option value="Cr">Cr.</option></select>' +
      '</div>' +

      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center; margin-top:10px;">' +
        '<label class="form-label" style="margin:0;">Address</label>' +
        '<input class="form-input" name="address" value="' + (data.address||'') + '">' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Contact No.</label>' +
        '<input class="form-input" name="contactNo" value="' + (data.contactNo||'') + '">' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Email Id.</label>' +
        '<input class="form-input" name="email" value="' + (data.email||'') + '">' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">PAN No.</label>' +
        '<input class="form-input" name="pan" value="' + (data.pan||'') + '">' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">TAN No.</label>' +
        '<input class="form-input" name="tan" value="' + (data.tan||'') + '">' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:140px 1fr; gap:20px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">GSTIN.</label>' +
        '<input class="form-input" name="gstin" value="' + (data.gstin||'') + '">' +
      '</div>' +
      '</div>' +
      '<div style="display:flex;gap:20px;margin-top:30px;justify-content:center; padding-bottom: 20px;">' +
      '<button class="btn-secondary" id="account_save_btn" style="min-width: 100px;">Save</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(this.closest(\'.jv-popup\').id.replace(\'popup_\',\'\'))" style="min-width: 100px;">Exit</button></div>';
  },
  bindFormEvents(popupId, editCode) {
    const popup = document.getElementById('popup_' + popupId);
    if (!popup) return;
    
    // Group selection popup
    popup.querySelector('#open_group_list').addEventListener('click', () => {
      const groups = GroupMaster.getAll();
      const content = '<div style="max-height:400px; overflow-y:auto;">' +
        '<table class="data-table"><thead><tr><th>Code</th><th>Group Name</th><th>Main Group</th><th>Action</th></tr></thead><tbody>' +
        groups.map(g => '<tr><td>' + g.code + '</td><td>' + g.name + '</td><td>' + g.mainGroup + 
          '</td><td><button class="btn-icon" data-sel-group="' + g.code + '" data-sel-name="' + g.name + '">Select</button></td></tr>').join('') +
        '</tbody></table></div>';
      
      const gPopup = PopupManager.open('group_selector', 'Select Group', content, { width:'500px' });
      gPopup.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-sel-group]');
        if (btn) {
          const code = btn.getAttribute('data-sel-group');
          const name = btn.getAttribute('data-sel-name');
          popup.querySelector('#hidden_group_code').value = code;
          popup.querySelector('#selected_group_name').textContent = name;
          PopupManager.close('group_selector');
        }
      });
    });

    popup.querySelector('#account_save_btn').addEventListener('click', () => {
      const data = SocietyMaster.collectForm(popup.querySelector('.jv-popup-body'));
      if (!data.code || !data.name || !data.groupCode) { showToast('Code, Name, and Group are required', 'error'); return; }
      const ok = editCode ? this.update(editCode, data) : this.add(data);
      if (ok) { showToast('Account saved', 'success'); PopupManager.close(popupId); AccountMaster.render(); }
    });
  },
  printList() {
    const rows = this.getAll().map(a =>
      '<tr><td>' + a.code + '</td><td>' + a.name + '</td><td>' + (a.nameBSheet||a.name) + '</td><td>' + a.groupCode + '</td><td>' + a.mainGroup + '</td></tr>'
    ).join('');
    const w = window.open('','_blank');
    w.document.write('<html><body style="font-family:sans-serif;"><h2>Account Master List</h2><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%;"><thead><tr><th>Code</th><th>Name</th><th>B/Sheet Name</th><th>Group</th><th>Main Group</th></tr></thead><tbody>' + rows + '</tbody></table></body></html>');
    w.document.close(); w.print();
  },
  render() {
    const tbody = document.querySelector('#account-table-body');
    if (!tbody) return;
    const sv = (document.querySelector('#account-search') || {}).value || '';
    const svl = sv.toLowerCase();
    const accounts = this.getAll().filter(a => !svl || a.code.toLowerCase().includes(svl) || a.name.toLowerCase().includes(svl));
    tbody.innerHTML = accounts.map(a =>
      '<tr><td>' + a.code + '</td><td>' + a.name + (a.nameSecondLang ? ' / ' + a.nameSecondLang : '') + '</td>' +
      '<td>' + (a.nameBSheet||'—') + '</td><td>' + a.groupCode + '</td><td>' + a.mainGroup + '</td>' +
      '<td><button class="btn-icon" onclick="AccountMaster.openEditForm(\'' + a.code + '\')">Alter</button>' +
      '<button class="btn-icon" onclick="AccountMaster.openLedger(\'' + a.code + '\')">Ledger</button>' +
      '<button class="btn-icon" onclick="AccountMaster.delete(\'' + a.code + '\');AccountMaster.render();">Delete</button></td></tr>'
    ).join('');
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 6 — MODULE 4: MEMBER MASTER
// ═══════════════════════════════════════════════════════════

const MemberMaster = {
  getAll()        { return dbRead(DB.MEMBERS); },
  getByCode(code) { return this.getAll().find(m => m.code === code); },
  getAccountingType(member) { return (member.openingPrincipal || 0) >= 0 ? 'Asset' : 'Liability'; },
  getTotalOpening(member) { return Math.abs(member.openingPrincipal||0) + Math.abs(member.openingInterest||0); },
  calculateParkingCharge(parkingDetails) {
    let total = 0;
    const charges4W = [0, 100, 250, 450, 700];
    const charges2W = [0, 50, 120, 200, 300];
    let count4W = 0, count2W = 0;
    (parkingDetails || []).forEach(p => {
      if (p.type === '4W') { count4W++; total += charges4W[Math.min(count4W, 4)] || (count4W * 150); }
      else { count2W++; total += charges2W[Math.min(count2W, 4)] || (count2W * 75); }
    });
    return total;
  },
  add(data) {
    const members = this.getAll();
    if (members.find(m => m.code === data.code)) { showToast('Member code already exists', 'error'); return false; }
    members.push({ ...MemberSchema, ...data });
    dbWrite(DB.MEMBERS, members);
    EventBus.emit('member:updated', members);
    MemberBillMaster.onMemberAdded(data);
    OpeningBalanceMaster.onMemberAdded(data);
    return true;
  },
  update(code, data) {
    const members = this.getAll();
    const idx = members.findIndex(m => m.code === code);
    if (idx === -1) { showToast('Member not found', 'error'); return false; }
    var oldSqft = members[idx].sqft || 0;
    members[idx] = { ...members[idx], ...data };
    dbWrite(DB.MEMBERS, members);
    EventBus.emit('member:updated', members);
    MemberBillMaster.onMemberUpdated(data);
    // Rule #12: If sqft changed, recalculate area-based auto master rules
    if (data.sqft !== undefined && parseFloat(data.sqft) !== oldSqft) {
      var rules = AutoMaster.getAll();
      var changed = false;
      rules.forEach(function(r) {
        if (r.memberId === code && r.applyType === 'area') {
          r.amount = parseFloat((parseFloat(data.sqft) * r.baseAmount).toFixed(2));
          changed = true;
        }
      });
      if (changed) {
        dbWrite(DB.AUTO_MASTER, rules);
        MemberBillMaster.applyAutoMaster();
      }
    }
    return true;
  },
  delete(code) {
    const members = this.getAll().filter(m => m.code !== code);
    dbWrite(DB.MEMBERS, members);
    EventBus.emit('member:updated', members);
    return true;
  },
  openAddForm() {
    if (!requireSociety('Member Master')) return;
    PopupManager.open('member_add', 'Add Member', this.buildForm(), { width:'640px' });
    this.bindFormEvents('member_add', null);
  },
  openEditForm(code) {
    const member = this.getByCode(code);
    if (!member) return;
    PopupManager.open('member_edit_' + code, 'Edit Member — ' + (member.names[0]||code),
      this.buildForm(member), { width:'640px' });
    this.bindFormEvents('member_edit_' + code, code);
  },
  openDetail(code) {
    const member = this.getByCode(code);
    if (!member) return;
    PopupManager.open('member_detail_' + code, 'Member Detail — ' + (member.names[0]||code),
      this.buildDetailView(member), { width:'760px', minHeight:'500px' });
  },
  buildDetailView(member) {
    const parkingCharge = this.calculateParkingCharge(member.parkingDetails || []);
    const accountingType = this.getAccountingType(member);
    const bills = MemberBillMaster.getForMember(member.code);
    var subtotal = bills.reduce(function(s,b){return s+parseFloat(b.amount||0);},0);
    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">' +
      '<div><div style="font-size:11px;color:var(--text-muted);">Member Code</div><div style="font-weight:700;">' + member.code + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--text-muted);">Name(s)</div><div style="font-weight:700;">' + member.names.filter(Boolean).join(' / ') + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--text-muted);">Flat / Building / Wing</div><div>' + (member.flatNo||'') + ' / ' + (member.building||'') + ' / ' + (member.wing||'') + '</div></div>' +
      '<div><div style="font-size:11px;color:var(--text-muted);">Area</div><div>' + (member.sqft||0) + ' sq.ft (' + (member.areaType||'RERA') + ')</div></div>' +
      '<div><div style="font-size:11px;color:var(--text-muted);">Opening Balance</div><div style="color:' + ((member.openingPrincipal||0)>=0?'var(--danger)':'var(--success)') + '">Principal: ₹' + Math.abs(member.openingPrincipal||0).toLocaleString('en-IN') + ' (' + accountingType + ')</div></div>' +
      '<div><div style="font-size:11px;color:var(--text-muted);">Parking Maintenance</div><div style="font-weight:700;color:var(--primary);">₹' + parkingCharge.toLocaleString('en-IN') + ' / month</div></div></div>' +
      '<div style="font-weight:700;font-size:13px;margin-bottom:8px;">Monthly Billing Breakdown</div>' +
      '<table class="data-table"><thead><tr><th>Charge Head</th><th>Amount (₹)</th></tr></thead><tbody>' +
      bills.map(function(b){ return '<tr><td>' + b.headName + '</td><td style="text-align:right;">' + parseFloat(b.amount||0).toLocaleString('en-IN') + '</td></tr>'; }).join('') +
      '<tr style="background:var(--accent-soft);"><td><strong>Parking Charges (Auto)</strong></td><td style="text-align:right;"><strong>' + parkingCharge.toLocaleString('en-IN') + '</strong></td></tr>' +
      '<tr style="background:#f0f0f0;font-weight:700;"><td>TOTAL</td><td style="text-align:right;">₹' + (subtotal + parkingCharge).toLocaleString('en-IN') + '</td></tr></tbody></table>';
  },
  buildParkingRow(idx, data) {
    data = data || {};
    return '<div class="parking-row" data-idx="' + idx + '" style="display:grid;grid-template-columns:80px 80px 1fr 80px auto;gap:8px;margin-bottom:6px;align-items:center;">' +
      '<select class="form-input" name="p_type_' + idx + '" style="font-size:12px;"><option value="4W" ' + (data.type==='4W'?'selected':'') + '>4-Wheeler</option><option value="2W" ' + (data.type==='2W'?'selected':'') + '>2-Wheeler</option></select>' +
      '<input class="form-input" name="p_slot_' + idx + '" placeholder="Slot" value="' + (data.slotNo||'') + '" style="font-size:12px;">' +
      '<input class="form-input" name="p_vehicle_' + idx + '" placeholder="Vehicle No." value="' + (data.vehicleNo||'') + '" style="font-size:12px;">' +
      '<span style="font-size:12px;color:var(--success);font-weight:600;">₹<span class="parking-charge-cell">' + (data.charges||0) + '</span></span>' +
      '<button type="button" class="btn-icon" onclick="this.closest(\'.parking-row\').remove();MemberMaster.recalcParkingCharge();" style="color:var(--danger);font-size:16px;">×</button></div>';
  },
  recalcParkingCharge() {
    var rows = document.querySelectorAll('.parking-row');
    var details = [];
    rows.forEach(function(row){ details.push({ type: row.querySelector('select') ? row.querySelector('select').value : '4W' }); });
    var total = MemberMaster.calculateParkingCharge(details);
    var preview = document.getElementById('parking_charge_preview');
    if (preview) preview.textContent = 'Charges: ₹' + total.toLocaleString('en-IN') + '/month';
    var charges4W = [0,100,250,450,700], charges2W = [0,50,120,200,300];
    rows.forEach(function(row, i) {
      var type = row.querySelector('select') ? row.querySelector('select').value : '4W';
      var cnt = 0;
      for (var j = 0; j <= i; j++) {
        var r = document.querySelectorAll('.parking-row')[j];
        if (r && r.querySelector('select') && r.querySelector('select').value === type) cnt++;
      }
      var charge = type==='4W' ? (charges4W[Math.min(cnt,4)] || cnt*150) : (charges2W[Math.min(cnt,4)] || cnt*75);
      var cell = row.querySelector('.parking-charge-cell');
      if (cell) cell.textContent = charge;
    });
  },
  buildForm(data) {
    data = data || {};
    const opPrin = parseFloat(data.openingPrincipal) || 0;
    const opInt = parseFloat(data.openingInterest) || 0;
    const totalOB = opPrin + opInt;
    const statusText = opPrin >= 0 ? 'Asset (Member owes dues)' : 'Liability (Advance received)';
    const statusColor = opPrin >= 0 ? '#d32f2f' : '#2e7d32';

    return '<div style="display:flex;flex-direction:column;gap:10px; padding: 10px 30px;">' +
      '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">' +
        '<div>' +
          '<div style="display:grid; grid-template-columns: 120px 1fr; gap:10px; align-items:center; margin-bottom:8px;">' +
            '<label class="form-label" style="margin:0;">Member Code</label>' +
            '<input class="form-input" name="code" value="' + (data.code||'') + '" style="width:120px;" ' + (data.code?'readonly':'') + '>' +
          '</div>' +
          '<div style="display:grid; grid-template-columns: 120px 1fr; gap:10px; align-items:center; margin-bottom:8px;">' +
            '<label class="form-label" style="margin:0;">Group Name</label>' +
            '<select class="form-input" name="groupName"><option>DUES FROM MEMBERS</option></select>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex; align-items:flex-start; justify-content:flex-end; gap:10px;">' +
          '<label class="form-label">Select Bill Master</label>' +
          '<select class="form-input" name="billMaster" style="width:100px;"><option>MB01</option></select>' +
        '</div>' +
      '</div>' +

      '<div>' +
        ['1','2','3','4'].map(n => 
          '<div style="display:grid; grid-template-columns: 120px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">Name ' + n + '</label>' +
            '<input class="form-input" name="name' + (parseInt(n)-1) + '" value="' + (data.names?data.names[parseInt(n)-1]||'':'') + '">' +
          '</div>'
        ).join('') +
        '<div style="display:grid; grid-template-columns: 120px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
          '<label class="form-label" style="margin:0;">Address</label>' +
          '<input class="form-input" name="address" value="' + (data.address||'') + '">' +
        '</div>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:5px;">' +
        '<div>' +
          '<div style="display:grid; grid-template-columns: 120px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">Bldg.</label>' +
            '<input class="form-input" name="building" value="' + (data.building||'') + '">' +
          '</div>' +
          '<div style="display:grid; grid-template-columns: 120px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="font-size:10px; margin:0;">(Flat/Shop/Garage etc.)</label>' +
            '<input class="form-input" name="areaType" value="' + (data.areaType||'') + '">' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">Wing</label>' +
            '<input class="form-input" name="wing" value="' + (data.wing||'') + '">' +
          '</div>' +
          '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">Sq.ft.</label>' +
            '<input class="form-input" name="sqft" type="number" step="0.01" value="' + (data.sqft||0) + '" style="text-align:right;">' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div style="background:#f9f9f9; padding:10px; border-radius:4px; margin-top:5px;">' +
        '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">' +
          '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center;">' +
            '<label class="form-label" style="margin:0;">Op. Principle</label>' +
            '<input class="form-input" name="openingPrincipal" id="m_op_prin" type="number" step="0.01" value="' + opPrin + '" style="text-align:right;">' +
          '</div>' +
          '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center;">' +
            '<label class="form-label" style="margin:0;">Op. Interest</label>' +
            '<input class="form-input" name="openingInterest" id="m_op_int" type="number" step="0.01" value="' + opInt + '" style="text-align:right;">' +
          '</div>' +
        '</div>' +
        '<div style="display:flex; justify-content:center; align-items:center; gap:20px; margin-top:8px;">' +
          '<span class="form-label" style="margin:0;">Total Opening Balance</span>' +
          '<span id="m_total_ob" style="font-weight:800; color:' + (totalOB>=0?'#d32f2f':'#2e7d32') + '; font-size:16px;">' + totalOB.toFixed(2) + '</span>' +
        '</div>' +
        '<div id="m_status_disp" style="text-align:center; font-size:11px; font-weight:700; color:' + statusColor + ';">' + statusText + '</div>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:5px;">' +
        '<div>' +
          ['1','2'].map(n => 
            '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
              '<label class="form-label" style="margin:0;">Contact No.' + n + '</label>' +
              '<input class="form-input" name="contactNo' + n + '" value="' + (data['contactNo'+n]||'') + '">' +
            '</div>'
          ).join('') +
          '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">GSTIN.</label>' +
            '<input class="form-input" name="gstin" value="' + (data.gstin||'') + '">' +
          '</div>' +
          '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">NocDetail</label>' +
            '<input class="form-input" name="nocDetail" value="' + (data.nocDetail||'') + '">' +
          '</div>' +
        '</div>' +
        '<div>' +
          ['1','2','3'].map(n => 
            '<div style="display:grid; grid-template-columns: 80px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
              '<label class="form-label" style="margin:0;">Email Id.' + n + '</label>' +
              '<input class="form-input" name="email' + n + '" value="' + (data['email'+n]||'') + '">' +
            '</div>'
          ).join('') +
          '<div style="display:grid; grid-template-columns: 80px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
            '<label class="form-label" style="margin:0;">Loan Det.</label>' +
            '<input class="form-input" name="loanDetails" value="' + (data.loanDetails||'') + '">' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">' +
         '<div>' +
           '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
             '<label class="form-label" style="margin:0;">Default Remark</label>' +
             '<input class="form-input" name="defaultRemark" value="' + (data.defaultRemark||'') + '">' +
           '</div>' +
           '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
             '<label class="form-label" style="margin:0;">Default Remark1</label>' +
             '<input class="form-input" name="defaultRemark1" value="' + (data.defaultRemark1||'') + '">' +
           '</div>' +
         '</div>' +
         '<div>' +
           '<div style="display:grid; grid-template-columns: 80px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
             '<label class="form-label" style="margin:0;">Park Det.</label>' +
             '<input class="form-input" name="parkDet" value="' + (data.parkDet||'') + '">' +
           '</div>' +
           '<div style="display:grid; grid-template-columns: 80px 1fr; gap:10px; align-items:center; margin-bottom:5px;">' +
             '<label class="form-label" style="margin:0;">Bank Name</label>' +
             '<input class="form-input" name="bankName" value="' + (data.bankName||'') + '">' +
           '</div>' +
         '</div>' +
      '</div>' +

      '</div>' +
      '<div style="display:flex;gap:30px;margin-top:20px;justify-content:center; padding-bottom: 20px;">' +
      '<button class="btn-secondary" id="member_save_btn" style="min-width: 120px;">Save</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(this.closest(\'.jv-popup\').id.replace(\'popup_\',\'\'))" style="min-width: 120px;">Exit</button></div>';
  },
  bindFormEvents(popupId, editCode) {
    const popup = document.getElementById('popup_' + popupId);
    if (!popup) return;

    const prinInput = popup.querySelector('#m_op_prin');
    const intInput = popup.querySelector('#m_op_int');
    const totalDisp = popup.querySelector('#m_total_ob');
    const statusDisp = popup.querySelector('#m_status_disp');

    const updateOB = () => {
      const p = parseFloat(prinInput.value) || 0;
      const i = parseFloat(intInput.value) || 0;
      const t = p + i;
      totalDisp.textContent = t.toFixed(2);
      totalDisp.style.color = p >= 0 ? '#d32f2f' : '#2e7d32';
      statusDisp.textContent = p >= 0 ? 'Asset (Member owes dues)' : 'Liability (Advance received)';
      statusDisp.style.color = p >= 0 ? '#d32f2f' : '#2e7d32';
    };

    prinInput.addEventListener('input', updateOB);
    intInput.addEventListener('input', updateOB);

    popup.querySelector('#member_save_btn').addEventListener('click', () => {
      const body = popup.querySelector('.jv-popup-body');
      const raw = SocietyMaster.collectForm(body);
      
      const mdata = {
        ...raw,
        names: [raw.name0||'', raw.name1||'', raw.name2||'', raw.name3||''],
        openingPrincipal: parseFloat(raw.openingPrincipal) || 0,
        openingInterest: parseFloat(raw.openingInterest) || 0,
        sqft: parseFloat(raw.sqft) || 0
      };

      if (!mdata.code || !mdata.name0) { showToast('Code and Name 1 are required', 'error'); return; }
      
      const ok = editCode ? this.update(editCode, mdata) : this.add(mdata);
      if (ok) { showToast('Member saved', 'success'); PopupManager.close(popupId); MemberMaster.render(); }
    });
  },
  printList() {
    const content = '<div style="display:flex; flex-direction:column; gap:15px; padding:10px;">' +
      '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">List Type</label>' +
        '<select class="form-input" id="m_list_type"><option value="signature">Signature</option><option value="kyc">KYC</option><option value="financial">Financial</option></select>' +
      '</div>' +
      '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Title Line</label>' +
        '<input class="form-input" id="m_title_line" value="Member List">' +
      '</div>' +
      '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Show Zero</label>' +
        '<select class="form-input" id="m_show_zero"><option>Yes</option><option>No</option></select>' +
      '</div>' +
      '<div style="border:1px solid var(--border); padding:10px; border-radius:4px;">' +
        '<div style="font-size:11px; font-weight:700; margin-bottom:8px;">Member Range</div>' +
        '<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">' +
          '<div style="display:flex; align-items:center; gap:5px;">' +
            '<span>From</span><input class="form-input" id="m_from_code" value="A/001" style="width:80px;">' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:5px;">' +
             '<span>To</span><input class="form-input" id="m_to_code" value="Z/999" style="width:80px;">' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid; grid-template-columns: 100px 1fr; gap:10px; align-items:center;">' +
        '<label class="form-label" style="margin:0;">Show Full Name</label>' +
        '<select class="form-input" id="m_show_fullname"><option value="yes">Yes</option><option value="no">No</option></select>' +
      '</div>' +
      '<div style="display:flex; justify-content:center; margin-top:10px;">' +
        '<button class="btn-primary" id="m_do_print" style="min-width:120px;">Preview</button>' +
      '</div>' +
    '</div>';
    PopupManager.open('member_print_options', 'Member List Options', content, { width:'360px' });
    
    setTimeout(() => {
      const btn = document.getElementById('m_do_print');
      if (btn) btn.onclick = () => {
        const type = document.getElementById('m_list_type').value;
        const title = document.getElementById('m_title_line').value;
        const from = document.getElementById('m_from_code').value.toLowerCase();
        const to = document.getElementById('m_to_code').value.toLowerCase();
        const showFull = document.getElementById('m_show_fullname').value === 'yes';
        
        let members = this.getAll().filter(m => {
          const c = m.code.toLowerCase();
          return (!from || c >= from) && (!to || c <= to);
        });
        
        let headers = '<th>Code</th>';
        if (type === 'signature') headers += '<th>Member Name</th><th>Flat No.</th><th style="width:150px;">Signature</th>';
        else if (type === 'financial') headers += '<th>Member Name</th><th>Bldg.</th><th>Wing</th><th>Principal</th><th>Interest</th>';
        else headers += '<th>Member Name</th><th>Flat</th><th>Wing</th><th>Bldg</th><th>Contact</th>';
        
        const rows = members.map(m => {
            const name = showFull ? m.names.filter(Boolean).join(' / ') : (m.names[0] || '—');
            if (type === 'signature') return `<tr><td>${m.code}</td><td>${name}</td><td>${m.flatNo || ''}</td><td></td></tr>`;
            if (type === 'financial') return `<tr><td>${m.code}</td><td>${name}</td><td>${m.building || ''}</td><td>${m.wing || ''}</td><td style="text-align:right;">${m.openingPrincipal}</td><td style="text-align:right;">${m.openingInterest}</td></tr>`;
            return `<tr><td>${m.code}</td><td>${name}</td><td>${m.flatNo || ''}</td><td>${m.wing || ''}</td><td>${m.building || ''}</td><td>${m.contactNo1 || ''}</td></tr>`;
        }).join('');
        
        const w = window.open('', '_blank');
        w.document.write(`<html><head><title>${title}</title><style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f4f4f4;}</style></head><body>`);
        w.document.write(`<h2>${title}</h2><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></body></html>`);
        w.document.close();
        w.print();
        PopupManager.close('member_print_options');
      };
    }, 100);
  },
  render() {
    var tbody = document.querySelector('#member-table-body');
    if (!tbody) return;
    var sv = (document.querySelector('#member-search') || {}).value || '';
    var svl = sv.toLowerCase();
    var members = this.getAll().filter(function(m) {
      return !svl || m.code.toLowerCase().includes(svl) || (m.names[0]||'').toLowerCase().includes(svl) || (m.flatNo||'').toLowerCase().includes(svl);
    });
    tbody.innerHTML = members.map(function(m) {
      return '<tr><td>' + m.code + '</td><td>' + (m.building||'—') + '</td><td>' + (m.wing||'—') + '</td><td>' + (m.flatNo||'—') + '</td><td>' + (m.names.filter(Boolean)[0]||'—') + '</td>' +
        '<td><button class="btn-icon" onclick="MemberMaster.openEditForm(\'' + m.code + '\')">Alter</button>' +
        '<button class="btn-icon" onclick="MemberMaster.openDetail(\'' + m.code + '\')">Detail</button>' +
        '<button class="btn-icon" onclick="MemberMaster.delete(\'' + m.code + '\');MemberMaster.render();">Delete</button></td></tr>';
    }).join('');
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 7 — MODULE 5: BILLING MASTER
// ═══════════════════════════════════════════════════════════

const BillSetting = {
  getAll() {
    var stored = dbRead(DB.BILL_SETTINGS);
    return BILLING_HEADS.map(function(head) {
      var sh = stored.find(function(s){ return s.id === head.id; });
      return sh ? Object.assign({}, head, sh) : Object.assign({}, head, { accountCode:'', shortName:head.name.substring(0,8) });
    });
  },
  save(settings) {
    dbWrite(DB.BILL_SETTINGS, settings);
    EventBus.emit('billsetting:updated', settings);
    MemberBillMaster.onBillSettingChanged(settings);
    showToast('Bill settings saved. All billing views updated.', 'success');
  },
  onAccountAdded(account) {
    document.querySelectorAll('select[name^="bs_account_"]').forEach(function(sel) {
      var current = sel.value;
      sel.innerHTML = BillSetting.buildAccountOptions(current);
    });
  },
  buildAccountOptions(selected) {
    selected = selected || '';
    return '<option value="">-- Select Account --</option>' +
      AccountMaster.getAll().map(function(a) {
        return '<option value="' + a.code + '" ' + (a.code===selected?'selected':'') + '>' + a.code + ' - ' + a.name + '</option>';
      }).join('');
  },
  applyGSTRemoval() {
    var settings = this.getAll().map(function(s) { return Object.assign({}, s, { gstApplicable:false, gstExempt:true }); });
    dbWrite(DB.BILL_SETTINGS, settings);
    EventBus.emit('billsetting:updated', settings);
    MemberBillMaster.onBillSettingChanged(settings);
  },
  openForm() {
    var settings = this.getAll();
    var gstEnabled = SocietyMaster.isGSTEnabled();
    var rows = settings.map(function(s) {
      return '<tr><td>' + s.name + '</td>' +
        '<td><input class="form-input" name="bs_short_' + s.id + '" value="' + (s.shortName||'') + '" style="font-size:12px;padding:5px;"></td>' +
        '<td><select class="form-input" name="bs_account_' + s.id + '" style="font-size:12px;padding:5px;">' + BillSetting.buildAccountOptions(s.accountCode||'') + '</select></td>' +
        '<td style="text-align:center;"><input type="checkbox" name="bs_gst_' + s.id + '" ' + (s.gstApplicable?'checked':'') + ' ' + (!gstEnabled?'disabled':'') + ' style="width:15px;height:15px;"></td>' +
        '<td style="text-align:center;"><input type="checkbox" name="bs_exempt_' + s.id + '" ' + (s.gstExempt?'checked':'') + ' ' + (!gstEnabled?'disabled':'') + ' style="width:15px;height:15px;"></td></tr>';
    }).join('');
    PopupManager.open('bill_setting', 'FrmBillSetting — Billing Parameter Engine',
      '<div style="font-size:12px;color:var(--danger);margin-bottom:10px;padding:8px;background:#FEE2E2;border-radius:6px;">⚠ Structure is FIXED. Only change: Account mapping, Short Name, GST flags.' +
      (!gstEnabled ? '<br><strong>GST is DISABLED — GST settings are locked.</strong>' : '') + '</div>' +
      '<div style="overflow-x:auto;"><table class="data-table" style="font-size:12px;"><thead><tr><th>Billing Head</th><th>Short Name</th><th>Account (Ledger)</th><th style="text-align:center;">GST Applicable</th><th style="text-align:center;">GST Exempt</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="bs_save_btn">Save & Apply to All Members</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'bill_setting\')">Cancel</button></div>',
      { width:'800px', minHeight:'460px' });
    setTimeout(function() {
      var saveBtn = document.getElementById('bs_save_btn');
      if (saveBtn) saveBtn.addEventListener('click', function() {
        var popup = document.getElementById('popup_bill_setting');
        var updated = BILLING_HEADS.map(function(head) {
          var sn = popup.querySelector('input[name="bs_short_' + head.id + '"]');
          var ac = popup.querySelector('select[name="bs_account_' + head.id + '"]');
          var ga = popup.querySelector('input[name="bs_gst_' + head.id + '"]');
          var ge = popup.querySelector('input[name="bs_exempt_' + head.id + '"]');
          return Object.assign({}, head, {
            shortName: sn ? sn.value : '', accountCode: ac ? ac.value : '',
            gstApplicable: ga ? ga.checked : false, gstExempt: ge ? ge.checked : false
          });
        });
        BillSetting.save(updated);
        PopupManager.close('bill_setting');
      });
    }, 50);
  }
};

const AutoMaster = {
  getAll() { return dbRead(DB.AUTO_MASTER); },
  addBulk(headId, applyType, amount) {
    var members = MemberMaster.getAll();
    var rules = this.getAll();
    members.forEach(function(m) {
      var charge = applyType === 'area' ? parseFloat((m.sqft * amount).toFixed(2)) : parseFloat(amount);
      var existing = rules.findIndex(function(r){ return r.memberId === m.code && r.headId === headId; });
      if (existing >= 0) rules[existing].amount = charge;
      else rules.push({ memberId:m.code, headId:headId, applyType:applyType, baseAmount:amount, amount:charge });
    });
    dbWrite(DB.AUTO_MASTER, rules);
    EventBus.emit('automaster:updated', rules);
    MemberBillMaster.applyAutoMaster();
    showToast('Bulk charge applied to ' + members.length + ' members', 'success');
  },
  addMultiply(headId, memberCodes, applyType, amount) {
    var rules = this.getAll();
    memberCodes.forEach(function(code) {
      var member = MemberMaster.getByCode(code);
      if (!member) return;
      var charge = applyType === 'area' ? parseFloat((member.sqft * amount).toFixed(2)) : parseFloat(amount);
      var existing = rules.findIndex(function(r){ return r.memberId === code && r.headId === headId; });
      if (existing >= 0) rules[existing].amount = charge;
      else rules.push({ memberId:code, headId:headId, applyType:applyType, baseAmount:amount, amount:charge });
    });
    dbWrite(DB.AUTO_MASTER, rules);
    EventBus.emit('automaster:updated', rules);
    MemberBillMaster.applyAutoMaster();
    showToast('Charge applied to ' + memberCodes.length + ' selected members', 'success');
  },
  getForMember(memberCode) { return this.getAll().filter(function(r){ return r.memberId === memberCode; }); },
  openAddForm() {
    var headOptions = BillSetting.getAll().map(function(s){ return '<option value="' + s.id + '">' + s.name + '</option>'; }).join('');
    PopupManager.open('auto_add', 'Auto Master — Bulk Charge',
      '<div style="display:flex;flex-direction:column;gap:14px;">' +
      '<div class="form-group"><label class="form-label">Billing Head</label><select class="form-input" name="headId">' + headOptions + '</select></div>' +
      '<div class="form-group"><label class="form-label">Apply Type</label><div style="display:flex;gap:10px;"><label><input type="radio" name="applyType" value="fixed" checked> Fixed Amount</label><label><input type="radio" name="applyType" value="area"> By Area (per sq.ft)</label></div></div>' +
      '<div class="form-group"><label class="form-label" id="amt_label">Amount (₹)</label><input class="form-input" name="amount" type="number" min="0" step="0.01" value="0"></div>' +
      '<div id="area_preview" style="display:none;padding:8px;background:var(--accent-soft);border-radius:6px;font-size:12px;">Preview: Member with 500 sq.ft → ₹<span id="preview_val">0</span></div></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="auto_add_all">Apply to ALL Members</button>' +
      '<button class="btn-secondary" onclick="AutoMaster.openMultiplyForm()">Select Members</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'auto_add\')">Cancel</button></div>',
      { width:'460px' });
    setTimeout(function() {
      var popup = document.getElementById('popup_auto_add');
      if (!popup) return;
      popup.querySelectorAll('input[name="applyType"]').forEach(function(r) {
        r.addEventListener('change', function() {
          var isArea = popup.querySelector('input[name="applyType"]:checked').value === 'area';
          document.getElementById('area_preview').style.display = isArea ? 'block' : 'none';
          document.getElementById('amt_label').textContent = isArea ? 'Rate per Sq.ft (₹)' : 'Amount (₹)';
        });
      });
      var amtInput = popup.querySelector('input[name="amount"]');
      if (amtInput) amtInput.addEventListener('input', function(e) { document.getElementById('preview_val').textContent = (parseFloat(e.target.value)||0) * 500; });
      var allBtn = document.getElementById('auto_add_all');
      if (allBtn) allBtn.addEventListener('click', function() {
        var headId = popup.querySelector('select[name="headId"]').value;
        var applyType = popup.querySelector('input[name="applyType"]:checked').value;
        var amount = parseFloat(popup.querySelector('input[name="amount"]').value) || 0;
        AutoMaster.addBulk(headId, applyType, amount);
        PopupManager.close('auto_add');
      });
    }, 50);
  },
  openMultiplyForm() {
    var members = MemberMaster.getAll();
    var memberRows = members.map(function(m) {
      return '<tr><td><input type="checkbox" name="sel_' + m.code + '" value="' + m.code + '" style="width:14px;height:14px;accent-color:var(--primary);"></td><td>' + m.code + '</td><td>' + (m.names[0]||'—') + '</td><td>' + (m.flatNo||'—') + '</td><td>' + (m.sqft||0) + ' sq.ft</td></tr>';
    }).join('');
    var headOpts = BillSetting.getAll().map(function(s){ return '<option value="' + s.id + '">' + s.name + '</option>'; }).join('');
    PopupManager.open('auto_multiply', 'Auto Master — Select Members',
      '<div style="margin-bottom:10px;display:flex;gap:8px;">' +
      '<button class="btn-secondary" onclick="document.querySelectorAll(\'#member_sel_tbody input[type=checkbox]\').forEach(function(c){c.checked=true})" style="font-size:11px;">Select All</button>' +
      '<button class="btn-secondary" onclick="document.querySelectorAll(\'#member_sel_tbody input[type=checkbox]\').forEach(function(c){c.checked=false})" style="font-size:11px;">Clear All</button></div>' +
      '<div style="max-height:300px;overflow-y:auto;"><table class="data-table" style="font-size:12px;"><thead><tr><th></th><th>Code</th><th>Name</th><th>Flat</th><th>Area</th></tr></thead><tbody id="member_sel_tbody">' + memberRows + '</tbody></table></div>' +
      '<div style="display:flex;gap:8px;margin-top:12px;"><select class="form-input" id="mul_head" style="font-size:12px;">' + headOpts + '</select>' +
      '<input class="form-input" id="mul_amt" type="number" placeholder="Amount" style="font-size:12px;width:120px;">' +
      '<select class="form-input" id="mul_type" style="font-size:12px;width:120px;"><option value="fixed">Fixed</option><option value="area">By Area</option></select></div>' +
      '<div style="display:flex;gap:10px;margin-top:12px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="apply_selected">Apply to Selected</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'auto_multiply\')">Cancel</button></div>',
      { width:'580px' });
    setTimeout(function() {
      var applyBtn = document.getElementById('apply_selected');
      if (applyBtn) applyBtn.addEventListener('click', function() {
        var selected = Array.from(document.querySelectorAll('#member_sel_tbody input:checked')).map(function(c){ return c.value; });
        var headId = document.getElementById('mul_head').value;
        var amount = parseFloat(document.getElementById('mul_amt').value) || 0;
        var applyType = document.getElementById('mul_type').value;
        if (!selected.length) { showToast('Select at least one member', 'warning'); return; }
        AutoMaster.addMultiply(headId, selected, applyType, amount);
        PopupManager.close('auto_multiply');
      });
    }, 50);
  }
};

// SECTION 7b — MEMBER BILL MASTER (Main Billing Grid)
// ═══════════════════════════════════════════════════════════

const MemberBillMaster = {
  getAll()           { return dbRead(DB.MEMBER_BILLS); },
  getForMember(code) { return this.getAll().filter(function(b){ return b.memberId === code; }); },
  onMemberAdded(member) {
    var bills = this.getAll();
    var settings = BillSetting.getAll();
    var autoRules = AutoMaster.getForMember(member.code);
    settings.forEach(function(s) {
      var rule = autoRules.find(function(r){ return r.headId === s.id; });
      if (!bills.find(function(b){ return b.memberId === member.code && b.headId === s.id; })) {
        bills.push({ memberId:member.code, headId:s.id, headName:s.name,
          amount: rule ? rule.amount : 0,
          gstApplicable: s.gstApplicable && SocietyMaster.isGSTEnabled(),
          gstExempt: s.gstExempt, isManual: false });
      }
    });
    dbWrite(DB.MEMBER_BILLS, bills);
    EventBus.emit('memberbill:updated', bills);
  },
  onMemberUpdated(member) { this.onMemberAdded(member); },
  onBillSettingChanged(settings) {
    var bills = this.getAll();
    var gstEnabled = SocietyMaster.isGSTEnabled();
    bills.forEach(function(b) {
      var setting = settings.find(function(s){ return s.id === b.headId; });
      if (setting) {
        b.headName = setting.name;
        b.gstApplicable = setting.gstApplicable && gstEnabled;
        b.gstExempt = setting.gstExempt;
        if (!gstEnabled) b.gstApplicable = false;
      }
    });
    dbWrite(DB.MEMBER_BILLS, bills);
    EventBus.emit('memberbill:updated', bills);
  },
  applyAutoMaster() {
    var bills = this.getAll();
    var rules = AutoMaster.getAll();
    bills.forEach(function(b) {
      if (b.isManual) return;
      var rule = rules.find(function(r){ return r.memberId === b.memberId && r.headId === b.headId; });
      if (rule) b.amount = rule.amount;
    });
    dbWrite(DB.MEMBER_BILLS, bills);
    EventBus.emit('memberbill:updated', bills);
  },
  updateAmount(memberId, headId, amount) {
    var bills = this.getAll();
    var idx = bills.findIndex(function(b){ return b.memberId === memberId && b.headId === headId; });
    if (idx >= 0) { bills[idx].amount = parseFloat(amount) || 0; bills[idx].isManual = true; }
    dbWrite(DB.MEMBER_BILLS, bills);
    EventBus.emit('memberbill:updated', bills);
    this.renderGrid();
  },
  init() {
    EventBus.on('gst:switched', function(d) {
      var settings = BillSetting.getAll();
      MemberBillMaster.onBillSettingChanged(settings);
    });
    EventBus.on('billsetting:updated', function(settings) {
      MemberBillMaster.onBillSettingChanged(settings);
    });
  },
  downloadTemplate() {
    var members = MemberMaster.getAll();
    var settings = BillSetting.getAll();
    var headers = ['Member Code','Name','Sq.ft'].concat(settings.map(function(s){ return s.name; }));
    var rows = members.map(function(m) {
      var bills = MemberBillMaster.getForMember(m.code);
      return [m.code, m.names[0]||'', m.sqft||0].concat(settings.map(function(s) {
        var b = bills.find(function(b){ return b.headId === s.id; });
        return b ? b.amount : 0;
      })).join(',');
    });
    var csv = [headers.join(',')].concat(rows).join('\n');
    var blob = new Blob([csv], { type:'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = 'member_bills_template.csv'; a.click();
    URL.revokeObjectURL(url);
  },
  uploadFile(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var lines = e.target.result.split('\n');
      var bills = MemberBillMaster.getAll();
      var settings = BillSetting.getAll();
      lines.slice(1).forEach(function(line) {
        if (!line.trim()) return;
        var cols = line.split(',');
        var memberCode = (cols[0]||'').trim();
        if (!memberCode) return;
        settings.forEach(function(s, i) {
          var amount = parseFloat(cols[3 + i]) || 0;
          var idx = bills.findIndex(function(b){ return b.memberId === memberCode && b.headId === s.id; });
          if (idx >= 0) { bills[idx].amount = amount; bills[idx].isManual = true; }
          else bills.push({ memberId:memberCode, headId:s.id, headName:s.name, amount:amount, isManual:true });
        });
      });
      dbWrite(DB.MEMBER_BILLS, bills);
      EventBus.emit('memberbill:updated', bills);
      MemberBillMaster.renderGrid();
      showToast('File uploaded and billing data updated', 'success');
    };
    reader.readAsText(file);
  },
  openUploadPopup() {
    PopupManager.open('bill_upload', 'Upload Billing Data',
      '<div style="display:flex;flex-direction:column;gap:14px;">' +
      '<div style="padding:10px;background:var(--accent-soft);border-radius:6px;font-size:12px;">' +
      'Upload a CSV file to update billing amounts. First download the template, edit values, then re-upload.</div>' +
      '<div><label class="form-label">Upload Scope</label>' +
      '<select class="form-input" id="upload_scope">' +
      '<option value="all">All Members — All Heads</option>' +
      '<option value="member">Specific Member</option>' +
      '<option value="head">Specific Billing Head</option></select></div>' +
      '<div><label class="form-label">Select CSV File</label>' +
      '<input type="file" id="upload_file" accept=".csv" style="display:block;padding:8px;border:1px dashed var(--border-dark);border-radius:6px;width:100%;"></div></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="do_upload">Upload & Apply</button>' +
      '<button class="btn-secondary" onclick="MemberBillMaster.downloadTemplate()">Download Template</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'bill_upload\')">Cancel</button></div>',
      { width:'480px' });
    setTimeout(function() {
      var btn = document.getElementById('do_upload');
      if (btn) btn.addEventListener('click', function() {
        var file = document.getElementById('upload_file');
        var scope = document.getElementById('upload_scope');
        if (!file || !file.files[0]) { showToast('Select a file first', 'warning'); return; }
        MemberBillMaster.uploadFile(file.files[0], scope ? scope.value : 'all');
        PopupManager.close('bill_upload');
      });
    }, 50);
  },
  renderGrid() {
    var tbody = document.querySelector('#member-bill-grid');
    if (!tbody) return;
    var members = MemberMaster.getAll();
    var settings = BillSetting.getAll();
    var bills = this.getAll();
    var gstEnabled = SocietyMaster.isGSTEnabled();
    
    tbody.innerHTML = members.map(function(m) {
      var memberBills = bills.filter(function(b){ return b.memberId === m.code; });
      var dynamicParking = MemberMaster.calculateParkingCharge(m.parkingDetails || []);
      
      var totalBill = 0;
      var cells = settings.map(function(s) {
        var bill = memberBills.find(function(b){ return b.headId === s.id; });
        var amount = bill ? parseFloat(bill.amount) : 0;
        
        if (s.id === 'parking' && dynamicParking > 0 && (!bill || !bill.isManual)) {
            amount = dynamicParking;
        }

        totalBill += amount;
        return '<td><input type="number" value="' + amount.toFixed(2) + '" step="0.01" style="width:70px;padding:3px 5px;border:1px solid var(--border);border-radius:4px;font-size:11px;background:' + (bill && bill.isManual ? '#FFFDE7' : 'white') + ';" onchange="MemberBillMaster.updateAmount(\'' + m.code + '\',\'' + s.id + '\',this.value)"></td>';
      }).join('');
      
      // Calculate GST (Pull from pre-computed fields if available)
      var cgst = m.cgst || 0;
      var sgst = m.sgst || 0;
      var interest = 0; // Simplified
      var grandTotal = totalBill + cgst + sgst + interest;

      return '<tr>' +
        '<td style="background:#f9f9f9; font-weight:600;">' + m.code + '</td>' +
        '<td>' + (m.names[0]||'—') + '</td>' +
        '<td style="text-align:right;">' + (m.sqft||0) + '</td>' + 
        cells +
        '<td style="text-align:right;background:#fefce8;font-weight:700;">' + cgst.toFixed(2) + '</td>' +
        '<td style="text-align:right;background:#fefce8;font-weight:700;">' + sgst.toFixed(2) + '</td>' +
        '<td style="text-align:right;">' + interest.toFixed(2) + '</td>' +
        '<td style="font-weight:800; color:var(--primary); text-align:right; background:#f0f7ff;">₹' + grandTotal.toLocaleString('en-IN', {minimumFractionDigits:2}) + '</td>' +
      '</tr>';
    }).join('');

    var thead = document.querySelector('#member-bill-thead');
    if (thead) {
      thead.innerHTML = '<tr><th style="width:80px;">Code</th><th>Member Name</th><th style="width:60px;">Sq.ft</th>' +
        settings.map(function(s){ return '<th title="' + s.name + '">' + (s.shortName||s.name) + '</th>'; }).join('') + 
        '<th style="width:70px; text-align:right;">CGST</th><th style="width:70px; text-align:right;">SGST</th>' +
        '<th style="width:70px; text-align:right;">Interest</th>' +
        '<th style="width:100px; text-align:right;">Total Bill</th></tr>';
    }
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 8 — MODULE 6: OPENING BALANCES
// ═══════════════════════════════════════════════════════════

const OpeningBalanceMaster = {
  getAll() { return dbRead(DB.OPENING_BALANCES); },
  onAccountAdded(account) {
    var balances = this.getAll();
    if (!balances.find(function(b){ return b.code === account.code; })) {
      balances.push({
        code: account.code, name: account.name, mainGroup: account.mainGroup, groupCode: account.groupCode,
        opDebit: account.openingBalanceType === 'Dr' ? account.openingBalance : 0,
        opCredit: account.openingBalanceType === 'Cr' ? account.openingBalance : 0, type: 'account'
      });
      dbWrite(DB.OPENING_BALANCES, balances);
      EventBus.emit('openingbalance:updated', balances);
    }
  },
  onMemberAdded(member) {
    var balances = this.getAll();
    var existingIdx = balances.findIndex(function(b){ return b.code === member.code && b.type === 'member'; });
    var principal = parseFloat(member.openingPrincipal) || 0;
    var interest = parseFloat(member.openingInterest) || 0;
    var total = Math.abs(principal) + Math.abs(interest);
    var isAsset = principal >= 0;
    var entry = { code: member.code, name: member.names ? member.names[0] || member.code : member.code,
      mainGroup: isAsset ? 'AS' : 'LI', opDebit: isAsset ? total : 0, opCredit: !isAsset ? total : 0, type: 'member' };
    if (existingIdx >= 0) balances[existingIdx] = entry; else balances.push(entry);
    dbWrite(DB.OPENING_BALANCES, balances);
    EventBus.emit('openingbalance:updated', balances);
    this.checkBalance();
  },
  getTotals() {
    var balances = this.getAll();
    var accDr = 0, accCr = 0, memDr = 0, memCr = 0;
    balances.forEach(function(b) {
      var dr = parseFloat(b.opDebit||0);
      var cr = parseFloat(b.opCredit||0);
      if (b.type === 'member') { memDr += dr; memCr += cr; }
      else { accDr += dr; accCr += cr; }
    });
    var totalDr = accDr + memDr;
    var totalCr = accCr + memCr;
    return { 
      accDr: parseFloat(accDr.toFixed(2)), accCr: parseFloat(accCr.toFixed(2)), 
      memDr: parseFloat(memDr.toFixed(2)), memCr: parseFloat(memCr.toFixed(2)),
      totalDr: parseFloat(totalDr.toFixed(2)), totalCr: parseFloat(totalCr.toFixed(2)), 
      diff: parseFloat((totalDr - totalCr).toFixed(2)),
      balanced: Math.abs(totalDr - totalCr) < 0.01 
    };
  },
  checkBalance() {
    var t = this.getTotals();
    var map = {
      '#ob_total_dr': t.accDr, '#ob_total_cr': t.accCr,
      '#ob_member_dr': t.memDr, '#ob_member_cr': t.memCr
    };
    Object.keys(map).forEach(function(id) {
      var el = document.querySelector(id);
      if (el) el.textContent = '₹' + map[id].toLocaleString('en-IN', {minimumFractionDigits:2});
    });
    
    var diffEl = document.querySelector('#ob_difference');
    if (diffEl) {
      diffEl.style.color = t.balanced ? 'var(--success)' : 'var(--danger)';
      diffEl.textContent = t.balanced ? '✅ Balanced (₹0.00)' : '❌ Difference: ₹' + Math.abs(t.diff).toLocaleString('en-IN', {minimumFractionDigits:2});
    }
    
    var saveBtn = document.querySelector('#ob_save_btn');
    if (saveBtn) {
      saveBtn.disabled = !t.balanced;
      saveBtn.style.opacity = t.balanced ? '1' : '0.5';
    }
    return t.balanced;
  },
  updateBalance(code, field, value) {
    var balances = this.getAll();
    var idx = balances.findIndex(function(b){ return b.code === code; });
    if (idx < 0) return;
    balances[idx][field] = parseFloat(value) || 0;
    if (field === 'opDebit' && parseFloat(value) > 0) balances[idx].opCredit = 0;
    if (field === 'opCredit' && parseFloat(value) > 0) balances[idx].opDebit = 0;
    dbWrite(DB.OPENING_BALANCES, balances);
    
    // Determine current filter from radio buttons
    var activeFilter = 'all';
    var radios = document.querySelectorAll('input[name="obFilter"]');
    radios.forEach(function(r) { if(r.checked) activeFilter = r.value; });
    
    this.renderTable(activeFilter);
  },
  save() {
    if (!this.checkBalance()) { showToast('Cannot save: Total Debit must equal Total Credit', 'error'); return false; }
    EventBus.emit('openingbalance:updated', this.getAll());
    showToast('Opening balances saved. System is now ready for transactions.', 'success');
    return true;
  },
  renderTable(filterType) {
    filterType = filterType || 'all';
    var tbody = document.querySelector('#ob-table-body');
    if (!tbody) return;
    var balances = this.getAll();
    if (filterType === 'balance_sheet') balances = balances.filter(function(b){ return ['AS','LI'].indexOf(b.mainGroup)>=0; });
    if (filterType === 'income_exp') balances = balances.filter(function(b){ return ['IN','EX'].indexOf(b.mainGroup)>=0; });
    if (filterType === 'member') balances = balances.filter(function(b){ return b.type==='member'; });

    // Grouping Logic
    var groups = { 'AS': 'Assets', 'LI': 'Liabilities', 'IN': 'Income', 'EX': 'Expenses' };
    var html = '';
    
    ['AS','LI','IN','EX'].forEach(function(mg) {
      var mgItems = balances.filter(function(b){ return b.mainGroup === mg; });
      if (mgItems.length === 0) return;

      // Main Group Header
      html += '<tr style="background:#FFF9C4;"><td colspan="4" style="font-weight:800; color:#827717; padding:8px 12px; font-size:13px;">( ' + groups[mg] + ' )</td></tr>';
      
      // Items
      var mgDr = 0, mgCr = 0;
      mgItems.forEach(function(b) {
        mgDr += parseFloat(b.opDebit||0);
        mgCr += parseFloat(b.opCredit||0);
        html += '<tr>' +
          '<td style="font-size:11px; color:#64748b;">' + b.code + '</td>' +
          '<td style="font-weight:500;">' + b.name + (b.type==='member' ? ' <small style="color:var(--text-muted)">(Member)</small>' : '') + '</td>' +
          '<td><input type="number" value="' + (b.opDebit||0) + '" min="0" step="0.01" style="width:100%; text-align:right; border:0; background:transparent; font-weight:600;" onchange="OpeningBalanceMaster.updateBalance(\'' + b.code + '\',\'opDebit\',this.value)"></td>' +
          '<td><input type="number" value="' + (b.opCredit||0) + '" min="0" step="0.01" style="width:100%; text-align:right; border:0; background:transparent; font-weight:600;" onchange="OpeningBalanceMaster.updateBalance(\'' + b.code + '\',\'opCredit\',this.value)"></td>' +
          '</tr>';
      });

      // Group Total
      html += '<tr style="background:#B71C1C; color:#fff; font-weight:700;">' +
        '<td colspan="2" style="text-align:right; padding-right:20px;">Group Total</td>' +
        '<td style="text-align:right;">₹' + mgDr.toLocaleString('en-IN', {minimumFractionDigits:2}) + '</td>' +
        '<td style="text-align:right;">₹' + mgCr.toLocaleString('en-IN', {minimumFractionDigits:2}) + '</td>' +
        '</tr>';
    });

    tbody.innerHTML = html || '<tr><td colspan="4" style="text-align:center; padding:40px; color:var(--text-muted);">No accounts found for selected filter.</td></tr>';
    this.checkBalance();
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 9 — MODULE 7: OPENING BANK RECO
// ═══════════════════════════════════════════════════════════

const OpeningBankReco = {
  getAll() { return dbRead(DB.OPENING_BANK_RECO); },
  getBankAccounts() {
    return AccountMaster.getAll().filter(function(a) {
      return a.mainGroup === 'AS' && (a.name.toLowerCase().includes('bank') || a.name.toLowerCase().includes('cash'));
    });
  },
  init() {
    var bankAccounts = this.getBankAccounts();
    var recos = this.getAll();
    bankAccounts.forEach(function(acc) {
      if (!recos.find(function(r){ return r.accountCode === acc.code; })) {
        recos.push({ accountCode:acc.code, accountName:acc.name, bookBalance:acc.openingBalance||0,
          pendingCheques:[], reconciledBalance:acc.openingBalance||0 });
      }
    });
    dbWrite(DB.OPENING_BANK_RECO, recos);
    this.renderTable();
  },
  updateReco(accountCode, data) {
    var recos = this.getAll();
    var idx = recos.findIndex(function(r){ return r.accountCode === accountCode; });
    if (idx >= 0) {
      recos[idx] = Object.assign({}, recos[idx], data);
      var pendingTotal = (recos[idx].pendingCheques || []).reduce(function(s,c){ return s + parseFloat(c.amount||0); }, 0);
      recos[idx].reconciledBalance = recos[idx].bookBalance - pendingTotal;
    }
    dbWrite(DB.OPENING_BANK_RECO, recos);
    this.renderTable();
  },
  openRecoForm(accountCode) {
    var reco = this.getAll().find(function(r){ return r.accountCode === accountCode; });
    if (!reco) return;
    var chequeRows = (reco.pendingCheques || []).map(function(c, i) {
      return '<tr class="cheque-row"><td><input class="form-input" name="ch_no_' + i + '" value="' + (c.chequeNo||'') + '" style="font-size:12px;padding:4px;"></td>' +
        '<td><input class="form-input" name="ch_amt_' + i + '" type="number" value="' + (c.amount||0) + '" style="font-size:12px;padding:4px;width:90px;"></td>' +
        '<td><input class="form-input" name="ch_date_' + i + '" type="date" value="' + (c.date||'') + '" style="font-size:12px;padding:4px;"></td>' +
        '<td><button class="btn-icon" onclick="this.closest(\'.cheque-row\').remove()" style="color:var(--danger);">×</button></td></tr>';
    }).join('');
    PopupManager.open('bank_reco_' + accountCode, 'Opening Bank Reco — ' + reco.accountName,
      '<div class="form-group"><label class="form-label">Book Balance (₹)</label><input class="form-input" id="br_book_bal" type="number" value="' + (reco.bookBalance||0) + '"></div>' +
      '<div style="font-weight:700;font-size:13px;margin:10px 0 6px;color:var(--primary);">Pending / Uncleared Cheques</div>' +
      '<table class="data-table" style="font-size:12px;"><thead><tr><th>Cheque No.</th><th>Amount (₹)</th><th>Date</th><th></th></tr></thead><tbody id="cheque_rows">' + chequeRows + '</tbody></table>' +
      '<button class="btn-secondary" id="add_cheque_row" style="margin-top:8px;font-size:12px;padding:5px 12px;">+ Add Cheque</button>' +
      '<div style="margin-top:12px;padding:10px;background:var(--accent-soft);border-radius:8px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:13px;"><span>Book Balance:</span><strong id="br_show_book">₹' + (reco.bookBalance||0).toLocaleString('en-IN') + '</strong></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:13px;margin-top:4px;"><span>Less: Pending Cheques:</span><strong id="br_show_pending">₹0</strong></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;margin-top:6px;color:var(--primary);"><span>Reconciled Balance:</span><strong id="br_show_reco">₹' + (reco.reconciledBalance||0).toLocaleString('en-IN') + '</strong></div></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="save_reco_btn">Save Reconciliation</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'bank_reco_' + accountCode + '\')">Cancel</button></div>',
      { width:'520px' });
    setTimeout(function() {
      var recalc = function() {
        var bookBal = parseFloat(document.getElementById('br_book_bal').value) || 0;
        var rows = document.querySelectorAll('#cheque_rows .cheque-row');
        var pending = 0;
        rows.forEach(function(row) { pending += parseFloat(row.querySelector('input[name^="ch_amt"]').value) || 0; });
        document.getElementById('br_show_book').textContent = '₹' + bookBal.toLocaleString('en-IN');
        document.getElementById('br_show_pending').textContent = '₹' + pending.toLocaleString('en-IN');
        document.getElementById('br_show_reco').textContent = '₹' + (bookBal - pending).toLocaleString('en-IN');
      };
      var bookBalEl = document.getElementById('br_book_bal');
      if (bookBalEl) bookBalEl.addEventListener('input', recalc);
      var addChequeBtn = document.getElementById('add_cheque_row');
      if (addChequeBtn) addChequeBtn.addEventListener('click', function() {
        var tbody = document.getElementById('cheque_rows');
        var i = tbody.querySelectorAll('.cheque-row').length;
        tbody.insertAdjacentHTML('beforeend', '<tr class="cheque-row"><td><input class="form-input" name="ch_no_' + i + '" style="font-size:12px;padding:4px;"></td><td><input class="form-input" name="ch_amt_' + i + '" type="number" value="0" style="font-size:12px;padding:4px;width:90px;" oninput="this.closest(\'table\').dispatchEvent(new Event(\'change\'))"></td><td><input class="form-input" name="ch_date_' + i + '" type="date" style="font-size:12px;padding:4px;"></td><td><button class="btn-icon" onclick="this.closest(\'.cheque-row\').remove();" style="color:var(--danger);">×</button></td></tr>');
        document.getElementById('cheque_rows').addEventListener('change', recalc);
      });
      var saveRecoBtn = document.getElementById('save_reco_btn');
      if (saveRecoBtn) saveRecoBtn.addEventListener('click', function() {
        var bookBal = parseFloat(document.getElementById('br_book_bal').value) || 0;
        var rows = document.querySelectorAll('#cheque_rows .cheque-row');
        var cheques = [];
        rows.forEach(function(row) {
          cheques.push({
            chequeNo: row.querySelector('input[name^="ch_no"]').value || '',
            amount: parseFloat(row.querySelector('input[name^="ch_amt"]').value) || 0,
            date: row.querySelector('input[name^="ch_date"]').value || ''
          });
        });
        OpeningBankReco.updateReco(accountCode, { bookBalance:bookBal, pendingCheques:cheques });
        showToast('Bank reconciliation saved', 'success');
        PopupManager.close('bank_reco_' + accountCode);
      });
    }, 50);
  },
  renderTable() {
    var tbody = document.querySelector('#bank-reco-tbody');
    if (!tbody) return;
    tbody.innerHTML = this.getAll().map(function(r) {
      var pendingAmt = (r.pendingCheques||[]).reduce(function(s,c){ return s+parseFloat(c.amount||0); },0);
      return '<tr><td>' + r.accountCode + '</td><td>' + r.accountName + '</td>' +
        '<td style="text-align:right;">₹' + (r.bookBalance||0).toLocaleString('en-IN') + '</td>' +
        '<td style="text-align:right;color:var(--warning);">₹' + pendingAmt.toLocaleString('en-IN') + '</td>' +
        '<td style="text-align:right;font-weight:700;color:var(--primary);">₹' + (r.reconciledBalance||0).toLocaleString('en-IN') + '</td>' +
        '<td><button class="btn-icon" onclick="OpeningBankReco.openRecoForm(\'' + r.accountCode + '\')">Open Reco</button></td></tr>';
    }).join('');
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 10 — MODULE 8: SET BILL PRINTING OPTION
// ═══════════════════════════════════════════════════════════

const BillPrintConfig = {
  get() { return dbReadObj(DB.BILL_PRINT_CONFIG); },
  save(config) { dbWrite(DB.BILL_PRINT_CONFIG, config); showToast('Bill print settings saved', 'success'); },
  openForm() {
    var config = this.get();
    var activeSociety = SocietyMaster.getActive() || {};
    PopupManager.open('bill_print_config', 'Set Bill Printing Option',
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
      '<div class="form-group"><label class="form-label">Page Format</label><select class="form-input" name="pageFormat"><option value="full" ' + (config.pageFormat==='full'?'selected':'') + '>Full Page</option><option value="half" ' + (config.pageFormat==='half'?'selected':'') + '>Half Page</option></select></div>' +
      '<div class="form-group"><label class="form-label">Columns</label><select class="form-input" name="columns"><option value="1" ' + (config.columns===1?'selected':'') + '>Single Column</option><option value="2" ' + (config.columns===2?'selected':'') + '>Two Columns</option></select></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Show on Bill</label><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;">' +
      ['GST Breakup','Interest Separately','Arrears','Society Address','Member GSTIN','Cheque Instructions','Bank Details','Remarks'].map(function(item) {
        var key = 'show_' + item.replace(/\s/g,'_').toLowerCase();
        return '<label style="display:flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;"><input type="checkbox" name="' + key + '" ' + (config[key]?'checked':'') + ' style="width:14px;height:14px;accent-color:var(--primary);">' + item + '</label>';
      }).join('') + '</div></div>' +
      '<div class="form-group"><label class="form-label">Bill No. Prefix</label><input class="form-input" name="billPrefix" value="' + (config.billPrefix||'BILL/') + '"></div>' +
      '<div class="form-group"><label class="form-label">Receipt No. Prefix</label><input class="form-input" name="receiptPrefix" value="' + (config.receiptPrefix||'RCPT/') + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Billing Remarks (line 1)</label><input class="form-input" name="remarksLine1" value="' + (config.remarksLine1||'') + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Billing Remarks (line 2)</label><input class="form-input" name="remarksLine2" value="' + (config.remarksLine2||'') + '"></div>' +
      '<div class="form-group"><label class="form-label">Chairman Name</label><input class="form-input" name="chairmanName" value="' + (config.chairmanName || activeSociety.chairmanName || '') + '"></div>' +
      '<div class="form-group"><label class="form-label">Secretary Name</label><input class="form-input" name="secretaryName" value="' + (config.secretaryName || activeSociety.secretaryName || '') + '"></div>' +
      '<div class="form-group"><label class="form-label">Treasurer Name</label><input class="form-input" name="treasurerName" value="' + (config.treasurerName || activeSociety.treasurerName || '') + '"></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Bank Details</label><textarea class="form-input" name="bankDetails" rows="2">' + (config.bankDetails||'') + '</textarea></div>' +
      '<div class="form-group" style="grid-column:1/-1;"><label class="form-label">Balance Sheet Footer</label><textarea class="form-input" name="balanceSheetFooter" rows="2">' + (config.balanceSheetFooter||'') + '</textarea></div></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="save_print_config">Save Settings</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'bill_print_config\')">Cancel</button></div>',
      { width:'620px' });
    setTimeout(function() {
      var saveBtn = document.getElementById('save_print_config');
      if (saveBtn) saveBtn.addEventListener('click', function() {
        var popup = document.getElementById('popup_bill_print_config');
        var config = SocietyMaster.collectForm(popup.querySelector('.jv-popup-body'));
        BillPrintConfig.save(config);
        PopupManager.close('bill_print_config');
      });
    }, 50);
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 11 — MODULE 9: GST MASTER (CONDITIONAL)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SECTION 11 — MODULE 10: MEMBER BILL (TRANSACTION ENGINE)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SECTION 11 — MODULE 11: MEMBER RECEIPT (PAYMENT ENGINE)
// ═══════════════════════════════════════════════════════════

const ReceiptEngine = {
  getReceipts() { return dbRead(DB.RECEIPTS); },
  
  getOutstanding(memberCode) {
    const ledger = BillingEngine.getLedger().filter(e => e.memberCode === memberCode);
    const opBal = OpeningBalanceMaster.getAll().find(b => b.code === memberCode && b.type === 'member');
    
    let totalPrinc = (opBal ? parseFloat(opBal.opDebit)||0 : 0);
    let totalInt = 0;
    
    ledger.forEach(e => {
      // In this system, bills contribute to Principal, and Interest bills to Interest
      // For simplicity, we assume MBill has both parts embedded or we split at entry
      if (e.type === 'MBill') {
        const inv = BillingEngine.getInvoices().find(i => i.billNo === e.refNo);
        totalPrinc += (inv ? inv.subTotal + inv.gstTotal : parseFloat(e.debit)||0);
        totalInt   += (inv ? inv.interest : 0);
      } else if (e.type === 'MRct') {
        // Receipts reduce Principal/Interest based on their stored bifurcation
        totalPrinc -= (parseFloat(e.princReduction)||0);
        totalInt   -= (parseFloat(e.intReduction)||0);
      }
    });

    return { principal: totalPrinc, interest: totalInt, total: totalPrinc + totalInt };
  },

  addReceipt(data) {
    const dues = this.getOutstanding(data.memberCode);
    const receipts = this.getReceipts();
    const ledger = BillingEngine.getLedger();
    
    // Logic: Interest cleared first
    let paidAmt = parseFloat(data.amount) || 0;
    let intPaid = Math.min(paidAmt, dues.interest);
    let princPaid = paidAmt - intPaid;

    const rct = Object.assign({}, data, {
      id: Date.now(),
      intBifurcation: { interest: intPaid, principal: princPaid },
      timestamp: new Date().toISOString()
    });

    receipts.push(rct);
    ledger.push({
      date: data.date, type: 'MRct', refNo: data.receiptNo, memberCode: data.memberCode,
      particulars: data.particulars || 'Payment Received - Chq: ' + (data.chequeNo||'Cash'),
      debit: 0, credit: paidAmt,
      princReduction: princPaid, intReduction: intPaid
    });

    dbWrite(DB.RECEIPTS, receipts);
    dbWrite(DB.LEDGER, ledger);
    showToast('Receipt #' + data.receiptNo + ' added and Ledger updated.', 'success');
    EventBus.emit('receipt:added', rct);
  },

  renderList() {
    const tbody = document.querySelector('#receipt-list-tbody');
    if (!tbody) return;
    const list = this.getReceipts();
    if (!list.length) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No receipts found.</td></tr>'; return; }
    
    tbody.innerHTML = list.slice().reverse().map(r => {
      const member = MemberMaster.get(r.memberCode) || { names:['Unknown'] };
      return `<tr>
        <td>${r.receiptNo}</td>
        <td>${r.date}</td>
        <td>${r.accountName || 'Bank A/c'}</td>
        <td>${r.memberCode}</td>
        <td>${member.names[0]}</td>
        <td class="amount">₹${parseFloat(r.amount).toLocaleString()}</td>
        <td>${r.chequeNo || 'Cash'}</td>
      </tr>`;
    }).join('');
  },

  openAddForm() {
    const members = MemberMaster.getAll();
    const accounts = AccountMaster.getAll().filter(a => a.mainGroup === 'Assets' && (a.name.toLowerCase().includes('bank')||a.name.toLowerCase().includes('cash')));
    
    const memberOpts = members.map(m => `<option value="${m.code}">${m.code} - ${m.names[0]}</option>`).join('');
    const accOpts = accounts.map(a => `<option value="${a.code}">${a.name}</option>`).join('');

    PopupManager.open('receipt_add', 'Member Receipt Add',
      `<div style="background:#f1f5f9; padding:15px; border-radius:8px; margin-bottom:20px; display:flex; justify-content:space-between; border:1px solid #cbd5e1;">
        <div><label style="font-size:11px; color:#64748b;">Principal</label><div id="rct_due_princ" style="font-weight:700;">₹0</div></div>
        <div><label style="font-size:11px; color:#64748b;">Interest</label><div id="rct_due_int" style="font-weight:700;">₹0</div></div>
        <div><label style="font-size:11px; color:#64748b;">Total Dues</label><div id="rct_due_total" style="font-weight:700; color:var(--danger);">₹0</div></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Receipt No.</label><input class="form-input" id="rct_no" value="${this.getReceipts().length + 1}"></div>
        <div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" id="rct_date" value="${new Date().toISOString().split('T')[0]}"></div>
      </div>
      <div class="form-group"><label class="form-label">Member (Cr.)</label><select class="form-input" id="rct_member" onchange="ReceiptEngine.updateDuesView(this.value)">${memberOpts}</select></div>
      <div class="form-group"><label class="form-label">Account (Dr.)</label><select class="form-input" id="rct_acc">${accOpts}</select></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Cheque No.</label><input class="form-input" id="rct_chq"></div>
        <div class="form-group"><label class="form-label">Chq Date</label><input class="form-input" type="date" id="rct_chq_date"></div>
      </div>
      <div class="form-group"><label class="form-label">Drawn On (Bank)</label><input class="form-input" id="rct_bank"></div>
      <div class="form-group"><label class="form-label">Particulars</label><input class="form-input" id="rct_part"></div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:15px; background:#fff; padding:15px; border:1px solid #ddd; border-radius:6px;">
        <div class="form-group"><label class="form-label">Amount</label><input type="number" class="form-input" id="rct_amt" style="font-size:18px; font-weight:700;" oninput="ReceiptEngine.calcBifurcation(this.value)"></div>
        <div>
          <label style="font-size:12px; font-weight:700; color:var(--primary);">Interest Bifurcation</label>
          <div style="display:flex; justify-content:space-between; font-size:13px; border-bottom:1px solid #eee; padding:5px 0;"><span>Principal:</span> <span id="rct_bif_princ">₹0</span></div>
          <div style="display:flex; justify-content:space-between; font-size:13px; padding:5px 0;"><span>Interest:</span> <span id="rct_bif_int">₹0</span></div>
        </div>
      </div>
      <div style="display:flex; justify-content:center; gap:12px; margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
        <button class="btn-primary" id="save_rct_btn">Save Receipt</button>
        <button class="btn-secondary" onclick="PopupManager.close('receipt_add')">Exit</button>
      </div>`, { width: '550px' }
    );

    setTimeout(() => {
      this.updateDuesView(document.getElementById('rct_member').value);
      document.getElementById('save_rct_btn').onclick = () => {
        const data = {
          receiptNo: document.getElementById('rct_no').value,
          date: document.getElementById('rct_date').value,
          memberCode: document.getElementById('rct_member').value,
          accountCode: document.getElementById('rct_acc').value,
          accountName: document.getElementById('rct_acc').options[document.getElementById('rct_acc').selectedIndex].text,
          amount: document.getElementById('rct_amt').value,
          chequeNo: document.getElementById('rct_chq').value,
          chequeDate: document.getElementById('rct_chq_date').value,
          bankName: document.getElementById('rct_bank').value,
          particulars: document.getElementById('rct_part').value
        };
        if(!data.amount || data.amount <= 0) { showToast('Enter valid amount', 'warning'); return; }
        this.addReceipt(data);
        PopupManager.close('receipt_add');
        this.renderList();
      };
    }, 50);
  },

  updateDuesView(memberCode) {
    const dues = this.getOutstanding(memberCode);
    document.getElementById('rct_due_princ').textContent = '₹' + dues.principal.toLocaleString();
    document.getElementById('rct_due_int').textContent = '₹' + dues.interest.toLocaleString();
    document.getElementById('rct_due_total').textContent = '₹' + dues.total.toLocaleString();
    this.calcBifurcation(document.getElementById('rct_amt').value || 0);
  },

  calcBifurcation(paidVal) {
    const memberCode = document.getElementById('rct_member').value;
    const dues = this.getOutstanding(memberCode);
    let paid = parseFloat(paidVal) || 0;
    let intPaid = Math.min(paid, dues.interest);
    let princPaid = paid - intPaid;
    document.getElementById('rct_bif_princ').textContent = '₹' + princPaid.toLocaleString();
    document.getElementById('rct_bif_int').textContent = '₹' + intPaid.toLocaleString();
  }
};

const BillingEngine = {
  getInvoices() { return dbRead(DB.INVOICES); },
  getLedger()   { return dbRead(DB.LEDGER); },
  
  calculateInterest(memberCode, date) {
    var ledger = this.getLedger().filter(function(e){ return e.memberCode === memberCode; });
    var opBal = OpeningBalanceMaster.getAll().find(function(b){ return b.code === memberCode && b.type === 'member'; });
    
    var balance = (opBal ? (parseFloat(opBal.opDebit)||0) - (parseFloat(opBal.opCredit)||0) : 0);
    ledger.forEach(function(e) { balance += (parseFloat(e.debit)||0) - (parseFloat(e.credit)||0); });
    
    if (balance <= 0) return 0;
    
    var activeSoc = SocietyMaster.getActive() || {};
    var rate = parseFloat(activeSoc.interestRate) || 21; 
    var monthlyRate = rate / 12 / 100;
    return parseFloat((balance * monthlyRate).toFixed(2));
  },

  openInterestForm() {
    PopupManager.open('interest_calc', 'Monthly Interest Calculation',
      '<div style="text-align:center; padding:10px;">' +
      '<h2 style="color:var(--primary); font-size:18px; margin-bottom:20px;">Monthly Interest Calculation</h2>' +
      '<div class="form-group" style="max-width:240px; margin:0 auto 20px;"><label class="form-label">Calculate Date</label><input type="date" class="form-input" id="int_calc_date"></div>' +
      '<div style="border:1px solid #ddd; padding:15px; border-radius:8px; margin-bottom:20px; text-align:left;">' +
      '<div style="font-weight:700; font-size:12px; margin-bottom:10px; color:#666;">Member Range</div>' +
      '<div style="display:flex; gap:10px; align-items:center;"><span>From</span><input class="form-input" id="int_from" value="G/101"><span>To</span><input class="form-input" id="int_to" value="Z/9999"></div></div>' +
      '<div style="display:flex; gap:12px; justify-content:center;">' +
      '<button class="btn-primary" onclick="showToast(\'Interest calculated for selected members\'); PopupManager.close(\'interest_calc\')">Calculate</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(\'interest_calc\')">Exit</button></div></div>',
      { width: '420px' }
    );
  },

  generateBulk(params) {
    var members = MemberMaster.getAll();
    var allBills = MemberBillMaster.getAll();
    var invoices = this.getInvoices();
    var ledger = this.getLedger();
    var count = 0;
    
    members.forEach(function(m, i) {
      var memberBills = allBills.filter(function(b){ return b.memberId === m.code; });
      var interest = BillingEngine.calculateInterest(m.code, params.billDate);
      
      var billNo = (params.prefix || 'BILL/') + (parseInt(params.startNo) + count);
      var subTotal = 0;
      var gstTotal = 0;
      var items = [];
      
      memberBills.forEach(function(b) {
        var amt = parseFloat(b.amount) || 0;
        var gst = (b.gstApplicable && !b.gstExempt) ? parseFloat((amt * 0.18).toFixed(2)) : 0;
        subTotal += amt;
        gstTotal += gst;
        items.push({ headId: b.headId, headName: b.headName, amount: amt, gst: gst });
      });
      
      var total = subTotal + gstTotal + interest;
      
      var inv = {
        billNo: billNo, memberCode: m.code, memberName: m.names[0], flatNo: m.flatNo,
        period: params.period, date: params.billDate, dueDate: params.dueDate,
        items: items, interest: interest, subTotal: subTotal, gstTotal: gstTotal, total: total
      };
      
      invoices.push(inv);
      ledger.push({
        date: params.billDate, type: 'MBill', refNo: billNo, memberCode: m.code,
        particulars: 'Maintenance Bill for ' + params.period, debit: total, credit: 0, balance: 0 
      });
      count++;
    });
    
    dbWrite(DB.INVOICES, invoices);
    dbWrite(DB.LEDGER, ledger);
    showToast(count + ' Bills Generated and Posted to Ledger', 'success');
    EventBus.emit('billing:generated', count);
    this.renderHistory();
  },

  renderHistory() {
    var tbody = document.querySelector('#bill-history-tbody');
    if (!tbody) return;
    var invoices = this.getInvoices();
    if (!invoices.length) { tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No bills generated.</td></tr>'; return; }
    tbody.innerHTML = invoices.slice(-20).reverse().map(function(inv) {
      return '<tr><td>' + inv.billNo + '</td><td>' + inv.memberName + ' (' + (inv.flatNo||'') + ')</td>' +
        '<td>' + inv.period + '</td><td class="amount">₹' + inv.subTotal.toLocaleString() + '</td>' +
        '<td class="amount">₹' + inv.gstTotal.toLocaleString() + '</td>' +
        '<td class="amount" style="font-weight:700;">₹' + inv.total.toLocaleString() + '</td>' +
        '<td><span class="badge badge-success">Generated</span></td>' +
        '<td><button class="btn-icon" onclick="BillingEngine.previewInv(\'' + inv.billNo + '\')" title="View Bill">👁️</button> ' +
        '<button class="btn-icon" onclick="BillingEngine.openBillForm(\'' + inv.billNo + '\')" title="Edit Bill">✏️</button> ' +
        '<button class="btn-icon" onclick="BillingEngine.deleteBill(\'' + inv.billNo + '\')" title="Delete Bill" style="color:var(--danger)">🗑️</button></td></tr>';
    }).join('');
  },

  openBillForm(billNo) {
    var inv = this.getInvoices().find(function(i){ return i.billNo === billNo; });
    if (!inv) return;
    var society = SocietyMaster.getActive() || {};
    var settings = BillSetting.getAll();
    
    var itemRows = settings.map(function(s, i) {
      var item = inv.items.find(function(it){ return it.headId === s.id; }) || { amount: 0 };
      return '<tr><td>' + (i+1) + '</td><td>' + s.name + '</td><td><input type="number" class="form-input bill-amt-input" data-head-id="' + s.id + '" data-gst="' + s.gstApplicable + '" value="' + item.amount + '" style="text-align:right; padding:3px 8px; font-size:12px;"></td></tr>';
    }).join('');

    PopupManager.open('bill_update', 'Member Bill Update',
      '<div style="display:grid; grid-template-columns: 1fr 240px; gap:20px;">' +
        '<div>' +
          '<div class="form-row">' +
            '<div class="form-group"><label class="form-label">No.</label><input class="form-input" id="upd_bill_no" value="' + inv.billNo + '" disabled></div>' +
            '<div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" id="upd_bill_date" value="' + inv.date + '"></div>' +
            '<div class="form-group"><label class="form-label">Due Date</label><input class="form-input" type="date" id="upd_bill_due" value="' + inv.dueDate + '"></div>' +
          '</div>' +
          '<div class="form-group"><label class="form-label">Period</label><input class="form-input" id="upd_period" value="' + inv.period + '"></div>' +
          '<div style="margin-bottom:12px; font-weight:700; color:var(--primary);">[ ' + inv.memberCode + ' ] ' + inv.memberName + '</div>' +
          '<div style="max-height:280px; overflow-y:auto; border:1px solid #ddd;">' +
            '<table class="data-table" style="font-size:11px; margin:0;">' +
              '<thead><tr><th style="width:40px;">Sr.</th><th>Bill Account</th><th style="width:100px; text-align:right;">Amount</th></tr></thead>' +
              '<tbody id="upd_bill_items">' + itemRows + '</tbody>' +
            '</table>' +
          '</div>' +
          '<div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px; font-weight:800; font-size:16px; color:var(--primary);"><span>Total:</span> <span id="upd_total_disp">₹' + inv.total.toLocaleString() + '</span></div>' +
        '</div>' +
        '<div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; align-self:flex-start;">' +
          '<h4 style="font-size:11px; color:#64748b; margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;">Summary</h4>' +
          '<div style="margin-bottom:15px;"><label style="font-size:11px; font-weight:700; color:#475569;">Non GST Total</label><div id="sum_non_gst" style="font-size:14px; font-weight:700; text-align:right;">₹0</div></div>' +
          '<div style="margin-bottom:15px;"><label style="font-size:11px; font-weight:700; color:#475569;">GST Total</label><div id="sum_gst_acc" style="font-size:14px; font-weight:700; text-align:right;">₹0</div></div>' +
          '<div style="margin-bottom:15px;"><label style="font-size:11px; font-weight:700; color:#475569;">GST Amount</label><div id="sum_gst_val" style="font-size:14px; font-weight:700; text-align:right;">₹0</div></div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex; justify-content:center; gap:12px; margin-top:20px; border-top:1px solid #eee; padding-top:15px;">' +
        '<button class="btn-primary" onclick="showToast(\'Bill updated successfully\'); PopupManager.close(\'bill_update\');">Update</button>' +
        '<button class="btn-secondary" onclick="PopupManager.close(\'bill_update\')">Exit</button>' +
      '</div>', { width: '820px' }
    );
    // Add logic to recalculate summary
  },

  deleteBill(billNo) {
    if (!confirm('Are you sure you want to delete this bill?')) return;
    var invs = this.getInvoices().filter(function(i){ return i.billNo !== billNo; });
    var ledger = this.getLedger().filter(function(e){ return !(e.type === 'MBill' && e.refNo === billNo); });
    dbWrite(DB.INVOICES, invs);
    dbWrite(DB.LEDGER, ledger);
    showToast('Bill deleted and ledger updated', 'info');
    this.renderHistory();
  },

  previewInv(billNo) {
    var inv = this.getInvoices().find(function(i){ return i.billNo === billNo; });
    if (!inv) return;
    var config = BillPrintConfig.get();
    var society = SocietyMaster.getActive() || {};
    
    var itemRows = inv.items.map(function(it){
      return '<tr><td style="padding:6px;">' + it.headName + '</td><td style="text-align:right;padding:6px;">' + it.amount.toFixed(2) + '</td></tr>';
    }).join('');

    PopupManager.open('inv_preview', 'Bill Preview — ' + billNo,
      '<div style="font-family:\'Courier New\', Courier, monospace; background:#fff; padding:30px; border:1px solid #ccc; max-width:600px; margin:0 auto; color:#333;">' +
      '<div style="text-align:center; border-bottom:2px solid #333; padding-bottom:10px; margin-bottom:15px;">' +
      '<h2 style="margin:0; text-transform:uppercase;">' + society.name + '</h2>' +
      '<div style="font-size:12px;">' + (society.address || '') + '</div>' +
      '<div style="font-size:11px; margin-top:4px;">GSTIN: ' + (society.gstNo || 'N/A') + ' | Pan: ' + (society.panNo || '') + '</div></div>' +
      '<div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:15px;">' +
      '<div>Bill No: <strong>' + inv.billNo + '</strong><br>Date: ' + inv.date + '</div>' +
      '<div style="text-align:right;">Period: ' + inv.period + '<br>Due Date: <strong>' + inv.dueDate + '</strong></div></div>' +
      '<div style="border-bottom:1px solid #333; padding-bottom:4px; margin-bottom:10px; font-weight:700;">Member: ' + inv.memberName + ' (' + inv.flatNo + ')</div>' +
      '<table style="width:100%; font-size:13px; border-collapse:collapse;">' +
      '<thead style="border-bottom:1px solid #333;"><tr><th style="text-align:left;padding:6px;">Description</th><th style="text-align:right;padding:6px;">Amount (₹)</th></tr></thead>' +
      '<tbody>' + itemRows + 
      '<tr style="border-top:1px dashed #999;"><td>CGST + SGST (18%)</td><td style="text-align:right;padding:6px;">' + inv.gstTotal.toFixed(2) + '</td></tr>' +
      '<tr><td>Interest for Delay</td><td style="text-align:right;padding:6px;">' + inv.interest.toFixed(2) + '</td></tr>' +
      '<tr style="border-top:2px solid #333; font-weight:800; font-size:15px;"><td style="padding:10px 6px;">NET PAYABLE</td><td style="text-align:right;padding:10px 6px;">₹' + inv.total.toLocaleString() + '</td></tr>' +
      '</tbody></table>' +
      '<div style="margin-top:20px; font-size:11px; border-top:1px solid #eee; padding-top:10px;">' +
      '<strong>Remarks:</strong> ' + (config.remarksLine1 || 'Please pay by due date to avoid interest.') + '</div>' +
      '<div style="margin-top:30px; display:flex; justify-content:space-between; font-size:12px;">' +
      '<div>_________________<br>Member Sign</div><div>_________________<br>Secretary</div></div></div>' +
      '<div style="margin-top:20px; text-align:right;"><button class="btn-secondary" onclick="window.print()">Print Bill</button> <button class="btn-primary" onclick="PopupManager.close(\'inv_preview\')">Done</button></div>',
      { width: '700px' }
    );
  }
};

const GSTMaster = {
  getAll() { return dbRead(DB.GST_MASTER); },
  isEnabled() { return SocietyMaster.isGSTEnabled(); },
  GST_RATES: [0, 5, 12, 18, 28],
  add(data) {
    if (!this.isEnabled()) { showToast('GST is not enabled for this society', 'error'); return false; }
    var list = this.getAll(); list.push(data); dbWrite(DB.GST_MASTER, list);
    EventBus.emit('gstmaster:updated', list); return true;
  },
  update(idx, data) {
    var list = this.getAll(); if (idx < 0 || idx >= list.length) return false;
    list[idx] = Object.assign({}, list[idx], data); dbWrite(DB.GST_MASTER, list);
    EventBus.emit('gstmaster:updated', list); return true;
  },
  delete(idx) {
    var list = this.getAll(); list.splice(idx, 1); dbWrite(DB.GST_MASTER, list);
    EventBus.emit('gstmaster:updated', list); return true;
  },
  openForm(editIdx) {
    if (editIdx === undefined) editIdx = null;
    if (!this.isEnabled()) { showToast('Enable GST in Society Master first', 'warning'); return; }
    var data = editIdx !== null ? this.getAll()[editIdx] : {};
    var popupId = 'gst_form_' + (editIdx !== null ? editIdx : 'new');
    var rateOpts = this.GST_RATES.map(function(r){ return '<option value="' + r + '" ' + (data.gstRate==r?'selected':'') + '>' + r + '%</option>'; }).join('');
    var accOpts = AccountMaster.getAll().map(function(a){ return '<option value="' + a.code + '" ' + (a.code===data.cgstAccount?'selected':'') + '>' + a.code + ' - ' + a.name + '</option>'; }).join('');
    var accOpts2 = AccountMaster.getAll().map(function(a){ return '<option value="' + a.code + '" ' + (a.code===data.sgstAccount?'selected':'') + '>' + a.code + ' - ' + a.name + '</option>'; }).join('');
    PopupManager.open(popupId, editIdx!==null? 'Edit GST Mapping' : 'Add GST Mapping',
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
      '<div class="form-group"><label class="form-label">Account Head</label><select class="form-input" name="accountCode">' + AccountMaster.buildGroupOptions(data.accountCode||'') + '</select></div>' +
      '<div class="form-group"><label class="form-label">GST Rate (%)</label><select class="form-input" name="gstRate">' + rateOpts + '</select></div>' +
      '<div id="gst_split_preview" style="padding:8px;background:var(--accent-soft);border-radius:6px;font-size:12px;"></div>' +
      '<div class="form-group"><label class="form-label">CGST Account</label><select class="form-input" name="cgstAccount"><option value="">-- Select --</option>' + accOpts + '</select></div>' +
      '<div class="form-group"><label class="form-label">SGST Account</label><select class="form-input" name="sgstAccount"><option value="">-- Select --</option>' + accOpts2 + '</select></div>' +
      '<div class="form-group"><label class="form-label">Exemption Limit (₹)</label><input class="form-input" name="exemptionLimit" type="number" min="0" value="' + (data.exemptionLimit||0) + '"></div>' +
      '<div class="form-group"><label class="form-label">Rounding Rule</label><select class="form-input" name="rounding"><option value="none" ' + (data.rounding==='none'?'selected':'') + '>No Rounding</option><option value="round" ' + (data.rounding==='round'?'selected':'') + '>Round to nearest ₹1</option><option value="ceil" ' + (data.rounding==='ceil'?'selected':'') + '>Ceil</option><option value="floor" ' + (data.rounding==='floor'?'selected':'') + '>Floor</option></select></div></div>' +
      '<div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end;">' +
      '<button class="btn-primary" id="gst_save_btn">Save</button>' +
      '<button class="btn-secondary" onclick="PopupManager.close(this.closest(\'.jv-popup\').id.replace(\'popup_\',\'\'))">Cancel</button></div>',
      { width:'480px' });
    setTimeout(function() {
      var rateEl = document.querySelector('#popup_' + popupId + ' select[name="gstRate"]');
      var updateSplit = function() {
        var rate = parseFloat(rateEl ? rateEl.value : 0) || 0;
        var preview = document.getElementById('gst_split_preview');
        if (preview) preview.innerHTML = 'GST ' + rate + '% → CGST: ' + (rate/2) + '% + SGST: ' + (rate/2) + '% (Intra-state)';
      };
      if (rateEl) rateEl.addEventListener('change', updateSplit);
      updateSplit();
      var saveBtn = document.getElementById('gst_save_btn');
      if (saveBtn) saveBtn.addEventListener('click', function() {
        var popup = document.querySelector('#popup_' + popupId + ' .jv-popup-body');
        if (!popup) return;
        var gdata = SocietyMaster.collectForm(popup);
        gdata.gstRate = parseFloat(gdata.gstRate) || 0;
        gdata.cgstRate = gdata.gstRate / 2;
        gdata.sgstRate = gdata.gstRate / 2;
        var ok = editIdx !== null ? GSTMaster.update(editIdx, gdata) : GSTMaster.add(gdata);
        if (ok) { showToast('GST mapping saved', 'success'); PopupManager.close(popupId); GSTMaster.render(); }
      });
    }, 50);
  },
  render() {
    var tbody = document.querySelector('#gst-table-body');
    if (!tbody) return;
    if (!this.isEnabled()) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">GST is not enabled. Enable it in Society Master.</td></tr>';
      return;
    }
    tbody.innerHTML = this.getAll().map(function(g, i) {
      return '<tr><td>' + (g.accountCode||'—') + '</td><td>' + (g.gstRate||0) + '%</td>' +
        '<td>' + (g.cgstRate||0) + '% / ' + (g.sgstRate||0) + '%</td>' +
        '<td>' + (g.cgstAccount||'—') + ' / ' + (g.sgstAccount||'—') + '</td>' +
        '<td>₹' + (g.exemptionLimit||0).toLocaleString('en-IN') + '</td>' +
        '<td><button class="btn-icon" onclick="GSTMaster.openForm(' + i + ')">Edit</button>' +
        '<button class="btn-icon" onclick="GSTMaster.delete(' + i + ');GSTMaster.render();">Delete</button></td></tr>';
    }).join('');
  }
};

// ═══════════════════════════════════════════════════════════
// SECTION 12 — MASTER INIT & WIRING
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  // Detect current page from URL or data-page body attribute
  var page = document.body.dataset.page ||
    window.location.pathname.split('/').pop().replace('.html','');

  // Init event bus cross-module sync
  MemberBillMaster.init();

  // Apply active society's GST switch on load
  var active = SocietyMaster.getActive();
  if (active) SocietyMaster.applyGSTSwitch(active.gstEnabled);

  // ── Wire data-action buttons (spec-compliant) ──────────
  var actionMap = {
    'add-society':           function() { SocietyMaster.openAddForm(); },
    'add-group':             function() { GroupMaster.openAddForm(); },
    'add-account':           function() { AccountMaster.openAddForm(); },
    'add-member':            function() { MemberMaster.openAddForm(); },
    'open-bill-setting':     function() { BillSetting.openForm(); },
    'open-auto-master':      function() { AutoMaster.openAddForm(); },
    'open-bill-upload':      function() { MemberBillMaster.openUploadPopup(); },
    'download-bill-template':function() { MemberBillMaster.downloadTemplate(); },
    'open-bill-print-config':function() { BillPrintConfig.openForm(); },
    'open-gst-master':       function() { GSTMaster.openForm(); }
  };
  Object.keys(actionMap).forEach(function(action) {
    var el = document.querySelector('[data-action="' + action + '"]');
    if (el) el.addEventListener('click', function(e) { e.preventDefault(); actionMap[action](); });
  });

  // ── Wire search inputs ────────────────────────────────
  var acctSearch = document.querySelector('#account-search');
  if (acctSearch) acctSearch.addEventListener('input', function() { AccountMaster.render(); });
  var memSearchById = document.querySelector('#member-search');
  if (memSearchById) memSearchById.addEventListener('input', function() { MemberMaster.render(); });
  var grpFilter = document.querySelector('#group-filter');
  if (grpFilter) grpFilter.addEventListener('change', function() { GroupMaster.render(); });

  // ── Wire Opening Balance filter tabs ──────────────────
  document.querySelectorAll('[data-ob-filter]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      OpeningBalanceMaster.renderTable(btn.dataset.obFilter);
    });
  });
  var obSaveBtnDA = document.querySelector('#ob_save_btn');
  if (obSaveBtnDA) obSaveBtnDA.addEventListener('click', function(e) {
    e.preventDefault(); OpeningBalanceMaster.save();
  });

  // ── Wire existing buttons by page (fallback wiring) ────
  // Masters hub page
  if (page === 'masters') {
    var societyCard = document.querySelector('.module-card');
    if (societyCard) {
      societyCard.onclick = function(e) { e.preventDefault(); SocietyMaster.openAddForm(); };
      var societyLink = societyCard.querySelector('.mc-link');
      if (societyLink) societyLink.onclick = function(e) { e.preventDefault(); SocietyMaster.openAddForm(); };
    }
  }

  // Group Master page
  if (page === 'group-master') {
    if (!document.querySelector('[data-action="add-group"]')) {
      var addBtn = document.querySelector('.btn-primary');
      if (addBtn && addBtn.textContent.includes('Add')) {
        addBtn.onclick = function(e) { e.preventDefault(); GroupMaster.openAddForm(); };
      }
    }
    var existingTbody = document.querySelector('.data-table tbody');
    if (existingTbody && !existingTbody.id) { existingTbody.id = 'group-table-body'; GroupMaster.render(); }
  }

  // Account Master page
  if (page === 'account-master') {
    if (!document.querySelector('[data-action="add-account"]')) {
      var accountAddBtn = document.querySelector('.btn-primary');
      if (accountAddBtn) accountAddBtn.onclick = function(e) { e.preventDefault(); AccountMaster.openAddForm(); };
    }
    var searchInput = document.querySelector('.form-input[placeholder*="Search"]');
    if (searchInput && !searchInput.id) {
      searchInput.id = 'account-search';
      searchInput.addEventListener('input', function(){ AccountMaster.render(); });
    }
    var acctTbody = document.querySelector('.data-table tbody');
    if (acctTbody && !acctTbody.id) { acctTbody.id = 'account-table-body'; AccountMaster.render(); }
  }

  // Member Master page
  if (page === 'member-master') {
    if (!document.querySelector('[data-action="add-member"]')) {
      var memberAddBtn = document.querySelector('.btn-primary');
      if (memberAddBtn) memberAddBtn.onclick = function(e) { e.preventDefault(); MemberMaster.openAddForm(); };
    }
    var memSearch = document.querySelector('.search-input');
    if (memSearch && !memSearch.id) {
      memSearch.id = 'member-search';
      memSearch.addEventListener('input', function(){ MemberMaster.render(); });
    }
    var memTbody = document.querySelector('.data-table tbody');
    if (memTbody && !memTbody.id) { memTbody.id = 'member-table-body'; MemberMaster.render(); }
  }

  // Billing Master page
  if (page === 'billing-master') {
    if (!document.querySelector('[data-action="open-bill-setting"]')) {
      var billBtns = document.querySelectorAll('.btn-primary');
      billBtns.forEach(function(btn) {
        if (btn.textContent.includes('Add')) {
          btn.onclick = function(e) { e.preventDefault(); BillSetting.openForm(); };
          btn.textContent = 'FrmBillSetting';
        }
      });
    }
    if (!document.querySelector('[data-action="open-auto-master"]')) {
      var chargeAddBtn = document.querySelector('.card-header .btn-primary');
      if (chargeAddBtn) {
        chargeAddBtn.onclick = function(e) { e.preventDefault(); AutoMaster.openAddForm(); };
        chargeAddBtn.textContent = 'Auto Master Add';
      }
    }
    var billingThead = document.querySelector('.data-table thead');
    var billingTbody = document.querySelector('.data-table tbody');
    if (billingThead && !billingThead.id) billingThead.id = 'member-bill-thead';
    if (billingTbody && !billingTbody.id) { billingTbody.id = 'member-bill-grid'; MemberBillMaster.renderGrid(); }
  }

  // Opening Balances page
  if (page === 'opening-balances') {
    var obSaveBtn = document.querySelector('.btn-primary');
    if (obSaveBtn && !obSaveBtn.id) {
      obSaveBtn.id = 'ob_save_btn';
      obSaveBtn.onclick = function(e) { e.preventDefault(); OpeningBalanceMaster.save(); };
    }
    var obTbody = document.querySelector('.data-table tbody');
    if (obTbody && !obTbody.id) { obTbody.id = 'ob-table-body'; OpeningBalanceMaster.renderTable(); }
    
    // Wire filters
    document.querySelectorAll('input[name="obFilter"]').forEach(function(btn) {
      btn.addEventListener('change', function() { OpeningBalanceMaster.renderTable(this.value); });
    });
  }

  // Opening Bank page
  if (page === 'opening-bank') {
    var bankTbody = document.querySelector('.data-table tbody');
    if (bankTbody && !bankTbody.id) { bankTbody.id = 'bank-reco-tbody'; OpeningBankReco.init(); }
    var bankAddBtn = document.querySelector('.btn-primary');
    if (bankAddBtn) {
      bankAddBtn.onclick = function(e) { e.preventDefault(); OpeningBankReco.init(); showToast('Bank accounts synced from Account Master', 'info'); };
    }
  }

  // Bill Print Setup page
  if (page === 'bill-print-setup') {
    if (!document.querySelector('[data-action="open-bill-print-config"]')) {
      var printSaveBtn = document.querySelector('.btn-primary');
      if (printSaveBtn) printSaveBtn.onclick = function(e) { e.preventDefault(); BillPrintConfig.openForm(); };
    }
  }

  // GST Master page
  if (page === 'gst-master') {
    if (!document.querySelector('[data-action="open-gst-master"]')) {
      var gstAddBtn = document.querySelector('.btn-primary');
      if (gstAddBtn) gstAddBtn.onclick = function(e) { e.preventDefault(); GSTMaster.openForm(); };
    }
    var gstTbody = document.querySelector('.data-table tbody');
    if (gstTbody && !gstTbody.id) { gstTbody.id = 'gst-table-body'; GSTMaster.render(); }
  }

  // ── No-society guard for module pages (Rule #1) ────────
  var modulePages = ['group-master','account-master','member-master','billing-master',
    'opening-balances','opening-bank','bill-print-setup','gst-master'];
  if (modulePages.indexOf(page) >= 0 && !SocietyMaster.getActive()) {
    var mainContent = document.querySelector('.main-content') || document.querySelector('main');
    if (mainContent) {
      var guard = document.createElement('div');
      guard.id = 'society_guard_overlay';
      guard.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,0.92);' +
        'z-index:999;display:flex;align-items:center;justify-content:center;flex-direction:column;';
      guard.innerHTML = '<div style="text-align:center;max-width:400px;padding:40px;">' +
        '<div style="font-size:48px;margin-bottom:16px;">🏢</div>' +
        '<h2 style="color:var(--primary,#2D1B69);margin-bottom:12px;">No Society Selected</h2>' +
        '<p style="color:#666;margin-bottom:20px;">Please select or create a society in the <strong>Society Master</strong> before using this module.</p>' +
        '<div style="display:flex;flex-direction:column;gap:12px;">' +
        '<button class="btn-primary" onclick="SocietyMaster.openAddForm();" style="padding:10px 24px;">Open Society Master</button>' +
        '<button class="btn-secondary" id="seed_sample_master" style="padding:10px 24px;border:1px solid var(--primary);color:var(--primary);">Seed Trial Data</button></div></div>';
      document.body.appendChild(guard);

      // Handle Sample Seeding from Overlay
      const seedBtn = guard.querySelector('#seed_sample_master');
      if (seedBtn) seedBtn.onclick = () => {
        if (!window.SampleDataSeeder) {
          const s = document.createElement('script');
          s.src = '../js/sample-data.js';
          s.onload = () => { SampleDataSeeder.seedAll(); location.reload(); };
          document.head.appendChild(s);
        } else {
          SampleDataSeeder.seedAll(); location.reload();
        }
      };
      // Auto-dismiss when a society is activated
      EventBus.on('society:updated', function() {
        var g = document.getElementById('society_guard_overlay');
        if (g && SocietyMaster.getActive()) g.remove();
      });
    }
  }

  // ── Initial renders (safe — only runs if element exists) ──
  SocietyMaster.render();
  GroupMaster.render();
  AccountMaster.render();
  MemberMaster.render();
  MemberBillMaster.renderGrid();
  OpeningBalanceMaster.renderTable();
  GSTMaster.render();

  console.log('🧠 Jeevika Masters Brain v1.0.1 loaded — Page: ' + page);
});

const FinancialYearMaster = {
  getAll() {
    let list = dbRead(DB.FINANCIAL_YEARS);
    if (!list || list.length === 0) {
        const activeSoc = SocietyMaster.getActive() || { code: '001', name: 'JEEVIKA SOCIETY' };
        list = [
            { id: 1, code: activeSoc.code, name: activeSoc.name, start: '01/04/2023', end: '31/03/2024' },
            { id: 2, code: activeSoc.code, name: activeSoc.name, start: '01/04/2024', end: '31/03/2025' },
            { id: 3, code: activeSoc.code, name: activeSoc.name, start: '01/04/2025', end: '31/03/2026', current: true }
        ];
        dbWrite(DB.FINANCIAL_YEARS, list);
    }
    return list;
  },
  setActive(id) {
    const list = this.getAll();
    const year = list.find(y => y.id == id);
    if (year) {
        const activeSoc = SocietyMaster.getActive();
        if (activeSoc) {
            activeSoc.financialYear = `${year.start} - ${year.end}`;
            dbWrite(DB.ACTIVE_SOCIETY, activeSoc);
            return true;
        }
    }
    return false;
  }
};

const VoucherTypeMaster = {
  getAll() {
    let list = dbRead(DB.VOUCHER_TYPES);
    if (!list || list.length === 0) {
        list = [
            { id: 3, type: 'Contra',  name: 'Contra',  shortName: 'Ctra', system: true, category: 'M' },
            { id: 4, type: 'Payment', name: 'BKCE',    shortName: 'BKCE', system: false, category: 'S' },
            { id: 5, type: 'Payment', name: 'Cash',    shortName: 'Cash', system: false, category: 'S' },
            { id: 1, type: 'Payment', name: 'Pymt',    shortName: 'Pymt', system: true, category: 'M' },
            { id: 2, type: 'Receipt', name: 'Rcpt',    shortName: 'Rcpt', system: true, category: 'M' }
        ];
        dbWrite(DB.VOUCHER_TYPES, list);
    }
    return list;
  },
  add(data) {
    const list = this.getAll();
    data.id = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    data.system = false;
    data.category = 'S';
    list.push(data);
    dbWrite(DB.VOUCHER_TYPES, list);
    return true;
  },
  update(id, data) {
    const list = this.getAll();
    const idx = list.findIndex(i => i.id === parseInt(id));
    if (idx > -1) {
        if (list[idx].system) return false;
        list[idx] = { ...list[idx], ...data };
        dbWrite(DB.VOUCHER_TYPES, list);
        return true;
    }
    return false;
  },
  delete(id) {
    const list = this.getAll();
    const idx = list.findIndex(i => i.id === parseInt(id));
    if (idx > -1) {
        if (list[idx].system) return false;
        list.splice(idx, 1);
        dbWrite(DB.VOUCHER_TYPES, list);
        return true;
    }
    return false;
  }
};

const DashboardSummary = {
  getStats() {
    const members = dbRead(DB.MEMBERS);
    const accounts = dbRead(DB.ACCOUNTS);
    const ledger = dbRead(DB.LEDGER);
    const invoices = dbRead(DB.INVOICES);

    // 1. Total Members
    const totalMembers = members.length;

    // 2. Bank Balance (Net of all transaction entries)
    const bankBal = ledger.reduce((sum, e) => sum + (parseFloat(e.dr) || 0) - (parseFloat(e.cr) || 0), 0);

    // 3. Pending Invoices (Total unpaid bills)
    const pendingInv = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);

    // 4. Monthly Profit (Placeholder for complex report)
    const profit = members.length * 1500; 

    return { 
        members: totalMembers, 
        accounts: accounts.length,
        bankBal: Math.abs(bankBal), 
        pending: pendingInv, 
        profit: profit, 
        socName: (dbReadObj(DB.ACTIVE_SOCIETY) || {}).name || 'Select Society'
    };
  }
};
