'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';

/** Piezas comunes del panel de administración (mismo estilo que el resto de LexCode). */

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Carga datos de la API con estados de carga y error; `reload()` vuelve a pedirlos. */
export function useApiData<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return;
    const ctrl = new AbortController();
    let active = true;
    api<T>(path, { signal: ctrl.signal })
      .then((d) => {
        if (!active) return;
        setData(d);
        setError('');
      })
      .catch((err) => {
        if (active && (err as Error).name !== 'AbortError') setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      ctrl.abort();
    };
  }, [path, version]);

  const reload = useCallback(() => {
    setLoading(true);
    setVersion((v) => v + 1);
  }, []);

  return { data, error, loading, reload, setData };
}

export const PageHeader: React.FC<{ title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  title,
  subtitle,
  actions,
}) => (
  <div className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
      {subtitle && <p className="text-sm text-[#A3A3A3] mt-1.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#111111] border border-[#222222] rounded-2xl ${className}`}>{children}</div>
);

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[#00FFEF] text-black hover:brightness-105',
  outline: 'bg-[#0A1E1D] border border-[#00FFEF] text-[#00FFEF] hover:bg-[#002A28]',
  ghost: 'border border-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:border-[#3A3A3A]',
  danger: 'bg-[#1A080C] border border-[#FF3366] text-[#FF3366] hover:bg-[#2A0A14]',
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; small?: boolean }
> = ({ variant = 'primary', small, className = '', type = 'button', ...props }) => (
  <button
    type={type}
    {...props}
    className={`${small ? 'px-3 py-1.5 text-[11px]' : 'px-5 py-2.5 text-xs'} rounded-lg font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_STYLES[variant]} ${className}`}
  />
);

/** Estilo de campo sin ancho (para filtros en línea: agrega w-44, max-w-sm, etc.). */
export const inputBase =
  'h-10 px-3.5 rounded-lg bg-[#0B0B0B] border border-[#242424] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF] [color-scheme:dark]';

export const inputClass = `w-full ${inputBase}`;

export const Field: React.FC<{ label: string; htmlFor: string; children: React.ReactNode; hint?: string }> = ({
  label,
  htmlFor,
  children,
  hint,
}) => (
  <div>
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-[#A3A3A3] mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-[#757575] mt-1">{hint}</p>}
  </div>
);

const BADGE_TONES = {
  cyan: 'bg-[#0A1E1D] text-[#00FFEF] border-[#00FFEF]/40',
  pink: 'bg-[#1A080C] text-[#FF3366] border-[#FF3366]/40',
  amber: 'bg-[#1F1606] text-[#FFB020] border-[#FFB020]/40',
  gray: 'bg-[#161616] text-[#A3A3A3] border-[#2A2A2A]',
};
export type BadgeTone = keyof typeof BADGE_TONES;

export const Badge: React.FC<{ tone?: BadgeTone; children: React.ReactNode }> = ({ tone = 'gray', children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold ${BADGE_TONES[tone]}`}>
    {children}
  </span>
);

export const Loading: React.FC = () => (
  <div className="py-16 flex justify-center" role="status">
    <div className="w-7 h-7 rounded-full border-2 border-[#242424] border-t-[#00FFEF] animate-spin" aria-hidden="true" />
    <span className="sr-only">Cargando…</span>
  </div>
);

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <Card className="p-8 text-center space-y-3">
    <p role="alert" className="text-sm text-[#FF3366]">
      {message}
    </p>
    {onRetry && (
      <Button variant="ghost" small onClick={onRetry}>
        <span className="inline-flex items-center gap-1.5">
          <RotateCw className="w-3 h-3" /> Reintentar
        </span>
      </Button>
    )}
  </Card>
);

export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <Card className="p-10 text-center text-sm text-[#757575]">{message}</Card>
);

export const Notice: React.FC<{ kind: 'ok' | 'error'; text: string }> = ({ kind, text }) => (
  <p
    role={kind === 'error' ? 'alert' : 'status'}
    className={`text-xs font-semibold ${kind === 'ok' ? 'text-[#00FFEF]' : 'text-[#FF3366]'}`}
  >
    {kind === 'ok' ? '✓ ' : ''}
    {text}
  </p>
);

export const Pagination: React.FC<{ page: number; pageSize: number; total: number; onPage: (p: number) => void }> = ({
  page,
  pageSize,
  total,
  onPage,
}) => {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return <p className="text-xs text-[#757575]">{total} en total</p>;
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-[#A3A3A3]">
      <span>
        {total} en total · página {page} de {pages}
      </span>
      <div className="flex gap-2">
        <Button variant="ghost" small disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Anterior
        </Button>
        <Button variant="ghost" small disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export function formatDate(value: string | null | undefined, withTime = false): string {
  if (!value) return '—';
  const d = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

/** Construye un query string ignorando valores vacíos. */
export function qs(params: Record<string, string | number | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  return entries.length ? `?${new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()}` : '';
}
