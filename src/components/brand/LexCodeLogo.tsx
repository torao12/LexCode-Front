'use client';

import React from 'react';

interface LexCodeLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LexCodeLogo: React.FC<LexCodeLogoProps> = ({ size = 'md' }) => {
  const iconDimensions =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const textClasses =
    size === 'sm'
      ? 'text-xl'
      : size === 'lg'
        ? 'text-4xl'
        : 'text-2xl';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        viewBox="0 0 64 56"
        className={`${iconDimensions} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="7" r="2.2" fill="#00FFEF" />
        <line x1="32" y1="9" x2="32" y2="47" stroke="#00FFEF" strokeWidth="2.4" />
        <line x1="12" y1="16" x2="52" y2="16" stroke="#00FFEF" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M18 11L9 16L18 21" stroke="#00FFEF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 11L55 16L46 21" stroke="#00FFEF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="47" width="24" height="3.2" rx="1.5" fill="#00FFEF" />
      </svg>
      <span className={`${textClasses} font-bold tracking-tight leading-none`}>
        <span className="text-white">Lex</span>
        <span className="text-[#00FFEF]">Code</span>
      </span>
    </div>
  );
};
