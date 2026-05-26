const ACCESS_TOKEN_KEY = 'portal_access_token';

export function getAccessToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(ACCESS_TOKEN_KEY) || '';
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function logout() {
  clearAccessToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/giris';
  }
}