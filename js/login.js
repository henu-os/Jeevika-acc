/* ════════════════════════════════════════════════
   JEEVIKA ACCOUNTING — LOGIN PAGE LOGIC
   ════════════════════════════════════════════════ */

// If already logged in, redirect to dashboard
if (JeevikaAuth.isLoggedIn()) {
  window.location.href = 'dashboard.html';
}

function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  if (!email || !password) {
    errEl.textContent = 'Please enter both email and password';
    errEl.style.display = 'block';
    return;
  }

  // Button loading state
  btn.disabled = true;
  btn.textContent = 'Signing in...';

  setTimeout(() => {
    const result = JeevikaAuth.login(email, password);
    if (result.success) {
      showToast('Welcome back, ' + result.user.name + '!');
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    } else {
      errEl.textContent = result.message;
      errEl.style.display = 'block';
      btn.disabled = false;
      btn.innerHTML = '\uD83D\uDD12 Sign In';
      // Shake effect
      const form = document.querySelector('.login-form');
      form.style.animation = 'none';
      form.offsetHeight; // force reflow
      form.style.animation = 'shake 0.4s ease';
    }
  }, 600);
}

// Enter key support
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// Demo credentials hint
document.addEventListener('DOMContentLoaded', () => {
  const hint = document.createElement('div');
  hint.style.cssText = 'margin-top:16px;padding:12px;background:var(--accent-soft);border-radius:8px;font-size:11px;color:var(--text-secondary);text-align:center';
  hint.innerHTML = '<strong>Demo Credentials:</strong><br>admin@jeevika.com / admin123<br>ramesh@jeevika.com / ramesh123';
  const form = document.querySelector('.login-form');
  if (form) form.appendChild(hint);
});
