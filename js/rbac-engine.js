/* ════════════════════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — RBAC ENGINE v1.0
   Role-Based Access Control with Multi-Tenant Society Management
   Stack: Vanilla JS — localStorage
   Rule: DO NOT change any HTML/CSS. PURE ENGINE.
   ════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════
// SECTION 1 — STORAGE KEYS
// ═══════════════════════════════════════════════════════════

const RBAC_DB = {
  USERS: 'jeevika_rbac_users',
  ROLES: 'jeevika_rbac_roles',
  SOCIETY_ASSIGNMENTS: 'jeevika_society_assignments',
  ACCESS_TOGGLES: 'jeevika_access_toggles',
  ACTIVITY_LOG: 'jeevika_activity_log',
  SESSION: 'jeevika_session',
};

function rbacRead(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
function rbacReadObj(key) { return JSON.parse(localStorage.getItem(key) || '{}'); }
function rbacWrite(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// ═══════════════════════════════════════════════════════════
// SECTION 2 — ROLE DEFINITIONS
// ═══════════════════════════════════════════════════════════

const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ACCOUNTANT: 'Accountant',
  USER: 'User',
  DATA_ENTRY: 'Data Entry',
  VIEWER: 'Viewer',
};

const ROLE_HIERARCHY = {
  'Super Admin': 5,
  'Accountant': 4,
  'User': 3,
  'Data Entry': 2,
  'Viewer': 1,
};

// Module-level permissions per role
const ROLE_PERMISSIONS = {
  'Super Admin': {
    canViewAllSocieties: true,
    canAssignSocieties: true,
    canManageUsers: true,
    canToggleAccess: true,
    canViewActivityLog: true,
    canDeleteSocieties: true,
    canCreateSocieties: true,
    canManageRoles: true,
    modules: '*', // all modules
  },
  'Accountant': {
    canViewAllSocieties: false,
    canAssignSocieties: false,
    canManageUsers: true,  // only users under their societies
    canToggleAccess: false,
    canViewActivityLog: false,
    canDeleteSocieties: false,
    canCreateSocieties: true,
    canManageRoles: false,
    modules: ['masters', 'transactions', 'reports', 'utilities'],
  },
  'User': {
    canViewAllSocieties: false,
    canAssignSocieties: false,
    canManageUsers: false,
    canToggleAccess: false,
    canViewActivityLog: false,
    canDeleteSocieties: false,
    canCreateSocieties: false,
    canManageRoles: false,
    modules: ['masters', 'transactions', 'reports'],
  },
  'Data Entry': {
    canViewAllSocieties: false,
    canAssignSocieties: false,
    canManageUsers: false,
    canToggleAccess: false,
    canViewActivityLog: false,
    canDeleteSocieties: false,
    canCreateSocieties: false,
    canManageRoles: false,
    modules: ['masters', 'transactions'],
  },
  'Viewer': {
    canViewAllSocieties: false,
    canAssignSocieties: false,
    canManageUsers: false,
    canToggleAccess: false,
    canViewActivityLog: false,
    canDeleteSocieties: false,
    canCreateSocieties: false,
    canManageRoles: false,
    modules: ['reports'],
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 3 — USER MANAGEMENT
// ═══════════════════════════════════════════════════════════

const RBACUserManager = {

  init() {
    var users = rbacRead(RBAC_DB.USERS);
    if (users.length === 0) {
      // Seed default users from existing JeevikaAuth
      var legacyUsers = JSON.parse(localStorage.getItem('jeevika_users') || '[]');
      if (legacyUsers.length > 0) {
        users = legacyUsers.map(function (u) {
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            password: u.password,
            role: u.role || 'User',
            avatar: u.avatar || u.name.charAt(0).toUpperCase(),
            phone: u.phone || '',
            active: true,
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            lastLogin: u.lastLogin || null,
          };
        });
      } else {
        users = [
          {
            id: 1, name: 'Admin', email: 'admin@jeevika.com', password: 'admin123',
            role: 'Super Admin', avatar: 'A', phone: '', active: true,
            createdBy: 'system', createdAt: new Date().toISOString(), lastLogin: null
          },
          {
            id: 2, name: 'Ramesh', email: 'ramesh@jeevika.com', password: 'ramesh123',
            role: 'Accountant', avatar: 'R', phone: '', active: true,
            createdBy: 'system', createdAt: new Date().toISOString(), lastLogin: null
          },
          {
            id: 3, name: 'Suresh', email: 'suresh@jeevika.com', password: 'suresh123',
            role: 'Data Entry', avatar: 'S', phone: '', active: true,
            createdBy: 'system', createdAt: new Date().toISOString(), lastLogin: null
          },
        ];
      }
      rbacWrite(RBAC_DB.USERS, users);
    }
  },

  getAll() { return rbacRead(RBAC_DB.USERS); },

  getById(id) { return this.getAll().find(function (u) { return u.id === id; }); },

  getByEmail(email) { return this.getAll().find(function (u) { return u.email === email; }); },

  getByRole(role) { return this.getAll().filter(function (u) { return u.role === role; }); },

  getNextId() {
    var users = this.getAll();
    return users.length > 0 ? Math.max.apply(null, users.map(function (u) { return u.id; })) + 1 : 1;
  },

  add(data) {
    var session = RBACAuth.getSession();
    if (!session) { showToast('Not logged in', 'error'); return false; }
    var perms = ROLE_PERMISSIONS[session.role];
    if (!perms || !perms.canManageUsers) { showToast('No permission to manage users', 'error'); return false; }
    // Accountant can only create users with lower role
    if (session.role === 'Accountant' && ROLE_HIERARCHY[data.role] >= ROLE_HIERARCHY['Accountant']) {
      showToast('Cannot create user with equal or higher role', 'error'); return false;
    }
    var users = this.getAll();
    if (users.find(function (u) { return u.email === data.email; })) {
      showToast('Email already exists', 'error'); return false;
    }
    var user = {
      id: this.getNextId(),
      name: data.name || '',
      email: data.email || '',
      password: data.password || 'password123',
      role: data.role || 'User',
      avatar: (data.name || 'U').charAt(0).toUpperCase(),
      phone: data.phone || '',
      active: true,
      createdBy: session.id,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    users.push(user);
    rbacWrite(RBAC_DB.USERS, users);
    ActivityLog.log('user_created', 'Created user: ' + user.name + ' (' + user.role + ')');
    showToast('User "' + user.name + '" created', 'success');
    return true;
  },

  update(id, data) {
    var users = this.getAll();
    var idx = users.findIndex(function (u) { return u.id === id; });
    if (idx === -1) { showToast('User not found', 'error'); return false; }
    // Cannot edit Super Admin unless you are Super Admin
    var session = RBACAuth.getSession();
    if (users[idx].role === 'Super Admin' && session.role !== 'Super Admin') {
      showToast('Cannot modify Super Admin', 'error'); return false;
    }
    users[idx] = Object.assign({}, users[idx], data);
    rbacWrite(RBAC_DB.USERS, users);
    ActivityLog.log('user_updated', 'Updated user: ' + users[idx].name);
    return true;
  },

  delete(id) {
    var session = RBACAuth.getSession();
    if (!session || session.role !== 'Super Admin') {
      showToast('Only Super Admin can delete users', 'error'); return false;
    }
    if (session.id === id) { showToast('Cannot delete yourself', 'error'); return false; }
    var users = this.getAll().filter(function (u) { return u.id !== id; });
    rbacWrite(RBAC_DB.USERS, users);
    // Also remove assignments
    SocietyAssignment.removeAllForUser(id);
    ActivityLog.log('user_deleted', 'Deleted user ID: ' + id);
    return true;
  },

  // Toggle user active status (SA only)
  toggleActive(id) {
    var session = RBACAuth.getSession();
    if (!session || !ROLE_PERMISSIONS[session.role].canToggleAccess) {
      showToast('No permission', 'error'); return false;
    }
    var users = this.getAll();
    var idx = users.findIndex(function (u) { return u.id === id; });
    if (idx === -1) return false;
    users[idx].active = !users[idx].active;
    rbacWrite(RBAC_DB.USERS, users);
    var status = users[idx].active ? 'enabled' : 'disabled';
    ActivityLog.log('access_toggled', 'User ' + users[idx].name + ' access ' + status);
    showToast('User ' + users[idx].name + ' ' + status, users[idx].active ? 'success' : 'warning');
    return true;
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 4 — SOCIETY ASSIGNMENT ENGINE
// ═══════════════════════════════════════════════════════════

const SocietyAssignment = {

  getAll() { return rbacRead(RBAC_DB.SOCIETY_ASSIGNMENTS); },

  // Get societies assigned to a user
  getForUser(userId) {
    return this.getAll().filter(function (a) { return a.userId === userId && a.active; });
  },

  // Get users assigned to a society
  getForSociety(societyCode) {
    return this.getAll().filter(function (a) { return a.societyCode === societyCode && a.active; });
  },

  // Assign society to user (SA only)
  assign(userId, societyCode) {
    var session = RBACAuth.getSession();
    if (!session || !ROLE_PERMISSIONS[session.role].canAssignSocieties) {
      showToast('No permission to assign societies', 'error'); return false;
    }
    var assignments = this.getAll();
    var existing = assignments.find(function (a) {
      return a.userId === userId && a.societyCode === societyCode;
    });
    if (existing) {
      existing.active = true;
      showToast('Society access re-enabled', 'success');
    } else {
      assignments.push({
        userId: userId,
        societyCode: societyCode,
        active: true,
        assignedBy: session.id,
        assignedAt: new Date().toISOString(),
      });
    }
    rbacWrite(RBAC_DB.SOCIETY_ASSIGNMENTS, assignments);
    var user = RBACUserManager.getById(userId);
    ActivityLog.log('society_assigned', 'Society ' + societyCode + ' assigned to ' + (user ? user.name : userId));
    return true;
  },

  // Revoke society access
  revoke(userId, societyCode) {
    var session = RBACAuth.getSession();
    if (!session || !ROLE_PERMISSIONS[session.role].canAssignSocieties) {
      showToast('No permission', 'error'); return false;
    }
    var assignments = this.getAll();
    var idx = assignments.findIndex(function (a) {
      return a.userId === userId && a.societyCode === societyCode;
    });
    if (idx >= 0) {
      assignments[idx].active = false;
      rbacWrite(RBAC_DB.SOCIETY_ASSIGNMENTS, assignments);
      ActivityLog.log('society_revoked', 'Society ' + societyCode + ' revoked from user ' + userId);
      showToast('Society access revoked', 'warning');
    }
    return true;
  },

  // Toggle assignment on/off
  toggle(userId, societyCode) {
    var assignments = this.getAll();
    var existing = assignments.find(function (a) {
      return a.userId === userId && a.societyCode === societyCode;
    });
    if (existing) {
      existing.active = !existing.active;
      rbacWrite(RBAC_DB.SOCIETY_ASSIGNMENTS, assignments);
      return existing.active;
    }
    return false;
  },

  // Remove all assignments for a user
  removeAllForUser(userId) {
    var assignments = this.getAll().filter(function (a) { return a.userId !== userId; });
    rbacWrite(RBAC_DB.SOCIETY_ASSIGNMENTS, assignments);
  },

  // Check if user has access to a specific society
  hasAccess(userId, societyCode) {
    var user = RBACUserManager.getById(userId);
    if (!user) return false;
    if (!user.active) return false;
    if (user.role === 'Super Admin') return true; // SA has access to all
    var assignment = this.getAll().find(function (a) {
      return a.userId === userId && a.societyCode === societyCode && a.active;
    });
    return !!assignment;
  },

  // Get all societies visible to current user
  getAccessibleSocieties(userId) {
    var user = RBACUserManager.getById(userId);
    if (!user || !user.active) return [];
    // SA sees all
    if (user.role === 'Super Admin') {
      return typeof SocietyMaster !== 'undefined' ? SocietyMaster.getAll() : [];
    }
    // Others see only assigned + active
    var assignments = this.getForUser(userId);
    var codes = assignments.map(function (a) { return a.societyCode; });
    var allSocieties = typeof SocietyMaster !== 'undefined' ? SocietyMaster.getAll() : [];
    return allSocieties.filter(function (s) { return codes.indexOf(s.code) >= 0; });
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 5 — ACCESS CONTROL (TOGGLE SYSTEM)
// ═══════════════════════════════════════════════════════════

const AccessControl = {

  // Check if current session user can access a module
  canAccessModule(moduleName) {
    var session = RBACAuth.getSession();
    if (!session) return false;
    var user = RBACUserManager.getById(session.id);
    if (!user || !user.active) return false;
    var perms = ROLE_PERMISSIONS[user.role];
    if (!perms) return false;
    if (perms.modules === '*') return true;
    return perms.modules.indexOf(moduleName) >= 0;
  },

  // Check specific permission
  hasPermission(permName) {
    var session = RBACAuth.getSession();
    if (!session) return false;
    var perms = ROLE_PERMISSIONS[session.role];
    return perms ? !!perms[permName] : false;
  },

  // Check if user can access current society
  canAccessCurrentSociety() {
    var session = RBACAuth.getSession();
    if (!session) return false;
    var activeSociety = localStorage.getItem('jeevika_active_society');
    if (!activeSociety) return true; // no society selected yet
    return SocietyAssignment.hasAccess(session.id, activeSociety);
  },

  // Enforce access — redirect or show error
  enforce() {
    var session = RBACAuth.getSession();
    if (!session) return;
    var user = RBACUserManager.getById(session.id);
    if (!user || !user.active) {
      showToast('Your account has been deactivated. Contact administrator.', 'error');
      RBACAuth.logout();
      return;
    }
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 6 — ENHANCED AUTH (replaces basic JeevikaAuth)
// ═══════════════════════════════════════════════════════════

const RBACAuth = {

  login(email, password) {
    var users = RBACUserManager.getAll();
    var user = users.find(function (u) { return u.email === email && u.password === password; });
    if (!user) return { success: false, message: 'Invalid email or password' };
    if (!user.active) return { success: false, message: 'Your account is deactivated. Contact Super Admin.' };
    // Update last login
    user.lastLogin = new Date().toISOString();
    rbacWrite(RBAC_DB.USERS, users);
    // Create session
    var session = {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      email: user.email,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(RBAC_DB.SESSION, JSON.stringify(session));
    // Also maintain legacy session for backward compatibility
    localStorage.setItem('jeevika_session', JSON.stringify(session));
    ActivityLog.log('login', user.name + ' logged in (' + user.role + ')');
    return { success: true, user: user };
  },

  logout() {
    var session = this.getSession();
    if (session) ActivityLog.log('logout', session.name + ' logged out');
    localStorage.removeItem(RBAC_DB.SESSION);
    localStorage.removeItem('jeevika_session');
    window.location.href = 'login.html';
  },

  getSession() {
    var s = localStorage.getItem(RBAC_DB.SESSION) || localStorage.getItem('jeevika_session');
    return s ? JSON.parse(s) : null;
  },

  isLoggedIn() { return !!this.getSession(); },

  getCurrentUser() {
    var session = this.getSession();
    return session ? RBACUserManager.getById(session.id) : null;
  },

  isSuperAdmin() {
    var session = this.getSession();
    return session && session.role === 'Super Admin';
  },

  isAccountant() {
    var session = this.getSession();
    return session && session.role === 'Accountant';
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 7 — ACTIVITY LOG
// ═══════════════════════════════════════════════════════════

const ActivityLog = {

  log(action, detail) {
    var logs = rbacRead(RBAC_DB.ACTIVITY_LOG);
    var session = RBACAuth.getSession();
    logs.unshift({
      timestamp: new Date().toISOString(),
      userId: session ? session.id : 0,
      userName: session ? session.name : 'System',
      userRole: session ? session.role : 'System',
      action: action,
      detail: detail,
      page: window.location.pathname.split('/').pop(),
    });
    // Keep only last 500 entries
    if (logs.length > 500) logs = logs.slice(0, 500);
    rbacWrite(RBAC_DB.ACTIVITY_LOG, logs);
  },

  getAll() { return rbacRead(RBAC_DB.ACTIVITY_LOG); },

  getForUser(userId) {
    return this.getAll().filter(function (l) { return l.userId === userId; });
  },

  clear() {
    if (!RBACAuth.isSuperAdmin()) { showToast('Only SA can clear logs', 'error'); return; }
    rbacWrite(RBAC_DB.ACTIVITY_LOG, []);
    showToast('Activity log cleared', 'success');
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 8 — SA ADMIN PANEL (POPUP-BASED)
// ═══════════════════════════════════════════════════════════

const SAPanel = {

  open() {
    if (!RBACAuth.isSuperAdmin()) {
      showToast('Super Admin access required', 'error'); return;
    }
    if (typeof PopupManager === 'undefined') {
      showToast('PopupManager not available', 'error'); return;
    }
    PopupManager.open('sa_panel', '🔐 Super Admin Panel', this.buildDashboard(), { width: '900px', minHeight: '600px' });
    this.bindEvents();
  },

  buildDashboard() {
    var users = RBACUserManager.getAll();
    var societies = typeof SocietyMaster !== 'undefined' ? SocietyMaster.getAll() : [];
    var logs = ActivityLog.getAll().slice(0, 20);
    var assignments = SocietyAssignment.getAll();

    var userRows = users.map(function (u) {
      var assignedCount = assignments.filter(function (a) { return a.userId === u.id && a.active; }).length;
      return '<tr>' +
        '<td><span class="avatar" style="display:inline-block;width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;text-align:center;line-height:28px;font-size:12px;font-weight:700;">' + u.avatar + '</span> ' + u.name + '</td>' +
        '<td>' + u.email + '</td>' +
        '<td><span style="padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:' +
        (u.role === 'Super Admin' ? '#EDE9FE;color:#7C3AED' : u.role === 'Accountant' ? '#DBEAFE;color:#2563EB' : '#F3F4F6;color:#374151') + ';">' + u.role + '</span></td>' +
        '<td>' + assignedCount + ' societies</td>' +
        '<td><label class="toggle-switch" style="position:relative;display:inline-block;width:40px;height:22px;">' +
        '<input type="checkbox" ' + (u.active ? 'checked' : '') + ' onchange="SAPanel.toggleUser(' + u.id + ')" style="opacity:0;width:0;height:0;">' +
        '<span style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:' + (u.active ? 'var(--success,#22C55E)' : '#ccc') + ';border-radius:22px;transition:.3s;"></span>' +
        '<span style="position:absolute;height:16px;width:16px;left:' + (u.active ? '20px' : '3px') + ';bottom:3px;background:white;border-radius:50%;transition:.3s;"></span>' +
        '</label></td>' +
        '<td>' +
        '<button class="btn-icon" onclick="SAPanel.openAssignForm(' + u.id + ')" title="Assign Societies">🏢</button>' +
        '<button class="btn-icon" onclick="SAPanel.openEditUser(' + u.id + ')" title="Edit">✏️</button>' +
        (u.role !== 'Super Admin' ? '<button class="btn-icon" onclick="SAPanel.deleteUser(' + u.id + ')" title="Delete" style="color:var(--danger);">🗑️</button>' : '') +
        '</td></tr>';
    }).join('');

    var logRows = logs.map(function (l) {
      return '<tr><td style="font-size:11px;white-space:nowrap;">' + new Date(l.timestamp).toLocaleString('en-IN') + '</td>' +
        '<td>' + l.userName + '</td><td>' + l.action + '</td><td>' + l.detail + '</td></tr>';
    }).join('');

    return '<div style="margin-bottom:16px;">' +
      '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
      '<button class="btn-primary" id="sa_tab_users" onclick="SAPanel.showTab(\'users\')" style="font-size:12px;">👥 Users (' + users.length + ')</button>' +
      '<button class="btn-secondary" id="sa_tab_assignments" onclick="SAPanel.showTab(\'assignments\')" style="font-size:12px;">🏢 Assignments</button>' +
      '<button class="btn-secondary" id="sa_tab_logs" onclick="SAPanel.showTab(\'logs\')" style="font-size:12px;">📋 Activity Log (' + logs.length + ')</button>' +
      '<button class="btn-secondary" onclick="SAPanel.openAddUser()" style="font-size:12px;margin-left:auto;">+ Add User</button>' +
      '</div></div>' +
      '<div id="sa_tab_content_users">' +
      '<table class="data-table" style="font-size:12px;"><thead><tr>' +
      '<th>User</th><th>Email</th><th>Role</th><th>Societies</th><th>Access</th><th>Actions</th></tr></thead>' +
      '<tbody>' + userRows + '</tbody></table></div>' +
      '<div id="sa_tab_content_assignments" style="display:none;">' + this.buildAssignmentView() + '</div>' +
      '<div id="sa_tab_content_logs" style="display:none;">' +
      '<table class="data-table" style="font-size:11px;"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Detail</th></tr></thead>' +
      '<tbody>' + logRows + '</tbody></table>' +
      '<button class="btn-secondary" onclick="ActivityLog.clear();SAPanel.refresh();" style="margin-top:8px;font-size:11px;">Clear Log</button></div>';
  },

  buildAssignmentView() {
    var societies = typeof SocietyMaster !== 'undefined' ? SocietyMaster.getAll() : [];
    var users = RBACUserManager.getAll().filter(function (u) { return u.role !== 'Super Admin'; });
    if (societies.length === 0) return '<p style="padding:20px;text-align:center;color:var(--text-muted);">No societies created yet.</p>';

    return societies.map(function (s) {
      var assigned = SocietyAssignment.getForSociety(s.code);
      var userList = assigned.map(function (a) {
        var u = RBACUserManager.getById(a.userId);
        return u ? '<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;background:var(--accent-soft);border-radius:12px;font-size:11px;margin:2px;">' +
          u.name + ' (' + u.role + ')' +
          '<button onclick="SocietyAssignment.revoke(' + a.userId + ',\'' + s.code + '\');SAPanel.refresh();" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:14px;">×</button></span>' : '';
      }).join('');

      return '<div style="padding:12px;margin-bottom:8px;background:var(--bg-card,#fff);border:1px solid var(--border);border-radius:8px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
        '<strong>' + s.code + ' — ' + s.name + '</strong>' +
        '<button class="btn-secondary" onclick="SAPanel.openBulkAssign(\'' + s.code + '\')" style="font-size:11px;padding:4px 10px;">+ Assign User</button>' +
        '</div>' +
        '<div>' + (userList || '<span style="color:var(--text-muted);font-size:12px;">No users assigned</span>') + '</div></div>';
    }).join('');
  },

  showTab(tab) {
    ['users', 'assignments', 'logs'].forEach(function (t) {
      var content = document.getElementById('sa_tab_content_' + t);
      var btn = document.getElementById('sa_tab_' + t);
      if (content) content.style.display = t === tab ? '' : 'none';
      if (btn) { btn.className = t === tab ? 'btn-primary' : 'btn-secondary'; }
    });
  },

  refresh() {
    var popup = document.getElementById('popup_sa_panel');
    if (!popup) return;
    popup.querySelector('.jv-popup-body').innerHTML = this.buildDashboard();
    this.bindEvents();
  },

  toggleUser(userId) {
    RBACUserManager.toggleActive(userId);
    this.refresh();
  },

  deleteUser(userId) {
    if (confirm('Delete this user? This cannot be undone.')) {
      RBACUserManager.delete(userId);
      this.refresh();
    }
  },

  openAddUser() {
    PopupManager.open('sa_add_user', 'Add New User',
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
      '<div class="form-group"><label class="form-label">Full Name *</label><input class="form-input" name="name"></div>' +
      '<div class="form-group"><label class="form-label">Email *</label><input class="form-input" name="email" type="email"></div>' +
      '<div class="form-group"><label class="form-label">Password *</label><input class="form-input" name="password" value="password123"></div>' +
      '<div class="form-group"><label class="form-label">Phone</label><input class="form-input" name="phone"></div>' +
      '<div class="form-group"><label class="form-label">Role *</label>' +
      '<select class="form-input" name="role">' +
      '<option value="User">User (Single Society)</option>' +
      '<option value="Accountant">Accountant (Multi-Society)</option>' +
      '<option value="Data Entry">Data Entry</option>' +
      '<option value="Viewer">Viewer (Read Only)</option>' +
      '</select></div>' +
      '<button class="btn-primary" id="sa_save_user">Create User</button></div>',
      { width: '400px' });
    setTimeout(function () {
      var btn = document.getElementById('sa_save_user');
      if (btn) btn.addEventListener('click', function () {
        var popup = document.getElementById('popup_sa_add_user');
        var body = popup.querySelector('.jv-popup-body');
        var data = {};
        body.querySelectorAll('[name]').forEach(function (el) { data[el.name] = el.value.trim(); });
        if (!data.name || !data.email) { showToast('Name and Email required', 'error'); return; }
        if (RBACUserManager.add(data)) { PopupManager.close('sa_add_user'); SAPanel.refresh(); }
      });
    }, 50);
  },

  openEditUser(userId) {
    var user = RBACUserManager.getById(userId);
    if (!user) return;
    PopupManager.open('sa_edit_user_' + userId, 'Edit User — ' + user.name,
      '<div style="display:flex;flex-direction:column;gap:12px;">' +
      '<div class="form-group"><label class="form-label">Full Name</label><input class="form-input" name="name" value="' + user.name + '"></div>' +
      '<div class="form-group"><label class="form-label">Email</label><input class="form-input" name="email" value="' + user.email + '"></div>' +
      '<div class="form-group"><label class="form-label">Password</label><input class="form-input" name="password" value="' + user.password + '"></div>' +
      '<div class="form-group"><label class="form-label">Phone</label><input class="form-input" name="phone" value="' + (user.phone || '') + '"></div>' +
      '<div class="form-group"><label class="form-label">Role</label>' +
      '<select class="form-input" name="role">' +
      ['Super Admin', 'Accountant', 'User', 'Data Entry', 'Viewer'].map(function (r) {
        return '<option value="' + r + '" ' + (user.role === r ? 'selected' : '') + '>' + r + '</option>';
      }).join('') +
      '</select></div>' +
      '<button class="btn-primary" id="sa_update_user_' + userId + '">Save Changes</button></div>',
      { width: '400px' });
    setTimeout(function () {
      var btn = document.getElementById('sa_update_user_' + userId);
      if (btn) btn.addEventListener('click', function () {
        var popup = document.querySelector('[id$="sa_edit_user_' + userId + '"]');
        var body = popup.querySelector('.jv-popup-body');
        var data = {};
        body.querySelectorAll('[name]').forEach(function (el) { data[el.name] = el.value.trim(); });
        if (RBACUserManager.update(userId, data)) {
          showToast('User updated', 'success');
          PopupManager.close('sa_edit_user_' + userId);
          SAPanel.refresh();
        }
      });
    }, 50);
  },

  openAssignForm(userId) {
    var user = RBACUserManager.getById(userId);
    if (!user) return;
    var societies = typeof SocietyMaster !== 'undefined' ? SocietyMaster.getAll() : [];
    var rows = societies.map(function (s) {
      var hasAccess = SocietyAssignment.hasAccess(userId, s.code);
      return '<tr><td>' + s.code + '</td><td>' + s.name + '</td>' +
        '<td><label style="position:relative;display:inline-block;width:40px;height:22px;cursor:pointer;">' +
        '<input type="checkbox" ' + (hasAccess ? 'checked' : '') +
        ' data-society="' + s.code + '" data-user="' + userId + '"' +
        ' style="opacity:0;width:0;height:0;" class="assign-toggle">' +
        '<span style="position:absolute;top:0;left:0;right:0;bottom:0;background:' + (hasAccess ? 'var(--success)' : '#ccc') +
        ';border-radius:22px;transition:.3s;"></span></label></td></tr>';
    }).join('');

    PopupManager.open('sa_assign_' + userId, '🏢 Assign Societies — ' + user.name,
      '<p style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">Toggle ON/OFF to grant/revoke society access</p>' +
      '<table class="data-table" style="font-size:12px;"><thead><tr><th>Code</th><th>Society</th><th>Access</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>',
      { width: '500px' });

    setTimeout(function () {
      document.querySelectorAll('.assign-toggle').forEach(function (cb) {
        cb.addEventListener('change', function () {
          var sc = cb.dataset.society;
          var uid = parseInt(cb.dataset.user);
          if (cb.checked) SocietyAssignment.assign(uid, sc);
          else SocietyAssignment.revoke(uid, sc);
          var span = cb.nextElementSibling;
          if (span) span.style.background = cb.checked ? 'var(--success)' : '#ccc';
        });
      });
    }, 50);
  },

  openBulkAssign(societyCode) {
    var users = RBACUserManager.getAll().filter(function (u) { return u.role !== 'Super Admin'; });
    var rows = users.map(function (u) {
      var has = SocietyAssignment.hasAccess(u.id, societyCode);
      return '<tr><td>' + u.name + '</td><td>' + u.role + '</td>' +
        '<td><input type="checkbox" ' + (has ? 'checked' : '') +
        ' data-uid="' + u.id + '" class="bulk-assign-cb" style="width:16px;height:16px;accent-color:var(--primary);"></td></tr>';
    }).join('');
    PopupManager.open('sa_bulk_assign_' + societyCode, 'Assign Users to ' + societyCode,
      '<table class="data-table" style="font-size:12px;"><thead><tr><th>User</th><th>Role</th><th>Access</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table>' +
      '<button class="btn-primary" id="sa_bulk_save" style="margin-top:12px;">Save Assignments</button>',
      { width: '400px' });
    setTimeout(function () {
      var btn = document.getElementById('sa_bulk_save');
      if (btn) btn.addEventListener('click', function () {
        document.querySelectorAll('.bulk-assign-cb').forEach(function (cb) {
          var uid = parseInt(cb.dataset.uid);
          if (cb.checked) SocietyAssignment.assign(uid, societyCode);
          else SocietyAssignment.revoke(uid, societyCode);
        });
        showToast('Assignments saved', 'success');
        PopupManager.close('sa_bulk_assign_' + societyCode);
        SAPanel.refresh();
      });
    }, 50);
  },

  bindEvents() { /* placeholder for future event bindings */ },
};

