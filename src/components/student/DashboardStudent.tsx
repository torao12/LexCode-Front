'use client';

import React from 'react';
import { Flame, ArrowRight, ArrowUpRight, Shield, Landmark, Lock, ClipboardCheck, GitBranch, BookOpen } from 'lucide-react';
import { LexisMascot } from '@/components/brand/LexisMascot';
import { BadgeHex } from '@/components/brand/BadgeHex';
import { BADGES_LIST } from '@/data/mockLexCode';
import { StudentRoute } from '@/types/lexcode';

interface DashboardStudentProps {
  userName: string;
  xp: number;
  streakDays: number;
  onNavigate: (route: StudentRoute) => void;
}

export const DashboardStudent: React.FC<DashboardStudentProps> = ({
  userName,
  xp,
  streakDays,
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

  const recentBadges = BADGES_LIST.filter((b) => b.earned).slice(0, 2);

  return (
    <div className="space-y-7 max-w-6xl">
      {/* Encabezado y racha */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Hola, {firstName}. Tu siguiente reto te espera.
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-1.5">
            Aprende a decidir mejor, una misión a la vez.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-[#111111] border border-[#222222] rounded-xl px-4 py-2.5 text-xs font-semibold text-white shrink-0">
          <Flame className="w-4 h-4 text-[#00FFEF]" />
          <span>{streakDays} días de racha</span>
        </div>
      </div>

      {/* Fila superior: Dilema recomendado + Nivel y XP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[0.08em] text-[#00FFEF] uppercase">
              DILEMA RECOMENDADO · LEGISLACIÓN
            </p>
            <h2 className="text-2xl font-bold text-white mt-2">
              ¿Vender datos sin consentimiento?
            </h2>
            <p className="text-xs sm:text-sm text-[#A3A3A3] mt-2 leading-relaxed max-w-lg">
              Tu equipo quiere vender los datos de sus usuarios sin su permiso para aumentar ingresos. Analiza la decisión y sus implicaciones bajo la LFPDPPP.
            </p>
          </div>

          <div className="mt-6">
            <div className="text-xs text-[#757575] mb-3">
              8 min · Misión 5 de 8 · Legislación
            </div>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onNavigate('dilemas')}
                className="inline-flex items-center gap-2 bg-[#00FFEF] text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg hover:brightness-105 transition cursor-pointer"
              >
                <span>Continuar misión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-xs text-[#757575]">Tu avance se conserva</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#A3A3A3]">
                Nivel 7 · Guardián de datos
              </p>
              <div className="text-3xl font-bold text-[#00FFEF] mt-2">
                {xp.toLocaleString('en-US')} XP
              </div>
              <p className="text-xs text-[#757575] mt-1">
                {xpRemaining} XP para llegar al nivel 8
              </p>
            </div>
            <LexisMascot expression="wave" className="w-20 h-24 shrink-0" />
          </div>

          <div className="mt-5">
            <div className="w-full h-2 rounded-full bg-[#242424] overflow-hidden">
              <div
                className="h-full bg-[#00FFEF] rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-[11px] text-[#757575] mt-2">
              12 de 24 misiones completadas · {progressPct}%
            </div>
          </div>
        </div>
      </div>

      {/* Tus rutas de aprendizaje */}
      <section>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-white">Tus rutas de aprendizaje</h2>
          <button
            type="button"
            onClick={() => onNavigate('dilemas')}
            className="text-xs font-semibold text-[#00FFEF] hover:underline cursor-pointer"
          >
            Explorar misiones →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Ruta Ética */}
          <div
            onClick={() => onNavigate('dilemas')}
            className="bg-[#111111] border border-[#1F1F1F] hover:border-[#333333] rounded-2xl p-5 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#00FFEF]" />
                <span className="text-sm font-bold text-white">Ética</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#757575]" />
            </div>
            <p className="text-xs text-[#757575] mt-2">Decisiones con responsabilidad</p>
            <div className="flex items-center justify-between text-xs mt-4 mb-2">
              <span className="text-[#A3A3A3]">6 de 8 misiones</span>
              <span className="text-[#00FFEF] font-semibold">75%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#242424] overflow-hidden">
              <div className="h-full bg-[#00FFEF] rounded-full w-3/4" />
            </div>
          </div>

          {/* Ruta Legislación */}
          <div
            onClick={() => onNavigate('dilemas')}
            className="bg-[#111111] border border-[#1F1F1F] hover:border-[#333333] rounded-2xl p-5 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Landmark className="w-4 h-4 text-[#00FFEF]" />
                <span className="text-sm font-bold text-white">Legislación</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#757575]" />
            </div>
            <p className="text-xs text-[#757575] mt-2">Derechos en el entorno digital</p>
            <div className="flex items-center justify-between text-xs mt-4 mb-2">
              <span className="text-[#A3A3A3]">4 de 8 misiones</span>
              <span className="text-[#00FFEF] font-semibold">50%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#242424] overflow-hidden">
              <div className="h-full bg-[#00FFEF] rounded-full w-1/2" />
            </div>
          </div>

          {/* Ruta Ciberseguridad */}
          <div
            onClick={() => onNavigate('actividades')}
            className="bg-[#111111] border border-[#1F1F1F] hover:border-[#333333] rounded-2xl p-5 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#00FFEF]" />
                <span className="text-sm font-bold text-white">Ciberseguridad</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#757575]" />
            </div>
            <p className="text-xs text-[#757575] mt-2">Protege sistemas y personas</p>
            <div className="flex items-center justify-between text-xs mt-4 mb-2">
              <span className="text-[#A3A3A3]">2 de 8 misiones</span>
              <span className="text-[#00FFEF] font-semibold">25%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#242424] overflow-hidden">
              <div className="h-full bg-[#00FFEF] rounded-full w-1/4" />
            </div>
          </div>
        </div>
      </section>

      {/* Fila inferior: Lo que has aprendido + Logros recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Lo que has aprendido</h2>
            <button
              type="button"
              onClick={() => onNavigate('actividades')}
              className="text-xs font-semibold text-[#00FFEF] hover:underline cursor-pointer"
            >
              Ver actividad →
            </button>
          </div>

          <div className="divide-y divide-[#1E1E1E]">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <ClipboardCheck className="w-4 h-4 text-[#A3A3A3] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Quiz: privacidad y consentimiento
                  </div>
                  <div className="text-[11px] text-[#757575]">
                    Legislación · 10 de 10 respuestas correctas
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[#757575]">Hoy</div>
                <div className="text-xs font-bold text-[#00FFEF]">+150 XP</div>
              </div>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <GitBranch className="w-4 h-4 text-[#A3A3A3] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Dilema: un acceso que no te corresponde
                  </div>
                  <div className="text-[11px] text-[#757575]">
                    Ética · Decisión y reflexión completadas
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[#757575]">Ayer</div>
                <div className="text-xs font-bold text-[#00FFEF]">+100 XP</div>
              </div>
            </div>

            <div className="pt-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <BookOpen className="w-4 h-4 text-[#A3A3A3] shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">
                    Glosario: datos personales sensibles
                  </div>
                  <div className="text-[11px] text-[#757575]">
                    Concepto consultado · Protección de datos
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-[#757575]">Ayer</div>
                <div className="text-xs font-semibold text-[#A3A3A3]">Repaso</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-white">Logros recientes</h2>
            <button
              type="button"
              onClick={() => onNavigate('insignias')}
              className="text-xs font-semibold text-[#00FFEF] hover:underline cursor-pointer"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center justify-items-center my-auto py-2">
            {recentBadges.map((badge) => (
              <BadgeHex key={badge.id} badge={badge} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#666666] pt-1">
        Aprendizaje para ingeniería · Las insignias reconocen tu avance; no son acreditaciones legales.
      </p>
    </div>
  );
};
