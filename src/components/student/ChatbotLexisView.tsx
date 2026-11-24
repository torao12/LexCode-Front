'use client';

import React, { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { StudentRoute } from '@/types/lexcode';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  glossaryLink?: boolean;
}

interface ChatbotLexisViewProps {
  userName: string;
  initialPrompt?: string;
  onNavigateGlossary: (route: StudentRoute) => void;
}

const LEGAL_KNOWLEDGE: { keywords: string[]; reply: string; glossaryLink?: boolean }[] = [
  {
    keywords: ['sensible', 'sensibles', 'dato personal'],
    reply:
      'Segun el Art. 3 de la LFPDPPP, son aquellos que afectan la esfera mas intima del titular o cuya utilizacion indebida pueda dar origen a discriminacion',
    glossaryLink: true,
  },
  {
    keywords: ['arco', 'acceso', 'rectificacion', 'cancelacion', 'oposicion'],
    reply:
      'Los derechos ARCO (Acceso, Rectificación, Cancelación y Oposición) permiten al titular controlar sus datos personales bajo la LFPDPPP.',
    glossaryLink: true,
  },
  {
    keywords: ['licencia', 'software', 'lfda', '101 bis', 'pirateria'],
    reply:
      'Conforme al Art. 101 Bis de la LFDA, los programas de cómputo gozan de protección legal; usar software sin licencia expone a sanciones civiles y penales.',
    glossaryLink: false,
  },
  {
    keywords: ['ddos', 'phishing', 'ciberseguridad', 'seguridad'],
    reply:
      'En ciberseguridad, el Phishing busca engañar al usuario para robar credenciales, mientras que un ataque DDoS satura la disponibilidad de un servicio.',
    glossaryLink: true,
  },
];

export const ChatbotLexisView: React.FC<ChatbotLexisViewProps> = ({
  userName,
  initialPrompt = '',
  onNavigateGlossary,
}) => {
  const firstName = userName.split(' ')[0] || 'Ian';
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: `Hola, ${firstName}! Soy tu asistente legal.\nTienes alguna duda sobre la LFPDPPP?`,
    },
    {
      id: 'm-q1',
      sender: 'user',
      text: 'Que es un dato personal sensible?',
    },
    {
      id: 'm-a1',
      sender: 'bot',
      text: 'Segun el Art. 3 de la LFPDPPP, son aquellos que afectan la esfera mas intima del titular o cuya utilizacion indebida pueda dar origen a discriminacion',
      glossaryLink: true,
    },
  ]);

  const appendConversation = (query: string) => {
    const clean = query.trim();
    if (!clean) return;

    const lower = clean.toLowerCase();
    const matched = LEGAL_KNOWLEDGE.find((entry) =>
      entry.keywords.some((kw) => lower.includes(kw))
    );

    const botReply = matched
      ? matched.reply
      : 'De acuerdo con la LFPDPPP y las buenas prácticas de ética en TI, todo tratamiento de datos debe contar con aviso de privacidad, finalidad legítima y medidas de seguridad.';

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: clean },
      {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: botReply,
        glossaryLink: matched?.glossaryLink ?? true,
      },
    ]);
  };

  useEffect(() => {
    if (initialPrompt.trim()) {
      appendConversation(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    appendConversation(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-5xl space-y-4">
      <h1 className="text-lg font-bold text-white">Asistente Virtual</h1>

      <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl overflow-hidden flex flex-col min-h-[540px] justify-between">
        {/* Cabecera del bot */}
        <div className="bg-[#121212] border-b border-[#1E1E1E] px-6 py-4 flex items-center gap-3.5">
          <div className="w-10 h-11 rounded-lg bg-white flex flex-col items-center justify-center shrink-0">
            <div className="w-8 h-6 rounded-md bg-black flex items-center justify-center gap-1.5">
              <span className="w-2 h-2.5 rounded-full bg-[#00FFEF]" />
              <span className="w-2 h-2.5 rounded-full bg-[#00FFEF]" />
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Nodulo de Analisis (Bot)</div>
            <div className="text-xs text-[#00FFEF] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#00FFEF]" />
              <span>En linea - Listo para ayudarte</span>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto">
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-[#00FFEF] text-black font-bold text-sm px-6 py-4 rounded-2xl max-w-md">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex items-start gap-3.5">
                <div className="w-9 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 mt-1">
                  <div className="w-7 h-5 rounded-md bg-black flex items-center justify-center gap-1">
                    <span className="w-1.5 h-2 rounded-full bg-[#00FFEF]" />
                    <span className="w-1.5 h-2 rounded-full bg-[#00FFEF]" />
                  </div>
                </div>

                <div className="bg-[#141414] border border-[#222222] rounded-2xl px-5 py-4 max-w-md space-y-2.5">
                  <p className="text-xs sm:text-sm text-[#D4D4D4] whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>
                  {msg.glossaryLink && (
                    <button
                      type="button"
                      onClick={() => onNavigateGlossary('glosario')}
                      className="text-xs font-bold text-[#00FFEF] hover:underline block cursor-pointer"
                    >
                      Ver definicion en Glosario
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra inferior de envío */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-[#181818] bg-[#090909]"
        >
          <div className="flex items-center justify-between gap-3 bg-[#050505] border border-[#222222] rounded-full pl-5 pr-2 py-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta legal o caso de estudio..."
              aria-label="Escribe tu consulta legal o caso de estudio"
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-[#555555] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Enviar consulta"
              className="w-9 h-9 rounded-full bg-[#00FFEF] text-black flex items-center justify-center hover:brightness-105 transition shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