// ═══════════════════════════════════════════════════════════
// SECTION 9 — SOCIETY FILTER (restrict society dropdown)
// ═══════════════════════════════════════════════════════════

const SocietyFilter = {

  // Override SocietyMaster.render to only show accessible societies
  apply() {
    if (typeof SocietyMaster === 'undefined') return;
    var originalRender = SocietyMaster.render;
    SocietyMaster.render = function () {
      var tbody = document.querySelector('#society-table-body');
      if (!tbody) return;

      var session = RBACAuth.getSession();
      var active = localStorage.getItem('jeevika_active_society');
      var allSocieties = SocietyMaster.getAll();

      // Filter by access
      var societies;
      if (session && session.role === 'Super Admin') {
        societies = allSocieties;
      } else if (session) {
        societies = SocietyAssignment.getAccessibleSocieties(session.id);
      } else {
        societies = [];
      }

      tbody.innerHTML = societies.map(function (s) {
        return '<tr class="' + (s.code === active ? 'active-row' : '') + '">' +
          '<td>' + s.code + '</td><td>' + s.name + '</td>' +
          '<td>' + (s.financialYearStart || '—') + ' to ' + (s.financialYearEnd || '—') + '</td>' +
          '<td><span class="badge ' + (s.gstEnabled ? 'badge-success' : 'badge-info') + '">' +
          (s.gstEnabled ? 'GST ON' : 'GST OFF') + '</span></td>' +
          '<td><button class="btn-icon society-select-btn" data-code="' + s.code + '">Select</button>' +
          '<button class="btn-icon" onclick="SocietyMaster.openEditForm(\'' + s.code + '\')">Edit</button>' +
          (AccessControl.hasPermission('canDeleteSocieties')
            ? '<button class="btn-icon" onclick="SocietyMaster.delete(\'' + s.code + '\');SocietyMaster.render();">Delete</button>'
            : '') +
          '</td></tr>';
      }).join('');
    };
  },
};

