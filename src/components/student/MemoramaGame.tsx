'use client';

import React, { useEffect, useState } from 'react';
import { MEMORAMA_CARDS } from '@/data/mockLexCode';

interface MemoramaGameProps {
  onUpdateXp: (delta: number) => void;
  onExit: () => void;
}

export const MemoramaGame: React.FC<MemoramaGameProps> = ({
  onUpdateXp,
  onExit,
}) => {
  const [flippedIds, setFlippedIds] = useState<string[]>(['m1', 'm4']);
  const [matchedPairs, setMatchedPairs] = useState<string[]>(['p1']);
  const [moves, setMoves] = useState<number>(12);
  const [seconds, setSeconds] = useState<number>(105);
  const [justMatchedBanner, setJustMatchedBanner] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleCardClick = (id: string, pairId: string) => {
    if (flippedIds.includes(id) || matchedPairs.includes(pairId) || flippedIds.length >= 2) {
      return;
    }

    const nextFlipped = [...flippedIds, id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const firstCard = MEMORAMA_CARDS.find((c) => c.id === nextFlipped[0]);
      const secondCard = MEMORAMA_CARDS.find((c) => c.id === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setMatchedPairs((prev) => [...prev, firstCard.pairId]);
        setJustMatchedBanner(true);
        onUpdateXp(50);
        setTimeout(() => {
          setFlippedIds([]);
        }, 550);
      } else {
        setTimeout(() => {
          setFlippedIds([]);
        }, 850);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl items-start">
      <div className="lg:col-span-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#A3A3A3]">Actividades / Memorama</div>
          <button
            type="button"
            onClick={onExit}
            className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
          >
            ← Volver
          </button>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Conexiones Legales
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1">
            Encuentra el par correcto entre el concepto y su definicion normativa.
          </p>
        </div>

        {/* Tablero de 8 cartas (2 filas x 4 columnas) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {MEMORAMA_CARDS.map((card) => {
            const isMatched = matchedPairs.includes(card.pairId);
            const isFlipped = flippedIds.includes(card.id) || isMatched;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card.id, card.pairId)}
                className={`h-44 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition cursor-pointer ${
                  isFlipped
                    ? 'bg-[#002A28]/55 border-2 border-[#00FFEF]'
                    : 'bg-[#111111] border border-[#222222] hover:border-[#3A3A3A]'
                }`}
              >
                {isFlipped ? (
                  <span
                    className={`leading-snug ${
                      card.side === 'concept'
                        ? 'text-sm font-bold text-[#00FFEF]'
                        : 'text-xs font-medium text-[#D4D4D4]'
                    }`}
                  >
                    {card.content}
                  </span>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00FFEF]" />
                    <div className="w-24 h-14 rounded-xl bg-white flex items-center justify-center relative">
                      <span className="w-5 h-6 rounded-full bg-[#00FFEF] mx-1.5" />
                      <span className="w-5 h-6 rounded-full bg-[#00FFEF] mx-1.5" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel derecho de métricas y recompensa */}
      <div className="lg:col-span-4 bg-[#111111] border border-[#1E1E1E] rounded-2xl p-7 space-y-6 text-center">
        {justMatchedBanner ? (
          <div className="bg-[#002A28]/70 border border-[#00FFEF] rounded-xl p-4">
            <div className="text-base font-bold text-[#00FFEF]">Par Correcto!</div>
            <div className="text-lg font-bold text-white mt-0.5">+ 50 XP</div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-semibold text-[#A3A3A3]">Tiempo</div>
            <div className="text-3xl font-bold text-[#00FFEF] mt-1">
              {formatTime(seconds)}
            </div>
          </div>
        )}

        {!justMatchedBanner && (
          <div>
            <div className="text-xs font-semibold text-[#A3A3A3]">Movimientos</div>
            <div className="text-2xl font-bold text-white mt-1">{moves}</div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-[#A3A3A3]">Pares Encontrados</div>
          <div className="text-2xl font-bold text-white mt-1">
            {matchedPairs.length} / 4
          </div>
        </div>
      </div>
    </div>
  );
};
