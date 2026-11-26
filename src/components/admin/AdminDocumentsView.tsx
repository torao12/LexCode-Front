'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { api, ApiError, errorMessage } from '@/lib/api';
import { Badge, Button, Card, ErrorState, Field, formatDate, inputClass, Loading, Notice, PageHeader, useApiData } from './ui';

interface LegalDoc {
  id: string;
  type: 'privacy_notice' | 'terms';
  version: string;
  title: string;
  content_url: string;
  effective_at: string;
}

interface DocsResponse {
  current: { privacyNotice: LegalDoc | null; terms: LegalDoc | null };
  all: LegalDoc[];
}

const TYPE_LABEL = { privacy_notice: 'Aviso de Privacidad', terms: 'Términos y Condiciones' } as const;

export const AdminDocumentsView: React.FC = () => {
  const { data, error, loading, reload } = useApiData<DocsResponse>('/privacy/documents');
  const [type, setType] = useState<LegalDoc['type']>('privacy_notice');
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [effectiveAt, setEffectiveAt] = useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const currentIds = new Set([data?.current.privacyNotice?.id, data?.current.terms?.id].filter(Boolean));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    try {
      await api('/admin/legal-documents', {
        method: 'POST',
        body: { type, version: version.trim(), title: title.trim(), contentUrl: url.trim(), effectiveAt },
      });
      setNotice({ kind: 'ok', text: `Se publicó ${TYPE_LABEL[type]} versión ${version.trim()}.` });
      setVersion('');
      setTitle('');
      setUrl('');
      reload();
    } catch (err) {
      const text =
        err instanceof ApiError && err.code === 'already_exists'
          ? 'Ya existe esa versión del documento.'
          : err instanceof ApiError && Object.keys(err.fields).length
            ? Object.values(err.fields).join('. ')
            : errorMessage(err);
      setNotice({ kind: 'error', text });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8">
      <PageHeader
        title="Documentos legales"
        subtitle="Al registrarse, cada persona acepta la versión vigente; publicar una nueva versión no cambia los consentimientos ya dados."
      />

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <Card className="divide-y divide-[#1E1E1E]">
          {data?.all.map((d) => {
            const isCurrent = currentIds.has(d.id);
            const isFuture = d.effective_at > new Date().toISOString().slice(0, 10);
            return (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-white">{d.title}</p>
                    <Badge>{TYPE_LABEL[d.type]}</Badge>
                    <Badge tone={isCurrent ? 'cyan' : isFuture ? 'amber' : 'gray'}>
                      v{d.version} · {isCurrent ? 'vigente' : isFuture ? 'programada' : 'anterior'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#757575] mt-1">Vigente desde {formatDate(d.effective_at)}</p>
                </div>
                <a
                  href={d.content_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00FFEF] hover:underline"
                >
                  Ver documento <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </Card>
      )}

      <Card className="p-4 sm:p-6">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-lg font-bold text-white">Publicar nueva versión</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Documento" htmlFor="doc-type">
              <select id="doc-type" value={type} onChange={(e) => setType(e.target.value as LegalDoc['type'])} className={inputClass}>
                <option value="privacy_notice">Aviso de Privacidad</option>
                <option value="terms">Términos y Condiciones</option>
              </select>
            </Field>
            <Field label="Versión" htmlFor="doc-version" hint="Formato 5.1">
              <input id="doc-version" value={version} onChange={(e) => setVersion(e.target.value)} className={inputClass} required />
            </Field>
            <Field label="Vigente desde" htmlFor="doc-date">
              <input id="doc-date" type="date" value={effectiveAt} onChange={(e) => setEffectiveAt(e.target.value)} className={inputClass} required />
            </Field>
          </div>
          <Field label="Título" htmlFor="doc-title">
            <input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
          </Field>
          <Field label="URL del PDF" htmlFor="doc-url" hint="Enlace público al documento (https://…)">
            <input id="doc-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} required />
          </Field>
          {notice && <Notice kind={notice.kind} text={notice.text} />}
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>
              {busy ? 'Publicando…' : 'Publicar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
