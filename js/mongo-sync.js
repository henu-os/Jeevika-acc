/* ════════════════════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — MONGODB DATA LAYER v1.0
   Dual-mode: localStorage (offline) + MongoDB (when server available)
   Auto-syncs localStorage → MongoDB on server availability
   ════════════════════════════════════════════════════════════════ */

const MongoSync = {
  API_BASE: 'http://localhost:3456/api',
  isOnline: false,
  syncQueue: [],

  // ── Check server availability ──
  async checkServer() {
    try {
      const res = await fetch(this.API_BASE + '/health', { method: 'GET', signal: AbortSignal.timeout(2000) });
      const data = await res.json();
      this.isOnline = data.status === 'ok' && data.mongodb === 'connected';
      if (this.isOnline) {
        document.body.classList.add('mongo-connected');
        this.processSyncQueue();
      } else {
        document.body.classList.remove('mongo-connected');
      }
      return this.isOnline;
    } catch {
      this.isOnline = false;
      document.body.classList.remove('mongo-connected');
      return false;
    }
  },

  // ── Queue operations for sync when offline ──
  queueSync(type, method, endpoint, data) {
    this.syncQueue.push({ type, method, endpoint, data, ts: Date.now() });
    localStorage.setItem('jeevika_sync_queue', JSON.stringify(this.syncQueue));
  },

  // ── Process queued operations ──
  async processSyncQueue() {
    const queue = JSON.parse(localStorage.getItem('jeevika_sync_queue') || '[]');
    if (!queue.length) return;
    for (const op of queue) {
      try {
        await fetch(this.API_BASE + op.endpoint, {
          method: op.method,
          headers: { 'Content-Type': 'application/json' },
          body: op.data ? JSON.stringify(op.data) : undefined
        });
      } catch (e) {
        console.warn('Sync failed for', op.endpoint, e);
      }
    }
    localStorage.removeItem('jeevika_sync_queue');
    this.syncQueue = [];
  },

  // ── Generic API call with fallback ──
  async apiCall(method, endpoint, data) {
    if (!this.isOnline) {
      this.queueSync('api', method, endpoint, data);
      return null;
    }
    try {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000)
      };
      if (data && method !== 'GET') opts.body = JSON.stringify(data);
      const res = await fetch(this.API_BASE + endpoint, opts);
      if (!res.ok) throw new Error('API error: ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('API call failed, using localStorage:', e.message);
      this.queueSync('api', method, endpoint, data);
      return null;
    }
  },

  // ═══ Society Operations ═══
  async saveSociety(data) {
    const result = await this.apiCall('POST', '/societies', data);
    return result;
  },

  async updateSociety(code, data) {
    return await this.apiCall('PUT', '/societies/' + code, data);
  },

  async getSocieties() {
    return await this.apiCall('GET', '/societies');
  },

  async deleteSociety(code) {
    return await this.apiCall('DELETE', '/societies/' + code);
  },

  async activateSociety(code) {
    return await this.apiCall('POST', '/societies/' + code + '/activate');
  },

  // ── Sub-section saves ──
  async saveShareCapital(code, data) {
    return await this.apiCall('PUT', '/societies/' + code + '/share-capital', data);
  },

  async saveBalanceSheetFooter(code, lines) {
    return await this.apiCall('PUT', '/societies/' + code + '/balance-sheet-footer', { lines });
  },

  async saveBillingRemarksCol1(code, data) {
    return await this.apiCall('PUT', '/societies/' + code + '/billing-remarks-col1', data);
  },

  async saveBillingRemarksCol2(code, data) {
    return await this.apiCall('PUT', '/societies/' + code + '/billing-remarks-col2', data);
  },

  async saveSignatures(code, data) {
    return await this.apiCall('PUT', '/societies/' + code + '/signatures', data);
  },

  async saveBlastPanel(code, data) {
    return await this.apiCall('PUT', '/societies/' + code + '/blast-panel', data);
  },

  // ═══ Full Migration ═══
  async migrateAll() {
    if (!this.isOnline) { showToast('Server not available', 'error'); return; }
    const types = [
      { key: 'jeevika_societies', type: 'societies' },
      { key: 'jeevika_groups', type: 'groups' },
      { key: 'jeevika_accounts', type: 'accounts' },
      { key: 'jeevika_members', type: 'members' }
    ];
    for (const t of types) {
      const data = JSON.parse(localStorage.getItem(t.key) || '[]');
      if (data.length) {
        await this.apiCall('POST', '/migrate', { type: t.type, data });
      }
    }
    showToast('All data migrated to MongoDB!', 'success');
  },

  // ── Init: check server on load ──
  init() {
    this.checkServer();
    // Re-check every 30 seconds
    setInterval(() => this.checkServer(), 30000);
  }
};

// Auto-init when script loads
document.addEventListener('DOMContentLoaded', () => MongoSync.init());
