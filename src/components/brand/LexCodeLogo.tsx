import React from 'react';

interface LexCodeLogoProps {
  size?: 'sm' | 'md';
}

export const LexCodeLogo: React.FC<LexCodeLogoProps> = ({ size = 'md' }) => {
  const isSmall = size === 'sm';

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={isSmall ? 24 : 30}
        height={isSmall ? 24 : 30}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M9 9L5 16L9 23"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 9L27 16L23 23"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 7V25M10 13H22M11 13L9.5 18.5H12.5L11 13ZM21 13L19.5 18.5H22.5L21 13Z"
          stroke="#00FFEF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`${
          isSmall ? 'text-lg' : 'text-2xl'
        } font-bold tracking-tight text-white leading-none`}
      >
        Lex<span className="text-[#00FFEF]">Code</span>
      </span>
    </div>
  );
};
