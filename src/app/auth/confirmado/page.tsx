'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LinkPageShell, primaryButton } from '@/components/public/LinkPageShell';

/** Destino del correo de confirmación de cuenta de Supabase. */
export default function EmailConfirmedPage() {
  const [error, setError] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(params.get('error_description')?.replace(/\+/g, ' ') ?? null);
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  if (error === undefined) return null;

  return error ? (
    <LinkPageShell title="No pudimos confirmar tu correo" expression="sad">
      <p className="text-sm text-[#A3A3A3] text-center">{error}</p>
      <Link href="/" className={primaryButton}>
        Volver al inicio
      </Link>
    </LinkPageShell>
  ) : (
    <LinkPageShell title="¡Correo confirmado!">
      <p className="text-sm text-[#A3A3A3] text-center">Tu cuenta está lista. Inicia sesión para empezar tu aventura.</p>
      <Link href="/" className={primaryButton}>
        Iniciar sesión
      </Link>
    </LinkPageShell>
  );
}
