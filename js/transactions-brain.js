/** ════════════════════════════════════════════════════════════════
    TransactionsBrain — Core Transaction Logic for Jeevika ERP
    ════════════════════════════════════════════════════════════════ */

const TRANS_DB = {
  DEBIT_NOTES:      'jeevika_debit_notes',
  CREDIT_NOTES:     'jeevika_credit_notes',
  CHEQUE_RETURNS:   'jeevika_cheque_returns',
  MEMBER_JOURNALS:  'jeevika_member_journals',
  RCPT_VOUCHERS:    'jeevika_rcpt_vouchers',
  PYMT_VOUCHERS:    'jeevika_pymt_vouchers',
  CONTRA_VOUCHERS:  'jeevika_contra_vouchers',
  JOURNAL_VOUCHERS: 'jeevika_journal_vouchers',
  BANK_RECO:        'jeevika_bank_reco',
  QUICK_NOTES:      'jeevika_quick_notes',
  MEMBER_RECEIPTS:  'jeevika_member_receipts',
};

const TransactionsBrain = {
  read(key) { return JSON.parse(localStorage.getItem(key) || '[]'); },
  write(key, data) { localStorage.setItem(key, JSON.stringify(data)); },

  // --- GENERIC GET/SAVE/DELETE ---
  get(key) { return this.read(key); },
  save(key, item, idField = 'no') {
    const data = this.read(key);
    const idx = data.findIndex(i => i[idField] === item[idField]);
    if (idx > -1) data[idx] = item; else data.push(item);
    this.write(key, data);
    return true;
  },
  delete(key, ids, idField = 'no') {
    let data = this.read(key);
    data = data.filter(i => !ids.includes(i[idField]));
    this.write(key, data);
    return true;
  },

  // --- SPECIALIZED WRAPPERS ---
  getDebitNotes() { return this.get(TRANS_DB.DEBIT_NOTES); },
  saveDebitNote(note) { this.save(TRANS_DB.DEBIT_NOTES, note); this.updateMemberLedger(note, 'debit', 'Debit Note'); },
  
  getCreditNotes() { return this.get(TRANS_DB.CREDIT_NOTES); },
  saveCreditNote(note) { this.save(TRANS_DB.CREDIT_NOTES, note); this.updateMemberLedger(note, 'credit', 'Credit Note'); },

  getChequeReturns() { return this.get(TRANS_DB.CHEQUE_RETURNS); },
  saveChequeReturn(entry) { this.save(TRANS_DB.CHEQUE_RETURNS, entry); this.updateMemberLedger(entry, 'debit', 'MAdj'); },

  getMemberJournals() { return this.get(TRANS_DB.MEMBER_JOURNALS); },
  saveMemberJournal(journal) {
    this.save(TRANS_DB.MEMBER_JOURNALS, journal);
    this.updateMemberLedger(journal, 'debit', 'MJournal', journal.memberCode);
    this.updateMemberLedger(journal, 'credit', 'MJournal', journal.toMemberCode);
  },

  getVouchers(type) { 
    const k = type === 'receipt' ? TRANS_DB.RCPT_VOUCHERS : type === 'payment' ? TRANS_DB.PYMT_VOUCHERS : TRANS_DB.CONTRA_VOUCHERS;
    return this.get(k); 
  },
  saveVoucher(voucher, type) {
    const k = type === 'receipt' ? TRANS_DB.RCPT_VOUCHERS : type === 'payment' ? TRANS_DB.PYMT_VOUCHERS : TRANS_DB.CONTRA_VOUCHERS;
    this.save(k, voucher);
    this.updateGeneralLedger(voucher, type);
  },

  getJournalVouchers() { return this.get(TRANS_DB.JOURNAL_VOUCHERS); },
  saveJournalVoucher(vou) { this.save(TRANS_DB.JOURNAL_VOUCHERS, vou); },

  getQuickNotes() { return this.get(TRANS_DB.QUICK_NOTES); },
  saveQuickNote(note) { this.save(TRANS_DB.QUICK_NOTES, note, 'id'); },

  getBankReco() { return this.get(TRANS_DB.BANK_RECO); },
  saveBankReco(entry) { this.save(TRANS_DB.BANK_RECO, entry, 'id'); },

  // --- LEDGER SYNC ---
  updateMemberLedger(note, type, voucherType, targetMemberCode) {
    const mCode = targetMemberCode || note.memberCode;
    const ledgerKey = 'jeevika_ledger_entries';
    const entries = JSON.parse(localStorage.getItem(ledgerKey) || '[]');
    const filtered = entries.filter(e => !(e.voucherNo === note.no && e.voucherType === voucherType && e.memberCode === mCode));
    filtered.push({
      date: note.date, memberCode: mCode, voucherNo: note.no, voucherType: voucherType,
      particulars: note.particular || `${voucherType} Entry`,
      dr: type === 'debit' ? (note.totals ? note.totals.finalTotal : (note.amount || 0)) : 0,
      cr: type === 'credit' ? (note.totals ? note.totals.finalTotal : (note.amount || 0)) : 0,
      period: note.period || ''
    });
    localStorage.setItem(ledgerKey, JSON.stringify(filtered));
  },

  updateGeneralLedger(voucher, type) {
     const ledgerKey = 'jeevika_general_ledger';
     const entries = JSON.parse(localStorage.getItem(ledgerKey) || '[]');
     const filtered = entries.filter(e => e.voucherNo !== voucher.no);
     filtered.push({
       date: voucher.date, voucherNo: voucher.no, type: type.toUpperCase(),
       account: voucher.paidTo || voucher.cashBank,
       dr: type === 'payment' ? voucher.amount : 0,
       cr: type === 'receipt' ? voucher.amount : 0,
       particulars: voucher.particular
     });
     localStorage.setItem(ledgerKey, JSON.stringify(filtered));
  },

  findReceipt(receiptNo) {
    const receipts = this.read(TRANS_DB.MEMBER_RECEIPTS);
    return receipts.find(r => r.no === receiptNo || r.receiptNo === receiptNo);
  },

  getNextNo(prefix) {
    const m = { 'DN': TRANS_DB.DEBIT_NOTES, 'CN': TRANS_DB.CREDIT_NOTES, 'MA': TRANS_DB.CHEQUE_RETURNS, 'MJ': TRANS_DB.MEMBER_JOURNALS, 'RV': TRANS_DB.RCPT_VOUCHERS, 'PV': TRANS_DB.PYMT_VOUCHERS, 'CV': TRANS_DB.CONTRA_VOUCHERS, 'JV': TRANS_DB.JOURNAL_VOUCHERS };
    return (this.read(m[prefix]) || []).length + 1;
  }
};
