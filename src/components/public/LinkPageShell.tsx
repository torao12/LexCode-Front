'use client';

import React from 'react';
import Link from 'next/link';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';
import { LexisMascot } from '@/components/brand/LexisMascot';
import type { LexisExpression } from '@/types/lexcode';

/** Marco común de las páginas a las que llegan los enlaces de los correos. */
export const LinkPageShell: React.FC<{
  title: string;
  expression?: LexisExpression;
  children: React.ReactNode;
}> = ({ title, expression = 'happy', children }) => (
  <div className="min-h-screen bg-[#000000] text-white flex flex-col">
    <header className="max-w-6xl w-full mx-auto px-8 pt-7">
      <Link href="/" aria-label="Ir al inicio">
        <LexCodeLogo size="md" />
      </Link>
    </header>
    <main className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full bg-[#0D0D0D] border border-[#00FFEF] rounded-2xl p-8 space-y-5">
        <div className="flex justify-center">
          <LexisMascot expression={expression} className="w-28 h-36" />
        </div>
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        {children}
      </div>
    </main>
  </div>
);

export const primaryButton =
  'w-full h-12 rounded-xl bg-[#00FFEF] text-black font-bold text-sm hover:brightness-105 transition cursor-pointer disabled:opacity-60 flex items-center justify-center';
