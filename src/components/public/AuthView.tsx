'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { api, ApiError, errorMessage } from '@/lib/api';
import { useSession } from '@/lib/session';
import type { RegisterResult } from '@/lib/types';

interface AuthViewProps {
  initialMode?: 'register' | 'login';
  /** isNewAccount = true justo después de registrarse (muestra el onboarding). */
  onCompleteAuth: (isNewAccount: boolean) => void;
  onBackToLanding: () => void;
}

const inputClass =
  'w-full h-11 px-4 rounded-xl bg-[#070707] border border-[#242424] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF]';

/** Edad cumplida a partir de AAAA-MM-DD. */
function ageFrom(birthDate: string): number | null {
  const [y, m, d] = birthDate.split('-').map(Number);
  if (!y || !m || !d) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  return age;
}

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="text-[11px] text-[#FF3366] mt-1.5">{message}</p> : null;

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'register',
  onCompleteAuth,
  onBackToLanding,
}) => {
  const { login, adoptSession } = useSession();
  const [mode, setMode] = useState<'register' | 'login' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [secondaryPurposes, setSecondaryPurposes] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notice, setNotice] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const age = birthDate ? ageFrom(birthDate) : null;
  const isMinor = age !== null && age >= 13 && age < 18;

  const switchMode = (next: 'register' | 'login' | 'forgot') => {
    setMode(next);
    setErrorMsg('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setNotice('');
    setFieldErrors({});

    if (mode === 'forgot') {
      if (!email.trim()) return setErrorMsg('Escribe el correo de tu cuenta.');
    } else if (mode === 'login') {
      if (!email.trim() || !password) return setErrorMsg('Ingresa tu correo y contraseña para continuar.');
    } else {
      if (!fullName.trim() || !username.trim() || !email.trim() || !password || !birthDate) {
        return setErrorMsg('Completa todos los campos para crear tu cuenta.');
      }
      if (age !== null && age < 13) return setErrorMsg('LexCode no admite cuentas de menores de 13 años.');
      if (isMinor && !guardianEmail.trim()) {
        return setFieldErrors({ guardianEmail: 'Obligatorio para menores de edad' });
      }
      if (!acceptedTerms) return setErrorMsg('Debes aceptar el Aviso de privacidad y los Términos y condiciones.');
    }

    setBusy(true);
    try {
      if (mode === 'forgot') {
        await api('/auth/password/forgot', { method: 'POST', auth: false, body: { email: email.trim() } });
        setNotice('Si existe una cuenta con ese correo, te enviamos un enlace para restablecer tu contraseña.');
        setMode('login');
      } else if (mode === 'login') {
        await login(email.trim(), password);
        onCompleteAuth(false);
      } else {
        const result = await api<RegisterResult>('/auth/register', {
          method: 'POST',
          auth: false,
          body: {
            fullName: fullName.trim(),
            username: username.trim(),
            email: email.trim(),
            password,
            birthDate,
            guardianEmail: isMinor ? guardianEmail.trim() : undefined,
            acceptPrivacy: true,
            acceptTerms: true,
            secondaryPurposes,
          },
        });
        if (result.session) {
          await adoptSession(result.session);
          onCompleteAuth(result.status === 'active');
        } else {
          setNotice(
            `Te enviamos un correo a ${email.trim()} para confirmar tu cuenta.` +
              (result.status === 'pending_guardian'
                ? ' También escribimos a tu madre, padre o tutor para que autorice tu registro.'
                : '') +
              ' Después inicia sesión aquí.',
          );
          setPassword('');
          setMode('login');
        }
      }
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) setFieldErrors(err.fields);
      if (err instanceof ApiError && err.code === 'username_taken') setFieldErrors({ username: err.message });
      setErrorMsg(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden flex flex-col">
      <div
        className="pointer-events-none absolute left-0 bottom-0 w-[260px] h-[340px] lexcode-dot-pattern opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 w-[440px] h-[420px] lexcode-dot-pattern opacity-90"
        aria-hidden="true"
      />

      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 flex items-center justify-between gap-3">
        <button type="button" onClick={onBackToLanding} className="cursor-pointer">
          <LexCodeLogo size="md" />
        </button>

      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Columna izquierda con encabezado y mascota */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            {mode === 'register' ? '¡Crea tu cuenta!' : mode === 'forgot' ? 'Recupera tu acceso' : '¡Bienvenido de nuevo!'}
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-3 max-w-xs leading-relaxed">
            {mode === 'register'
              ? 'Regístrate para empezar a resolver dilemas y ganar insignias'
              : mode === 'forgot'
                ? 'Te enviaremos un enlace para crear una nueva contraseña'
                : 'Inicia sesión con tu cuenta institucional para continuar tu progreso'}
          </p>

          <div className="mt-6 lg:ml-10">
            <LexisMascot expression="happy" className="w-44 h-52" />
          </div>
        </div>

        {/* Columna derecha: tarjeta de formulario */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg bg-[#0D0D0D] border border-[#00FFEF] rounded-2xl p-5 sm:p-8 space-y-5"
          >
            {mode === 'register' && (
              <div>
                <label
                  htmlFor="auth-fullname"
                  className="block text-xs font-semibold text-white mb-2"
                >
                  Nombre completo
                </label>
                <input
                  id="auth-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Andrés Silva"
                  autoComplete="name"
                  className={inputClass}
                />
                <FieldError message={fieldErrors.fullName} />
              </div>
            )}

            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="auth-username" className="block text-xs font-semibold text-white mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    id="auth-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="andres_silva"
                    autoComplete="username"
                    className={inputClass}
                  />
                  <FieldError message={fieldErrors.username} />
                </div>
                <div>
                  <label htmlFor="auth-birthdate" className="block text-xs font-semibold text-white mb-2">
                    Fecha de nacimiento
                  </label>
                  <input
                    id="auth-birthdate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    autoComplete="bday"
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                  <FieldError message={fieldErrors.birthDate} />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-semibold text-white mb-2"
              >
                Correo universitario (.edu)
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@universidad.edu.mx"
                autoComplete="email"
                className={inputClass}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            {mode !== 'forgot' && (
            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-semibold text-white mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#070707] border border-[#242424] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Mostrar u ocultar contraseña"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-white cursor-pointer"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={fieldErrors.password} />
              {mode === 'register' && !fieldErrors.password && (
                <p className="text-[11px] text-[#757575] mt-1.5">Mínimo 8 caracteres, con al menos una letra y un número.</p>
              )}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-[11px] text-[#00FFEF] hover:underline mt-2 cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            )}

            {mode === 'register' && isMinor && (
              <div>
                <label htmlFor="auth-guardian" className="block text-xs font-semibold text-white mb-2">
                  Correo de tu madre, padre o tutor
                </label>
                <input
                  id="auth-guardian"
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="tutor@correo.com"
                  className={inputClass}
                />
                <FieldError message={fieldErrors.guardianEmail} />
                <p className="text-[11px] text-[#757575] mt-1.5">
                  Como eres menor de edad, le pediremos que autorice tu cuenta.
                </p>
              </div>
            )}

            {mode === 'register' && (
              <label className="flex items-start gap-3 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#333333] bg-[#111111] accent-[#00FFEF]"
                />
                <span className="text-xs text-[#A3A3A3] leading-relaxed">
                  He leído y acepto el{' '}
                  <span className="text-[#00FFEF] underline">Aviso de privacidad</span> y los{' '}
                  <span className="text-[#00FFEF] underline">Términos y condiciones</span>
                </span>
              </label>
            )}

            {mode === 'register' && (
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={secondaryPurposes}
                  onChange={(e) => setSecondaryPurposes(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#333333] bg-[#111111] accent-[#00FFEF]"
                />
                <span className="text-xs text-[#A3A3A3] leading-relaxed">
                  (Opcional) Acepto que mis datos se usen para mejorar la plataforma con estadísticas anónimas
                </span>
              </label>
            )}

            {notice && <p className="text-xs text-[#00FFEF] font-medium">{notice}</p>}

            {errorMsg && (
              <p role="alert" className="text-xs text-[#FF3366] font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-12 rounded-xl bg-[#00FFEF] text-black font-bold text-sm hover:brightness-105 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {busy
                ? 'Un momento…'
                : mode === 'register'
                  ? 'Comenzar mi aventura'
                  : mode === 'forgot'
                    ? 'Enviar enlace'
                    : 'Iniciar sesión'}
            </button>

            <p className="text-center text-xs text-[#A3A3A3] pt-1">
              {mode === 'register' ? (
                <>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-[#00FFEF] font-semibold hover:underline cursor-pointer"
                  >
                    Iniciar sesión
                  </button>
                </>
              ) : (
                <>
                  ¿Aún no tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-[#00FFEF] font-semibold hover:underline cursor-pointer"
                  >
                    Regístrate gratis
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};
