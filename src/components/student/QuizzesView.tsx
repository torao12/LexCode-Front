'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import {
  BADGES_LIST,
  INITIAL_LEADERBOARD,
  QUIZ_MODULES,
  QUIZ_QUESTIONS,
} from '@/data/mockLexCode';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { BadgeHex } from '@/components/brand/BadgeHex';

interface QuizzesViewProps {
  xp: number;
  onUpdateXp: (delta: number) => void;
  onCompleteActivity?: (activityId: string) => void;
  onExitToActivities: () => void;
}

type QuizPhase = 'modules' | 'active' | 'leaderboard';

export const QuizzesView: React.FC<QuizzesViewProps> = ({
  xp,
  onUpdateXp,
  onCompleteActivity,
  onExitToActivities,
}) => {
  const [phase, setPhase] = useState<QuizPhase>('modules');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('ciberseguridad');
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(14);
  const [sessionXp, setSessionXp] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const currentQuestion = QUIZ_QUESTIONS[questionIdx] || QUIZ_QUESTIONS[0];
  const lastBadge = BADGES_LIST.find((b) => b.title === 'Maestro Ético') || BADGES_LIST[1];

  useEffect(() => {
    if (phase !== 'active' || selectedOptionId) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, selectedOptionId]);

  const handleStartQuiz = () => {
    setQuestionIdx(0);
    setSelectedOptionId(null);
    setSecondsLeft(14);
    setSessionXp(0);
    setCorrectCount(0);
    setPhase('active');
  };

  const handleChooseOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (selectedOptionId) return;
    setSelectedOptionId(optionId);
    if (optionId === currentQuestion.correctId) {
      setCorrectCount((prev) => prev + 1);
      setSessionXp((prev) => prev + currentQuestion.xpCorrect);
      onUpdateXp(currentQuestion.xpCorrect);
    } else {
      setSessionXp((prev) => prev + currentQuestion.xpWrong);
      onUpdateXp(currentQuestion.xpWrong);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setSecondsLeft(14);
    if (questionIdx + 1 < QUIZ_QUESTIONS.length) {
      setQuestionIdx((prev) => prev + 1);
    } else {
      onCompleteActivity?.(`quiz-${selectedModuleId}`);
      setPhase('leaderboard');
    }
  };

  if (phase === 'modules') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-8 max-w-6xl">
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Modulos de Evaluacion
              </h1>
              <p className="text-sm text-[#A3A3A3] mt-1.5">
                Selecciona una categoria para poner a prueba tus conocimientos contra reloj.
              </p>
            </div>
            <button
              type="button"
              onClick={onExitToActivities}
              className="text-xs text-[#A3A3A3] hover:text-white cursor-pointer"
            >
              ← Actividades
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            {QUIZ_MODULES.map((mod) => {
              const isSelected = selectedModuleId === mod.id;
              const isMuted = mod.accent === 'muted';
              const circleColor =
                mod.accent === 'cyan'
                  ? 'bg-[#00FFEF]'
                  : mod.accent === 'pink'
                    ? 'bg-[#FF3366]'
                    : 'bg-[#363636]';

              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`rounded-2xl p-4 sm:p-6 text-left flex flex-col justify-between min-h-[136px] sm:min-h-[210px] transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#002A28]/45 border-2 border-[#00FFEF]'
                      : 'bg-[#111111] border border-[#222222] hover:border-[#3A3A3A]'
                  }`}
                >
                  <div>
                    <div className={`w-11 h-11 rounded-full ${circleColor} mb-6`} />
                    <h2
                      className={`text-lg font-bold ${
                        isMuted ? 'text-[#8E8E8E]' : 'text-white'
                      }`}
                    >
                      {mod.title}
                    </h2>
                    <div className="text-xs text-[#757575] mt-2">
                      {mod.questionsCount} Preguntas
                    </div>
                    <div className="text-xs text-[#757575] mt-1 leading-relaxed">
                      {mod.description}
                    </div>
                  </div>

                  <div className="pt-6">
                    {mod.completedBadge && (
                      <div className="text-[11px] text-[#757575] mb-1">
                        {mod.completedBadge}
                      </div>
                    )}
                    <div
                      className={`text-xs font-bold ${
                        isMuted ? 'text-[#8E8E8E]' : 'text-[#00FFEF]'
                      }`}
                    >
                      {mod.xpReward}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0A0A0A] border-l border-[#181818] pl-0 lg:pl-8 flex flex-col items-center space-y-5">
          <div className="w-full bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
            <div className="text-xs font-semibold text-[#A3A3A3]">
              Progreso de Evaluaciones
            </div>
            <div className="text-3xl font-bold text-[#00FFEF] mt-1.5">
              Nivel {Math.max(1, Math.floor(xp / 600) + 1)}
            </div>
          </div>

          <div className="w-full bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5">
            <div className="text-xs font-semibold text-[#A3A3A3] mb-3">
              Ultima Insignia
            </div>
            <div className="flex items-center gap-3.5">
              <BadgeHex badge={{ ...lastBadge, meta: undefined }} size="sm" />
              <div>
                <div className="text-sm font-bold text-white">Maestro Etico</div>
                <div className="text-xs text-[#757575]">Obtenido ayer</div>
              </div>
            </div>
          </div>

          <LexisMascot expression="angry" className="w-36 h-44" />

          <button
            type="button"
            onClick={handleStartQuiz}
            className="w-full h-12 rounded-xl bg-[#00FFEF] text-black font-bold text-sm hover:brightness-105 transition cursor-pointer"
          >
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'leaderboard') {
    const dynamicLeaderboard = INITIAL_LEADERBOARD.map((entry) =>
      entry.isCurrentUser ? { ...entry, xp: Math.max(entry.xp, xp) } : entry
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-8 max-w-6xl items-start">
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Resultados del Quiz
            </h1>
            <p className="text-sm text-[#A3A3A3] mt-1">
              Modulo: {selectedModuleId} — {correctCount}/{QUIZ_QUESTIONS.length} aciertos
            </p>
          </div>

          <div className="space-y-4">
            {dynamicLeaderboard.map((row) => (
              <div
                key={row.rank}
                className={`rounded-2xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4 ${
                  row.isCurrentUser
                    ? 'bg-[#002A28]/55 border-2 border-[#00FFEF]'
                    : 'bg-[#111111] border border-[#222222]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black ${
                      row.rank === 1
                        ? 'bg-[#FFD43B]'
                        : row.rank === 2
                          ? 'bg-[#C4C4C4]'
                          : 'bg-[#B45309]'
                    }`}
                  >
                    {row.rank}
                  </span>
                  <span
                    className={`text-sm sm:text-base font-bold ${
                      row.isCurrentUser ? 'text-[#00FFEF]' : 'text-white'
                    }`}
                  >
                    {row.name}
                  </span>
                </div>

                <span className="text-sm sm:text-base font-bold text-[#00FFEF]">
                  {row.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0A0A0A] border-l border-[#181818] pl-0 lg:pl-8 flex flex-col items-center space-y-4">
          <div className="w-full bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 text-center space-y-2">
            <div className="text-sm font-bold text-white">Evaluación registrada</div>
            <div className="text-3xl font-bold text-[#00FFEF]">
              {sessionXp >= 0 ? `+ ${sessionXp}` : sessionXp} XP
            </div>
            <div className="text-xs text-[#A3A3A3] pt-1">
              Nivel {Math.max(1, Math.floor(xp / 600) + 1)} alcanzado
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('modules')}
            className="w-full h-11 rounded-xl bg-[#00FFEF] text-black font-bold text-xs hover:brightness-105 transition cursor-pointer"
          >
            Volver a Módulos
          </button>
        </div>
      </div>
    );
  }

  const isWrong =
    selectedOptionId !== null && selectedOptionId !== currentQuestion.correctId;
  const isCorrect = selectedOptionId === currentQuestion.correctId;
  const formattedTimer = `00:${String(secondsLeft).padStart(2, '0')}`;
  const progressPct = Math.round(
    ((questionIdx + (selectedOptionId ? 1 : 0.35)) / QUIZ_QUESTIONS.length) * 100
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 lg:gap-8 max-w-6xl items-start">
      <div className="lg:col-span-8 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-white whitespace-nowrap">
            Quiz en progreso ({questionIdx + 1}/{QUIZ_QUESTIONS.length})
          </span>
          <div className="flex-1 max-w-md h-2 rounded-full bg-[#242424] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isWrong ? 'bg-[#FF3366]' : 'bg-[#00FFEF]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <p className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
            {currentQuestion.moduleTag}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight max-w-lg">
            {currentQuestion.question}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-2xl">
          {currentQuestion.options.map((opt) => {
            const isChosen = selectedOptionId === opt.id;
            const isRightOption = opt.id === currentQuestion.correctId;

            let classes =
              'bg-[#0D0D0D] border border-[#222222] hover:border-[#444444] text-[#D4D4D4]';

            if (isWrong && isChosen) {
              classes = 'bg-[#2A0A14] border-2 border-[#FF3366] text-white';
            } else if (selectedOptionId && isRightOption) {
              classes = 'bg-[#002A28]/65 border-2 border-[#00FFEF] text-white';
            }

            return (
              <button
                key={opt.id}
                type="button"
                disabled={Boolean(selectedOptionId)}
                onClick={() => handleChooseOption(opt.id)}
                className={`rounded-xl px-4 py-3.5 sm:px-5 sm:py-5 text-left text-xs sm:text-sm font-medium flex items-center justify-between gap-3 transition cursor-pointer disabled:cursor-default ${classes}`}
              >
                <span>
                  <strong className="text-white">{opt.id})</strong> {opt.text}
                </span>

                {isWrong && isChosen && (
                  <span className="w-4 h-4 rounded-full bg-[#FF3366] shrink-0" />
                )}
                {selectedOptionId && isRightOption && (
                  <span className="w-4 h-4 rounded-full bg-[#00FFEF] flex items-center justify-center text-black shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#0A0A0A] border-l border-[#181818] pl-0 lg:pl-8 flex flex-col items-center justify-between space-y-6">
        {isWrong ? (
          <div className="w-full bg-[#220911] border border-[#FF3366]/60 rounded-2xl p-5">
            <div className="text-base font-bold text-white">
              Infraccion de seguridad!
            </div>
            <div className="text-lg font-bold text-[#FF3366] mt-0.5">
              {currentQuestion.xpWrong} XP
            </div>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        ) : isCorrect ? (
          <div className="w-full bg-[#002A28]/50 border border-[#00FFEF]/60 rounded-2xl p-5">
            <div className="text-base font-bold text-white">
              ¡Respuesta correcta!
            </div>
            <div className="text-lg font-bold text-[#00FFEF] mt-0.5">
              +{currentQuestion.xpCorrect} XP
            </div>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        ) : (
          <div className="w-full bg-[#111111] border border-[#1E1E1E] rounded-2xl p-5 text-center">
            <div className="text-xs font-semibold text-[#A3A3A3]">
              Tiempo Restante
            </div>
            <div className="text-3xl font-bold text-[#FF3366] mt-1">
              {formattedTimer}
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#242424] overflow-hidden mt-3">
              <div
                className="h-full bg-[#FF3366] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (secondsLeft / 15) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <LexisMascot
          expression={isWrong ? 'sad' : isCorrect ? 'happy' : 'neutral'}
          className="w-40 h-48"
        />

        <button
          type="button"
          onClick={handleNextQuestion}
          className="w-full h-12 rounded-xl bg-[#00FFEF] text-black font-bold text-sm hover:brightness-105 transition cursor-pointer"
        >
          Siguiente pregunta
        </button>
      </div>
    </div>
  );
};
