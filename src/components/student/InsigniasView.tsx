'use client';

import React from 'react';
import { BADGES_LIST } from '@/data/mockLexCode';
import { BadgeHex } from '@/components/brand/BadgeHex';

export const InsigniasView: React.FC = () => {
  const earnedBadges = BADGES_LIST.filter((b) => b.earned);
  const lockedBadges = BADGES_LIST.filter((b) => !b.earned);

  return (
    <div className="relative max-w-6xl space-y-10">
      {/* Cuadrícula decorativa superior derecha como en Certificados.png */}
      <div
        className="pointer-events-none hidden lg:block absolute -top-6 right-0 w-[340px] h-[250px] lexcode-grid-pattern opacity-80"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Insignias
        </h1>
      </div>

      {/* Sección Obtenidas */}
      <section className="relative z-10 space-y-6">
        <h2 className="text-xl font-semibold text-white">Obtenidas</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center max-w-4xl">
          {earnedBadges.map((badge) => (
            <BadgeHex key={badge.id} badge={badge} size="md" />
          ))}
        </div>
      </section>

      {/* Sección Bloqueadas */}
      <section className="relative z-10 space-y-6 pt-2">
        <h2 className="text-xl font-semibold text-white">Bloqueadas</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 justify-items-center max-w-4xl">
          {lockedBadges.map((badge) => (
            <BadgeHex key={badge.id} badge={badge} size="md" />
          ))}
        </div>
      </section>
    </div>
  );
};
