'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api, ApiError, errorMessage } from '@/lib/api';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  formatDate,
  inputClass,
  Loading,
  Notice,
  PageHeader,
  useApiData,
} from './ui';

type Expression = 'happy' | 'neutral' | 'sad' | 'angry' | 'book_bulb' | 'wave';

interface Answer {
  id: string;
  body: string;
  expression: Expression;
  is_active: boolean;
  version: number;
  updated_at: string;
}

interface Topic {
  id: string;
  name: string;
  keywords: string[];
  suggested_question: string | null;
  module_id: string | null;
  created_at: string;
  answers: Answer[];
}

interface Unanswered {
  question: string;
  times: number;
  last_asked: string;
}

const EXPRESSIONS: Record<Expression, string> = {
  neutral: 'Neutral',
  happy: 'Feliz',
  book_bulb: 'Explicando (libro)',
  wave: 'Saludando',
  sad: 'Triste',
  angry: 'Alerta',
};

const splitKeywords = (s: string) =>
  s
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);

const NewTopicForm: React.FC<{ prefill?: string; onCancel: () => void; onCreated: (t: Topic) => void }> = ({
  prefill = '',
  onCancel,
  onCreated,
}) => {
  const [name, setName] = useState(prefill);
  const [keywords, setKeywords] = useState(prefill);
  const [question, setQuestion] = useState('');
  const [body, setBody] = useState('');
  const [expression, setExpression] = useState<Expression>('neutral');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const kw = splitKeywords(keywords);
    if (!kw.length) return setError('Agrega al menos una palabra clave.');
    setBusy(true);
    try {
      const topic = await api<Topic>('/admin/lexis/topics', {
        method: 'POST',
        body: {
          name: name.trim(),
          keywords: kw,
          suggestedQuestion: question.trim() || null,
          answer: body.trim() ? { body: body.trim(), expression } : undefined,
        },
      });
      onCreated(topic);
    } catch (err) {
      setError(
        err instanceof ApiError && Object.keys(err.fields).length
          ? Object.values(err.fields).join('. ')
          : errorMessage(err),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-lg font-bold text-white">Nuevo tema para Lexis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre del tema" htmlFor="lx-name">
            <input id="lx-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </Field>
          <Field label="Pregunta sugerida (opcional)" htmlFor="lx-question" hint="Aparece como botón en el chat">
            <input id="lx-question" value={question} onChange={(e) => setQuestion(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Palabras clave" htmlFor="lx-keywords" hint="Separadas por coma. Lexis busca sin acentos y tolera errores de dedo.">
          <input id="lx-keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputClass} required />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-3">
            <Field label="Respuesta" htmlFor="lx-body">
              <textarea
                id="lx-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className={`${inputClass} h-auto py-2.5`}
                placeholder="Lo que contestará Lexis (mínimo 10 caracteres)"
              />
            </Field>
          </div>
          <Field label="Expresión de Lexis" htmlFor="lx-expression">
            <select
              id="lx-expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value as Expression)}
              className={inputClass}
            >
              {Object.entries(EXPRESSIONS).map(([v, t]) => (
                <option key={v} value={v}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {error && <Notice kind="error" text={error} />}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? 'Guardando…' : 'Crear tema'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

const TopicCard: React.FC<{ topic: Topic; onChange: (t: Topic | null) => void }> = ({ topic, onChange }) => {
  const active = topic.answers.find((a) => a.is_active);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(active?.body ?? '');
  const [expression, setExpression] = useState<Expression>(active?.expression ?? 'neutral');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const answer = await api<Answer>(`/admin/lexis/topics/${topic.id}/answers`, {
        method: 'POST',
        body: { body: body.trim(), expression },
      });
      onChange({
        ...topic,
        answers: [...topic.answers.map((a) => ({ ...a, is_active: false })), answer],
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError && err.fields.body ? 'La respuesta debe tener entre 10 y 2000 caracteres.' : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/admin/lexis/topics/${topic.id}`, { method: 'DELETE' });
      onChange(null);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Card className="p-5 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-bold text-white">{topic.name}</p>
            {active ? <Badge tone="cyan">v{active.version} · {EXPRESSIONS[active.expression]}</Badge> : <Badge tone="pink">Sin respuesta</Badge>}
            {topic.answers.length > 1 && <Badge>{topic.answers.length} versiones</Badge>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topic.keywords.map((k) => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-md bg-[#161616] text-[#A3A3A3]">
                {k}
              </span>
            ))}
          </div>
          {topic.suggested_question && <p className="text-xs text-[#757575]">Sugerida: «{topic.suggested_question}»</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          {!editing && (
            <Button small variant="outline" onClick={() => setEditing(true)}>
              Nueva versión
            </Button>
          )}
          {confirmDelete ? (
            <>
              <Button small variant="ghost" onClick={() => setConfirmDelete(false)}>
                Cancelar
              </Button>
              <Button small variant="danger" disabled={busy} onClick={() => void remove()}>
                Sí, eliminar
              </Button>
            </>
          ) : (
            <Button small variant="danger" aria-label={`Eliminar tema ${topic.name}`} onClick={() => setConfirmDelete(true)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {!editing && active && <p className="text-sm text-[#D4D4D4] whitespace-pre-line">{active.body}</p>}

      {editing && (
        <form onSubmit={publish} className="space-y-3 pt-2 border-t border-[#1E1E1E]">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <Field label="Respuesta (nueva versión)" htmlFor={`ans-${topic.id}`} hint="La versión anterior queda en el historial.">
                <textarea
                  id={`ans-${topic.id}`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className={`${inputClass} h-auto py-2.5`}
                />
              </Field>
            </div>
            <Field label="Expresión" htmlFor={`expr-${topic.id}`}>
              <select
                id={`expr-${topic.id}`}
                value={expression}
                onChange={(e) => setExpression(e.target.value as Expression)}
                className={inputClass}
              >
                {Object.entries(EXPRESSIONS).map(([v, t]) => (
                  <option key={v} value={v}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Publicando…' : 'Publicar versión'}
            </Button>
          </div>
        </form>
      )}
      {error && <Notice kind="error" text={error} />}
    </Card>
  );
};

export const AdminLexisView: React.FC = () => {
  const topics = useApiData<Topic[]>('/admin/lexis/topics');
  const unanswered = useApiData<Unanswered[]>('/admin/lexis/unanswered?limit=20');
  const [creating, setCreating] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const list = useMemo(() => topics.data ?? [], [topics.data]);

  return (
    <div className="max-w-5xl space-y-8">
      <PageHeader
        title="Lexis"
        subtitle="Temas y respuestas predeterminadas del asistente. Lexis elige el tema por sus palabras clave."
        actions={
          creating === null && (
            <Button onClick={() => setCreating('')}>
              <span className="inline-flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Nuevo tema
              </span>
            </Button>
          )
        }
      />
      {notice && <Notice kind="ok" text={notice} />}

      {creating !== null && (
        <NewTopicForm
          key={creating}
          prefill={creating}
          onCancel={() => setCreating(null)}
          onCreated={(t) => {
            topics.setData((prev) => [...(prev ?? []), t].sort((a, b) => a.name.localeCompare(b.name)));
            setNotice(`Tema «${t.name}» creado.`);
            setCreating(null);
            unanswered.reload();
          }}
        />
      )}

      <section className="space-y-3" aria-labelledby="unanswered-title">
        <h2 id="unanswered-title" className="text-lg font-bold text-white">
          Preguntas sin respuesta
        </h2>
        <p className="text-xs text-[#757575]">Lo que preguntaron los alumnos y Lexis no supo contestar (sin datos de quién preguntó).</p>
        {unanswered.loading && !unanswered.data ? (
          <Loading />
        ) : unanswered.error ? (
          <ErrorState message={unanswered.error} onRetry={unanswered.reload} />
        ) : !unanswered.data?.length ? (
          <EmptyState message="Lexis ha podido responder todo lo que le han preguntado." />
        ) : (
          <Card className="divide-y divide-[#1E1E1E]">
            {unanswered.data.map((q) => (
              <div key={q.question} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">«{q.question}»</p>
                  <p className="text-[11px] text-[#757575]">
                    {q.times} {q.times === 1 ? 'vez' : 'veces'} · última {formatDate(q.last_asked, true)}
                  </p>
                </div>
                <Button small variant="outline" onClick={() => setCreating(q.question)}>
                  Crear tema
                </Button>
              </div>
            ))}
          </Card>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="topics-title">
        <h2 id="topics-title" className="text-lg font-bold text-white">
          Temas ({list.length})
        </h2>
        {topics.loading && !topics.data ? (
          <Loading />
        ) : topics.error ? (
          <ErrorState message={topics.error} onRetry={topics.reload} />
        ) : !list.length ? (
          <EmptyState message="Aún no hay temas." />
        ) : (
          <div className="space-y-3">
            {list.map((t) => (
              <TopicCard
                key={t.id}
                topic={t}
                onChange={(updated) =>
                  topics.setData((prev) =>
                    updated ? (prev ?? []).map((x) => (x.id === t.id ? updated : x)) : (prev ?? []).filter((x) => x.id !== t.id),
                  )
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
