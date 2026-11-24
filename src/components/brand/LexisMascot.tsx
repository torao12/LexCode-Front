'use client';

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
  return (
    <svg
      viewBox="0 0 210 250"
      className={`${className} select-none`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={`Mascota Lexis en estado ${expression}`}
    >
      {/* Antena superior */}
      <line x1="105" y1="18" x2="105" y2="42" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="105" cy="14" r="6" fill="#00FFEF" />

      {/* Brazo izquierdo */}
      <g>
        <path
          d="M52 136C33 142 25 162 24 182C23 191 31 196 36 189C40 183 41 169 52 158"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <line x1="33" y1="176" x2="43" y2="171" stroke="#00FFEF" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Brazo derecho */}
      {expression === 'sad' ? (
        <path
          d="M158 136C174 146 177 166 168 184C164 191 155 188 157 180C160 171 158 158 148 150"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M158 136C176 132 188 114 190 96C191 88 182 85 178 92C174 100 168 113 154 121"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      )}
      {expression !== 'sad' && (
        <line x1="171" y1="114" x2="180" y2="119" stroke="#00FFEF" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* Cuerpo */}
      <path
        d="M66 134C66 126 144 126 144 134C148 164 142 198 124 214C112 224 98 224 86 214C68 198 62 164 66 134Z"
        fill="#FFFFFF"
      />
      {/* Emblema </> central */}
      <circle cx="105" cy="154" r="13" fill="#00FFEF" stroke="#000000" strokeWidth="2.5" />
      <path d="M101 150L97 154L101 158" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M109 150L113 154L109 158" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="106.5" y1="149" x2="103.5" y2="159" stroke="#000000" strokeWidth="2" strokeLinecap="round" />

      {/* Detalles de circuito en cuerpo */}
      <line x1="105" y1="167" x2="105" y2="177" stroke="#000000" strokeWidth="2" />
      <path d="M76 174H92L97 180" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <circle cx="76" cy="174" r="2.8" fill="#00FFEF" stroke="#000000" strokeWidth="1.5" />
      <path d="M134 174H118L113 180" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <circle cx="134" cy="174" r="2.8" fill="#00FFEF" stroke="#000000" strokeWidth="1.5" />
      <line x1="99" y1="191" x2="99" y2="201" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="105" y1="191" x2="105" y2="201" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="111" y1="191" x2="111" y2="201" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="97" y="211" width="16" height="4" rx="2" fill="#00FFEF" />

      {/* Manos cuando está triste */}
      {expression === 'sad' && (
        <>
          <ellipse cx="88" cy="178" rx="11" ry="7" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
          <ellipse cx="122" cy="178" rx="11" ry="7" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
        </>
      )}

      {/* Libro y foco en modo glosario */}
      {expression === 'book_bulb' && (
        <g>
          {/* Foco */}
          <circle cx="44" cy="108" r="14" fill="#FFD43B" />
          <rect x="39" y="121" width="10" height="6" rx="2" fill="#D4D4D4" />
          <line x1="44" y1="84" x2="44" y2="89" stroke="#FFD43B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="108" x2="27" y2="108" stroke="#FFD43B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="27" y1="91" x2="31" y2="95" stroke="#FFD43B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Libro abierto */}
          <path d="M52 174C64 170 76 173 84 178V204C76 199 64 197 52 201V174Z" fill="#00FFEF" stroke="#000000" strokeWidth="2" />
          <path d="M116 174C104 170 92 173 84 178V204C92 199 104 197 116 201V174Z" fill="#00FFEF" stroke="#000000" strokeWidth="2" />
        </g>
      )}

      {/* Cabeza */}
      <rect x="44" y="42" width="122" height="86" rx="22" fill="#FFFFFF" />
      <rect x="54" y="51" width="102" height="68" rx="15" fill="#000000" />

      {/* Esquinas de visor */}
      <path d="M62 64V58H68" stroke="#00FFEF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M148 64V58H142" stroke="#00FFEF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M62 106V112H68" stroke="#00FFEF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M148 106V112H142" stroke="#00FFEF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ojos según expresión */}
      {expression === 'happy' && (
        <>
          <ellipse cx="83" cy="82" rx="10" ry="12" fill="#00FFEF" />
          <ellipse cx="127" cy="82" rx="10" ry="12" fill="#00FFEF" />
          <path d="M95 100C100 106 110 106 115 100" stroke="#00FFEF" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}

      {expression === 'wave' && (
        <>
          <path d="M73 85C76 76 90 76 93 85" stroke="#00FFEF" strokeWidth="4" strokeLinecap="round" />
          <path d="M117 85C120 76 134 76 137 85" stroke="#00FFEF" strokeWidth="4" strokeLinecap="round" />
          <path d="M98 98C100 107 110 107 112 98H98Z" fill="#00FFEF" />
        </>
      )}

      {expression === 'neutral' && (
        <>
          <rect x="74" y="72" width="18" height="22" rx="8" fill="#00FFEF" />
          <rect x="118" y="72" width="18" height="22" rx="8" fill="#00FFEF" />
          <line x1="99" y1="104" x2="111" y2="104" stroke="#00FFEF" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}

      {expression === 'sad' && (
        <>
          <ellipse cx="83" cy="83" rx="9" ry="10" fill="#00FFEF" />
          <ellipse cx="127" cy="83" rx="9" ry="10" fill="#00FFEF" />
          <path d="M74 69L91 73" stroke="#00FFEF" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M136 69L119 73" stroke="#00FFEF" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M97 105C101 99 109 99 113 105" stroke="#00FFEF" strokeWidth="3.2" strokeLinecap="round" />
        </>
      )}

      {expression === 'angry' && (
        <>
          <ellipse cx="83" cy="85" rx="9" ry="8" fill="#00FFEF" />
          <ellipse cx="127" cy="85" rx="9" ry="8" fill="#00FFEF" />
          <path d="M72 72L93 80" stroke="#00FFEF" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M138 72L117 80" stroke="#00FFEF" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="99" y1="103" x2="111" y2="103" stroke="#00FFEF" strokeWidth="3.2" strokeLinecap="round" />
        </>
      )}

      {expression === 'book_bulb' && (
        <>
          <path d="M74 84C77 75 89 75 92 84" stroke="#00FFEF" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="127" cy="82" rx="9" ry="11" fill="#00FFEF" />
          <path d="M98 100C102 106 108 106 112 100" stroke="#00FFEF" strokeWidth="3.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};
