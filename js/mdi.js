/* ════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — MDI SHELL LOGIC
   Window Management, Draggable & Top Menu
   ════════════════════════════════════════════════ */

const JeevikaMDI = {
    windows: [],
    activeWin: null,
    nextZ: 100,
    container: null,

    init() {
        this.container = document.querySelector('.mdi-container');
        document.addEventListener('mousedown', (e) => {
            // Close menu if clicking outside
            if (!e.target.closest('.mdi-nav-item')) {
                document.querySelectorAll('.mdi-nav-item').forEach(item => item.classList.remove('active'));
            }
        });

        // Initialize Taskbar tracking
        this.updateTaskbar();
    },

    // ─── WINDOW MANAGEMENT ───
    openWindow(url, title, width = 900, height = 600) {
        // If window with same URL already open, focus it
        const existing = this.windows.find(w => w.url === url);
        if (existing) {
            this.focusWindow(existing.id);
            return;
        }

        const id = 'win_' + Math.random().toString(36).substr(2, 9);
        const winEl = document.createElement('div');
        winEl.className = 'mdi-window active';
        winEl.id = id;
        winEl.style.width = width + 'px';
        winEl.style.height = height + 'px';
        
        // Random position
        const offsetX = 50 + (this.windows.length * 30) % 300;
        const offsetY = 40 + (this.windows.length * 30) % 200;
        winEl.style.left = offsetX + 'px';
        winEl.style.top = offsetY + 'px';

        winEl.innerHTML = `
            <div class="mdi-window-header">
                <div class="mdi-window-title">${title}</div>
                <div class="mdi-window-controls">
                    <button class="mdi-win-btn" onclick="JeevikaMDI.minimizeWindow('${id}')">-</button>
                    <button class="mdi-win-btn close" onclick="JeevikaMDI.closeWindow('${id}')">×</button>
                </div>
            </div>
            <div class="mdi-window-content">
                <div class="mdi-win-loader"></div>
                <iframe class="mdi-window-iframe" src="${url}" onload="this.previousElementSibling.remove()"></iframe>
            </div>
        `;

        this.container.appendChild(winEl);
        this.windows.push({ id, url, title, el: winEl });
        this.focusWindow(id);
        this.makeDraggable(winEl);
        this.updateTaskbar();
    },

    closeWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (win) {
            win.el.remove();
            this.windows = this.windows.filter(w => w.id !== id);
            this.updateTaskbar();
        }
    },

    minimizeWindow(id) {
        const win = this.windows.find(w => w.id === id);
        if (win) {
            win.el.style.display = 'none';
            this.updateTaskbar();
        }
    },

    focusWindow(id) {
        this.windows.forEach(w => {
            w.el.classList.remove('active');
            if (w.id === id) {
                w.el.classList.add('active');
                w.el.style.display = 'flex';
                w.el.style.zIndex = ++this.nextZ;
                this.activeWin = id;
            }
        });
        this.updateTaskbar();
    },

    // ─── TOP MENU ACTIONS ───
    toggleMenu(el) {
        const isActive = el.classList.contains('active');
        document.querySelectorAll('.mdi-nav-item').forEach(item => item.classList.remove('active'));
        if (!isActive) el.classList.add('active');
    },

    // ─── TASKBAR TRACKING ───
    updateTaskbar() {
        const tb = document.querySelector('.mdi-taskbar');
        if (!tb) return;
        tb.innerHTML = '';
        this.windows.forEach(w => {
            const btn = document.createElement('div');
            btn.className = 'mdi-task-item' + (this.activeWin === w.id ? ' active' : '');
            btn.textContent = w.title;
            btn.onclick = () => this.focusWindow(w.id);
            tb.appendChild(btn);
        });
    },

    // ─── DRAGGABLE LOGIC ───
    makeDraggable(el) {
        const header = el.querySelector('.mdi-window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = (e) => {
            e.preventDefault();
            this.focusWindow(el.id);
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },

    // ─── SHORTCUTS ───
    handleShortcuts(e) {
        if (e.ctrlKey) {
            const key = e.key.toLowerCase();
            if (key === 'g') { e.preventDefault(); this.openWindow('html/group-master.html', 'Group Master'); }
            if (key === 'a') { e.preventDefault(); this.openWindow('html/account-master.html', 'Account Master'); }
            if (key === 'm') { e.preventDefault(); this.openWindow('html/member-master.html', 'Member Master'); }
            if (key === 'b') { e.preventDefault(); this.openWindow('html/bill-print-setup.html', 'Bill Format'); }
            if (key === 't') { e.preventDefault(); this.openWindow('html/member-receipt.html', 'Receipt'); }
            if (key === 'o') { e.preventDefault(); this.openWindow('html/outstanding-list.html', 'Outstanding List'); }
            if (key === 'e') { e.preventDefault(); this.openWindow('html/member-ledger.html', 'Member Account'); }
            if (key === 'i') { e.preventDefault(); this.openWindow('html/receipt-voucher.html', 'Receipt'); }
            if (key === 'p') { e.preventDefault(); this.openWindow('html/payment-voucher.html', 'Payment'); }
            if (key === 'c') { e.preventDefault(); this.openWindow('html/contra-voucher.html', 'Contra'); }
            if (key === 'k') { e.preventDefault(); this.openWindow('html/bank-reconciliation.html', 'Bank Reco'); }
        }
    }
};

// Global Shortcut Listener
window.addEventListener('keydown', e => JeevikaMDI.handleShortcuts(e));

// Auto-init
document.addEventListener('DOMContentLoaded', () => JeevikaMDI.init());
