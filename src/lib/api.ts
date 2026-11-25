/**
 * Cliente de la API de LexCode (repositorio LexCode-Back).
 * Respuestas: { data } en éxito y { error: { code, message, details } } en error.
 */

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

const STORAGE_KEY = 'lexcode.session';

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number | null;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------- sesión guardada
export function loadSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null): void {
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Navegación privada o almacenamiento bloqueado: la sesión dura solo esta pestaña.
  }
}

let onSessionExpired: (() => void) | null = null;
/** El SessionProvider se registra aquí para volver al login si la sesión ya no se puede renovar. */
export function setSessionExpiredHandler(fn: (() => void) | null) {
  onSessionExpired = fn;
}

// ---------------------------------------------------------------- peticiones
interface RequestOptions {
  method?: string;
  body?: unknown;
  form?: FormData;
  auth?: boolean;
  /** Token explícito (p. ej. el de recuperación de contraseña). */
  token?: string;
  signal?: AbortSignal;
}

async function rawRequest(path: string, opts: RequestOptions, token?: string): Promise<Response> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  try {
    return await fetch(`${API_URL}${path}`, { method: opts.method ?? 'GET', headers, body, signal: opts.signal });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    throw new ApiError(0, 'network_error', 'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.');
  }
}

async function toError(res: Response): Promise<ApiError> {
  try {
    const json = await res.json();
    const e = json?.error ?? {};
    return new ApiError(res.status, e.code ?? 'error', e.message ?? 'Ocurrió un error', e.details?.fields ?? {});
  } catch {
    return new ApiError(res.status, 'error', 'Ocurrió un error inesperado');
  }
}

let refreshing: Promise<Session | null> | null = null;

/** Renueva el access token una sola vez aunque varias peticiones fallen al mismo tiempo. */
async function refreshSession(): Promise<Session | null> {
  if (refreshing) return refreshing;
  const current = loadSession();
  if (!current?.refreshToken) return null;
  refreshing = (async () => {
    const res = await rawRequest('/auth/refresh', { method: 'POST', body: { refreshToken: current.refreshToken } });
    if (!res.ok) return null;
    const json = await res.json();
    const next: Session = json.data.session;
    saveSession(next);
    return next;
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export async function api<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const useAuth = opts.auth !== false;
  const token = opts.token ?? (useAuth ? loadSession()?.accessToken : undefined);
  let res = await rawRequest(path, opts, token);

  // Token vencido: se renueva y se repite la petición una vez.
  if (res.status === 401 && useAuth && !opts.token && loadSession()) {
    const renewed = await refreshSession();
    if (renewed) {
      res = await rawRequest(path, opts, renewed.accessToken);
    } else {
      saveSession(null);
      onSessionExpired?.();
    }
  }
  if (!res.ok) throw await toError(res);
  if (res.status === 204) return undefined as T;
  const json = await res.json();
  return json.data as T;
}

/** Descarga un archivo de la API (p. ej. exportación de datos) con la sesión actual. */
export async function downloadFile(path: string, fallbackName: string): Promise<void> {
  let res = await rawRequest(path, {}, loadSession()?.accessToken);
  if (res.status === 401 && (await refreshSession())) res = await rawRequest(path, {}, loadSession()?.accessToken);
  if (!res.ok) throw await toError(res);
  const blob = await res.blob();
  const name = /filename="([^"]+)"/.exec(res.headers.get('content-disposition') ?? '')?.[1] ?? fallbackName;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/** Mensaje para mostrar al usuario a partir de cualquier error. */
export function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  return 'Ocurrió un error inesperado';
}
