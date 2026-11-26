'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Bot, ClipboardCheck, GitBranch, SearchX } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import type { StudentRoute } from '@/types/lexcode';
import { LexisMascot } from '@/components/brand/LexisMascot';

type Kind = 'glossary' | 'module' | 'dilemma' | 'lexis_topic';

interface SearchHit {
  kind: Kind;
  id: string;
  slug: string | null;
  title: string;
  snippet: string;
  score: number;
}

interface BusquedaViewProps {
  query: string;
  onOpenGlossary: (term: string) => void;
  onAskLexis: (question: string) => void;
  onNavigate: (route: StudentRoute) => void;
}

const KIND_META: Record<Kind, { label: string; icon: React.ReactNode; action: string }> = {
  glossary: { label: 'Glosario', icon: <BookOpen className="w-4 h-4" />, action: 'Ver definición' },
  module: { label: 'Módulos', icon: <ClipboardCheck className="w-4 h-4" />, action: 'Ir a actividades' },
  dilemma: { label: 'Dilemas', icon: <GitBranch className="w-4 h-4" />, action: 'Ir a dilemas' },
  lexis_topic: { label: 'Pregúntale a Lexis', icon: <Bot className="w-4 h-4" />, action: 'Preguntar' },
};

const ORDER: Kind[] = ['glossary', 'lexis_topic', 'dilemma', 'module'];

/** Resultados de la barra de búsqueda: glosario, módulos, dilemas y temas de Lexis. */
export const BusquedaView: React.FC<BusquedaViewProps> = ({ query, onOpenGlossary, onAskLexis, onNavigate }) => {
  const q = query.trim();
  const [state, setState] = useState<{ q: string; hits: SearchHit[] | null; error: string }>({ q: '', hits: null, error: '' });

  useEffect(() => {
    if (q.length < 2) return;
    const ctrl = new AbortController();
    api<SearchHit[]>(`/search?q=${encodeURIComponent(q)}&limit=30`, { signal: ctrl.signal })
      .then((hits) => setState({ q, hits, error: '' }))
      .catch((err) => {
        if ((err as Error).name !== 'AbortError') setState({ q, hits: [], error: errorMessage(err) });
      });
    return () => ctrl.abort();
  }, [q]);

  const current = state.q === q ? state : { q, hits: null, error: '' };

  const open = (hit: SearchHit) => {
    if (hit.kind === 'glossary') onOpenGlossary(hit.title);
    else if (hit.kind === 'lexis_topic') onAskLexis(hit.snippet || hit.title);
    else if (hit.kind === 'dilemma') onNavigate('dilemas');
    else onNavigate('actividades');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Resultados de búsqueda</h1>
        <p className="text-sm text-[#A3A3A3] mt-1.5">Buscando: &quot;{q}&quot;</p>
      </div>

      {q.length < 2 ? (
        <p className="text-sm text-[#757575]">Escribe al menos 2 caracteres.</p>
      ) : current.hits === null ? (
        <div className="py-16 flex justify-center" role="status">
          <div className="w-8 h-8 rounded-full border-2 border-[#242424] border-t-[#00FFEF] animate-spin" aria-hidden="true" />
          <span className="sr-only">Buscando…</span>
        </div>
      ) : current.error ? (
        <p role="alert" className="text-sm text-[#FF3366]">
          {current.error}
        </p>
      ) : current.hits.length === 0 ? (
        <div className="bg-[#0D0D0D] border border-[#1E1E1E] rounded-2xl py-12 px-6 flex flex-col items-center text-center space-y-4">
          <div className="flex items-center gap-5">
            <LexisMascot expression="sad" className="w-24 h-32" />
            <SearchX className="w-9 h-9 text-[#FF3366]" />
          </div>
          <h2 className="text-xl font-bold text-white">No encontramos nada con esa búsqueda</h2>
          <button
            type="button"
            onClick={() => onAskLexis(q)}
            className="bg-[#00FFEF] text-black font-bold text-xs px-6 py-3 rounded-lg hover:brightness-105 cursor-pointer"
          >
            Preguntar al Asistente Virtual
          </button>
        </div>
      ) : (
        ORDER.filter((kind) => current.hits!.some((h) => h.kind === kind)).map((kind) => (
          <section key={kind} className="space-y-3" aria-label={KIND_META[kind].label}>
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#00FFEF]">
              {KIND_META[kind].icon}
              {KIND_META[kind].label}
            </h2>
            <div className="space-y-2.5">
              {current.hits!
                .filter((h) => h.kind === kind)
                .map((hit) => (
                  <button
                    key={`${hit.kind}-${hit.id}`}
                    type="button"
                    onClick={() => open(hit)}
                    className="w-full text-left bg-[#111111] border border-[#222222] hover:border-[#00FFEF] rounded-2xl px-6 py-4 transition cursor-pointer group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{hit.title}</p>
                        {hit.snippet && <p className="text-xs text-[#A3A3A3] mt-1 line-clamp-2">{hit.snippet}</p>}
                      </div>
                      <span className="text-xs font-bold text-[#00FFEF] shrink-0 opacity-70 group-hover:opacity-100">
                        {KIND_META[kind].action} →
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};
