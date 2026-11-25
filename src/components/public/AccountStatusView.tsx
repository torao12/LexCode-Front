'use client';

import React, { useState } from 'react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { api, errorMessage } from '@/lib/api';
import { useSession } from '@/lib/session';

/** Pantalla para cuentas que todavía no pueden usar la app: esperando al tutor o en eliminación. */
export const AccountStatusView: React.FC = () => {
  const { profile, logout, reloadProfile } = useSession();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  if (!profile) return null;
  const pending = profile.status === 'pending_guardian';
  const deleted = profile.status === 'deleted';

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await fn();
      setNotice(ok);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col">
      <header className="max-w-6xl w-full mx-auto px-8 pt-7">
        <LexCodeLogo size="md" />
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-[#0D0D0D] border border-[#00FFEF] rounded-2xl p-8 text-center space-y-5">
          <div className="flex justify-center">
            <LexisMascot expression={pending ? 'wave' : 'sad'} className="w-32 h-40" />
          </div>
          <h1 className="text-2xl font-bold">
            {pending ? 'Esperando a tu madre, padre o tutor' : deleted ? 'Tu cuenta está en eliminación' : 'Tu cuenta no está activa'}
          </h1>
          <p className="text-sm text-[#A3A3A3] leading-relaxed">
            {pending
              ? 'Como eres menor de edad, enviamos un correo a tu madre, padre o tutor para que autorice tu cuenta. En cuanto lo haga podrás empezar.'
              : deleted
                ? 'Pediste eliminar tu cuenta. Tienes 30 días para recuperarla; después se borra junto con tus datos.'
                : 'Escribe a soporte para saber más.'}
          </p>

          {notice && <p className="text-xs font-semibold text-[#00FFEF]">{notice}</p>}
          {error && (
            <p role="alert" className="text-xs font-semibold text-[#FF3366]">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            {pending && (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(() => api('/auth/guardian/resend', { method: 'POST' }), 'Listo, reenviamos el correo.')}
                  className="px-5 py-3 rounded-xl bg-[#00FFEF] text-black text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Reenviar correo
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => run(reloadProfile, '')}
                  className="px-5 py-3 rounded-xl border border-[#00FFEF] text-[#00FFEF] text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  Ya me autorizó
                </button>
              </>
            )}
            {deleted && (
              <button
                type="button"
                disabled={busy}
                onClick={() => run(async () => {
                  await api('/privacy/account/restore', { method: 'POST' });
                  await reloadProfile();
                }, '')}
                className="px-5 py-3 rounded-xl bg-[#00FFEF] text-black text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                Recuperar mi cuenta
              </button>
            )}
            <button
              type="button"
              onClick={() => void logout()}
              className="px-5 py-3 rounded-xl border border-[#333333] text-[#A3A3A3] text-xs font-bold hover:text-white cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
