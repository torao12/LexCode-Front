'use client';

import React from 'react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';
import { LexisMascot } from '@/components/brand/LexisMascot';

interface LandingViewProps {
  onStartAdventure: () => void;
  onLogin: () => void;
  onViewModules: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartAdventure,
  onLogin,
  onViewModules,
}) => {
  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden flex flex-col justify-between overflow-x-hidden">
      <div
        className="pointer-events-none absolute left-0 bottom-0 w-[260px] h-[340px] lexcode-dot-pattern opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 w-[220px] sm:w-[360px] lg:w-[460px] h-[240px] sm:h-[360px] lg:h-[440px] lexcode-dot-pattern opacity-75 sm:opacity-90"
        aria-hidden="true"
      />

      <header className="relative z-10 max-w-6xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-7 pb-3 sm:pb-4 flex items-center justify-between gap-2 sm:gap-4">
        <LexCodeLogo size="md" />

        <nav className="flex items-center gap-2 sm:gap-6 text-[11px] sm:text-sm shrink-0" aria-label="Navegación pública">
          <button
            type="button"
            onClick={onViewModules}
            className="hidden sm:inline-block text-[#A3A3A3] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Acerca de
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="text-white font-semibold hover:text-[#00FFEF] transition-colors whitespace-nowrap px-1.5 py-1 cursor-pointer"
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={onStartAdventure}
            className="bg-[#00FFEF] text-black font-semibold text-[11px] sm:text-xs px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full hover:brightness-105 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            Regístrate gratis
          </button>
        </nav>
      </header>

      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <div className="lg:col-span-6 space-y-6">
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#00FFEF] uppercase">
            APRENDIZAJE GAMIFICADO PARA INGENIEROS
          </p>

          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.06] tracking-tight text-white">
            Domina la etica y
            <br />
            legislacion en TI.
          </h1>

          <p className="text-sm sm:text-base text-[#A3A3A3] max-w-md leading-relaxed">
            Aprende ciberseguridad, proteccion de datos y buenas practicas
            resolviendo dilemas reales de la industria del software.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStartAdventure}
              className="bg-[#00FFEF] text-black font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg hover:brightness-105 transition cursor-pointer"
            >
              Comenzar mi aventura
            </button>
            <button
              type="button"
              onClick={onViewModules}
              className="bg-[#111111] border border-[#262626] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg hover:border-[#757575] transition cursor-pointer"
            >
              Ver modulos
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-8 pt-6">
            <div>
              <div className="text-2xl font-bold text-white">+20</div>
              <div className="text-xs text-[#A3A3A3] leading-snug">
                Dilemas
                <br />
                eticos
              </div>
            </div>
            <div className="h-9 w-[1px] bg-[#242424]" aria-hidden="true" />
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-xs text-[#A3A3A3] leading-snug">
                Rutas de
                <br />
                especialidad
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative min-h-[380px] flex items-center justify-center">
          <div className="w-full h-[360px] rounded-2xl lexcode-grid-pattern relative flex items-center justify-center">
            <div className="absolute top-2 left-8 bg-[#0B0B0B] border border-[#00FFEF] rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
              <span className="w-6 h-6 rounded-full bg-[#00FFEF] shrink-0" />
              <span className="text-xs font-semibold text-white">Etica Profesional</span>
            </div>

            <LexisMascot expression="happy" className="w-48 h-56 mt-6" />

            <div className="absolute bottom-2 right-4 bg-[#111111] border border-[#252525] rounded-xl px-5 py-3.5 flex items-center gap-3.5">
              <span className="w-7 h-7 rounded-full bg-[#3A3A3A] shrink-0" />
              <span className="text-xs font-semibold text-[#A3A3A3]">Ciberseguridad</span>
            </div>
          </div>
        </div>
      </main>

      <div className="h-6" />
    </div>
  );
};
