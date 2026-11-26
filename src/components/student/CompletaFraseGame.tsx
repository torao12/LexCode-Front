'use client';

import React, { useState } from 'react';
import { CLOZE_ITEMS } from '@/data/mockLexCode';

interface CompletaFraseGameProps {
  onUpdateXp: (delta: number) => void;
  onCompleteActivity?: (activityId: string) => void;
  onExit: () => void;
}

export const CompletaFraseGame: React.FC<CompletaFraseGameProps> = ({
  onUpdateXp,
  onCompleteActivity,
  onExit,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [isSummary, setIsSummary] = useState(false);

  const currentItem = CLOZE_ITEMS[index] || CLOZE_ITEMS[0];
  const progressPct = isSummary
    ? 100
    : Math.round(
        ((index + (feedback === 'correct' ? 1 : 0.45)) / CLOZE_ITEMS.length) * 100
      );

  const handleCheck = () => {
    if (!selectedWord || feedback === 'correct') return;
    if (selectedWord.toLowerCase() === currentItem.answer.toLowerCase()) {
      setFeedback('correct');
      setCorrectAnswersCount((prev) => prev + 1);
      setSessionXp((prev) => prev + 100);
      onUpdateXp(100);
    } else {
      setFeedback('wrong');
      setSessionXp((prev) => prev - 25);
      onUpdateXp(-25);
    }
  };

  const handleNext = () => {
    setFeedback('idle');
    setSelectedWord(null);
    if (index + 1 < CLOZE_ITEMS.length) {
      setIndex((prev) => prev + 1);
    } else {
      setIsSummary(true);
      onCompleteActivity?.('cloze');
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelectedWord(null);
    setFeedback('idle');
    setCorrectAnswersCount(0);
    setSessionXp(0);
    setIsSummary(false);
  };

  if (isSummary) {
    return (
      <div className="max-w-3xl bg-[#111111] border border-[#00FFEF] rounded-2xl p-4 sm:p-8 space-y-5 sm:space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00FFEF]">
            Actividad completada
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">
            Completa la Frase — Resumen
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-2">
            Acertaste {correctAnswersCount} de {CLOZE_ITEMS.length} enunciados normativos.
          </p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl p-5 flex items-center justify-between">
          <span className="text-xs text-[#A3A3A3]">XP neta de la sesión</span>
          <span className="text-xl font-bold text-[#00FFEF]">
            {sessionXp >= 0 ? `+${sessionXp}` : sessionXp} XP
          </span>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-bold text-white hover:border-[#00FFEF] transition cursor-pointer"
          >
            Practicar de nuevo
          </button>
          <button
            type="button"
            onClick={onExit}
            className="px-6 py-3 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 transition cursor-pointer"
          >
            Volver a Actividades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-white">
          {currentItem.ruleTitle} ({index + 1}/{CLOZE_ITEMS.length})
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
        >
          ← Volver a Actividades
        </button>
      </div>

      <div className="w-full h-2 rounded-full bg-[#242424] overflow-hidden">
        <div
          className="h-full bg-[#00FFEF] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="pt-4 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Completa la siguiente frase con el termino legal correcto:
        </h1>

        <p className="text-xl sm:text-2xl text-[#A3A3A3] leading-relaxed">
          {currentItem.prefix}{' '}
          <span
            className={`inline-block min-w-[150px] text-center px-4 py-1 mx-1 rounded-md border border-dashed text-base font-semibold ${
              feedback === 'correct'
                ? 'border-[#00FFEF] bg-[#002A28]/60 text-[#00FFEF]'
                : feedback === 'wrong'
                  ? 'border-[#FF3366] bg-[#2A0A14] text-[#FF3366]'
                  : selectedWord
                    ? 'border-[#00FFEF] bg-[#111111] text-[#00FFEF]'
                    : 'border-[#555555] bg-[#111111] text-transparent'
            }`}
          >
            {selectedWord || '____'}
          </span>{' '}
          {currentItem.suffix}
        </p>

        <p className="text-xs text-[#757575] pt-2">
          Selecciona una de las opciones para rellenar el espacio vacio:
        </p>

        <div className="flex flex-wrap gap-4">
          {currentItem.options.map((opt) => {
            const active = selectedWord === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setFeedback('idle');
                  setSelectedWord(opt);
                }}
                className={`min-w-[155px] h-11 px-6 rounded-xl text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-[#002A28]/60 border-2 border-[#00FFEF] text-[#00FFEF]'
                    : 'bg-[#111111] border border-[#242424] text-white hover:border-[#444444]'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
        <div className="text-xs">
          {feedback === 'correct' && (
            <span className="text-[#00FFEF] font-bold">
              ✓ ¡Correcto! +100 XP — Término normativo validado.
            </span>
          )}
          {feedback === 'wrong' && (
            <span className="text-[#FF3366] font-bold">
              ✗ Revisa la definición legal e inténtalo de nuevo (-25 XP).
            </span>
          )}
        </div>

        {feedback === 'correct' ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-[#00FFEF] text-black font-bold text-xs px-6 py-3 rounded-xl hover:brightness-105 transition cursor-pointer"
          >
            Continuar
          </button>
        ) : (
          <button
            type="button"
            disabled={!selectedWord}
            onClick={handleCheck}
            className="bg-[#00FFEF] text-black font-bold text-xs px-6 py-3 rounded-xl hover:brightness-105 transition disabled:opacity-40 cursor-pointer"
          >
            Comprobar Respuesta
          </button>
        )}
      </div>
    </div>
  );
};
