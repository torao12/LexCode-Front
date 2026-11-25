'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MEMORAMA_CARDS } from '@/data/mockLexCode';
import { MemoramaCard } from '@/types/lexcode';

interface MemoramaGameProps {
  onUpdateXp: (delta: number) => void;
  onCompleteActivity?: (activityId: string) => void;
  onExit: () => void;
}

function shuffleCards(cards: MemoramaCard[]): MemoramaCard[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const MemoramaGame: React.FC<MemoramaGameProps> = ({
  onUpdateXp,
  onCompleteActivity,
  onExit,
}) => {
  const totalPairs = useMemo(
    () => new Set(MEMORAMA_CARDS.map((c) => c.pairId)).size,
    []
  );

  const [deck, setDeck] = useState<MemoramaCard[]>(() => shuffleCards(MEMORAMA_CARDS));
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [earnedSessionXp, setEarnedSessionXp] = useState<number>(0);
  const [justMatchedBanner, setJustMatchedBanner] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [completedReported, setCompletedReported] = useState<boolean>(false);

  const isFinished = matchedPairs.length >= totalPairs && totalPairs > 0;

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  useEffect(() => {
    if (isFinished && !completedReported) {
      setCompletedReported(true);
      onCompleteActivity?.('memorama');
    }
  }, [isFinished, completedReported, onCompleteActivity]);

  const formatTime = (totalSec: number) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleRestart = () => {
    setDeck(shuffleCards(MEMORAMA_CARDS));
    setFlippedIds([]);
    setMatchedPairs([]);
    setMoves(0);
    setSeconds(0);
    setEarnedSessionXp(0);
    setJustMatchedBanner(false);
    setIsLocked(false);
    setCompletedReported(false);
  };

  const handleCardClick = (id: string, pairId: string) => {
    if (
      isLocked ||
      flippedIds.includes(id) ||
      matchedPairs.includes(pairId) ||
      flippedIds.length >= 2
    ) {
      return;
    }

    const nextFlipped = [...flippedIds, id];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      setIsLocked(true);

      const firstCard = deck.find((c) => c.id === nextFlipped[0]);
      const secondCard = deck.find((c) => c.id === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        const nextMatched = [...matchedPairs, firstCard.pairId];
        setMatchedPairs(nextMatched);
        setJustMatchedBanner(true);
        setEarnedSessionXp((prev) => prev + 50);
        onUpdateXp(50);

        setTimeout(() => {
          setFlippedIds([]);
          setJustMatchedBanner(false);
          setIsLocked(false);
        }, 650);
      } else {
        setJustMatchedBanner(false);
        setTimeout(() => {
          setFlippedIds([]);
          setIsLocked(false);
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

        {isFinished && (
          <div className="bg-[#002A28]/65 border-2 border-[#00FFEF] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold text-[#00FFEF]">
                ¡Memorama completado!
              </div>
              <p className="text-xs text-[#D4D4D4] mt-1">
                Encontraste los {totalPairs} pares en {moves} movimientos ({formatTime(seconds)}) y ganaste +{earnedSessionXp} XP.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 transition cursor-pointer"
              >
                Jugar de nuevo
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-4 py-2.5 rounded-xl bg-[#141414] border border-[#2A2A2A] text-xs font-bold text-white hover:border-[#00FFEF] transition cursor-pointer"
              >
                Ver actividades
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {deck.map((card) => {
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

        <div>
          <div className="text-xs font-semibold text-[#A3A3A3]">Movimientos</div>
          <div className="text-2xl font-bold text-white mt-1">{moves}</div>
        </div>

        <div>
          <div className="text-xs font-semibold text-[#A3A3A3]">Pares Encontrados</div>
          <div className="text-2xl font-bold text-white mt-1">
            {matchedPairs.length} / {totalPairs}
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="w-full py-2.5 rounded-xl bg-[#181818] border border-[#282828] text-xs font-semibold text-[#A3A3A3] hover:text-white hover:border-[#00FFEF] transition cursor-pointer"
        >
          Reiniciar partida
        </button>
      </div>
    </div>
  );
};
