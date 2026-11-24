'use client';

import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { INITIAL_DILEMAS } from '@/data/mockLexCode';
import { DilemaCase, DilemaOption } from '@/types/lexcode';
import { LexisMascot } from '@/components/brand/LexisMascot';

interface DilemasViewProps {
  xp: number;
  onUpdateXp: (delta: number) => void;
}

export const DilemasView: React.FC<DilemasViewProps> = ({ xp, onUpdateXp }) => {
  const [dilemas, setDilemas] = useState<DilemaCase[]>(INITIAL_DILEMAS);
  const [activeDilemaId, setActiveDilemaId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<DilemaOption | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);

  const activeDilema = dilemas.find((d) => d.id === activeDilemaId) || null;

  const handleSelectOption = (opt: DilemaOption) => {
    if (selectedOption) return;
    setSelectedOption(opt);
    onUpdateXp(opt.xpDelta);
    if (opt.isCorrect && activeDilema) {
      setCompletedCount((prev) => prev + 1);
      setDilemas((prev) =>
        prev.map((item, idx) => {
          if (item.id === activeDilema.id) {
            return { ...item, status: 'completed' };
          }
          if (idx > 0 && prev[idx - 1].id === activeDilema.id && item.status === 'locked') {
            return { ...item, status: 'active' };
          }
          return item;
        })
      );
    }
  };

  const handleNextDilema = () => {
    if (!activeDilema) return;
    const currentIndex = dilemas.findIndex((d) => d.id === activeDilema.id);
    const nextItem = dilemas[currentIndex + 1];
    setSelectedOption(null);
    if (nextItem) {
      setDilemas((prev) =>
        prev.map((d) => (d.id === nextItem.id ? { ...d, status: 'active' } : d))
      );
      setActiveDilemaId(nextItem.id);
    } else {
      setActiveDilemaId(null);
    }
  };

  // Vista 1: Lista de Casos de Estudio Éticos (Dilemas.png)
  if (!activeDilema) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Casos de Estudio Eticos
            </h1>
            <p className="text-sm text-[#A3A3A3] mt-1.5">
              Selecciona un dilema del mundo real para poner a prueba tu criterio legal.
            </p>
          </div>

          <div className="space-y-4">
            {dilemas.map((item) => {
              const isLocked = item.status === 'locked';
              const isActive = item.status === 'active';

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isLocked) {
                      setSelectedOption(null);
                      setActiveDilemaId(item.id);
                    }
                  }}
                  className={`rounded-2xl px-6 py-5 flex items-center justify-between gap-4 transition ${
                    isActive
                      ? 'bg-[#002A28]/45 border-2 border-[#00FFEF] cursor-pointer'
                      : isLocked
                        ? 'bg-[#111111] border border-[#1E1E1E] opacity-75 cursor-not-allowed'
                        : 'bg-[#111111] border border-[#00FFEF]/50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-[#00FFEF]'
                          : item.status === 'completed'
                            ? 'bg-[#00FFEF]'
                            : 'bg-[#2A2A2A]'
                      }`}
                    >
                      {item.status === 'completed' && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </span>

                    <div>
                      <div
                        className={`text-sm sm:text-base font-bold ${
                          isLocked ? 'text-[#A3A3A3]' : 'text-white'
                        }`}
                      >
                        {item.number}. {item.title}
                      </div>
                      <div className="text-xs text-[#757575] mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>

                  {isActive ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOption(null);
                        setActiveDilemaId(item.id);
                      }}
                      className="bg-[#00FFEF] text-black font-bold text-xs px-5 py-2.5 rounded-full hover:brightness-105 transition shrink-0 cursor-pointer"
                    >
                      Continuar
                    </button>
                  ) : item.status === 'completed' ? (
                    <span className="text-xs font-semibold text-[#00FFEF] shrink-0">
                      Completado
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#666666] shrink-0">
                      Bloqueado
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel derecho lateral */}
        <div className="lg:col-span-4 bg-[#0A0A0A] border-l border-[#181818] pl-0 lg:pl-8 flex flex-col items-center space-y-5">
          <div className="w-full bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
            <div className="text-xs font-semibold text-[#A3A3A3]">Progreso de Dilemas</div>
            <div className="text-3xl font-bold text-[#00FFEF] mt-1.5">
              {completedCount} / 20
            </div>
            <div className="text-xs text-[#757575] mt-1">Casos resueltos</div>
          </div>

          <div className="w-full bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
            <div className="text-xs font-semibold text-[#A3A3A3]">Racha de Auditor</div>
            <div className="text-lg font-bold text-[#FFD43B] mt-1.5">3 Dias activos</div>
          </div>

          <div className="pt-4 flex flex-col items-center">
            <LexisMascot expression="angry" className="w-40 h-48" />
            <span className="text-[11px] text-[#757575] mt-2">XP actual: {xp}</span>
          </div>
        </div>
      </div>
    );
  }

  // Vista 2: Dilema en progreso / Correcto / Incorrecto
  const progressWidth = selectedOption ? '60%' : '30%';
  const isWrongSelection = selectedOption && !selectedOption.isCorrect;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-xs font-bold text-white whitespace-nowrap">
              Dilema en progreso
            </span>
            <div className="flex-1 max-w-md h-2 rounded-full bg-[#242424] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isWrongSelection ? 'bg-[#FF3366]' : 'bg-[#00FFEF]'
                }`}
                style={{ width: progressWidth }}
              />
            </div>
          </div>
          {selectedOption && (
            <span className="text-[11px] text-[#757575]">60% de avance</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Tarjeta de escenario y cita legal */}
          <div className="md:col-span-6 bg-[#111111] border border-[#222222] rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
                {activeDilema.category}
              </p>
              <h2 className="text-2xl font-bold text-white mt-2 leading-tight">
                {activeDilema.title}
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
                {activeDilema.description}
              </p>
            </div>

            <div className="bg-[#232323] rounded-xl p-5 space-y-2">
              <div className="text-2xl font-bold text-[#A3A3A3] leading-none">“</div>
              <p className="text-xs sm:text-sm text-[#D4D4D4] leading-relaxed">
                {activeDilema.lawQuote}
              </p>
            </div>
          </div>

          {/* Opciones A, B, C, D */}
          <div className="md:col-span-6 space-y-3.5">
            {activeDilema.options.map((opt) => {
              const isChosen = selectedOption?.id === opt.id;
              const showAsCorrectHighlight = selectedOption && opt.isCorrect;
              const showAsWrongHighlight = isChosen && !opt.isCorrect;

              let cardClasses =
                'bg-[#0D0D0D] border border-[#222222] hover:border-[#444444] text-[#D4D4D4]';

              if (showAsWrongHighlight) {
                cardClasses =
                  'bg-[#2A0A14] border-2 border-[#FF3366] text-white';
              } else if (showAsCorrectHighlight) {
                cardClasses =
                  'bg-[#002A28]/70 border-2 border-[#00FFEF] text-white';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={Boolean(selectedOption)}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left rounded-xl px-5 py-4 transition flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${cardClasses}`}
                >
                  <div className="text-xs sm:text-sm leading-snug">
                    <span className="font-bold text-white mr-1">{opt.id})</span>
                    <span>{opt.text}</span>
                  </div>

                  {showAsCorrectHighlight && (
                    <span className="w-5 h-5 rounded-full bg-[#00FFEF] text-black flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                  {showAsWrongHighlight && (
                    <span className="w-4 h-4 rounded-full bg-[#FF3366] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel derecho de retroalimentación y Lexis */}
      <div className="lg:col-span-4 bg-[#0A0A0A] border-l border-[#181818] pl-0 lg:pl-8 flex flex-col items-center justify-between space-y-6">
        {selectedOption ? (
          <>
            <div
              className={`w-full rounded-2xl p-5 border ${
                selectedOption.isCorrect
                  ? 'bg-[#002A28]/35 border-[#00FFEF]/50'
                  : 'bg-[#220911] border-[#FF3366]/60'
              }`}
            >
              <div
                className={`text-base font-bold ${
                  selectedOption.isCorrect ? 'text-white' : 'text-white'
                }`}
              >
                {selectedOption.feedbackTitle}
              </div>
              <div
                className={`text-lg font-bold mt-0.5 ${
                  selectedOption.isCorrect ? 'text-[#00FFEF]' : 'text-[#FF3366]'
                }`}
              >
                {selectedOption.xpDelta > 0
                  ? `+${selectedOption.xpDelta} XP`
                  : `${selectedOption.xpDelta} XP`}
              </div>
              <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
                {selectedOption.feedbackText}
              </p>
            </div>

            <LexisMascot
              expression={selectedOption.isCorrect ? 'happy' : 'sad'}
              className="w-40 h-48"
            />

            <button
              type="button"
              onClick={handleNextDilema}
              className="w-full h-12 rounded-xl bg-[#00FFEF] text-black font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 transition cursor-pointer"
            >
              <span>Siguiente pregunta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="my-auto flex flex-col items-center text-center space-y-4">
            <LexisMascot expression="neutral" className="w-36 h-44" />
            <p className="text-xs text-[#A3A3A3] max-w-[220px]">
              Elige una opción para evaluar su impacto legal y ético.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
