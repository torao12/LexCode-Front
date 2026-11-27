'use client';

import React, { useState } from 'react';
import { FileText, Shield } from 'lucide-react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';
import { LexisMascot } from '@/components/brand/LexisMascot';

interface OnboardingViewProps {
  onFinishOnboarding: (selectedModule: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onFinishOnboarding,
}) => {
  const [step, setStep] = useState<'welcome' | 'select'>('welcome');
  const [selectedId, setSelectedId] = useState<string>('etica');

  const modules = [
    {
      id: 'etica',
      title: 'Ética Profesional',
      subtitle: 'Dilemas morales en el desarrollo de software.',
      recommended: true,
    },
    {
      id: 'legislacion',
      title: 'Legislación TI',
      subtitle: 'Normativas, licencias y derechos de autor digitales.',
      recommended: false,
    },
    {
      id: 'ciberseguridad',
      title: 'Ciberseguridad',
      subtitle: 'Privacidad de datos y vulnerabilidades legales.',
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden flex flex-col justify-between">
      <div
        className="pointer-events-none absolute left-0 bottom-0 w-[260px] h-[340px] lexcode-dot-pattern opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 w-[220px] sm:w-[340px] lg:w-[440px] h-[240px] sm:h-[360px] lg:h-[420px] lexcode-dot-pattern opacity-75 sm:opacity-90"
        aria-hidden="true"
      />

      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        <LexCodeLogo size="md" />
      </header>

      {step === 'welcome' ? (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Bienvenido a LexCode
          </h1>
          <p className="text-sm sm:text-base text-[#A3A3A3] mt-3 max-w-md leading-relaxed">
            Selecciona tu modulo inicial y
            <br />
            comencemos a aprender juntos
          </p>

          <div className="my-7">
            <LexisMascot expression="wave" className="w-40 h-48" />
          </div>

          <button
            type="button"
            onClick={() => setStep('select')}
            className="bg-[#00FFEF] text-black font-bold text-sm px-5 sm:px-8 py-3 rounded-xl hover:brightness-105 transition cursor-pointer"
          >
            Continuar
          </button>
        </main>
      ) : (
        <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <div className="w-24 hidden sm:block" />
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Selecciona tu Módulo Inicial
              </h1>
              <p className="text-xs sm:text-sm text-[#A3A3A3] mt-2">
                Elige el área de especialidad por la que deseas comenzar tu auditoría.
              </p>
            </div>
            <div className="hidden sm:flex justify-end w-28">
              <LexisMascot expression="happy" className="w-28 h-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 w-full mt-4 sm:mt-6">
            {modules.map((mod) => {
              const isSelected = selectedId === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedId(mod.id)}
                  className={`rounded-2xl p-4 sm:p-7 text-center flex flex-col items-center justify-center min-h-[132px] sm:min-h-[200px] transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#002A28]/50 border-2 border-[#00FFEF]'
                      : 'bg-[#111111] border border-[#222222] hover:border-[#444444]'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 ${
                      isSelected
                        ? 'border-[#00FFEF] text-[#00FFEF]'
                        : 'border-[#444444] text-[#A3A3A3]'
                    }`}
                  >
                    {mod.id === 'etica' && (
                      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                        <path
                          d="M8 14H24M16 14V24M11 14V19M21 14V19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    {mod.id === 'legislacion' && <FileText className="w-7 h-7" />}
                    {mod.id === 'ciberseguridad' && <Shield className="w-7 h-7" />}
                  </div>

                  <div className="text-base font-bold text-white">{mod.title}</div>
                  <p className="text-xs text-[#A3A3A3] mt-2 max-w-[190px] leading-relaxed">
                    {mod.subtitle}
                  </p>

                  {mod.recommended && (
                    <span className="mt-4 inline-block bg-[#00FFEF] text-black text-[10px] font-bold px-3 py-1 rounded-full">
                      Recomendado
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onFinishOnboarding(selectedId)}
            className="mt-5 sm:mt-8 bg-[#00FFEF] text-black font-bold text-sm px-5 sm:px-8 py-3 rounded-xl hover:brightness-105 transition cursor-pointer"
          >
            Confirmar mi selección
          </button>
        </main>
      )}

      <div className="h-6" />
    </div>
  );
};
