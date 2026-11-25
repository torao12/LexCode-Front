'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, errorMessage } from '@/lib/api';
import { LinkPageShell, primaryButton } from '@/components/public/LinkPageShell';

/**
 * Supabase manda aquí desde el correo de recuperación con
 * #access_token=…&type=recovery en la URL.
 */
export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    // El token se lee una sola vez y se quita de la barra de direcciones.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(params.get('access_token'));
    if (params.get('error_description')) setError(params.get('error_description')!.replace(/\+/g, ' '));
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Las contraseñas no coinciden.');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      return setError('Usa al menos 8 caracteres, con letras y números.');
    }
    setBusy(true);
    try {
      await api('/auth/password/reset', { method: 'POST', token: token!, body: { password } });
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (token === undefined) return null;

  if (done) {
    return (
      <LinkPageShell title="¡Contraseña actualizada!">
        <p className="text-sm text-[#A3A3A3] text-center">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link href="/" className={primaryButton}>
          Ir a LexCode
        </Link>
      </LinkPageShell>
    );
  }

  if (!token) {
    return (
      <LinkPageShell title="El enlace no es válido" expression="sad">
        <p className="text-sm text-[#A3A3A3] text-center">
          {error || 'El enlace expiró o ya se usó. Solicita uno nuevo desde “¿Olvidaste tu contraseña?”.'}
        </p>
        <Link href="/" className={primaryButton}>
          Volver al inicio
        </Link>
      </LinkPageShell>
    );
  }

  return (
    <LinkPageShell title="Crea una nueva contraseña">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-xs font-semibold mb-2">
            Nueva contraseña
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#070707] border border-[#242424] text-sm focus:outline-none focus:border-[#00FFEF]"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-xs font-semibold mb-2">
            Repite la contraseña
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-[#070707] border border-[#242424] text-sm focus:outline-none focus:border-[#00FFEF]"
          />
        </div>
        {error && (
          <p role="alert" className="text-xs text-[#FF3366]">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className={primaryButton}>
          {busy ? 'Guardando…' : 'Guardar contraseña'}
        </button>
      </form>
    </LinkPageShell>
  );
}
