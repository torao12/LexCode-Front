'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Send, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { api, errorMessage } from '@/lib/api';
import type { LexisReply } from '@/lib/types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  messageId?: number;
  legalReference?: LexisReply['legalReference'];
  glossarySlug?: string | null;
  suggestions?: string[];
  feedback?: boolean;
  isError?: boolean;
}

interface ChatbotLexisViewProps {
  userName: string;
  initialPrompt?: string;
  /** Se llama cuando el prompt inicial ya se envió (para no repetirlo). */
  onConsumePrompt?: () => void;
  /** Abre el glosario buscando ese término. */
  onOpenGlossary: (term: string) => void;
}

interface HistoryItem {
  id: number;
  user_text: string;
  was_helpful: boolean | null;
  created_at: string;
  answer: { body: string; expression: string } | null;
}

interface Suggestion {
  id: string;
  name: string;
  suggested_question: string;
}

const BotAvatar: React.FC<{ small?: boolean }> = ({ small }) => (
  <div
    className={`${small ? 'w-9 h-10 mt-1' : 'w-10 h-11'} rounded-lg bg-white flex items-center justify-center shrink-0`}
  >
    <div className={`${small ? 'w-7 h-5 gap-1' : 'w-8 h-6 gap-1.5'} rounded-md bg-black flex items-center justify-center`}>
      <span className={`${small ? 'w-1.5 h-2' : 'w-2 h-2.5'} rounded-full bg-[#00FFEF]`} />
      <span className={`${small ? 'w-1.5 h-2' : 'w-2 h-2.5'} rounded-full bg-[#00FFEF]`} />
    </div>
  </div>
);

