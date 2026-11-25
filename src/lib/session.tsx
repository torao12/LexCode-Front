'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, loadSession, saveSession, setSessionExpiredHandler, type Session } from './api';
import type { SessionProfile } from './types';

interface SessionContextValue {
  /** null = sin sesión; undefined = todavía cargando. */
  profile: SessionProfile | null | undefined;
  login: (email: string, password: string) => Promise<SessionProfile>;
  /** Guarda una sesión recibida (p. ej. al registrarse) y carga el perfil. */
  adoptSession: (session: Session) => Promise<SessionProfile | null>;
  logout: () => Promise<void>;
  reloadProfile: () => Promise<void>;
  /** Actualiza campos del perfil en memoria sin pedirlo de nuevo. */
  patchProfile: (patch: Partial<SessionProfile>) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<SessionProfile | null | undefined>(undefined);

  const reloadProfile = useCallback(async () => {
    if (!loadSession()) {
      setProfile(null);
      return;
    }
    try {
      setProfile(await api<SessionProfile>('/auth/me'));
    } catch {
      saveSession(null);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => setProfile(null));
    // Al abrir la app se recupera la sesión guardada.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reloadProfile();
    return () => setSessionExpiredHandler(null);
  }, [reloadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api<{ session: Session; profile: SessionProfile }>('/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    });
    saveSession(res.session);
    setProfile(res.profile);
    return res.profile;
  }, []);

  const adoptSession = useCallback(async (session: Session) => {
    saveSession(session);
    try {
      const me = await api<SessionProfile>('/auth/me');
      setProfile(me);
      return me;
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (loadSession()) await api('/auth/logout', { method: 'POST' });
    } catch {
      // Aunque falle la red, la sesión local se borra.
    }
    saveSession(null);
    setProfile(null);
  }, []);

  const patchProfile = useCallback((patch: Partial<SessionProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo(
    () => ({ profile, login, adoptSession, logout, reloadProfile, patchProfile }),
    [profile, login, adoptSession, logout, reloadProfile, patchProfile],
  );
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession debe usarse dentro de <SessionProvider>');
  return ctx;
}
