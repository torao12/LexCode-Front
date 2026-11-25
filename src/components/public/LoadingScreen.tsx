'use client';

import React from 'react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center gap-5" role="status">
    <LexCodeLogo size="md" />
    <div className="w-8 h-8 rounded-full border-2 border-[#242424] border-t-[#00FFEF] animate-spin" aria-hidden="true" />
    <span className="sr-only">Cargando LexCode…</span>
  </div>
);