export const ChatbotLexisView: React.FC<ChatbotLexisViewProps> = ({
  userName,
  initialPrompt = '',
  onConsumePrompt,
  onOpenGlossary,
}) => {
  const firstName = userName.split(' ')[0] || userName;
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      text: `¡Hola, ${firstName}! Soy Lexis, tu asistente legal.\n¿Tienes alguna duda sobre ética, legislación de TI o ciberseguridad?`,
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  // Evita enviar dos veces la misma pregunta inicial (React monta dos veces en desarrollo).
  const sentPromptRef = useRef<string | null>(null);

  const [confirmClear, setConfirmClear] = useState(false);

  // Conversaciones anteriores (las más recientes), debajo del saludo.
  useEffect(() => {
    api<{ items: HistoryItem[] }>('/lexis/history?pageSize=20')
      .then(({ items }) => {
        if (!items.length) return;
        setMessages((prev) => {
          const existing = new Set(prev.map((m) => m.id));
          const past: ChatMessage[] = [];
          [...items].reverse().forEach((h) => {
            if (existing.has(`b-${h.id}`)) return;
            past.push({ id: `hu-${h.id}`, sender: 'user', text: h.user_text });
            past.push({
              id: `b-${h.id}`,
              sender: 'bot',
              text: h.answer?.body ?? 'Todavía no tenía una respuesta para esto.',
              messageId: h.id,
              feedback: h.was_helpful ?? undefined,
            });
          });
          return [prev[0], ...past, ...prev.slice(1)];
        });
      })
      .catch(() => undefined);
  }, []);

  const clearHistory = async () => {
    try {
      await api('/lexis/history', { method: 'DELETE' });
      setMessages((prev) => [prev[0]]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: `e-${Date.now()}`, sender: 'bot', text: errorMessage(err), isError: true }]);
    } finally {
      setConfirmClear(false);
    }
  };

  useEffect(() => {
    api<Suggestion[]>('/lexis/suggestions')
      .then((rows) => setSuggestions(rows.slice(0, 4)))
      .catch(() => setSuggestions([]));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const ask = async (query: string) => {
    const clean = query.trim();
    if (!clean || sending) return;
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: clean }]);
    setSending(true);
    try {
      const r = await api<LexisReply>('/lexis/ask', { method: 'POST', body: { text: clean } });
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${r.messageId}`,
          sender: 'bot',
          text: r.body,
          messageId: r.messageId,
          legalReference: r.legalReference,
          glossarySlug: r.glossarySlug,
          suggestions: r.found ? [] : r.suggestions,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `e-${Date.now()}`, sender: 'bot', text: errorMessage(err), isError: true },
      ]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (initialPrompt.trim() && sentPromptRef.current !== initialPrompt) {
      sentPromptRef.current = initialPrompt;
      void ask(initialPrompt);
      onConsumePrompt?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  const sendFeedback = async (msg: ChatMessage, helpful: boolean) => {
    if (!msg.messageId) return;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, feedback: helpful } : m)));
    try {
      await api(`/lexis/messages/${msg.messageId}/feedback`, { method: 'POST', body: { helpful } });
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, feedback: undefined } : m)));
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    void ask(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-5xl space-y-4">
      <h1 className="text-lg font-bold text-white">Asistente Virtual</h1>

      <div className="bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl overflow-hidden flex flex-col min-h-[540px] justify-between">
        {/* Cabecera del bot */}
        <div className="bg-[#121212] border-b border-[#1E1E1E] px-6 py-4 flex items-center gap-3.5">
          <BotAvatar />
          <div className="flex-1">
            <div className="text-sm font-bold text-white">Lexis · Asistente legal</div>
            <div className="text-xs text-[#00FFEF] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#00FFEF]" />
              <span>En línea - Listo para ayudarte</span>
            </div>
          </div>
          {messages.length > 1 &&
            (confirmClear ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#A3A3A3]">¿Borrar la conversación?</span>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-lg text-[#A3A3A3] hover:text-white cursor-pointer"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => void clearHistory()}
                  className="px-3 py-1.5 rounded-lg bg-[#FF3366] text-black font-bold cursor-pointer"
                >
                  Sí, borrar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 text-xs text-[#757575] hover:text-[#FF3366] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Borrar historial
              </button>
            ))}
        </div>

        {/* Mensajes */}
        <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[560px]" aria-live="polite">
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
                <BotAvatar small />

                <div className="bg-[#141414] border border-[#222222] rounded-2xl px-5 py-4 max-w-md space-y-2.5">
                  <p
                    className={`text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                      msg.isError ? 'text-[#FF3366]' : 'text-[#D4D4D4]'
                    }`}
                  >
                    {msg.text}
                  </p>

                  {msg.legalReference && (
                    <p className="text-[11px] text-[#757575]">
                      Fundamento:{' '}
                      {msg.legalReference.url ? (
                        <a
                          href={msg.legalReference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#A3A3A3] underline hover:text-white"
                        >
                          {msg.legalReference.law}
                          {msg.legalReference.article ? `, ${msg.legalReference.article}` : ''}
                        </a>
                      ) : (
                        <>
                          {msg.legalReference.law}
                          {msg.legalReference.article ? `, ${msg.legalReference.article}` : ''}
                        </>
                      )}
                    </p>
                  )}

                  {msg.glossarySlug && (
                    <button
                      type="button"
                      onClick={() => onOpenGlossary(msg.glossarySlug!.replace(/-/g, ' '))}
                      className="text-xs font-bold text-[#00FFEF] hover:underline block cursor-pointer"
                    >
                      Ver definición en Glosario
                    </button>
                  )}

                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => void ask(sug)}
                          className="text-[11px] px-3 py-1.5 rounded-full border border-[#00FFEF] text-[#00FFEF] hover:bg-[#0A1E1D] cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.messageId && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#757575]">
                      <span>¿Te sirvió?</span>
                      <button
                        type="button"
                        aria-label="Sí me sirvió"
                        aria-pressed={msg.feedback === true}
                        onClick={() => void sendFeedback(msg, true)}
                        className={`p-1 rounded cursor-pointer ${msg.feedback === true ? 'text-[#00FFEF]' : 'hover:text-white'}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="No me sirvió"
                        aria-pressed={msg.feedback === false}
                        onClick={() => void sendFeedback(msg, false)}
                        className={`p-1 rounded cursor-pointer ${msg.feedback === false ? 'text-[#FF3366]' : 'hover:text-white'}`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sending && (
            <p className="text-xs text-[#757575] pl-12" role="status">
              Lexis está escribiendo…
            </p>
          )}

          {messages.length === 1 && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 pl-12">
              {suggestions.map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => void ask(sug.suggested_question)}
                  className="text-xs px-4 py-2 rounded-full border border-[#2A2A2A] text-[#D4D4D4] hover:border-[#00FFEF] hover:text-[#00FFEF] cursor-pointer"
                >
                  {sug.suggested_question}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Barra inferior de envío */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#181818] bg-[#090909]">
          <div className="flex items-center justify-between gap-2 sm:gap-3 bg-[#050505] border border-[#222222] rounded-full pl-4 sm:pl-5 pr-2 py-2 min-w-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu consulta legal o caso de estudio..."
              aria-label="Escribe tu consulta legal o caso de estudio"
              maxLength={500}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-[#555555] focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Enviar consulta"
              disabled={sending}
              className="w-9 h-9 rounded-full bg-[#00FFEF] text-black flex items-center justify-center hover:brightness-105 transition shrink-0 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
