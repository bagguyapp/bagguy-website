const API = 'https://bagguy.byorkmc.com'
const TOKEN_KEY = 'bagguy_token'

export const auth = {
  API,
  getToken: () => { try { return localStorage.getItem(TOKEN_KEY) || null } catch { return null } },
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
}
