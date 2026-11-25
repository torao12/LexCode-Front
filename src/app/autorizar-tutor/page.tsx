'use client';

import React, { useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import { LinkPageShell, primaryButton } from '@/components/public/LinkPageShell';

/** El correo al tutor trae ?token=…; se autoriza la cuenta solo al confirmar. */
export default function GuardianAuthorizationPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(new URLSearchParams(window.location.search).get('token'));
  }, []);

  const authorize = async () => {
    setState('busy');
    try {
      await api('/auth/guardian/confirm', { method: 'POST', auth: false, body: { token } });
      setState('done');
    } catch (err) {
      setError(errorMessage(err));
      setState('error');
    }
  };

  if (token === undefined) return null;

  if (!token || state === 'error') {
    return (
      <LinkPageShell title="El enlace no es válido" expression="sad">
        <p className="text-sm text-[#A3A3A3] text-center">
          {error || 'Falta el código de autorización. Abre el enlace completo que llegó a tu correo.'}
        </p>
      </LinkPageShell>
    );
  }

  if (state === 'done') {
    return (
      <LinkPageShell title="¡Cuenta autorizada!">
        <p className="text-sm text-[#A3A3A3] text-center">
          Gracias. Ya puede iniciar sesión en LexCode y empezar a aprender sobre ética, legislación de TI y
          ciberseguridad.
        </p>
      </LinkPageShell>
    );
  }

  return (
    <LinkPageShell title="Autorizar cuenta en LexCode" expression="wave">
      <p className="text-sm text-[#A3A3A3] leading-relaxed">
        Una persona menor de edad a tu cargo creó una cuenta en LexCode, una plataforma educativa sobre ética
        profesional, legislación de TI y ciberseguridad. Al autorizarla aceptas el Aviso de Privacidad y los
        Términos y Condiciones en su nombre.
      </p>
      <button type="button" onClick={() => void authorize()} disabled={state === 'busy'} className={primaryButton}>
        {state === 'busy' ? 'Autorizando…' : 'Autorizar cuenta'}
      </button>
      <p className="text-[11px] text-[#757575] text-center">Si no reconoces este registro, ignora el correo.</p>
    </LinkPageShell>
  );
}
