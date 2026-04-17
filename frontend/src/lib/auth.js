const KEY = 'reesha_admin_token';
const ADMIN_KEY = 'reesha_admin_profile';

export function getToken() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function setToken(token) {
  try { localStorage.setItem(KEY, token); } catch {}
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(ADMIN_KEY);
  } catch {}
}

export function getAdmin() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setAdmin(admin) {
  try { localStorage.setItem(ADMIN_KEY, JSON.stringify(admin)); } catch {}
}
