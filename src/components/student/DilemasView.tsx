'use client';

import React, { useEffect, useState } from 'react';
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
  const [dilemas, setDilemas] = useState<DilemaCase[]>(() =>
    buildDilemasFromCompleted(completedDilemaIds)
  );
  const [activeDilemaId, setActiveDilemaId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<DilemaOption | null>(null);

  useEffect(() => {
    setDilemas(buildDilemasFromCompleted(completedDilemaIds));
  }, [completedDilemaIds]);

  const activeDilema = dilemas.find((d) => d.id === activeDilemaId) || null;
  const completedCount = dilemas.filter((d) => d.status === 'completed').length;

  const handleSelectOption = (opt: DilemaOption) => {
    if (selectedOption || !activeDilema) return;
    setSelectedOption(opt);
    onUpdateXp(opt.xpDelta);
    onCompleteDilema?.(activeDilema.id, opt.isCorrect);

    if (opt.isCorrect) {
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

  if (activeDilema) {
    const isWrongChoice = selectedOption && !selectedOption.isCorrect;
    const maxXp = Math.max(0, ...activeDilema.options.map((o) => o.xpDelta));

    return (
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
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

        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
            {activeDilema.category} · {activeDilema.subtitle}
          </span>
          <h1 className="text-3xl font-bold text-white">{activeDilema.title}</h1>
          <p className="text-sm text-[#D4D4D4] leading-relaxed max-w-3xl">
            {activeDilema.description}
          </p>
          <p className="text-xs text-[#00FFEF]/90 font-medium pt-1">
            {activeDilema.lawQuote}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {activeDilema.options.map((opt) => {
            const isChosen = selectedOption?.id === opt.id;
            let cardStyle =
              'bg-[#111111] border-[#222222] hover:border-[#00FFEF] text-white';

            if (isChosen) {
              cardStyle = opt.isCorrect
                ? 'bg-[#002A28]/65 border-[#00FFEF] text-white'
                : 'bg-[#2A0A14] border-[#FF3366] text-white';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(selectedOption)}
                onClick={() => handleSelectOption(opt)}
                className={`rounded-2xl border p-5 text-left transition cursor-pointer disabled:cursor-default ${cardStyle}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#00FFEF]">
                    Opción {opt.id}
                  </span>
                  <span className="text-xs font-semibold text-[#A3A3A3]">
                    {opt.xpDelta >= 0 ? `+${opt.xpDelta} XP` : `${opt.xpDelta} XP`}
                  </span>
                </div>
                <p className="text-sm font-semibold mt-2 leading-snug">
                  {opt.text}
                </p>
              </button>
            );
          })}
        </div>

        {selectedOption && (
          <div
            className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
              isWrongChoice
                ? 'bg-[#220911] border-[#FF3366]'
                : 'bg-[#002A28]/50 border-[#00FFEF]'
            }`}
          >
            <div className="flex items-start gap-4">
              <LexisMascot
                expression={isWrongChoice ? 'sad' : 'happy'}
                className="w-20 h-24 shrink-0"
              />
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  {selectedOption.feedbackTitle} (
                  {selectedOption.xpDelta >= 0
                    ? `+${selectedOption.xpDelta}`
                    : selectedOption.xpDelta}{' '}
                  XP)
                </div>
                <p className="text-xs text-[#D4D4D4] leading-relaxed">
                  {selectedOption.feedbackText}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveDilemaId(null);
                setSelectedOption(null);
              }}
              className="px-5 py-3 rounded-xl bg-[#00FFEF] text-black text-xs font-bold shrink-0 hover:brightness-105 transition cursor-pointer"
            >
              Continuar
            </button>
          </div>
        )}

        <div className="text-[11px] text-[#757575]">
          Recompensa máxima del caso: +{maxXp} XP
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Dilemas Éticos y Legales
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Resuelve escenarios reales de ingeniería, privacidad y legislación.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#222222] rounded-xl px-4 py-2.5 text-xs">
          <span className="text-[#A3A3A3]">Resueltos: </span>
          <span className="font-bold text-[#00FFEF]">
            {completedCount} / {dilemas.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {dilemas.map((dilema) => {
          const isLocked = dilema.status === 'locked';
          const isCompleted = dilema.status === 'completed';
          const rewardXp = Math.max(0, ...dilema.options.map((o) => o.xpDelta));

          return (
            <div
              key={dilema.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between gap-5 ${
                isLocked
                  ? 'bg-[#0B0B0B] border-[#1A1A1A] opacity-65'
                  : isCompleted
                    ? 'bg-[#002A28]/35 border-[#00FFEF]/60'
                    : 'bg-[#111111] border-[#222222]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00FFEF]">
                    {dilema.category} · {dilema.subtitle}
                  </span>
                  {isCompleted && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00FFEF]">
                      <Check className="w-3.5 h-3.5" /> Completado
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white">{dilema.title}</h2>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {dilema.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
                <span className="text-xs font-semibold text-[#757575]">
                  +{rewardXp} XP
                </span>

                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => {
                    setActiveDilemaId(dilema.id);
                    setSelectedOption(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 transition disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{isCompleted ? 'Repetir caso' : 'Resolver dilema'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
