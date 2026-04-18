/* ═══════════════════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — UNIVERSAL EXPORT ENGINE v1.0
   Formats: PDF (print-based), Excel (.xlsx via SheetJS), CSV
   Usage: ExportManager.show(data, columns, title, opts)
   ═══════════════════════════════════════════════════════════════ */

const ExportManager = {

  _sheetJSLoaded: false,

  // ── Load SheetJS dynamically ──
  async _loadSheetJS() {
    if (this._sheetJSLoaded || typeof XLSX !== 'undefined') { this._sheetJSLoaded = true; return; }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      s.onload = () => { this._sheetJSLoaded = true; resolve(); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  // ── Show Export Modal ──
  show(data, columns, title, opts) {
    opts = opts || {};
    this._pendingExport = { data, columns, title, opts };
    const existing = document.getElementById('__exportModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = '__exportModal';
    modal.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.5);
      z-index:9999;display:flex;align-items:center;justify-content:center;
    `;
    modal.innerHTML = `
      <div style="background:#fff;border-radius:14px;padding:28px;width:420px;
        box-shadow:0 10px 50px rgba(45,27,105,.28);font-family:inherit">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
          <h3 style="font-size:16px;font-weight:800;color:#2D1B69;margin:0">📤 Export ${title||'Report'}</h3>
          <button onclick="document.getElementById('__exportModal').remove()"
            style="background:none;border:none;font-size:22px;cursor:pointer;color:#888;line-height:1">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
          <div>
            <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Export Format</label>
            <select id="__exp_fmt" style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit">
              <option value="pdf">📄 PDF</option>
              <option value="xlsx">📊 Excel (.xlsx)</option>
              <option value="xls">📋 Excel (.xls)</option>
              <option value="csv">📝 CSV</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Paper Size</label>
            <select id="__exp_paper" style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit">
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="A5">A5</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Orientation</label>
            <select id="__exp_orient" style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit">
              <option value="Portrait">Portrait</option>
              <option value="Landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Font Size (pt)</label>
            <input id="__exp_font" type="number" value="10" min="7" max="16"
              style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit">
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Margin (mm)</label>
            <input id="__exp_margin" type="number" value="10" min="0" max="50"
              style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit">
          </div>
          <div>
            <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Line Spacing</label>
            <select id="__exp_ls" style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit">
              <option value="1">Single</option>
              <option value="1.2" selected>1.2</option>
              <option value="1.5">1.5</option>
              <option value="2">Double</option>
            </select>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;padding:10px 12px;background:#F4F1FB;border-radius:8px">
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer">
            <input type="checkbox" id="__exp_hdr" checked style="accent-color:#2D1B69">
            Include Society Header
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer">
            <input type="checkbox" id="__exp_totals" checked style="accent-color:#2D1B69">
            Include Grand Total Row
          </label>
          <label style="display:flex;align-items:center;gap:8px;font-size:12px;cursor:pointer">
            <input type="checkbox" id="__exp_date" checked style="accent-color:#2D1B69">
            Include Export Date/Time
          </label>
        </div>

        <div style="margin-bottom:16px">
          <label style="display:block;font-size:11px;font-weight:700;color:#5A5380;margin-bottom:4px">Custom Report Title</label>
          <input id="__exp_title" type="text" value="${title||''}"
            style="width:100%;padding:8px 10px;border:1px solid #C4BAE8;border-radius:6px;font-size:13px;font-family:inherit;box-sizing:border-box">
        </div>

        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button onclick="document.getElementById('__exportModal').remove()"
            style="padding:9px 22px;border:1px solid #C4BAE8;border-radius:7px;background:#fff;font-size:13px;font-family:inherit;cursor:pointer">
            Cancel
          </button>
          <button id="__exp_btn"
            style="padding:9px 22px;border:none;border-radius:7px;background:#2D1B69;color:#fff;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer">
            📤 Export
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('__exp_btn').onclick = () => this._doExport();

    // Show/hide PDF-only options based on format
    document.getElementById('__exp_fmt').onchange = function() {
      const isPDF = this.value === 'pdf';
      ['__exp_paper','__exp_orient','__exp_font','__exp_margin','__exp_ls'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.closest('div').style.opacity = isPDF ? '1' : '0.4';
      });
    };
  },

  async _doExport() {
    const { data, columns, opts } = this._pendingExport;
    const format = document.getElementById('__exp_fmt').value;
    const paper = document.getElementById('__exp_paper').value;
    const orient = document.getElementById('__exp_orient').value;
    const fontSize = document.getElementById('__exp_font').value;
    const margin = document.getElementById('__exp_margin').value;
    const lineSpacing = document.getElementById('__exp_ls').value;
    const incHdr = document.getElementById('__exp_hdr').checked;
    const incTotals = document.getElementById('__exp_totals').checked;
    const incDate = document.getElementById('__exp_date').checked;
    const title = document.getElementById('__exp_title').value;

    document.getElementById('__exportModal').remove();

    const cfg = JSON.parse(localStorage.getItem('jeevika_bill_print_config') || '{}');
    const societyName = cfg.line1 || (typeof SocietyMaster !== 'undefined' ? SocietyMaster.getActive()?.name : '') || 'Society';

    if (format === 'csv') {
      this._exportCSV(data, columns, title);
    } else if (format === 'xlsx' || format === 'xls') {
      await this._exportExcel(data, columns, title, format, societyName, incHdr, incDate);
    } else {
      this._exportPDF(data, columns, title, { paper, orient, fontSize, margin, lineSpacing, incHdr, incTotals, incDate, societyName, cfg });
    }
  },

  // ── CSV Export ──
  _exportCSV(data, columns, title) {
    const rows = [];
    rows.push(columns.map(c => `"${c.label||c.key}"`).join(','));
    data.forEach(row => {
      rows.push(columns.map(c => `"${(row[c.key]||'').toString().replace(/"/g,'""')}"`).join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = (title||'export').replace(/\s+/g,'-').toLowerCase() + '.csv';
    a.click(); URL.revokeObjectURL(url);
    if (typeof showToast === 'function') showToast('CSV exported successfully', 'success');
  },

  // ── Excel Export (SheetJS) ──
  async _exportExcel(data, columns, title, format, societyName, incHdr, incDate) {
    try {
      await this._loadSheetJS();
      const wb = XLSX.utils.book_new();
      const wsData = [];

      if (incHdr) {
        wsData.push([societyName]);
        wsData.push([title]);
        if (incDate) wsData.push(['Exported: ' + new Date().toLocaleString('en-IN')]);
        wsData.push([]);
      }
      wsData.push(columns.map(c => c.label || c.key));
      data.forEach(row => {
        wsData.push(columns.map(c => {
          const v = row[c.key];
          return (c.type === 'number' || c.numeric) ? (parseFloat(v)||0) : (v||'');
        }));
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Style header row
      const hdrRow = incHdr ? (incDate ? 4 : 3) : 0;
      columns.forEach((_, ci) => {
        const cellRef = XLSX.utils.encode_cell({ r: hdrRow, c: ci });
        if (ws[cellRef]) {
          ws[cellRef].s = { font: { bold: true }, fill: { fgColor: { rgb: 'E2DCF5' } } };
        }
      });

      // Auto column width
      ws['!cols'] = columns.map(c => ({ wch: Math.max((c.label||c.key).length + 4, 15) }));

      XLSX.utils.book_append_sheet(wb, ws, title.substring(0,30)||'Report');
      const ext = format === 'xls' ? 'xls' : 'xlsx';
      const bType = format === 'xls' ? 'biff8' : 'xlsx';
      XLSX.writeFile(wb, (title||'export').replace(/\s+/g,'-').toLowerCase() + '.' + ext);
      if (typeof showToast === 'function') showToast(`Excel (${ext}) exported successfully`, 'success');
    } catch(e) {
      console.error('Excel export error:', e);
      if (typeof showToast === 'function') showToast('Excel export failed — trying PDF', 'warning');
    }
  },

  // ── PDF Export (print-based) ──
  _exportPDF(data, columns, title, cfg) {
    const { paper, orient, fontSize, margin, lineSpacing, incHdr, incTotals, incDate, societyName, cfg: billCfg } = cfg;
    const headerHtml = incHdr ? `
      <div style="text-align:center;margin-bottom:10px">
        <strong style="font-size:${parseInt(fontSize)+3}pt">${societyName}</strong><br>
        <span style="font-size:${parseInt(fontSize)-1}pt">${billCfg?.line2||''}</span>
      </div>` : '';
    const dateHtml = incDate ? `<p style="text-align:right;font-size:${parseInt(fontSize)-2}pt;color:#666">Exported: ${new Date().toLocaleString('en-IN')}</p>` : '';

    const thead = `<tr>${columns.map(c=>`<th>${c.label||c.key}</th>`).join('')}</tr>`;
    const tbody = data.map(row =>
      `<tr>${columns.map(c=>`<td style="${c.align==='right'?'text-align:right':''}">${row[c.key]||''}</td>`).join('')}</tr>`
    ).join('');

    let totalRow = '';
    if (incTotals) {
      totalRow = `<tr style="font-weight:bold;background:#e8f4fd">
        ${columns.map((c,i)=> i===0?`<td>TOTAL</td>`:`<td style="text-align:right">${c.numeric?data.reduce((s,r)=>s+(parseFloat(r[c.key])||0),0).toLocaleString('en-IN',{minimumFractionDigits:2}):''}</td>`).join('')}
      </tr>`;
    }

    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${title}</title>
      <style>
        body{font-family:Arial,sans-serif;font-size:${fontSize}pt;line-height:${lineSpacing};margin:${margin}mm}
        table{width:100%;border-collapse:collapse}
        td,th{border:1px solid #888;padding:3px 6px;font-size:${fontSize}pt}
        th{background:#e0e0e0;font-weight:bold}
        h2{text-align:center;margin:6px 0;font-size:${parseInt(fontSize)+3}pt}
        @media print{@page{size:${paper} ${orient};margin:${margin}mm}}
      </style></head><body>
      ${headerHtml}
      <h2>${title}</h2>
      ${dateHtml}
      <table><thead>${thead}</thead><tbody>${tbody}${totalRow}</tbody></table>
      <script>window.onload=function(){window.print()}<\/script>
    </body></html>`);
    win.document.close();
  }
};
