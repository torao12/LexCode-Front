'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WifiOff, RotateCw, SearchX } from 'lucide-react';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { api, ApiError } from '@/lib/api';
import type { GlossaryTermDto } from '@/lib/types';

interface GlosarioViewProps {
  externalSearch?: string;
  onAskLexis: (queryText: string) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

type LoadState = 'loading' | 'ready' | 'error';

export const GlosarioView: React.FC<GlosarioViewProps> = ({
  externalSearch = '',
  onAskLexis,
}) => {
  const [allTerms, setAllTerms] = useState<GlossaryTermDto[]>([]);
  // Resultados guardados junto con la búsqueda que los produjo
  const [searchState, setSearchState] = useState<{ q: string; items: GlossaryTermDto[] } | null>(null);
  const [state, setState] = useState<LoadState>('loading');
  const [errorText, setErrorText] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const search = externalSearch.trim();

  // Todos los términos (para el índice alfabético)
  useEffect(() => {
    const ctrl = new AbortController();
    api<{ items: GlossaryTermDto[] }>('/glossary', { signal: ctrl.signal })
      .then((res) => {
        setAllTerms(res.items);
        setState('ready');
      })
      .catch((err) => {
        if ((err as Error).name === 'AbortError') return;
        setErrorText(err instanceof ApiError ? err.message : 'No se pudo cargar el glosario');
        setState('error');
      });
    return () => ctrl.abort();
  }, [reloadKey]);

  // Búsqueda en el servidor (sin acentos y tolerante a errores de dedo)
  useEffect(() => {
    if (!search) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      api<{ items: GlossaryTermDto[] }>(`/glossary?q=${encodeURIComponent(search)}`, { signal: ctrl.signal })
        .then((res) => setSearchState({ q: search, items: res.items }))
        .catch((err) => {
          if ((err as Error).name !== 'AbortError') setSearchState({ q: search, items: [] });
        });
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [search, reloadKey]);

  const searchResults = searchState && searchState.q === search ? searchState.items : null;
  const lettersWithTerms = useMemo(() => new Set(allTerms.map((t) => t.letter)), [allTerms]);
  const firstLetter = allTerms[0]?.letter ?? null;
  const activeLetter = selectedLetter ?? firstLetter;

  const filteredTerms = useMemo(() => {
    if (search) return searchResults ?? [];
    return allTerms.filter((item) => item.letter === activeLetter);
  }, [search, searchResults, allTerms, activeLetter]);

  const activeTerm =
    filteredTerms.find((t) => t.id === selectedTermId) || filteredTerms[0] || null;

  const retry = useCallback(() => {
    setState('loading');
    setReloadKey((k) => k + 1);
  }, []);

  const searching = search.length > 0 && searchResults === null;
  const showNoResultCard = state === 'ready' && search.length > 0 && searchResults !== null && searchResults.length === 0;
  const forceEmptyState = state === 'error';

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Glosario de términos
        </h1>

        {search && (
          <p className="text-xs text-[#757575]">
            Resultados para &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* Barra alfabética A-Z */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm font-medium pt-1">
        {ALPHABET.map((letter) => {
          const isActive = !search && !forceEmptyState && activeLetter === letter;
          const hasTerms = lettersWithTerms.has(letter);
          return (
            <button
              key={letter}
              type="button"
              disabled={!hasTerms}
              onClick={() => {
                setSelectedLetter(letter);
                setSelectedTermId(null);
              }}
              className={`w-6 h-6 rounded flex items-center justify-center transition ${
                isActive
                  ? 'bg-[#00FFEF] text-black font-bold'
                  : hasTerms
                    ? 'text-[#A3A3A3] hover:text-white cursor-pointer'
                    : 'text-[#3A3A3A] cursor-default'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {state === 'loading' || searching ? (
        <div className="py-20 flex justify-center" role="status">
          <div className="w-8 h-8 rounded-full border-2 border-[#242424] border-t-[#00FFEF] animate-spin" aria-hidden="true" />
          <span className="sr-only">Cargando glosario…</span>
        </div>
      ) : showNoResultCard || forceEmptyState ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Resultados de busqueda</h2>
            <p className="text-xs text-[#757575] mt-1">
              Buscando: &quot;{externalSearch.trim() || 'Ataque DDoS'}&quot;
            </p>
          </div>

          <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl py-8 sm:py-14 px-4 sm:px-6 flex flex-col items-center text-center space-y-5">
            <div className="flex items-center gap-6">
              <LexisMascot expression="sad" className="w-28 h-36" />
              <div className="flex flex-col items-center gap-3">
                {forceEmptyState ? (
                  <WifiOff className="w-9 h-9 text-[#FF3366]" />
                ) : (
                  <SearchX className="w-9 h-9 text-[#FF3366]" />
                )}
                <button
                  type="button"
                  onClick={retry}
                  aria-label="Reintentar búsqueda"
                  className="text-[#00FFEF] hover:rotate-45 transition cursor-pointer"
                >
                  <RotateCw className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                {forceEmptyState ? 'No pudimos cargar el glosario' : 'No encontramos este término'}
              </h3>
              <p className="text-xs text-[#757575] mt-1.5">
                {forceEmptyState
                  ? errorText
                  : 'El término todavía no está en el glosario. Pregúntale a Lexis.'}
              </p>
            </div>

            {!forceEmptyState && (
            <button
              type="button"
              onClick={() => onAskLexis(search)}
              className="bg-[#00FFEF] text-black font-bold text-xs px-6 py-3 rounded-lg hover:brightness-105 transition cursor-pointer"
            >
              Preguntar al Asistente Virtual
            </button>
            )}
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
                  className={`w-full text-left rounded-2xl px-4 py-3.5 sm:px-6 sm:py-5 transition cursor-pointer ${
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
            <div className="lg:col-span-7 bg-[#111111] border border-[#222222] rounded-2xl p-4 sm:p-7 relative min-h-[260px] lg:min-h-[400px] flex flex-col justify-between">
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
                    {activeTerm.legal_citation}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-end gap-3">
                {activeTerm.lexis_tip && (
                <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-4 max-w-[230px] text-xs text-[#D4D4D4] leading-relaxed mb-4">
                  {activeTerm.lexis_tip}
                </div>
                )}
                <LexisMascot expression="book_bulb" className="w-36 h-44 shrink-0" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
