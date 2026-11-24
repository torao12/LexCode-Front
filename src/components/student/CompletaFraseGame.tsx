'use client';

import React, { useState } from 'react';
import { CLOZE_ITEMS } from '@/data/mockLexCode';

interface CompletaFraseGameProps {
  onUpdateXp: (delta: number) => void;
  onExit: () => void;
}

export const CompletaFraseGame: React.FC<CompletaFraseGameProps> = ({
  onUpdateXp,
  onExit,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentItem = CLOZE_ITEMS[index] || CLOZE_ITEMS[0];
  const progressPct = Math.round(((index + (feedback === 'correct' ? 1 : 0.45)) / CLOZE_ITEMS.length) * 100);

  const handleCheck = () => {
    if (!selectedWord) return;
    if (selectedWord.toLowerCase() === currentItem.answer.toLowerCase()) {
      setFeedback('correct');
      onUpdateXp(100);
    } else {
      setFeedback('wrong');
      onUpdateXp(-25);
    }
  };

  const handleNext = () => {
    setFeedback('idle');
    setSelectedWord(null);
    if (index + 1 < CLOZE_ITEMS.length) {
      setIndex((prev) => prev + 1);
    } else {
      onExit();
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-white">{currentItem.ruleTitle}</div>
        <button
          type="button"
          onClick={onExit}
          className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
        >
          ← Volver a Actividades
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-2 rounded-full bg-[#242424] overflow-hidden">
        <div
          className="h-full bg-[#00FFEF] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Enunciado con hueco interactivo */}
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

      {/* Barra inferior de comprobación */}
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
