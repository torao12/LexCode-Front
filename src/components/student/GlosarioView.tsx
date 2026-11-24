'use client';

import React, { useMemo, useState } from 'react';
import { WifiOff, RotateCw } from 'lucide-react';
import { GLOSSARY_TERMS } from '@/data/mockLexCode';
import { LexisMascot } from '@/components/brand/LexisMascot';

interface GlosarioViewProps {
  externalSearch?: string;
  onAskLexis: (queryText: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const GlosarioView: React.FC<GlosarioViewProps> = ({
  externalSearch = '',
  onAskLexis,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string>('D');
  const [selectedTermId, setSelectedTermId] = useState<string>('datos-personales-sensibles');
  const [forceEmptyState, setForceEmptyState] = useState<boolean>(false);

  const normalizedSearch = externalSearch.trim().toLowerCase();

  const filteredTerms = useMemo(() => {
    if (forceEmptyState) return [];
    if (normalizedSearch) {
      return GLOSSARY_TERMS.filter(
        (item) =>
          item.term.toLowerCase().includes(normalizedSearch) ||
          item.definition.toLowerCase().includes(normalizedSearch)
      );
    }
    const byLetter = GLOSSARY_TERMS.filter((item) => item.letter === selectedLetter);
    return byLetter.length > 0 ? byLetter : GLOSSARY_TERMS;
  }, [forceEmptyState, normalizedSearch, selectedLetter]);

  const activeTerm =
    filteredTerms.find((t) => t.id === selectedTermId) || filteredTerms[0] || null;

  const showNoResultCard =
    forceEmptyState || (normalizedSearch.length > 0 && filteredTerms.length === 0);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Glosario de términos
        </h1>

        <button
          type="button"
          onClick={() => setForceEmptyState((prev) => !prev)}
          className="text-[11px] text-[#757575] hover:text-[#00FFEF] transition cursor-pointer"
        >
          {forceEmptyState ? 'Ver términos' : 'Simular sin conexión / término no encontrado'}
        </button>
      </div>

      {/* Barra alfabética A-Z */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-medium pt-1">
        {ALPHABET.map((letter) => {
          const isActive = !normalizedSearch && !forceEmptyState && selectedLetter === letter;
          return (
            <button
              key={letter}
              type="button"
              onClick={() => {
                setForceEmptyState(false);
                setSelectedLetter(letter);
                const firstMatch = GLOSSARY_TERMS.find((g) => g.letter === letter);
                if (firstMatch) setSelectedTermId(firstMatch.id);
              }}
              className={`w-6 h-6 rounded flex items-center justify-center transition cursor-pointer ${
                isActive
                  ? 'bg-[#00FFEF] text-black font-bold'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {showNoResultCard ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Resultados de busqueda</h2>
            <p className="text-xs text-[#757575] mt-1">
              Buscando: &quot;{externalSearch.trim() || 'Ataque DDoS'}&quot;
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl py-14 px-6 flex flex-col items-center text-center space-y-5">
            <div className="flex items-center gap-6">
              <LexisMascot expression="sad" className="w-28 h-36" />
              <div className="flex flex-col items-center gap-3">
                <WifiOff className="w-9 h-9 text-[#FF3366]" />
                <button
                  type="button"
                  onClick={() => setForceEmptyState(false)}
                  aria-label="Reintentar búsqueda"
                  className="text-[#00FFEF] hover:rotate-45 transition cursor-pointer"
                >
                  <RotateCw className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">No encontramos este termino</h3>
              <p className="text-xs text-[#757575] mt-1.5">
                El termino no esta registrado en el glosario estandar de la LFPDPPP.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                onAskLexis(externalSearch.trim() || '¿Qué es un ataque DDoS?')
              }
              className="bg-[#00FFEF] text-black font-bold text-xs px-6 py-3 rounded-lg hover:brightness-105 transition cursor-pointer"
            >
              Preguntar al Asistente Virtual
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-2 items-start">
          {/* Columna izquierda: lista de términos */}
          <div className="lg:col-span-5 space-y-3.5">
            {filteredTerms.map((item) => {
              const isSelected = activeTerm?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedTermId(item.id)}
                  className={`w-full text-left rounded-2xl px-6 py-5 transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#121212] border-2 border-[#00FFEF]'
                      : 'bg-[#111111] border border-[#222222] hover:border-[#3A3A3A]'
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold tracking-wide text-white uppercase block">
                    {item.term}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Columna derecha: tarjeta de definición detallada y Lexis con libro */}
          {activeTerm && (
            <div className="lg:col-span-7 bg-[#111111] border border-[#222222] rounded-2xl p-7 relative min-h-[420px] flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
                  {activeTerm.category}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                  {activeTerm.term}
                </h2>
                <p className="text-xs sm:text-sm text-[#D4D4D4] mt-4 leading-relaxed">
                  {activeTerm.definition}
                </p>

                <div className="mt-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 max-w-md">
                  <p className="text-xs text-[#D4D4D4] leading-relaxed">
                    {activeTerm.legalRef}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-end gap-3">
                <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-4 max-w-[230px] text-xs text-[#D4D4D4] leading-relaxed mb-4">
                  {activeTerm.lexisTip}
                </div>
                <LexisMascot expression="book_bulb" className="w-36 h-44 shrink-0" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
