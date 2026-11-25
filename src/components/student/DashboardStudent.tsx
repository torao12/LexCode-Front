'use client';

import React from 'react';
import {
  Flame,
  ArrowRight,
  ArrowUpRight,
  Shield,
  Landmark,
  Lock,
  ClipboardCheck,
  GitBranch,
  BookOpen,
} from 'lucide-react';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { BadgeHex } from '@/components/brand/BadgeHex';
import { BADGES_LIST, INITIAL_DILEMAS } from '@/data/mockLexCode';
import { StudentRoute } from '@/types/lexcode';

interface DashboardStudentProps {
  userName: string;
  xp: number;
  streakDays: number;
  completedDilemaIds?: string[];
  completedActivities?: string[];
  onNavigate: (route: StudentRoute) => void;
}

export const DashboardStudent: React.FC<DashboardStudentProps> = ({
  userName,
  xp,
  streakDays,
  completedDilemaIds = [],
  completedActivities = [],
  onNavigate,
}) => {
  const firstName = userName.split(' ')[0] || 'Ian';
  const nextLevelXp = 3000;
  const currentLevelBase = 2000;
  const progressPct = Math.min(
    100,
    Math.max(10, Math.round(((xp - currentLevelBase) / (nextLevelXp - currentLevelBase)) * 100))
  );
  const xpRemaining = Math.max(0, nextLevelXp - xp);
  const completedMissions = 12 + completedDilemaIds.length + completedActivities.length;
  const totalMissions = 24;
  const missionsPct = Math.min(100, Math.round((completedMissions / totalMissions) * 100));

  const earnedPreview = BADGES_LIST.filter((b) => b.earned).slice(0, 2);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 max-w-7xl items-start">
      <div className="xl:col-span-8 space-y-6">
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#0A1E1D] border-2 border-[#00FFEF] flex items-center justify-center shrink-0">
              <LexisMascot expression="happy" className="w-12 h-14" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                ¡Hola de nuevo, {firstName}!
              </h1>
              <p className="text-xs text-[#A3A3A3] mt-0.5">
                Nivel {Math.max(1, Math.floor(xp / 600) + 1)} · Guardián de datos
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="w-44 sm:w-56 h-2 rounded-full bg-[#242424] overflow-hidden">
                  <div
                    className="h-full bg-[#00FFEF] rounded-full transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-[#00FFEF] whitespace-nowrap">
                  {xp} / {nextLevelXp} XP
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0B0B0B] border border-[#222222] rounded-xl px-4 py-2.5 flex items-center gap-2.5 self-end sm:self-center">
            <Flame className="w-5 h-5 text-[#FF3366] fill-[#FF3366]" />
            <div>
              <div className="text-xs font-bold text-white">{streakDays} días</div>
              <div className="text-[11px] text-[#757575]">de racha activa</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
                MÓDULO ACTUAL
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Ética Profesional y Protección de Datos
              </h2>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#002A28] text-[#00FFEF] shrink-0">
              En progreso
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
            Aprende a aplicar la LFPDPPP, el aviso de privacidad y los principios de ética en el desarrollo de software mediante casos reales y simulaciones.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A3A3A3]">
                {completedMissions} de {totalMissions} misiones completadas
              </span>
              <span className="font-bold text-[#00FFEF]">{missionsPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-[#00FFEF] rounded-full transition-all duration-300"
                style={{ width: `${missionsPct}%` }}
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={() => onNavigate('dilemas')}
              className="inline-flex items-center gap-2 bg-[#00FFEF] text-black font-bold text-xs px-5 py-3 rounded-xl hover:brightness-105 transition cursor-pointer"
            >
              <span>Continuar aprendiendo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
                PRÁCTICA RÁPIDA
              </span>
              <h3 className="text-lg font-bold text-white">
                Evaluaciones y Juegos
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Pon a prueba tus conocimientos con memorama, completar frases y quizzes contra reloj.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('actividades')}
              className="w-full h-11 rounded-xl bg-[#181818] border border-[#282828] text-xs font-bold text-white hover:border-[#00FFEF] hover:text-[#00FFEF] transition cursor-pointer"
            >
              Ir a Quizzes y Juegos
            </button>
          </div>

          <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
                CONSULTA NORMATIVA
              </span>
              <h3 className="text-lg font-bold text-white">
                Glosario y Asistente Lexis
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Busca conceptos legales o resuelve dudas de ética y ciberseguridad con el bot.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('glosario')}
                className="h-11 rounded-xl bg-[#181818] border border-[#282828] text-xs font-bold text-white hover:border-[#00FFEF] transition cursor-pointer"
              >
                Glosario
              </button>
              <button
                type="button"
                onClick={() => onNavigate('chatbot')}
                className="h-11 rounded-xl bg-[#181818] border border-[#282828] text-xs font-bold text-[#00FFEF] hover:bg-[#002A28]/50 transition cursor-pointer"
              >
                Asistente
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 space-y-6">
        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Insignias Recientes</h2>
            <button
              type="button"
              onClick={() => onNavigate('insignias')}
              className="text-xs font-semibold text-[#00FFEF] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            {earnedPreview.map((badge) => (
              <div
                key={badge.id}
                className="bg-[#0B0B0B] border border-[#1E1E1E] rounded-xl p-4 flex flex-col items-center text-center"
              >
                <BadgeHex badge={badge} size="sm" />
              </div>
            ))}
          </div>

          <p className="text-xs text-[#757575] pt-1">
            Te faltan <span className="text-[#00FFEF] font-bold">{xpRemaining} XP</span> para el siguiente hito de nivel.
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Ruta de Dilemas</h2>
            <span className="text-xs font-bold text-[#00FFEF]">
              {completedDilemaIds.length} / {INITIAL_DILEMAS.length}
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_DILEMAS.map((d, idx) => {
              const isDone = completedDilemaIds.includes(d.id);
              const isUnlocked =
                idx === 0 || completedDilemaIds.includes(INITIAL_DILEMAS[idx - 1].id);
              const Icon =
                idx === 0
                  ? Shield
                  : idx === 1
                    ? Landmark
                    : idx === 2
                      ? ClipboardCheck
                      : idx === 3
                        ? GitBranch
                        : idx === 4
                          ? BookOpen
                          : Lock;

              return (
                <button
                  key={d.id}
                  type="button"
                  disabled={!isUnlocked}
                  onClick={() => onNavigate('dilemas')}
                  className={`w-full rounded-xl px-4 py-3 border text-left flex items-center justify-between gap-3 transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                    isDone
                      ? 'bg-[#002A28]/35 border-[#00FFEF]/50 text-white'
                      : 'bg-[#0B0B0B] border-[#1E1E1E] text-[#D4D4D4] hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-[#00FFEF] shrink-0" />
                    <span className="text-xs font-semibold truncate">{d.title}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#00FFEF] shrink-0">
                    {isDone ? 'Hecho' : isUnlocked ? 'Listo' : 'Bloqueado'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
