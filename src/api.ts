import { Platform } from 'react-native';

import { API_URL, authClient } from '@/auth-client';

export class SessionExpired extends Error {}

export async function api<T = unknown>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const cookie = Platform.OS === 'web' ? undefined : await authClient.getCookie();
  const res = await fetch(`${API_URL}/api/data${path}`, {
    method,
    credentials: Platform.OS === 'web' ? 'include' : 'omit',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 401) throw new SessionExpired();
  if (!res.ok) throw new Error(`api ${res.status}`);
  return res.json() as Promise<T>;
}
