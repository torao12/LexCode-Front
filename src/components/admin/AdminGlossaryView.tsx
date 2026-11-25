'use client';

import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api, ApiError, errorMessage } from '@/lib/api';
import type { GlossaryTermDto } from '@/lib/types';
import { Button, Card, EmptyState, ErrorState, Field, inputBase, inputClass, Loading, Notice, PageHeader, useApiData } from './ui';

interface FormState {
  term: string;
  category: string;
  definition: string;
  legalCitation: string;
  lexisTip: string;
}

const EMPTY: FormState = { term: '', category: '', definition: '', legalCitation: '', lexisTip: '' };

const TermForm: React.FC<{
  initial?: GlossaryTermDto;
  categories: string[];
  onCancel: () => void;
  onSaved: (t: GlossaryTermDto) => void;
}> = ({ initial, categories, onCancel, onSaved }) => {
  const [form, setForm] = useState<FormState>(
    initial
      ? {
          term: initial.term,
          category: initial.category,
          definition: initial.definition,
          legalCitation: initial.legal_citation,
          lexisTip: initial.lexis_tip ?? '',
        }
      : EMPTY,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const id = initial?.id ?? 'new';
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFields({});
    setBusy(true);
    const body = {
      term: form.term.trim(),
      category: form.category.trim(),
      definition: form.definition.trim(),
      legalCitation: form.legalCitation.trim(),
      lexisTip: form.lexisTip.trim() || null,
    };
    try {
      const saved = initial
        ? await api<GlossaryTermDto>(`/admin/glossary/${initial.id}`, { method: 'PATCH', body })
        : await api<GlossaryTermDto>('/admin/glossary', { method: 'POST', body });
      onSaved(saved);
    } catch (err) {
      if (err instanceof ApiError) setFields(err.fields);
      setError(err instanceof ApiError && err.code === 'already_exists' ? 'Ya existe un término con ese nombre.' : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-lg font-bold text-white">{initial ? 'Editar término' : 'Nuevo término'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Término" htmlFor={`g-term-${id}`}>
            <input id={`g-term-${id}`} value={form.term} onChange={set('term')} className={inputClass} required />
            {fields.term && <p className="text-[11px] text-[#FF3366] mt-1">{fields.term}</p>}
          </Field>
          <Field label="Categoría" htmlFor={`g-cat-${id}`} hint="Ej. CONCEPTO - LFPDPPP">
            <input
              id={`g-cat-${id}`}
              list="glossary-categories"
              value={form.category}
              onChange={set('category')}
              className={inputClass}
              required
            />
            <datalist id="glossary-categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
        <Field label="Definición" htmlFor={`g-def-${id}`}>
          <textarea
            id={`g-def-${id}`}
            value={form.definition}
            onChange={set('definition')}
            rows={3}
            className={`${inputClass} h-auto py-2.5`}
            required
          />
          {fields.definition && <p className="text-[11px] text-[#FF3366] mt-1">{fields.definition}</p>}
        </Field>
        <Field label="Cita legal" htmlFor={`g-cite-${id}`} hint="Artículo o norma que la respalda">
          <input id={`g-cite-${id}`} value={form.legalCitation} onChange={set('legalCitation')} className={inputClass} required />
        </Field>
        <Field label="Consejo de Lexis (opcional)" htmlFor={`g-tip-${id}`}>
          <input id={`g-tip-${id}`} value={form.lexisTip} onChange={set('lexisTip')} className={inputClass} />
        </Field>
        {error && <Notice kind="error" text={error} />}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? 'Guardando…' : initial ? 'Guardar cambios' : 'Agregar término'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const AdminGlossaryView: React.FC = () => {
  const { data, error, loading, reload, setData } = useApiData<{ items: GlossaryTermDto[] }>('/glossary');
  const [editing, setEditing] = useState<GlossaryTermDto | 'new' | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const terms = useMemo(() => data?.items ?? [], [data]);
  const categories = useMemo(() => [...new Set(terms.map((t) => t.category))].sort(), [terms]);
  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return f ? terms.filter((t) => t.term.toLowerCase().includes(f) || t.category.toLowerCase().includes(f)) : terms;
  }, [terms, filter]);

  const remove = async (t: GlossaryTermDto) => {
    try {
      await api(`/admin/glossary/${t.id}`, { method: 'DELETE' });
      setData((prev) => (prev ? { items: prev.items.filter((x) => x.id !== t.id) } : prev));
      setNotice({ kind: 'ok', text: `Se eliminó «${t.term}».` });
    } catch (err) {
      setNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Glosario"
        subtitle={`${terms.length} términos. Los alumnos los ven en el Glosario y Lexis los enlaza en sus respuestas.`}
        actions={
          editing === null && (
            <Button onClick={() => setEditing('new')}>
              <span className="inline-flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Nuevo término
              </span>
            </Button>
          )
        }
      />
      {notice && <Notice kind={notice.kind} text={notice.text} />}

      {editing !== null && (
        <TermForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={editing === 'new' ? undefined : editing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSaved={(saved) => {
            setData((prev) => {
              const items = prev?.items ?? [];
              const exists = items.some((x) => x.id === saved.id);
              const next = exists ? items.map((x) => (x.id === saved.id ? saved : x)) : [...items, saved];
              return { items: next.sort((a, b) => a.term.localeCompare(b.term)) };
            });
            setNotice({ kind: 'ok', text: `«${saved.term}» guardado.` });
            setEditing(null);
          }}
        />
      )}

      <input
        aria-label="Filtrar términos"
        placeholder="Filtrar por término o categoría"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={`${inputBase} w-full max-w-sm`}
      />

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !visible.length ? (
        <EmptyState message="No hay términos." />
      ) : (
        <div className="space-y-3">
          {visible.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold tracking-wider text-[#00FFEF] uppercase">{t.category}</p>
                  <p className="text-base font-bold text-white mt-0.5">{t.term}</p>
                  <p className="text-xs text-[#A3A3A3] mt-1.5 line-clamp-2">{t.definition}</p>
                  <p className="text-[11px] text-[#757575] mt-1.5">{t.legal_citation}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {confirmId === t.id ? (
                    <>
                      <Button small variant="ghost" onClick={() => setConfirmId(null)}>
                        Cancelar
                      </Button>
                      <Button small variant="danger" onClick={() => void remove(t)}>
                        Sí, eliminar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button small variant="outline" aria-label={`Editar ${t.term}`} onClick={() => setEditing(t)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button small variant="danger" aria-label={`Eliminar ${t.term}`} onClick={() => setConfirmId(t.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
