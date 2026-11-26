'use client';

import React, { useMemo, useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { INITIAL_DILEMAS } from '@/data/mockLexCode';
import { DilemaCase, DilemaOption } from '@/types/lexcode';
import { LexisMascot } from '@/components/brand/LexisMascot';

interface DilemasViewProps {
  xp: number;
  completedDilemaIds?: string[];
  onUpdateXp: (delta: number) => void;
  onCompleteDilema?: (dilemaId: string, isCorrect: boolean) => void;
}

function buildDilemasFromCompleted(completedIds: string[]): DilemaCase[] {
  return INITIAL_DILEMAS.map((item, idx) => {
    if (completedIds.includes(item.id)) {
      return { ...item, status: 'completed' };
    }
    if (idx === 0) {
      return { ...item, status: 'active' };
    }
    const prevItem = INITIAL_DILEMAS[idx - 1];
    if (prevItem && completedIds.includes(prevItem.id)) {
      return { ...item, status: 'active' };
    }
    return item;
  });
}

export const DilemasView: React.FC<DilemasViewProps> = ({
  completedDilemaIds = [],
  onUpdateXp,
  onCompleteDilema,
}) => {
  const [activeDilemaId, setActiveDilemaId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<DilemaOption | null>(null);
  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>([]);

  const mergedIds = useMemo(
    () => Array.from(new Set([...completedDilemaIds, ...localCompletedIds])),
    [completedDilemaIds, localCompletedIds]
  );
  const completedKey = mergedIds.join('|');

  const dilemas = useMemo(
    () => buildDilemasFromCompleted(completedKey ? completedKey.split('|') : []),
    [completedKey]
  );

  const activeDilema = dilemas.find((d) => d.id === activeDilemaId) || null;
  const completedCount = dilemas.filter((d) => d.status === 'completed').length;

  const handleSelectOption = (opt: DilemaOption) => {
    if (selectedOption || !activeDilema) return;
    setSelectedOption(opt);
    onUpdateXp(opt.xpDelta);
    if (opt.isCorrect) {
      setLocalCompletedIds((prev) =>
        prev.includes(activeDilema.id) ? prev : [...prev, activeDilema.id]
      );
    }
    onCompleteDilema?.(activeDilema.id, opt.isCorrect);
  };

  if (activeDilema) {
    const isWrongChoice = selectedOption && !selectedOption.isCorrect;
    const maxXp = Math.max(0, ...activeDilema.options.map((o) => o.xpDelta));

    return (
      <div className="max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-[#A3A3A3]">
            Dilemas / {activeDilema.title}
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveDilemaId(null);
              setSelectedOption(null);
            }}
            className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
          >
            ← Volver a Dilemas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-[#0B0B0B] border border-[#222222] rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#161616] text-[#00FFEF] border border-[#262626]">
                {activeDilema.category}
              </span>
              <span className="text-xs font-semibold text-[#FFD43B]">
                +{maxXp} XP
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {activeDilema.title}
            </h1>

            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              {activeDilema.description}
            </p>

            <div className="space-y-3 pt-2">
              {activeDilema.options.map((opt) => {
                const isPicked = selectedOption?.id === opt.id;
                let borderStyle =
                  'border-[#242424] bg-[#111111] hover:border-[#3A3A3A]';

                if (selectedOption) {
                  if (isPicked && opt.isCorrect) {
                    borderStyle = 'border-[#00FFEF] bg-[#00FFEF]/10';
                  } else if (isPicked && !opt.isCorrect) {
                    borderStyle = 'border-[#FF3366] bg-[#FF3366]/10';
                  } else if (opt.isCorrect) {
                    borderStyle = 'border-[#00FFEF]/50 bg-[#111111]';
                  } else {
                    borderStyle = 'border-[#1C1C1C] bg-[#0D0D0D] opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={Boolean(selectedOption)}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${borderStyle}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <span className="text-sm text-white leading-snug">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0B0B0B] border border-[#222222] rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-4">
              <LexisMascot
                expression={
                  !selectedOption
                    ? 'neutral'
                    : selectedOption.isCorrect
                      ? 'happy'
                      : 'sad'
                }
                className="w-20 h-24 shrink-0"
              />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#00FFEF]">
                  Análisis de Lexis
                </div>
                <h2 className="text-base font-bold text-white mt-0.5">
                  {!selectedOption
                    ? 'Evalúa el impacto legal y ético'
                    : selectedOption.feedbackTitle}
                </h2>
              </div>
            </div>

            {selectedOption ? (
              <div className="space-y-4">
                <p className="text-sm text-[#D4D4D4] leading-relaxed">
                  {selectedOption.feedbackText}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1E1E1E]">
                  <span
                    className={`text-xs font-bold ${
                      selectedOption.isCorrect ? 'text-[#00FFEF]' : 'text-[#FF3366]'
                    }`}
                  >
                    {selectedOption.xpDelta >= 0
                      ? `+${selectedOption.xpDelta} XP`
                      : `${selectedOption.xpDelta} XP`}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (isWrongChoice) {
                        setSelectedOption(null);
                      } else {
                        setActiveDilemaId(null);
                        setSelectedOption(null);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 transition cursor-pointer"
                  >
                    {isWrongChoice ? 'Intentar de nuevo' : 'Continuar'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#9E9E9E] leading-relaxed">
                Selecciona una de las opciones para analizar las consecuencias bajo privacidad de datos, derechos de autor o responsabilidad profesional.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Dilemas éticos y legales
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Resuelve casos prácticos y acumula XP
          </p>
        </div>
        <span className="text-xs font-semibold text-[#00FFEF]">
          {completedCount} de {dilemas.length} completados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dilemas.map((dilema, index) => {
          const isCompleted = dilema.status === 'completed';
          const isLocked = dilema.status === 'locked';
          const maxXp = Math.max(0, ...dilema.options.map((o) => o.xpDelta));

          return (
            <div
              key={dilema.id}
              className={`rounded-2xl border p-4 sm:p-6 flex flex-col justify-between gap-5 transition ${
                isLocked
                  ? 'bg-[#080808] border-[#1A1A1A] opacity-65'
                  : 'bg-[#0B0B0B] border-[#242424] hover:border-[#00FFEF]/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#151515] text-[#00FFEF] border border-[#262626]">
                    Caso {index + 1} · {dilema.category}
                  </span>
                  <span className="text-xs font-semibold text-[#FFD43B]">
                    +{maxXp} XP
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">{dilema.title}</h2>
                <p className="text-sm text-[#A3A3A3] line-clamp-3 leading-relaxed">
                  {dilema.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1B1B1B]">
                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00FFEF]">
                    <Check className="w-4 h-4" />
                    Completado
                  </span>
                ) : isLocked ? (
                  <span className="text-xs text-[#6E6E6E]">
                    Completa el caso anterior para desbloquear
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[#D4D4D4]">
                    Disponible
                  </span>
                )}

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    setSelectedOption(null);
                    setActiveDilemaId(dilema.id);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00FFEF] text-black hover:brightness-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isCompleted ? 'Repasar' : 'Resolver caso'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
