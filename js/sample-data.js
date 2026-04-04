/**
 * JEEVIKA ACCOUNTING — SAMPLE DATA SEEDER v1.0
 * Seeds localStorage with trial data for all modules.
 */

const SampleDataSeeder = {
  seedAll() {
    this.seedSocieties();
    this.seedGroups();
    this.seedAccounts();
    this.seedMembers();
    this.seedBillSettings();
    this.seedAutoMaster();
    this.seedOpeningBalances();
    this.seedOpeningBankReco();
    this.seedBillPrintConfig();
    this.seedGSTMaster();
    this.seedMemberBills();
    this.seedRBAC();
    console.log('✅ Sample data seeded successfully!');
    if (typeof showToast === 'function') showToast('Sample data seeded successfully!', 'success');
  },

  seedSocieties() {
    const societies = [
      {
        code: 'SOC01',
        name: 'Shree Sai Usha Complex CHS Ltd.',
        registrationNo: 'BOM/HSG/4567 of 2010',
        address: 'Andheri West, Mumbai - 400058',
        email: 'society@ssu-complex.com',
        contactNo: '022-26354411',
        gstin: '27AAAAA0000A1Z5',
        pan: 'AAAAA0000A',
        tan: 'MUMT00000A',
        areaUnit: 'sqft',
        financialYearStart: '2025-04-01',
        financialYearEnd: '2026-03-31',
        interestMethod: 'monthly',
        interestType: 'simple',
        interestRate: 21,
        interestPriority: 'interest_first',
        billingMethod: 'monthly',
        billDate: 1,
        dueDate: 20,
        gstEnabled: true,
        chairmanName: 'Mr. Rajesh Mehra',
        secretaryName: 'Mrs. Sunita Patil',
        treasurerName: 'Mr. Amit Shah',
        bankName: 'HDFC Bank Ltd.',
        bankAccountNo: '50100123456789',
        bankIFSC: 'HDFC0000123',
        upiId: 'ssucomplex@hdfcbank'
      }
    ];
    localStorage.setItem('jeevika_societies', JSON.stringify(societies));
    localStorage.setItem('jeevika_active_society', 'SOC01');
    localStorage.setItem('jeevika_gst_enabled', '1');
  },

  seedGroups() {
    const groups = [
      { code: 'AS01', name: 'Fixed Assets', mainGroup: 'AS', isTotal: false },
      { code: 'AS02', name: 'Bank Accounts', mainGroup: 'AS', isTotal: false },
      { code: 'AS03', name: 'Cash in Hand', mainGroup: 'AS', isTotal: false },
      { code: 'AS04', name: 'Dues from Members', mainGroup: 'AS', isTotal: true },
      { code: 'LI01', name: 'Reserve Funds', mainGroup: 'LI', isTotal: false },
      { code: 'LI02', name: 'Advances from Members', mainGroup: 'LI', isTotal: false },
      { code: 'IN01', name: 'Maintenance Income', mainGroup: 'IN', isTotal: true },
      { code: 'IN02', name: 'Interest Received', mainGroup: 'IN', isTotal: false },
      { code: 'EX01', name: 'Electricity Expenses', mainGroup: 'EX', isTotal: false },
      { code: 'EX02', name: 'Water Charges', mainGroup: 'EX', isTotal: false },
      { code: 'EX03', name: 'Security & Staff Charges', mainGroup: 'EX', isTotal: false }
    ];
    localStorage.setItem('jeevika_groups', JSON.stringify(groups));
  },

  seedAccounts() {
    const accounts = [
      { code: '1001', name: 'HDFC Bank Savings', groupCode: 'AS02', mainGroup: 'AS', openingBalance: 543150, openingBalanceType: 'Dr' },
      { code: '1002', name: 'Petty Cash', groupCode: 'AS03', mainGroup: 'AS', openingBalance: 5000, openingBalanceType: 'Dr' },
      { code: '2001', name: 'Sinking Fund Reserve', groupCode: 'LI01', mainGroup: 'LI', openingBalance: 1500000, openingBalanceType: 'Cr' },
      { code: '2002', name: 'Building Repair Fund', groupCode: 'LI01', mainGroup: 'LI', openingBalance: 850000, openingBalanceType: 'Cr' },
      { code: '3001', name: 'Service Charges Income', groupCode: 'IN01', mainGroup: 'IN', openingBalance: 0, openingBalanceType: 'Cr' },
      { code: '3002', name: 'Parking Charges', groupCode: 'IN01', mainGroup: 'IN', openingBalance: 0, openingBalanceType: 'Cr' },
      { code: '4001', name: 'MSEB Electricity', groupCode: 'EX01', mainGroup: 'EX', openingBalance: 0, openingBalanceType: 'Dr' },
      { code: '1003', name: 'CGST Payable', groupCode: 'LI01', mainGroup: 'LI', openingBalance: 0, openingBalanceType: 'Cr' },
      { code: '1004', name: 'SGST Payable', groupCode: 'LI01', mainGroup: 'LI', openingBalance: 0, openingBalanceType: 'Cr' }
    ];
    localStorage.setItem('jeevika_accounts', JSON.stringify(accounts));
  },

  seedMembers() {
    const members = [
      { code: 'M001', names: ['Aman Salvi', 'Suman Salvi'], building: 'A', wing: '1', flatNo: '101', sqft: 750, areaType: 'RERA', openingPrincipal: 15500, openingInterest: 0, contactNo1: '9876543210', email1: 'aman@example.com' },
      { code: 'M002', names: ['Priya Sharma'], building: 'B', wing: '2', flatNo: '205', sqft: 550, areaType: 'RERA', openingPrincipal: 85000, openingInterest: 5400, contactNo1: '9876543211', email1: 'priya@example.com' },
      { code: 'M003', names: ['Rajesh Patil'], building: 'C', wing: '3', flatNo: '302', sqft: 900, areaType: 'RERA', openingPrincipal: 42300, openingInterest: 1200, contactNo1: '9876543212', email1: 'rajesh@example.com' },
      { code: 'M004', names: ['Aditya Varma'], building: 'A', wing: '1', flatNo: '404', sqft: 1200, areaType: 'RERA', openingPrincipal: -5000, openingInterest: 0, contactNo1: '9876543213', email1: 'aditya@example.com' },
      { code: 'M005', names: ['Sneha Kapoor'], building: 'B', wing: '2', flatNo: '501', sqft: 800, areaType: 'RERA', openingPrincipal: 0, openingInterest: 0, contactNo1: '9876543214', email1: 'sneha@example.com' }
    ];
    localStorage.setItem('jeevika_members', JSON.stringify(members));
  },

  seedBillSettings() {
    const settings = [
      { id: 'property_tax', name: 'Property Tax', shortName: 'PropTax', accountCode: '3001', gstApplicable: false, gstExempt: false },
      { id: 'water', name: 'Water Charges', shortName: 'Water', accountCode: '3001', gstApplicable: false, gstExempt: false },
      { id: 'service', name: 'Service Charges', shortName: 'Service', accountCode: '3001', gstApplicable: true, gstExempt: false },
      { id: 'sinking_fund', name: 'Sinking Fund', shortName: 'Sinking', accountCode: '2001', gstApplicable: false, gstExempt: true },
      { id: 'repair_fund', name: 'Repair & Maintenance Fund', shortName: 'Repair', accountCode: '2002', gstApplicable: false, gstExempt: true },
      { id: 'parking', name: 'Parking Charges', shortName: 'Parking', accountCode: '3002', gstApplicable: false, gstExempt: false }
    ];
    localStorage.setItem('jeevika_bill_settings', JSON.stringify(settings));
  },

  seedAutoMaster() {
    const rules = [
      { memberId: 'M001', headId: 'service', applyType: 'fixed', baseAmount: 1500, amount: 1500 },
      { memberId: 'M001', headId: 'water', applyType: 'fixed', baseAmount: 350, amount: 350 },
      { memberId: 'M002', headId: 'service', applyType: 'fixed', baseAmount: 1200, amount: 1200 },
      { memberId: 'M003', headId: 'service', applyType: 'area', baseAmount: 2.5, amount: 2250 }
    ];
    localStorage.setItem('jeevika_auto_master', JSON.stringify(rules));
  },

  seedOpeningBalances() {
    const balances = [
      { code: '1001', name: 'HDFC Bank Savings', mainGroup: 'AS', opDebit: 543150, opCredit: 0, type: 'account' },
      { code: '1002', name: 'Petty Cash', mainGroup: 'AS', opDebit: 5000, opCredit: 0, type: 'account' },
      { code: '2001', name: 'Sinking Fund Reserve', mainGroup: 'LI', opDebit: 0, opCredit: 1500000, type: 'account' },
      { code: '2002', name: 'Building Repair Fund', mainGroup: 'LI', opDebit: 0, opCredit: 850000, type: 'account' },
      { code: 'M001', name: 'Aman Salvi', mainGroup: 'AS', opDebit: 15500, opCredit: 0, type: 'member' },
      { code: 'M002', name: 'Priya Sharma', mainGroup: 'AS', opDebit: 90400, opCredit: 0, type: 'member' },
      { code: 'M003', name: 'Rajesh Patil', mainGroup: 'AS', opDebit: 43500, opCredit: 0, type: 'member' },
      { code: 'M004', name: 'Aditya Varma', mainGroup: 'LI', opDebit: 0, opCredit: 5000, type: 'member' },
      { code: 'M005', name: 'Sneha Kapoor', mainGroup: 'AS', opDebit: 0, opCredit: 0, type: 'member' }
    ];
    // Need to balance them or the system might complain
    const totalDr = balances.reduce((s,b) => s + b.opDebit, 0);
    const totalCr = balances.reduce((s,b) => s + b.opCredit, 0);
    const diff = totalCr - totalDr;
    if (diff > 0) {
      balances.push({ code: 'SUSP01', name: 'Suspense Account', mainGroup: 'AS', opDebit: diff, opCredit: 0, type: 'account' });
    } else if (diff < 0) {
      balances.push({ code: 'SUSP01', name: 'Suspense Account', mainGroup: 'LI', opDebit: 0, opCredit: Math.abs(diff), type: 'account' });
    }

    localStorage.setItem('jeevika_opening_balances', JSON.stringify(balances));
  },

  seedOpeningBankReco() {
    const recos = [
      {
        accountCode: '1001',
        accountName: 'HDFC Bank Savings',
        bookBalance: 543150,
        pendingCheques: [
          { chequeNo: '123456', amount: 5000, date: '2025-03-25' }
        ],
        reconciledBalance: 538150
      }
    ];
    localStorage.setItem('jeevika_opening_bank_reco', JSON.stringify(recos));
  },

  seedBillPrintConfig() {
    const config = {
      pageFormat: 'full',
      columns: 1,
      show_gst_breakup: true,
      show_interest_separately: true,
      show_arrears: true,
      show_society_address: true,
      show_member_gstin: true,
      billPrefix: 'SSU/',
      receiptPrefix: 'RCPT/',
      remarksLine1: 'Please pay by check or UPI',
      remarksLine2: 'Interest @21% will be charged on late payments'
    };
    localStorage.setItem('jeevika_bill_print_config', JSON.stringify(config));
  },

  seedGSTMaster() {
    const gstMap = [
      {
        accountCode: '3001',
        gstRate: 18,
        cgstRate: 9,
        sgstRate: 9,
        cgstAccount: '1003',
        sgstAccount: '1004',
        exemptionLimit: 0,
        rounding: 'round'
      }
    ];
    localStorage.setItem('jeevika_gst_master', JSON.stringify(gstMap));
  },

  seedMemberBills() {
    const members = JSON.parse(localStorage.getItem('jeevika_members') || '[]');
    const settings = JSON.parse(localStorage.getItem('jeevika_bill_settings') || '[]');
    const bills = [];

    members.forEach(m => {
      settings.forEach(s => {
        let amount = 0;
        if (s.id === 'service') amount = m.sqft * 2.5;
        if (s.id === 'water') amount = 350;
        if (s.id === 'parking') amount = 150;
        if (s.id === 'property_tax') amount = m.sqft * 1.5;
        
        bills.push({
          memberId: m.code,
          headId: s.id,
          headName: s.name,
          amount: parseFloat(amount.toFixed(2)),
          gstApplicable: s.gstApplicable,
          gstExempt: s.gstExempt,
          isManual: false
        });
      });
    });
    localStorage.setItem('jeevika_member_bills', JSON.stringify(bills));
  },

  seedRBAC() {
    const users = [
      { id: 1, name: 'Admin', email: 'admin@jeevika.com', password: 'admin123', role: 'Super Admin', avatar: 'A', phone: '9999999999', active: true, createdBy: 'system', createdAt: new Date().toISOString(), lastLogin: null },
      { id: 2, name: 'Ramesh', email: 'ramesh@jeevika.com', password: 'ramesh123', role: 'Accountant', avatar: 'R', phone: '9888888888', active: true, createdBy: 'system', createdAt: new Date().toISOString(), lastLogin: null },
      { id: 3, name: 'Suresh', email: 'suresh@jeevika.com', password: 'suresh123', role: 'Data Entry', avatar: 'S', phone: '9777777777', active: true, createdBy: 'system', createdAt: new Date().toISOString(), lastLogin: null }
    ];
    localStorage.setItem('jeevika_rbac_users', JSON.stringify(users));
    localStorage.setItem('jeevika_users', JSON.stringify(users)); // Legacy compat

    const assignments = [
      { userId: 1, societyCode: 'SOC01', active: true, assignedBy: 1, assignedAt: new Date().toISOString() },
      { userId: 2, societyCode: 'SOC01', active: true, assignedBy: 1, assignedAt: new Date().toISOString() },
      { userId: 3, societyCode: 'SOC01', active: true, assignedBy: 1, assignedAt: new Date().toISOString() }
    ];
    localStorage.setItem('jeevika_society_assignments', JSON.stringify(assignments));

    // Ensure session is set to Admin for preview
    if (!localStorage.getItem('jeevika_session')) {
      localStorage.setItem('jeevika_session', JSON.stringify({
        id: 1, name: 'Admin', role: 'Super Admin', avatar: 'A', email: 'admin@jeevika.com', loginTime: new Date().toISOString()
      }));
    }
  }
};

window.SampleDataSeeder = SampleDataSeeder;
