'use client';

import React, { useState } from 'react';
import { QuizzesView } from '@/components/student/QuizzesView';
import { MemoramaGame } from '@/components/student/MemoramaGame';
import { CompletaFraseGame } from '@/components/student/CompletaFraseGame';

type ActivityMode = 'menu' | 'quizzes' | 'memorama' | 'cloze';

interface ActividadesViewProps {
  xp: number;
  onUpdateXp: (delta: number) => void;
}

export const ActividadesView: React.FC<ActividadesViewProps> = ({
  xp,
  onUpdateXp,
}) => {
  const [mode, setMode] = useState<ActivityMode>('menu');

  if (mode === 'quizzes') {
    return (
      <QuizzesView
        xp={xp}
        onUpdateXp={onUpdateXp}
        onExitToActivities={() => setMode('menu')}
      />
    );
  }

  if (mode === 'memorama') {
    return (
      <MemoramaGame
        onUpdateXp={onUpdateXp}
        onExit={() => setMode('menu')}
      />
    );
  }

  if (mode === 'cloze') {
    return (
      <CompletaFraseGame
        onUpdateXp={onUpdateXp}
        onExit={() => setMode('menu')}
      />
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Centro de Entrenamiento
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1.5">
          Selecciona un modo de juego para practicar la normativa legal y etica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 pt-2">
        {/* Tarjeta 1: Auditoría Rápida */}
        <div className="bg-[#111111] border-2 border-[#00FFEF] rounded-2xl p-8 flex flex-col items-center justify-between text-center min-h-[310px]">
          <div className="w-16 h-16 rounded-full border-2 border-[#00FFEF] flex items-center justify-center text-2xl font-bold text-[#00FFEF]">
            ?
          </div>

          <div className="my-4">
            <h2 className="text-lg font-bold text-white">Auditoria Rapida</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 max-w-[190px] leading-relaxed">
              Modo clásico de preguntas. Pon a prueba tu retencion.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode('quizzes')}
            className="w-full h-11 rounded-xl bg-[#00FFEF] text-black font-bold text-xs hover:brightness-105 transition cursor-pointer"
          >
            Jugar
          </button>
        </div>

        {/* Tarjeta 2: Conexiones Legales (Memorama) */}
        <div className="bg-[#111111] border border-[#222222] hover:border-[#3A3A3A] rounded-2xl p-8 flex flex-col items-center justify-between text-center min-h-[310px] transition">
          <div className="grid grid-cols-2 gap-1.5 w-12 h-12">
            <span className="border-2 border-[#00FFEF] rounded-sm" />
            <span className="border-2 border-[#FF3366] rounded-sm" />
            <span className="border-2 border-[#FF3366] rounded-sm" />
            <span className="border-2 border-[#00FFEF] rounded-sm" />
          </div>

          <div className="my-4">
            <h2 className="text-lg font-bold text-white">Conexiones Legales</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 max-w-[205px] leading-relaxed">
              Encuentra los pares entre conceptos y sus definiciones.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode('memorama')}
            className="w-full h-11 rounded-xl bg-[#181818] border border-[#2A2A2A] text-white font-semibold text-xs hover:border-[#00FFEF] transition cursor-pointer"
          >
            Jugar Memorama
          </button>
        </div>

        {/* Tarjeta 3: Código Incompleto (Completar Frases) */}
        <div className="bg-[#111111] border border-[#222222] hover:border-[#3A3A3A] rounded-2xl p-8 flex flex-col items-center justify-between text-center min-h-[310px] transition">
          <div className="flex flex-col justify-center gap-2 w-14 h-12">
            <span className="h-1.5 w-full bg-[#333333] rounded-full" />
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-7 bg-[#00FFEF] rounded-full" />
              <span className="h-1.5 w-5 bg-[#333333] rounded-full" />
            </div>
            <span className="h-1.5 w-10 bg-[#333333] rounded-full" />
          </div>

          <div className="my-4">
            <h2 className="text-lg font-bold text-white">Codigo Incompleto</h2>
            <p className="text-xs text-[#A3A3A3] mt-2 max-w-[205px] leading-relaxed">
              Construye la norma arrastrando las palabras correctas al espacio.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMode('cloze')}
            className="w-full h-11 rounded-xl bg-[#181818] border border-[#2A2A2A] text-white font-semibold text-xs hover:border-[#00FFEF] transition cursor-pointer"
          >
            Completar Frases
          </button>
        </div>
      </div>
    </div>
  );
};
