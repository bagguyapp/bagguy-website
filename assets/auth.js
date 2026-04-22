// Bag Guy shared auth helpers.
// Included from every page via <script src="/assets/auth.js"></script>
(function () {
  // Set to the public URL of your FastAPI backend (via Cloudflare tunnel).
  // Default uses your byorkmc.com tunnel — works once you add the hostname in CF.
  // Switch to https://api.bagguyapp.com once you move bagguyapp.com's DNS to Cloudflare.
  const API = 'https://bagguy.byorkmc.com';
  const TOKEN_KEY = 'bagguy_token';
  const USER_KEY = 'bagguy_user';

  const BagGuyAuth = {
    API,
    getToken() {
      try { return localStorage.getItem(TOKEN_KEY) || null; } catch { return null; }
    },
    setToken(t) {
      try { localStorage.setItem(TOKEN_KEY, t); } catch {}
    },
    getUser() {
      try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    },
    setUser(u) {
      try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch {}
    },
    isLoggedIn() { return !!this.getToken(); },
    logout() {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch {}
    },
    // Call after page load to swap nav links between logged-in / out states.
    // Expects a container with id="navRight" OR data-auth-nav attribute.
    paintNav(container) {
      const host = container || document.getElementById('navRight') ||
        document.querySelector('[data-auth-nav]');
      if (!host) return;
      const loggedIn = this.isLoggedIn();
      const user = this.getUser();
      const existing = host.querySelectorAll('[data-auth-inject]');
      existing.forEach(n => n.remove());

      const mk = (html) => {
        const span = document.createElement('span');
        span.setAttribute('data-auth-inject', '1');
        span.innerHTML = html;
        return span.firstElementChild;
      };

      if (loggedIn) {
        host.appendChild(mk(`<a data-auth-inject="1" href="/dashboard.html" style="color:var(--muted);text-decoration:none;font-size:.85rem;font-weight:600">Dashboard</a>`));
        const b = document.createElement('button');
        b.setAttribute('data-auth-inject', '1');
        b.textContent = 'Log out' + (user?.email ? ` (${user.email.split('@')[0]})` : '');
        b.style.cssText = 'background:transparent;border:1px solid var(--border);color:var(--muted);padding:9px 14px;border-radius:8px;font-size:.8rem;font-weight:600;cursor:pointer;font-family:inherit';
        b.addEventListener('click', () => { BagGuyAuth.logout(); location.href = '/'; });
        host.appendChild(b);
      } else {
        host.appendChild(mk(`<a data-auth-inject="1" href="/login.html" style="color:var(--muted);text-decoration:none;font-size:.85rem;font-weight:600">Log in</a>`));
        host.appendChild(mk(`<a data-auth-inject="1" class="btn-nav" href="/signup.html" style="background:var(--purple);color:#fff;padding:9px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:.875rem">Sign up</a>`));
      }
    },
  };

  window.BagGuyAuth = BagGuyAuth;
})();
