import React from 'react';
import { LexisExpression } from '@/types/lexcode';

interface LexisMascotProps {
  expression?: LexisExpression;
  className?: string;
}

export const LexisMascot: React.FC<LexisMascotProps> = ({
  expression = 'happy',
  className = 'w-36 h-44',
}) => {
  const eyeColor = expression === 'angry' ? '#FF3366' : '#00FFEF';

  return (
    <svg
      viewBox="0 0 180 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`Mascota Lexis con expresión ${expression}`}
    >
      {/* Antena superior */}
      <line
        x1="90"
        y1="14"
        x2="90"
        y2="34"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle
        cx="90"
        cy="12"
        r="6.5"
        fill={expression === 'angry' ? '#FF3366' : '#00FFEF'}
      />

      {/* Brazo izquierdo levantado cuando saluda ("wave") */}
      {expression === 'wave' ? (
        <g>
          <path
            d="M42 128C24 114 20 92 31 76"
            stroke="#00FFEF"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="33" cy="72" r="9" fill="#FFFFFF" />
        </g>
      ) : (
        <g>
          <path
            d="M42 132C26 138 22 154 28 168"
            stroke="#00FFEF"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="30" cy="171" r="8.5" fill="#FFFFFF" />
        </g>
      )}

      {/* Brazo derecho o libro/foco según expresión */}
      {expression === 'book_bulb' ? (
        <g>
          {/* Foco de idea arriba a la izquierda/derecha */}
          <circle cx="150" cy="54" r="14" fill="#FFD43B" fillOpacity="0.22" />
          <path
            d="M150 42C144.5 42 140 46.5 140 52C140 55.6 142 58.7 145 60.4V64H155V60.4C158 58.7 160 55.6 160 52C160 46.5 155.5 42 150 42Z"
            fill="#FFD43B"
          />
          <line x1="146" y1="67" x2="154" y2="67" stroke="#FFD43B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Libro de leyes en la mano */}
          <path
            d="M126 126C136 120 148 120 158 126V154C148 149 136 149 126 154V126Z"
            fill="#FFFFFF"
            stroke="#00FFEF"
            strokeWidth="2.5"
          />
          <line x1="142" y1="123" x2="142" y2="151" stroke="#111111" strokeWidth="2" />
          <path
            d="M136 136C124 142 118 138 118 128"
            stroke="#00FFEF"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </g>
      ) : (
        <g>
          <path
            d="M138 132C154 138 158 154 152 168"
            stroke="#00FFEF"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="150" cy="171" r="8.5" fill="#FFFFFF" />
        </g>
      )}

      {/* Piernas / bases del robot */}
      <rect x="64" y="166" width="14" height="26" rx="6" fill="#00FFEF" />
      <rect x="102" y="166" width="14" height="26" rx="6" fill="#00FFEF" />
      <rect x="58" y="187" width="26" height="9" rx="4.5" fill="#FFFFFF" />
      <rect x="96" y="187" width="26" height="9" rx="4.5" fill="#FFFFFF" />

      {/* Torso */}
      <rect
        x="48"
        y="114"
        width="84"
        height="56"
        rx="20"
        fill="#FFFFFF"
      />
      <rect
        x="62"
        y="128"
        width="56"
        height="28"
        rx="10"
        fill="#141414"
      />
      <circle cx="90" cy="142" r="5.5" fill={eyeColor} />

      {/* Cabeza */}
      <rect
        x="38"
        y="34"
        width="104"
        height="82"
        rx="28"
        fill="#FFFFFF"
      />
      <rect
        x="48"
        y="46"
        width="84"
        height="58"
        rx="20"
        fill="#0D0D0D"
      />

      {/* Cejas en expresión enojada */}
      {expression === 'angry' && (
        <g stroke="#FF3366" strokeWidth="4" strokeLinecap="round">
          <line x1="58" y1="61" x2="78" y2="69" />
          <line x1="122" y1="61" x2="102" y2="69" />
        </g>
      )}

      {/* Ojos */}
      {expression === 'sad' ? (
        <g>
          <ellipse cx="70" cy="74" rx="8.5" ry="10.5" fill="#00FFEF" />
          <ellipse cx="110" cy="74" rx="8.5" ry="10.5" fill="#00FFEF" />
          {/* Lágrima */}
          <path
            d="M118 84C118 84 123 91 123 95C123 97.8 120.8 100 118 100C115.2 100 113 97.8 113 95C113 91 118 84 118 84Z"
            fill="#00FFEF"
          />
        </g>
      ) : (
        <g>
          <ellipse cx="70" cy="74" rx="8.5" ry="11.5" fill={eyeColor} />
          <ellipse cx="110" cy="74" rx="8.5" ry="11.5" fill={eyeColor} />
          <circle cx="67.5" cy="70" r="2.8" fill="#FFFFFF" />
          <circle cx="107.5" cy="70" r="2.8" fill="#FFFFFF" />
        </g>
      )}

      {/* Boca / expresión */}
      {expression === 'happy' && (
        <path
          d="M78 88C83 95 97 95 102 88"
          stroke="#00FFEF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      {expression === 'wave' && (
        <path
          d="M80 89C85 95 95 95 100 89"
          stroke="#00FFEF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      {expression === 'neutral' && (
        <line
          x1="81"
          y1="91"
          x2="99"
          y2="91"
          stroke="#00FFEF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      {expression === 'sad' && (
        <path
          d="M79 95C84 89 96 89 101 95"
          stroke="#00FFEF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      {expression === 'angry' && (
        <path
          d="M79 94C84 88 96 88 101 94"
          stroke="#FF3366"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
      {expression === 'book_bulb' && (
        <path
          d="M80 89C85 94 95 94 100 89"
          stroke="#00FFEF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};
