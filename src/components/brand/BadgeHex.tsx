import React from 'react';
import { BadgeItem } from '@/types/lexcode';

export type BadgeVariant = 'check' | 'star' | 'flame' | 'scroll';

export interface BadgeHexProps {
  badge: BadgeItem;
  size?: 'sm' | 'md';
  variant?: BadgeVariant;
  laurels?: boolean;
  imageSrc?: string;
}

function inferVariant(badge: BadgeItem): BadgeVariant {
  const text = `${badge.id ?? ''} ${badge.title ?? ''} ${badge.meta ?? ''}`.toLowerCase();
  if (text.includes('racha') || text.includes('streak') || text.includes('flame') || text.includes('fuego')) {
    return 'flame';
  }
  if (text.includes('cert') || text.includes('diploma') || text.includes('curso') || text.includes('quiz') || text.includes('scroll')) {
    return 'scroll';
  }
  if (text.includes('star') || text.includes('estrella') || text.includes('ganado') || text.includes('maestro') || text.includes('top')) {
    return 'star';
  }
  return 'check';
}

export const BadgeHex: React.FC<BadgeHexProps> = ({
  badge,
  size = 'md',
  variant,
  laurels = false,
  imageSrc,
}) => {
  const isSmall = size === 'sm';
  const isEarned = Boolean(badge.earned) && badge.theme !== 'locked';
  const resolvedVariant = variant ?? inferVariant(badge);

  const primaryFill = isEarned ? '#FFD43B' : '#A3A3A3';
  const eyeFill = isEarned ? '#FFD43B' : '#9CA3AF';
  const outlineStroke = '#0A0A0A';

  const renderBottomSymbol = () => {
    if (!isEarned) {
      return (
        <g transform="translate(88, 128)">
          <path
            d="M12 10V7C12 3.686 14.686 1 18 1C21.314 1 24 3.686 24 7V10M18 15V19M8 10H28V24H8V10Z"
            stroke="#0A0A0A"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    }

    switch (resolvedVariant) {
      case 'star':
        return (
          <path
            d="M106 130L109.4 137L117 138.1L111.5 143.5L112.8 151.1L106 147.5L99.2 151.1L100.5 143.5L95 138.1L102.6 137L106 130Z"
            stroke="#0A0A0A"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'flame':
        return (
          <path
            d="M107.8 130C113.6 134 115.7 137.3 114 139.9C117.3 143.2 116.5 146.1 111.5 148.8C104.1 151.4 99.1 149.8 96.6 143.8C95 140.5 96.6 137.6 101.6 134.9C101.6 139.6 102.8 141.5 105.3 140.9C108.6 138.9 109.5 135.3 107.8 130Z"
            stroke="#0A0A0A"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
      case 'scroll':
        return (
          <g stroke="#0A0A0A" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <rect x="97" y="132" width="18" height="12" rx="1.5" />
            <line x1="101" y1="136" x2="111" y2="136" />
            <line x1="101" y1="140" x2="108" y2="140" />
            <path d="M101 144L98.5 149L106 146.5L113.5 149L111 144" />
          </g>
        );
      case 'check':
      default:
        return (
          <path
            d="M97.5 141.5L103.5 147.5L115.5 134.5"
            stroke="#0A0A0A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );
    }
  };

  const renderLaurels = () => {
    if (!laurels) return null;
    const leafFill = isEarned ? '#FFD43B' : '#A3A3A3';
    return (
      <g stroke={outlineStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 124C21 114 18 100 20 84" fill="none" stroke={leafFill} strokeWidth="2.6" />
        <ellipse cx="22" cy="113" rx="5" ry="9" transform="rotate(-28 22 113)" fill={leafFill} />
        <ellipse cx="17" cy="99" rx="5" ry="9" transform="rotate(-18 17 99)" fill={leafFill} />
        <ellipse cx="17" cy="84" rx="5" ry="9" transform="rotate(-8 17 84)" fill={leafFill} />
        <ellipse cx="22" cy="70" rx="5" ry="9" transform="rotate(8 22 70)" fill={leafFill} />

        <path d="M185 124C191 114 194 100 192 84" fill="none" stroke={leafFill} strokeWidth="2.6" />
        <ellipse cx="190" cy="113" rx="5" ry="9" transform="rotate(28 190 113)" fill={leafFill} />
        <ellipse cx="195" cy="99" rx="5" ry="9" transform="rotate(18 195 99)" fill={leafFill} />
        <ellipse cx="195" cy="84" rx="5" ry="9" transform="rotate(8 195 84)" fill={leafFill} />
        <ellipse cx="190" cy="70" rx="5" ry="9" transform="rotate(-8 190 70)" fill={leafFill} />
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center text-center group">
      <div
        className={`${
          isSmall ? 'w-20 h-22' : 'w-28 h-32'
        } flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={badge.title}
            className={`w-full h-full object-contain transition ${
              isEarned ? '' : 'grayscale opacity-75'
            }`}
          />
        ) : (
          <svg
            viewBox="0 0 212 225"
            className="w-full h-full overflow-visible drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
            role="img"
            aria-label={badge.title}
          >
            {renderLaurels()}

            <path
              d="M54 152L46 206L66 192L82 208L92 162Z"
              fill={primaryFill}
              stroke={outlineStroke}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M158 152L166 206L146 192L130 208L120 162Z"
              fill={primaryFill}
              stroke={outlineStroke}
              strokeWidth="3"
              strokeLinejoin="round"
            />

            <path
              d="M106 8L182 51.5C186.5 54.1 189 58.8 189 64V136C189 141.2 186.5 145.9 182 148.5L113.5 188C108.9 190.6 103.1 190.6 98.5 188L30 148.5C25.5 145.9 23 141.2 23 136V64C23 58.8 25.5 54.1 30 51.5L106 8Z"
              fill={primaryFill}
              stroke={outlineStroke}
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            <path
              d="M106 20L174 59.3V137.8L106 177L38 137.8V59.3L106 20Z"
              fill="#0A0A0A"
            />

            <line
              x1="106"
              y1="44"
              x2="106"
              y2="56"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle
              cx="106"
              cy="41"
              r="4.5"
              fill={primaryFill}
              stroke={outlineStroke}
              strokeWidth="1.5"
            />

            <rect
              x="67"
              y="56"
              width="78"
              height="52"
              rx="14"
              fill="#FFFFFF"
              stroke={outlineStroke}
              strokeWidth="2"
            />
            <rect x="75" y="64" width="62" height="36" rx="8" fill="#0A0A0A" />

            <ellipse cx="92" cy="82" rx="7.5" ry="9.5" fill={eyeFill} />
            <ellipse cx="120" cy="82" rx="7.5" ry="9.5" fill={eyeFill} />

            {isEarned && (
              <path
                d="M101 92C104 95 108 95 111 92"
                stroke={eyeFill}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}

            <circle
              cx="106"
              cy="141"
              r="18"
              fill={primaryFill}
              stroke={outlineStroke}
              strokeWidth="2.5"
            />
            {renderBottomSymbol()}
          </svg>
        )}
      </div>

      <div
        className={`${
          isSmall ? 'text-xs mt-1.5' : 'text-sm mt-2.5'
        } font-bold ${
          isEarned ? 'text-white' : 'text-[#8E8E8E]'
        } max-w-[148px] leading-snug`}
      >
        {badge.title}
      </div>

      {badge.meta && (
        <div className="text-[11px] text-[#757575] mt-0.5 max-w-[150px]">
          {badge.meta}
        </div>
      )}
    </div>
  );
};
