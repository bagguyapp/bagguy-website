// Bag Guy shared auth helpers.
// Included from every page via <script src="/assets/auth.js"></script>
(function () {
  // Production Bag Guy API. Keep this public base URL only; never place secrets
  // or private API keys in the website bundle.
  const API = 'https://api.bagguyapp.com';
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
    tokenFrom(data) {
      return data?.token || data?.access_token || null;
    },
    userFrom(data) {
      return data?.user || data?.profile || data || null;
    },
    setSession(data) {
      const token = this.tokenFrom(data);
      const user = this.userFrom(data);
      if (!token) throw new Error('The server did not return a session token.');
      this.setToken(token);
      if (user) this.setUser(user);
      return { token, user };
    },
    errorText(data, fallback) {
      const detail = data?.detail || data?.message || data?.error;
      if (Array.isArray(detail)) {
        return detail.map((item) => item?.msg || item?.message || String(item)).join(' ');
      }
      if (detail && typeof detail === 'object') return detail.msg || detail.message || fallback;
      return detail || fallback;
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
        host.appendChild(mk(`<a data-auth-inject="1" href="/rewards.html" style="color:var(--muted);text-decoration:none;font-size:.85rem;font-weight:800">Rewards</a>`));
        host.appendChild(mk(`<a data-auth-inject="1" href="/dashboard.html" style="color:var(--muted);text-decoration:none;font-size:.85rem;font-weight:800">Dashboard</a>`));
        const b = document.createElement('button');
        b.setAttribute('data-auth-inject', '1');
        b.textContent = 'Log out' + (user?.email ? ` (${user.email.split('@')[0]})` : '');
        b.style.cssText = 'background:#fff;border:1px solid var(--line,#dce9e2);color:var(--muted);padding:9px 14px;border-radius:999px;font-size:.8rem;font-weight:850;cursor:pointer;font-family:inherit';
        b.addEventListener('click', () => { BagGuyAuth.logout(); location.href = '/'; });
        host.appendChild(b);
      } else {
        host.appendChild(mk(`<a data-auth-inject="1" href="/login.html" style="color:var(--muted);text-decoration:none;font-size:.85rem;font-weight:800">Log in</a>`));
        host.appendChild(mk(`<a data-auth-inject="1" class="btn-nav" href="/signup.html" style="background:var(--green,#0aae63);color:#fff;padding:9px 16px;border-radius:999px;text-decoration:none;font-weight:900;font-size:.875rem">Sign up</a>`));
      }
    },
  };

  window.BagGuyAuth = BagGuyAuth;
})();