// ═══════════════════════════════════════════════════════════
// SECTION 10 — INIT & WIRING
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  // Initialize RBAC
  RBACUserManager.init();

  // Apply society filter
  SocietyFilter.apply();

  // Enforce access control
  AccessControl.enforce();

  // Add SA Panel button to topbar if Super Admin
  var session = RBACAuth.getSession();
  if (session && session.role === 'Super Admin') {
    var topbarActions = document.querySelector('.topbar-actions') || document.querySelector('.topbar-right');
    if (topbarActions) {
      var saBtn = document.createElement('button');
      saBtn.className = 'btn-secondary';
      saBtn.style.cssText = 'font-size:12px;padding:6px 14px;margin-right:8px;background:#7C3AED;color:white;border:none;border-radius:6px;cursor:pointer;';
      saBtn.innerHTML = '🔐 SA Panel';
      saBtn.onclick = function () { SAPanel.open(); };
      topbarActions.insertBefore(saBtn, topbarActions.firstChild);
    }
  }

  // Show role badge in topbar
  if (session) {
    var roleEl = document.querySelector('.topbar-profile .role');
    if (roleEl) {
      roleEl.textContent = session.role;
      if (session.role === 'Super Admin') roleEl.style.color = '#7C3AED';
      else if (session.role === 'Accountant') roleEl.style.color = '#2563EB';
    }
  }

  console.log('🔐 Jeevika RBAC Engine v1.0 loaded — Role: ' + (session ? session.role : 'none'));
});
