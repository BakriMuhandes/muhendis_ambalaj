import { getAccessToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

async function request(path: string, init?: RequestInit) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'API istegi basarisiz');
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.blob();
}

export const api = {
  login: (username: string, password: string) =>
    request('/customer-auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  dashboard: () => request('/portal/dashboard'),
  deliveries: (from?: string, to?: string) =>
    request(`/portal/deliveries${buildQuery({ from, to })}`),
  payments: () => request('/portal/payments'),
  reportMonthly: (year: number, month: number) =>
    request(`/portal/reports/monthly${buildQuery({ year: String(year), month: String(month) })}`),
  reportYearly: (year: number) =>
    request(`/portal/reports/yearly${buildQuery({ year: String(year) })}`),
  reportCustom: (from: string, to: string) =>
    request(`/portal/reports/custom${buildQuery({ from, to })}`),
  reportXlsx: (params: Record<string, string>) =>
    request(`/portal/reports/export/xlsx${buildQuery(params)}`),
  reportPrint: (params: Record<string, string>) =>
    request(`/portal/reports/export/print${buildQuery(params)}`),
};

function buildQuery(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const q = search.toString();
  return q ? `?${q}` : '';
}