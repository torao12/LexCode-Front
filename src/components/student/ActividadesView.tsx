'use client';

import React, { useState } from 'react';
import { QuizzesView } from '@/components/student/QuizzesView';
import { MemoramaGame } from '@/components/student/MemoramaGame';
import { CompletaFraseGame } from '@/components/student/CompletaFraseGame';

type ActivityMode = 'menu' | 'quizzes' | 'memorama' | 'cloze';

interface ActividadesViewProps {
  xp: number;
  completedActivities?: string[];
  onUpdateXp: (delta: number) => void;
  onCompleteActivity?: (activityId: string) => void;
}

export const ActividadesView: React.FC<ActividadesViewProps> = ({
  xp,
  completedActivities = [],
  onUpdateXp,
  onCompleteActivity,
}) => {
  const [mode, setMode] = useState<ActivityMode>('menu');

  if (mode === 'quizzes') {
    return (
      <QuizzesView
        xp={xp}
        onUpdateXp={onUpdateXp}
        onCompleteActivity={onCompleteActivity}
        onExitToActivities={() => setMode('menu')}
      />
    );
  }

  if (mode === 'memorama') {
    return (
      <MemoramaGame
        onUpdateXp={onUpdateXp}
        onCompleteActivity={onCompleteActivity}
        onExit={() => setMode('menu')}
      />
    );
  }

  if (mode === 'cloze') {
    return (
      <CompletaFraseGame
        onUpdateXp={onUpdateXp}
        onCompleteActivity={onCompleteActivity}
        onExit={() => setMode('menu')}
      />
    );
  }

  const hasMemoramaDone = completedActivities.includes('memorama');
  const hasClozeDone = completedActivities.includes('cloze');
  const hasQuizDone = completedActivities.some((id) => id.startsWith('quiz-'));

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Actividades y Juegos
        </h1>
        <p className="text-sm text-[#A3A3A3] mt-1">
          Elige una dinámica interactiva para practicar y sumar XP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        <button
          type="button"
          onClick={() => setMode('memorama')}
          className="bg-[#111111] border border-[#222222] hover:border-[#00FFEF] rounded-2xl p-6 text-left flex flex-col justify-between min-h-[210px] transition cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#00FFEF]">
                Memorama
              </span>
              {hasMemoramaDone && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#002A28] text-[#00FFEF]">
                  Completado
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mt-2">
              Conexiones Legales
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Empareja conceptos normativos con su definición legal correspondiente.
            </p>
          </div>
          <span className="text-xs font-bold text-[#00FFEF] pt-4">
            +50 XP por par →
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode('cloze')}
          className="bg-[#111111] border border-[#222222] hover:border-[#00FFEF] rounded-2xl p-6 text-left flex flex-col justify-between min-h-[210px] transition cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#00FFEF]">
                Espacios en blanco
              </span>
              {hasClozeDone && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#002A28] text-[#00FFEF]">
                  Completado
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mt-2">
              Completa la Frase
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Rellena los huecos normativos con el término jurídico o de seguridad adecuado.
            </p>
          </div>
          <span className="text-xs font-bold text-[#00FFEF] pt-4">
            +100 XP por acierto →
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode('quizzes')}
          className="bg-[#111111] border border-[#222222] hover:border-[#00FFEF] rounded-2xl p-6 text-left flex flex-col justify-between min-h-[210px] transition cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#00FFEF]">
                Evaluación contrarreloj
              </span>
              {hasQuizDone && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#002A28] text-[#00FFEF]">
                  Completado
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-white mt-2">
              Módulos de Quiz
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Responde reactivos sobre ciberseguridad, ética profesional y protección de datos.
            </p>
          </div>
          <span className="text-xs font-bold text-[#00FFEF] pt-4">
            Hasta +450 XP →
          </span>
        </button>
      </div>
    </div>
  );
};
