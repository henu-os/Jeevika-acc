/* ════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — SIDEBAR HOVER SYSTEM
   Enables flyout submenus on sidebar hover
   ════════════════════════════════════════════════ */

const SidebarHover = {
    // Menu Data
    menus: {
        'Masters': [
            { name: 'Society Master', url: 'society-master.html' },
            { name: 'Group Master', url: 'group-master.html' },
            { name: 'Account Master', url: 'account-master.html' },
            { name: 'Member Master', url: 'member-master.html' },
            { name: 'Billing Master', url: 'billing-master.html' },
            { name: 'Area Master', url: 'area-master.html' },
            { name: 'GST Master', url: 'gst-master.html' },
            { name: 'Opening Bank', url: 'opening-bank.html' },
            { name: 'Opening Balances', url: 'opening-balances.html' }
        ],
        'Transactions': [
            { name: 'Member Bill', url: 'member-bill.html' },
            { name: 'Member Receipt', url: 'member-receipt.html' },
            { name: 'Member Debit Note', url: 'debit-note.html' },
            { name: 'Member Credit Note', url: 'credit-note.html' },
            { name: 'Receipt Voucher', url: 'receipt-voucher.html' },
            { name: 'Payment Voucher', url: 'payment-voucher.html' },
            { name: 'Contra Voucher', url: 'contra-voucher.html' },
            { name: 'Journal Voucher', url: 'journal-voucher.html' },
            { name: 'Bank Reconciliation', url: 'bank-reconciliation.html' }
        ],
        'Reports': [
            { name: 'Outstanding List', url: 'outstanding-list.html' },
            { name: 'Member Ledger', url: 'member-ledger.html' },
            { name: 'Trial Balance', url: 'trial-balance.html' },
            { name: 'Balance Sheet', url: 'balance-sheet.html' },
            { name: 'Income & Expenditure', url: 'income-expenditure.html' },
            { name: 'Cash Book', url: 'cash-book.html' },
            { name: 'Bank Book', url: 'bank-book.html' },
            { name: 'Account Ledger', url: 'account-ledger.html' }
        ],
        'Utilities': [
            { name: 'Member Transfer', url: 'transfer-members.html' },
            { name: 'Interest Calculator', url: 'interest-calc.html' },
            { name: 'Import / Export', url: 'import-export.html' },
            { name: 'Rebuild Balances', url: 'rebuild-balances.html' },
            { name: 'Year End Process', url: 'year-end.html' }
        ],
        'Billing Utilities': [
            { name: 'Bill Cancellation', url: 'bill-cancellation.html' },
            { name: 'Bill Modification', url: 'bill-modification.html' },
            { name: 'Bulk Bill Print', url: 'bulk-bill-print.html' }
        ],
        'Stat. Compliance': [
            { name: 'GST Returns', url: 'gst-returns.html' },
            { name: 'TDS Compliance', url: 'tds-compliance.html' },
            { name: 'IT Returns', url: 'it-returns.html' }
        ]
    },

    init() {
        // Run once on each page
        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar) return;

            // Find all nav-items
            const navItems = sidebar.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const label = item.textContent.trim().replace(/^[\s\S]*?\s/, '').trim();
                if (this.menus[label]) {
                    this.injectSubmenu(item, label, this.menus[label]);
                }
            });
        });
    },

    injectSubmenu(parent, label, links) {
        const submenu = document.createElement('div');
        submenu.className = 'sidebar-submenu';
        
        let html = `<div class="submenu-header">${label}</div>`;
        links.forEach(link => {
            html += `<a href="${link.url}" class="submenu-item">${link.name}</a>`;
        });
        
        submenu.innerHTML = html;
        parent.appendChild(submenu);
    }
};

// Start Injection System
SidebarHover.init();
