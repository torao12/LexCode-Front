'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { UserRole } from '@/types/lexcode';

interface AuthViewProps {
  initialMode?: 'register' | 'login';
  onCompleteAuth: (role: UserRole, fullName: string) => void;
  onBackToLanding: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'register',
  onCompleteAuth,
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Completa tu nombre, correo universitario (.edu) y contraseña.');
        return;
      }
      if (!acceptedTerms) {
        setErrorMsg('Debes aceptar el Aviso de privacidad y los Términos y condiciones.');
        return;
      }
    } else if (!email.trim() || !password.trim()) {
      setErrorMsg('Ingresa tu correo y contraseña para continuar.');
      return;
    }

    setErrorMsg('');
    const resolvedName = fullName.trim() || 'Ian Mauricio Morales Montejo';
    onCompleteAuth(role, resolvedName);
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

      <header className="relative z-10 max-w-6xl w-full mx-auto px-8 pt-7 flex items-center justify-between">
        <button type="button" onClick={onBackToLanding} className="cursor-pointer">
          <LexCodeLogo size="md" />
        </button>

        <div className="flex items-center gap-2 bg-[#111111] border border-[#242424] rounded-lg p-1 text-xs">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              role === 'student' ? 'bg-[#00FFEF] text-black' : 'text-[#A3A3A3]'
            }`}
          >
            Rol Alumno
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
              role === 'teacher' ? 'bg-[#00FFEF] text-black' : 'text-[#A3A3A3]'
            }`}
          >
            Rol Docente
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Columna izquierda con encabezado y mascota */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            {mode === 'register' ? '¡Crea tu cuenta!' : '¡Bienvenido de nuevo!'}
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-3 max-w-xs leading-relaxed">
            {mode === 'register'
              ? 'Regístrate para empezar a resolver dilemas y ganar insignias'
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
            className="w-full max-w-lg bg-[#0D0D0D] border border-[#00FFEF] rounded-2xl p-8 space-y-5"
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
                  className="w-full h-11 px-4 rounded-xl bg-[#070707] border border-[#242424] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF]"
                />
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
                className="w-full h-11 px-4 rounded-xl bg-[#070707] border border-[#242424] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF]"
              />
            </div>

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
            </div>

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

            {errorMsg && (
              <p role="alert" className="text-xs text-[#FF3366] font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#00FFEF] text-black font-bold text-sm hover:brightness-105 transition cursor-pointer"
            >
              {mode === 'register' ? 'Comenzar mi aventura' : 'Iniciar sesión'}
            </button>

            <p className="text-center text-xs text-[#A3A3A3] pt-1">
              {mode === 'register' ? (
                <>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
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
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                    }}
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
