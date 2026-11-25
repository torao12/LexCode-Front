const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://lexcode.onrender.com/api/v1';

export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

const TOKEN_STORAGE_KEY = 'lexcode_access_token';
const REFRESH_STORAGE_KEY = 'lexcode_refresh_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setSessionTokens(
  accessToken?: string | null,
  refreshToken?: string | null
) {
  if (typeof window === 'undefined') return;
  if (accessToken) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  }
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
  }
}

export function clearSessionTokens() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(REFRESH_STORAGE_KEY);
}

interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Content-Type') && !(rest.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAccessToken();
    if (token && !requestHeaders.has('Authorization')) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });

  if (response.status === 401 && auth) {
    clearSessionTokens();
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      (data &&
      typeof data === 'object' &&
      ('message' in data || 'error' in data)
        ? String(
            (data as { message?: string; error?: string }).message ||
              (data as { error?: string }).error
          )
        : null) || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}
