'use client';

import React from 'react';
import { BadgeItem } from '@/types/lexcode';

interface BadgeHexProps {
  badge: BadgeItem;
  size?: 'sm' | 'md';
}

export const BadgeHex: React.FC<BadgeHexProps> = ({ badge, size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-24 h-28' : 'w-32 h-36';
  const strokeColor = badge.earned ? '#FFD43B' : '#9E9E9E';
  const accentFill = badge.earned ? '#FFD43B' : '#8E8E8E';
  const ribbonFill = badge.earned ? '#FFD43B' : '#8E8E8E';
  const ribbonLight = badge.earned ? '#FFE885' : '#666666';

  return (
    <div className="flex flex-col items-center text-center select-none">
      <svg
        viewBox="0 0 150 175"
        className={dimensions}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={badge.title}
      >
        {/* Laureles en medalla con estrella */}
        {badge.variant === 'star_laurel' && badge.earned && (
          <g stroke={accentFill} strokeWidth="2.5" strokeLinecap="round">
            <path d="M22 86C13 78 13 64 21 56" />
            <path d="M18 76L11 73" />
            <path d="M16 66L9 64" />
            <path d="M128 86C137 78 137 64 129 56" />
            <path d="M132 76L139 73" />
            <path d="M134 66L141 64" />
          </g>
        )}

        {/* Listones inferiores */}
        <polygon points="50,122 36,158 51,152 60,164 72,126" fill={ribbonLight} />
        <polygon points="100,122 114,158 99,152 90,164 78,126" fill={ribbonFill} />

        {/* Hexágono exterior */}
        <polygon
          points="75,14 124,42 124,98 75,126 26,98 26,42"
          fill="#0B0B0B"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Ícono superior */}
        {badge.variant === 'check_ribbon' && (
          <path d="M68 29L75 23L82 29" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {badge.variant === 'star_laurel' && (
          <path d="M68 29L75 23L82 29" stroke={strokeColor} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {badge.variant === 'flame_lock' && (
          <path d="M75 22C77 25 79 27 78 30C77 31 74 31 73 30C72 28 74 25 75 22Z" stroke={strokeColor} strokeWidth="2" />
        )}
        {badge.variant === 'doc_lock' && (
          <rect x="70" y="22" width="10" height="11" rx="1.5" stroke={strokeColor} strokeWidth="2" />
        )}

        {/* Cabeza estilizada de Lexis */}
        <rect
          x="45"
          y="42"
          width="60"
          height="42"
          rx="12"
          fill={badge.earned ? '#FFFFFF' : '#0B0B0B'}
          stroke={strokeColor}
          strokeWidth="3.5"
        />
        <rect x="51" y="48" width="48" height="30" rx="7" fill="#000000" />
        {badge.earned ? (
          <>
            <path d="M59 64C61 58 69 58 71 64" stroke={accentFill} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M79 64C81 58 89 58 91 64" stroke={accentFill} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M71 71C73 74 77 74 79 71" stroke={accentFill} strokeWidth="2.4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <rect x="61" y="57" width="8" height="11" rx="3.5" fill={strokeColor} />
            <rect x="81" y="57" width="8" height="11" rx="3.5" fill={strokeColor} />
          </>
        )}

        {/* Emblema inferior central */}
        {badge.earned ? (
          badge.variant === 'check_ribbon' ? (
            <>
              <circle cx="75" cy="100" r="11" fill={accentFill} />
              <path d="M70 100L73.5 103.5L80.5 96.5" stroke="#000000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </>
          ) : (
            <>
              <circle cx="75" cy="100" r="11" fill={accentFill} />
              <polygon
                points="75,92 77.5,97.5 83.5,98 79,102 80.5,108 75,105 69.5,108 71,102 66.5,98 72.5,97.5"
                fill="#000000"
              />
            </>
          )
        ) : (
          <>
            <circle cx="75" cy="100" r="11" fill="#4A4A4A" />
            <rect x="70.5" y="99" width="9" height="7" rx="1.5" fill="#0B0B0B" />
            <path d="M72.5 99V96.5C72.5 95.1 73.6 94 75 94C76.4 94 77.5 95.1 77.5 96.5V99" stroke="#0B0B0B" strokeWidth="1.8" />
          </>
        )}
      </svg>

      <span className={`mt-1 text-xs font-semibold ${badge.earned ? 'text-white' : 'text-[#A3A3A3]'}`}>
        {badge.title}
      </span>
      {badge.meta && (
        <span className="text-[11px] text-[#757575] mt-0.5">{badge.meta}</span>
      )}
    </div>
  );
};
