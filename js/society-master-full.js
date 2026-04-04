/* ════════════════════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — SOCIETY MASTER FULL FORM v2.0
   Replicates legacy Society Master Update form EXACTLY
   Layout: Left = Operational | Right = Legal + Output
   Popup: Resizable, Draggable, Adjustable
   ════════════════════════════════════════════════════════════════ */

const SocietyMasterFull = {

  // ═══ Enhanced PopupManager with RESIZE support ═══
  openResizablePopup(id, title, contentHTML, opts = {}) {
    const existing = document.getElementById('popup_' + id);
    if (existing) { PopupManager.focus(id); return existing; }

    const popup = document.createElement('div');
    popup.id = 'popup_' + id;
    popup.className = 'jv-popup jv-popup-resizable';
    const w = opts.width || '1060px';
    const h = opts.height || '720px';
    popup.style.cssText = `
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: ${w}; height: ${h};
      min-width: 600px; min-height: 400px;
      max-width: 98vw; max-height: 95vh;
      z-index: ${PopupManager.zBase + PopupManager.activePopups.length};
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 12px 60px rgba(45,27,105,0.28), 0 0 0 1px rgba(45,27,105,0.06);
      display: flex; flex-direction: column;
      overflow: hidden; resize: both;
    `;

    popup.innerHTML = `
      <div class="smf-header" style="
        background: linear-gradient(135deg, #2D1B69 0%, #4A2DAA 100%);
        color: #fff; padding: 10px 18px;
        display: flex; align-items: center; justify-content: space-between;
        cursor: move; user-select: none; flex-shrink: 0;
        border-bottom: 2px solid rgba(124,92,191,0.3);
      ">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">🏢</span>
          <span style="font-weight:700;font-size:15px;letter-spacing:-0.3px;">${title}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span class="smf-connection-badge" style="
            font-size:10px;padding:2px 8px;border-radius:10px;
            background:rgba(255,255,255,0.15);color:rgba(255,255,255,0.7);
          ">localStorage</span>
          <button onclick="SocietyMasterFull.toggleMaximize('${id}')" style="
            background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;
            font-size:14px;padding:4px 8px;border-radius:4px;
          ">⛶</button>
          <button onclick="PopupManager.close('${id}')" style="
            background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;
            font-size:18px;line-height:1;padding:2px 8px;border-radius:4px;
          ">&times;</button>
        </div>
      </div>
      <div class="smf-body" style="
        flex:1; overflow-y:auto; padding:0;
        background: #F4F1FB;
      ">${contentHTML}</div>
    `;

    document.body.appendChild(popup);
    PopupManager.activePopups.push(id);
    PopupManager.makeDraggable(popup);
    PopupManager.focus(id);

    // Check MongoDB connection
    if (typeof MongoSync !== 'undefined') {
      MongoSync.checkServer().then(online => {
        const badge = popup.querySelector('.smf-connection-badge');
        if (badge) {
          badge.textContent = online ? '🟢 MongoDB' : '🟡 localStorage';
          badge.style.background = online ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.15)';
        }
      });
    }
    return popup;
  },

  toggleMaximize(id) {
    const popup = document.getElementById('popup_' + id);
    if (!popup) return;
    if (popup.dataset.maximized === '1') {
      popup.style.cssText = popup.dataset.prevStyle;
      popup.dataset.maximized = '0';
    } else {
      popup.dataset.prevStyle = popup.style.cssText;
      popup.dataset.maximized = '1';
      popup.style.cssText = `
        position:fixed;top:0;left:0;width:100vw;height:100vh;
        z-index:${parseInt(popup.style.zIndex)||2000};
        background:#fff;border-radius:0;
        box-shadow:none;display:flex;flex-direction:column;overflow:hidden;
        transform:none;
      `;
    }
  },

  // ═══ OPEN THE FULL SOCIETY MASTER FORM ═══
  openForm(code) {
    var data = code ? SocietyMaster.getAll().find(s => s.code === code) : {};
    if (code && !data) { showToast('Society not found', 'error'); return; }
    data = data || {};

    var popupId = code ? 'society_full_' + code : 'society_full_new';
    var title = code ? 'Society Master Update — ' + (data.name || code) : 'Society Master — Add New';

    this.openResizablePopup(popupId, title, this.buildFullForm(data), {
      width: '1080px', height: '740px'
    });

    // Bind all events after render
    setTimeout(() => this.bindAllEvents(popupId, code), 80);
  },

  // ═══ BUILD THE FULL TWO-PANEL FORM ═══
  buildFullForm(d) {
    d = d || {};
    // Ensure sub-objects exist
    d.shareCapital = d.shareCapital || {};
    d.balanceSheetFooter = d.balanceSheetFooter || [];
    d.billingRemarksCol1 = d.billingRemarksCol1 || [];
    d.billingRemarksCol2 = d.billingRemarksCol2 || { lines: [] };
    d.signatures = d.signatures || {};
    d.blastPanel = d.blastPanel || {};

    return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:100%;">
      
      <!-- ═══════════════ LEFT PANEL ═══════════════ -->
      <div style="padding:16px 18px;border-right:2px solid #E2DCF5;overflow-y:auto;background:#fff;">
        
        <!-- SOCIETY DETAILS -->
        ${this._sectionHeader('🏢', 'Society Details')}
        <div class="smf-grid2">
          ${this._field('Regn. No.', 'registrationNo', d.registrationNo, 'full')}
          ${this._field('Address', 'address', d.address, 'full', 'textarea')}
          ${this._field('Email Id', 'email', d.email)}
          ${this._field('Contact No', 'contactNo', d.contactNo)}
          ${this._field('GSTIN', 'gstin', d.gstin)}
          ${this._field('P.T.No', 'ptNo', d.ptNo || '')}
          ${this._field('PAN', 'pan', d.pan)}
          ${this._field('TAN', 'tan', d.tan)}
          <div class="smf-field">
            <label class="smf-label">Area Unit</label>
            <select class="smf-input" name="areaUnit">
              <option value="sqft" ${d.areaUnit==='sqft'?'selected':''}>Sq.Ft</option>
              <option value="sqmtr" ${d.areaUnit==='sqmtr'?'selected':''}>Sq.Mtr</option>
            </select>
          </div>
          ${this._field('Message', 'message', d.message || '', 'full')}
        </div>

        <!-- INTEREST SETTING DETAILS -->
        ${this._sectionHeader('📊', 'Interest Setting Details')}
        <div class="smf-grid2">
          <div class="smf-field">
            <label class="smf-label">Method</label>
            <select class="smf-input" name="interestMethod">
              <option value="monthly" ${d.interestMethod==='monthly'?'selected':''}>Monthly</option>
              <option value="quarterly" ${d.interestMethod==='quarterly'?'selected':''}>Quarterly</option>
              <option value="yearly" ${d.interestMethod==='yearly'?'selected':''}>Yearly</option>
            </select>
          </div>
          ${this._field('Rate', 'interestRate', d.interestRate || 21, '', 'number')}
          <div class="smf-field">
            <label class="smf-label">Type</label>
            <select class="smf-input" name="interestType">
              <option value="simple" ${d.interestType==='simple'?'selected':''}>Simple</option>
              <option value="compound" ${d.interestType==='compound'?'selected':''}>Compound</option>
            </select>
          </div>
          ${this._field('Rounded upto', 'roundedUpto', d.roundedUpto || 0, '', 'number')}
          <div class="smf-field">
            <label class="smf-label">Priority</label>
            <select class="smf-input" name="interestPriority">
              <option value="interest_first" ${d.interestPriority==='interest_first'?'selected':''}>Interest First</option>
              <option value="principal_first" ${d.interestPriority==='principal_first'?'selected':''}>Principal First</option>
            </select>
          </div>
        </div>

        <!-- BILLING CYCLE INFO -->
        ${this._sectionHeader('📅', 'Billing Cycle Info')}
        <div class="smf-grid2">
          <div class="smf-field">
            <label class="smf-label">Method</label>
            <select class="smf-input" name="billingMethod">
              <option value="monthly" ${d.billingMethod==='monthly'?'selected':''}>Monthly</option>
              <option value="quarterly" ${d.billingMethod==='quarterly'?'selected':''}>Quarterly</option>
              <option value="annual" ${d.billingMethod==='annual'?'selected':''}>Annual</option>
            </select>
          </div>
          ${this._field('No. of Months', 'noOfMonths', d.noOfMonths || 1, '', 'number')}
          ${this._field('Bill Date', 'billDate', d.billDate || 1, '', 'number')}
          ${this._field('Period', 'period', d.period || '')}
          ${this._field('Due Date', 'dueDate', d.dueDate || 20, '', 'number')}
          ${this._field('Particular', 'particular', d.particular || '')}
        </div>

        <!-- GST -->
        <div style="margin:10px 0;padding:8px 12px;background:linear-gradient(135deg,#EDE8F8,#F4F1FB);border-radius:8px;border:1px solid #E2DCF5;">
          <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px;font-weight:600;color:#2D1B69;">
            <input type="checkbox" name="gstEnabled" ${d.gstEnabled?'checked':''} style="width:16px;height:16px;accent-color:#2D1B69;">
            GST Enabled
            <span style="font-size:11px;color:#EF4444;font-weight:400;">⚠ Affects billing system-wide</span>
          </label>
        </div>

        <!-- PARKING / NOC -->
        ${this._sectionHeader('🚗', 'Parking / NOC Charges Info')}
        <div class="smf-grid2">
          ${this._field('Parking', 'parking', d.parking || '')}
          ${this._field('NOC', 'nocCharges', d.nocCharges || '')}
        </div>

        <!-- SIGNATURE DETAILS -->
        ${this._sectionHeader('✍️', 'Signature Details')}
        <table class="smf-sig-table">
          <thead>
            <tr><th style="width:90px;"></th><th>Chairman</th><th>Secretary</th><th>Treasurer</th></tr>
          </thead>
          <tbody>
            <tr>
              <td class="smf-sig-label">Voucher</td>
              <td><input class="smf-input" name="sig_voucher_chairman" value="${d.signatures.chairmanName || d.chairmanName || ''}"></td>
              <td><input class="smf-input" name="sig_voucher_secretary" value="${d.signatures.secretaryName || d.secretaryName || ''}"></td>
              <td><input class="smf-input" name="sig_voucher_treasurer" value="${d.signatures.treasurerName || d.treasurerName || ''}"></td>
            </tr>
            <tr>
              <td class="smf-sig-label">Bill / Receipt</td>
              <td><input class="smf-input" name="sig_bill_chairman" value="${d.signatures.chairmanLabel || 'Hon.Chairman'}"></td>
              <td><input class="smf-input" name="sig_bill_secretary" value="${d.signatures.secretaryLabel || 'Hon.Secretary'}"></td>
              <td><input class="smf-input" name="sig_bill_treasurer" value="${d.signatures.treasurerLabel || 'Hon.Treasurer'}"></td>
            </tr>
          </tbody>
        </table>

        <!-- CONTACT PERSON DETAILS -->
        ${this._sectionHeader('👤', 'Contact Person Details')}
        <div class="smf-grid2">
          ${this._field('Person 1', 'contactPerson1', d.contactPerson1 || '')}
          ${this._field('Person 2', 'contactPerson2', d.contactPerson2 || '')}
        </div>

      </div>

      <!-- ═══════════════ RIGHT PANEL ═══════════════ -->
      <div style="padding:16px 18px;overflow-y:auto;background:#FAFAFE;">

        <!-- AUTHORISED SHARE CAPITAL -->
        ${this._sectionHeader('📜', 'Authorised Share Capital Details', '#B91C1C')}
        <div class="smf-share-capital" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px;margin-bottom:14px;">
          <div class="smf-grid2">
            <div class="smf-field" style="grid-column:1/-1;">
              <label class="smf-label">Name</label>
              <input class="smf-input" name="sc_name" value="${d.shareCapital.totalShares ? d.shareCapital.totalShares + ' Shares Of Rs. ' + (d.shareCapital.valuePerShare || 50) + '/- Each' : '2000 Shares Of Rs. 50/- Each'}" style="font-weight:600;">
            </div>
            <div class="smf-field">
              <label class="smf-label">Amount (₹)</label>
              <input class="smf-input" name="sc_amount" type="number" value="${d.shareCapital.totalAmount || 100000}" style="font-weight:700;color:#B91C1C;font-size:15px;">
            </div>
          </div>
        </div>

        <!-- BALANCE SHEET FOOTER -->
        ${this._sectionHeader('📄', 'Balance Sheet Footer')}
        <div style="margin-bottom:14px;">
          ${this._remarkLines('bsf', d.balanceSheetFooter, 6, true)}
        </div>

        <!-- BILLING REMARK (COLUMN 1) -->
        ${this._sectionHeader('📝', 'Billing Remark (Column 1)')}
        <div style="margin-bottom:10px;">
          ${this._remarkLines('br1', d.billingRemarksCol1, 6, true)}
          <div style="display:flex;align-items:center;gap:16px;margin-top:6px;">
            <label class="smf-label" style="margin:0;white-space:nowrap;">Linewise Remark</label>
            <select class="smf-input" name="linewiseRemark" style="width:70px;">
              <option value="yes" ${d.linewiseRemark !== false?'selected':''}>Yes</option>
              <option value="no" ${d.linewiseRemark === false?'selected':''}>No</option>
            </select>
          </div>
        </div>

        <!-- BILLING REMARK (COLUMN 2) -->
        ${this._sectionHeader('📝', 'Billing Remark (Column 2)', '#7C3AED')}
        <div style="font-size:10px;color:#7C3AED;font-weight:600;margin:-8px 0 6px;padding:2px 8px;background:#EDE9FE;border-radius:4px;display:inline-block;">Not Print on Half Page Bill</div>
        <div style="margin-bottom:10px;">
          ${this._remarkLines('br2', (d.billingRemarksCol2 && d.billingRemarksCol2.lines) || [], 6, true)}
          <div style="display:flex;align-items:center;gap:16px;margin-top:6px;flex-wrap:wrap;">
            <label class="smf-label" style="margin:0;white-space:nowrap;">Linewise Remark</label>
            <select class="smf-input" name="br2_linewiseRemark" style="width:70px;">
              <option value="yes">Yes</option>
              <option value="no" selected>No</option>
            </select>
            <label class="smf-label" style="margin:0;white-space:nowrap;">Print In 2 Columns</label>
            <select class="smf-input" name="br2_printIn2Columns" style="width:70px;">
              <option value="no" ${(!d.billingRemarksCol2 || !d.billingRemarksCol2.printIn2Columns)?'selected':''}>No</option>
              <option value="yes" ${(d.billingRemarksCol2 && d.billingRemarksCol2.printIn2Columns)?'selected':''}>Yes</option>
            </select>
          </div>
        </div>

        <!-- BLAST PANEL -->
        ${this._sectionHeader('🚀', 'Blast Panel — Communication Control', '#D97706')}
        <div class="smf-blast-panel" style="background:linear-gradient(135deg,#FFFBEB,#FEF3C7);border:1px solid #FDE68A;border-radius:8px;padding:12px;margin-bottom:14px;">
          <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:10px;">
            ${this._blastToggle('blast_whatsapp', '💬 WhatsApp', d.blastPanel.whatsappEnabled)}
            ${this._blastToggle('blast_email', '📧 Email', d.blastPanel.emailEnabled)}
            ${this._blastToggle('blast_sms', '📱 SMS', d.blastPanel.smsEnabled)}
            ${this._blastToggle('blast_push', '🔔 Push', d.blastPanel.pushEnabled)}
          </div>
          <div class="smf-field" style="margin-bottom:0;">
            <label class="smf-label">Default Blast Message</label>
            <textarea class="smf-input" name="blast_message" rows="2" placeholder="Type default message for communication blast...">${d.blastPanel.defaultMessage || ''}</textarea>
          </div>
        </div>

      </div>
    </div>

    <!-- FOOTER BUTTONS -->
    <div style="
      padding:10px 20px; border-top:2px solid #E2DCF5;
      display:flex; gap:10px; justify-content:flex-end; align-items:center;
      background:#fff; flex-shrink:0;
    ">
      <span style="flex:1;font-size:11px;color:#9B95B5;">
        ${d.code ? '📝 Editing: ' + d.code + ' — ' + (d.name||'') : '➕ Creating new society'}
      </span>
      <button class="btn-primary" id="smf_update_btn" style="padding:9px 28px;font-size:13px;">
        ${d.code ? '💾 Update' : '💾 Save'}
      </button>
      <button class="btn-secondary" id="smf_exit_btn" style="padding:9px 28px;font-size:13px;">
        Exit
      </button>
    </div>
    `;
  },

  // ═══ HELPER: Section Header ═══
  _sectionHeader(icon, title, color) {
    color = color || '#2D1B69';
    return `<div style="
      display:flex;align-items:center;gap:8px;
      margin:12px 0 8px;padding-bottom:4px;
      border-bottom:2px solid ${color}22;
    ">
      <span style="font-size:15px;">${icon}</span>
      <span style="font-size:13px;font-weight:700;color:${color};letter-spacing:-0.2px;">${title}</span>
    </div>`;
  },

  // ═══ HELPER: Form Field ═══
  _field(label, name, value, span, type) {
    type = type || 'text';
    var spanStyle = span === 'full' ? 'grid-column:1/-1;' : '';
    value = value !== undefined && value !== null ? value : '';
    if (type === 'textarea') {
      return `<div class="smf-field" style="${spanStyle}">
        <label class="smf-label">${label}</label>
        <textarea class="smf-input" name="${name}" rows="2">${value}</textarea>
      </div>`;
    }
    return `<div class="smf-field" style="${spanStyle}">
      <label class="smf-label">${label}</label>
      <input class="smf-input" name="${name}" type="${type}" value="${value}">
    </div>`;
  },

  // ═══ HELPER: Remark Lines (1-6) with Bold checkbox ═══
  _remarkLines(prefix, dataArr, count, showBold) {
    var html = '<table class="smf-remark-table"><tbody>';
    for (var i = 0; i < count; i++) {
      var lineData = dataArr[i] || {};
      var text = lineData.text || '';
      var bold = lineData.bold || false;
      html += `<tr>
        <td style="width:24px;padding:2px 4px;font-size:11px;color:#9B95B5;text-align:right;vertical-align:middle;">${i + 1}.</td>
        <td style="padding:2px 3px;"><input class="smf-input smf-remark-input" name="${prefix}_line_${i}" value="${this._escHtml(text)}"></td>`;
      if (showBold) {
        html += `<td style="width:44px;padding:2px 4px;text-align:center;vertical-align:middle;">
          <label style="display:flex;align-items:center;gap:3px;cursor:pointer;font-size:10px;color:#7C5CBF;white-space:nowrap;">
            <input type="checkbox" name="${prefix}_bold_${i}" ${bold?'checked':''} style="width:13px;height:13px;accent-color:#2D1B69;">
            <span>Bold</span>
          </label>
        </td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  },

  // ═══ HELPER: Blast Toggle ═══
  _blastToggle(name, label, checked) {
    return `<label style="
      display:flex;align-items:center;gap:6px;cursor:pointer;
      padding:5px 10px;border-radius:6px;font-size:12px;font-weight:600;
      background:${checked ? '#DCFCE7' : '#F5F3FF'};
      border:1px solid ${checked ? '#86EFAC' : '#E2DCF5'};
      color:${checked ? '#166534' : '#5A5380'};
      transition:all 0.2s;
    ">
      <input type="checkbox" name="${name}" ${checked?'checked':''} style="width:14px;height:14px;accent-color:#22C55E;"
        onchange="this.closest('label').style.background=this.checked?'#DCFCE7':'#F5F3FF';this.closest('label').style.borderColor=this.checked?'#86EFAC':'#E2DCF5';this.closest('label').style.color=this.checked?'#166534':'#5A5380';">
      ${label}
    </label>`;
  },

  _escHtml(str) {
    return String(str||'').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },

  // ═══ COLLECT ALL FORM DATA ═══
  collectFullForm(popup) {
    var body = popup.querySelector('.smf-body');
    if (!body) return {};

    // Basic fields
    var data = {};
    body.querySelectorAll('[name]').forEach(el => {
      if (el.type === 'checkbox') data[el.name] = el.checked;
      else if (el.type === 'number') data[el.name] = parseFloat(el.value) || 0;
      else data[el.name] = el.value.trim();
    });

    // Parse share capital from name field
    var scName = data.sc_name || '';
    var scMatch = scName.match(/(\d+)\s*Shares?\s*Of\s*Rs\.?\s*(\d+)/i);
    data.shareCapital = {
      totalShares: scMatch ? parseInt(scMatch[1]) : 0,
      valuePerShare: scMatch ? parseInt(scMatch[2]) : 0,
      totalAmount: data.sc_amount || 0,
      paidUpShares: 0,
      paidUpAmount: 0
    };

    // Balance Sheet Footer lines
    data.balanceSheetFooter = [];
    for (var i = 0; i < 6; i++) {
      var text = data['bsf_line_' + i] || '';
      var bold = data['bsf_bold_' + i] || false;
      if (text) data.balanceSheetFooter.push({ text, bold });
    }

    // Billing Remarks Col 1
    data.billingRemarksCol1 = [];
    for (var i = 0; i < 6; i++) {
      var text = data['br1_line_' + i] || '';
      var bold = data['br1_bold_' + i] || false;
      if (text) data.billingRemarksCol1.push({ text, bold });
    }
    data.linewiseRemark = data.linewiseRemark === 'yes';

    // Billing Remarks Col 2
    var col2Lines = [];
    for (var i = 0; i < 6; i++) {
      var text = data['br2_line_' + i] || '';
      var bold = data['br2_bold_' + i] || false;
      if (text) col2Lines.push({ text, bold });
    }
    data.billingRemarksCol2 = {
      lines: col2Lines,
      notPrintOnHalfPageBill: true,
      printIn2Columns: data.br2_printIn2Columns === 'yes'
    };

    // Signatures
    data.signatures = {
      chairmanName: data.sig_voucher_chairman || '',
      chairmanLabel: data.sig_bill_chairman || 'Hon.Chairman',
      secretaryName: data.sig_voucher_secretary || '',
      secretaryLabel: data.sig_bill_secretary || 'Hon.Secretary',
      treasurerName: data.sig_voucher_treasurer || '',
      treasurerLabel: data.sig_bill_treasurer || 'Hon.Treasurer',
      showOnBills: true,
      showOnReports: true,
      showOnReceipts: true
    };

    // Blast Panel
    data.blastPanel = {
      enabled: data.blast_whatsapp || data.blast_email || data.blast_sms || data.blast_push,
      whatsappEnabled: data.blast_whatsapp || false,
      emailEnabled: data.blast_email || false,
      smsEnabled: data.blast_sms || false,
      pushEnabled: data.blast_push || false,
      defaultMessage: data.blast_message || ''
    };

    // Also store chairmanName, secretaryName, treasurerName at top level for backward compat
    data.chairmanName = data.signatures.chairmanName;
    data.secretaryName = data.signatures.secretaryName;
    data.treasurerName = data.signatures.treasurerName;

    // Clean up temp keys
    var tempPrefixes = ['bsf_', 'br1_', 'br2_', 'sc_', 'sig_', 'blast_'];
    Object.keys(data).forEach(k => {
      for (var p of tempPrefixes) { if (k.startsWith(p)) { delete data[k]; break; } }
    });

    return data;
  },

  // ═══ BIND ALL FORM EVENTS ═══
  bindAllEvents(popupId, editCode) {
    var popup = document.getElementById('popup_' + popupId);
    if (!popup) return;

    // Share Capital auto-calculate
    var scNameInput = popup.querySelector('input[name="sc_name"]');
    var scAmountInput = popup.querySelector('input[name="sc_amount"]');
    if (scNameInput && scAmountInput) {
      scNameInput.addEventListener('input', function() {
        var match = scNameInput.value.match(/(\d+)\s*Shares?\s*Of\s*Rs\.?\s*(\d+)/i);
        if (match) {
          scAmountInput.value = parseInt(match[1]) * parseInt(match[2]);
        }
      });
    }

    // Update button
    var updateBtn = popup.querySelector('#smf_update_btn');
    if (updateBtn) {
      updateBtn.addEventListener('click', () => {
        var data = this.collectFullForm(popup);
        if (!data.registrationNo && !editCode) {
          // For new society, need a code
          var code = prompt('Enter Society Code (e.g., SOC001):');
          if (!code) return;
          data.code = code.toUpperCase();
        }
        if (editCode) data.code = editCode;

        // Need name
        if (!data.name) data.name = data.registrationNo || data.code || 'New Society';

        var ok;
        if (editCode) {
          ok = SocietyMaster.update(editCode, data);
        } else {
          if (!data.code) { showToast('Society code is required', 'error'); return; }
          ok = SocietyMaster.add(data);
        }

        if (ok) {
          // Sync to MongoDB
          if (typeof MongoSync !== 'undefined' && MongoSync.isOnline) {
            if (editCode) {
              MongoSync.updateSociety(editCode, data);
            } else {
              MongoSync.saveSociety(data);
            }
          }
          showToast('Society saved successfully!', 'success');
          PopupManager.close(popupId);
          SocietyMaster.render();
        }
      });
    }

    // Exit button
    var exitBtn = popup.querySelector('#smf_exit_btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => PopupManager.close(popupId));
    }
  }
};

