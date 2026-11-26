'use client';

import React, { useMemo } from 'react';
import { BADGES_LIST } from '@/data/mockLexCode';
import { BadgeHex, BadgeVariant } from '@/components/brand/BadgeHex';
import { BadgeItem } from '@/types/lexcode';

interface InsigniasViewProps {
  xp?: number;
  completedDilemaIds?: string[];
  completedActivities?: string[];
}

function getBadgeVisualConfig(badge: BadgeItem, index: number): {
  variant: BadgeVariant;
  laurels: boolean;
} {
  if (badge.id === 'b-1' || index === 0) {
    return { variant: 'check', laurels: false };
  }
  if (badge.id === 'b-2' || index === 1) {
    return { variant: 'star', laurels: true };
  }
  if (badge.id === 'b-3' || index === 2) {
    return { variant: 'flame', laurels: false };
  }
  if (badge.id === 'b-4' || index === 3) {
    return { variant: 'scroll', laurels: false };
  }
  return { variant: 'star', laurels: false };
}

export const InsigniasView: React.FC<InsigniasViewProps> = ({
  xp = 2450,
  completedDilemaIds = [],
  completedActivities = [],
}) => {
  const computedBadges = useMemo(() => {
    const hasActivity = completedActivities.length > 0;
    const hasDilema = completedDilemaIds.length > 0;
    const hasHighXp = xp >= 600;

    return BADGES_LIST.map((badge, idx) => {
      const unlockedByProgress =
        (idx === 0 && hasActivity) ||
        (idx === 1 && hasDilema) ||
        (idx === 2 && hasHighXp);

      if (unlockedByProgress) {
        return {
          ...badge,
          earned: true,
          theme: badge.theme === 'locked' ? 'yellow' : badge.theme,
          meta: badge.earned && badge.meta ? badge.meta : 'Desbloqueada',
        };
      }

      if (!badge.earned) {
        return {
          ...badge,
          theme: 'locked' as const,
          meta: badge.meta || 'Bloqueado',
        };
      }

      return badge;
    });
  }, [completedActivities.length, completedDilemaIds.length, xp]);

  const earnedBadges = computedBadges.filter((b) => b.earned);
  const lockedBadges = computedBadges.filter((b) => !b.earned);

  return (
    <div className="relative max-w-6xl space-y-10">
      <div
        className="pointer-events-none hidden lg:block absolute -top-6 right-0 w-[340px] h-[250px] lexcode-grid-pattern opacity-80"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Insignias
        </h1>
        <span className="text-xs font-semibold text-[#00FFEF]">
          {earnedBadges.length} de {computedBadges.length} obtenidas · {xp} XP
        </span>
      </div>

      <section className="relative z-10 space-y-6">
        <h2 className="text-xl font-semibold text-white">Obtenidas</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center max-w-4xl">
          {earnedBadges.map((badge, idx) => {
            const visual = getBadgeVisualConfig(badge, idx);
            return (
              <BadgeHex
                key={badge.id}
                badge={badge}
                size="md"
                variant={visual.variant}
                laurels={visual.laurels}
              />
            );
          })}
        </div>
      </section>

      <section className="relative z-10 space-y-6 pt-2">
        <h2 className="text-xl font-semibold text-white">Bloqueadas</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center max-w-4xl">
          {lockedBadges.map((badge, idx) => {
            const visual = getBadgeVisualConfig(badge, earnedBadges.length + idx);
            return (
              <BadgeHex
                key={badge.id}
                badge={badge}
                size="md"
                variant={visual.variant}
                laurels={visual.laurels}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