// ═══ CSS INJECTION: Society Master Full Form Styles ═══
(function() {
  var style = document.createElement('style');
  style.textContent = `
    /* ── Society Master Full Form Styles ── */
    .smf-grid2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 10px;
      margin-bottom: 10px;
    }
    .smf-field {
      margin-bottom: 4px;
    }
    .smf-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #5A5380;
      margin-bottom: 2px;
      letter-spacing: 0.2px;
    }
    .smf-input {
      width: 100%;
      padding: 5px 8px;
      border: 1px solid #C4BAE8;
      border-radius: 5px;
      font-size: 12px;
      font-family: inherit;
      color: #1A0F4F;
      background: #fff;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .smf-input:focus {
      border-color: #7C5CBF;
      box-shadow: 0 0 0 2px rgba(124,92,191,0.12);
    }
    textarea.smf-input {
      resize: vertical;
      min-height: 36px;
    }
    .smf-remark-table {
      width: 100%;
      border-collapse: collapse;
    }
    .smf-remark-table td {
      padding: 1px 2px;
    }
    .smf-remark-input {
      padding: 4px 6px !important;
      font-size: 11px !important;
    }
    .smf-sig-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }
    .smf-sig-table th {
      font-size: 11px;
      font-weight: 600;
      color: #5A5380;
      padding: 4px 4px;
      text-align: left;
      border-bottom: 1px solid #E2DCF5;
    }
    .smf-sig-table td {
      padding: 3px 3px;
    }
    .smf-sig-table input {
      padding: 4px 6px !important;
      font-size: 11px !important;
    }
    .smf-sig-label {
      font-size: 11px;
      font-weight: 600;
      color: #7C5CBF;
      white-space: nowrap;
    }

    /* Popup resizable */
    .jv-popup-resizable {
      resize: both;
      overflow: hidden;
    }
    .jv-popup-resizable::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 16px;
      cursor: nwse-resize;
      background: linear-gradient(135deg, transparent 50%, #C4BAE8 50%);
      border-radius: 0 0 12px 0;
    }
    
    /* MongoDB connection indicators */
    .mongo-connected .smf-connection-badge {
      background: rgba(34,197,94,0.25) !important;
      color: #fff !important;
    }
  `;
  document.head.appendChild(style);
})();
