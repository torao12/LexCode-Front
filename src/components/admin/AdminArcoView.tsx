'use client';

import React, { useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Field,
  formatDate,
  inputBase,
  inputClass,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  type Paged,
  qs,
  useApiData,
  type BadgeTone,
} from './ui';

export type ArcoStatus = 'received' | 'info_required' | 'in_review' | 'approved' | 'rejected' | 'resolved';

export interface ArcoRequest {
  id: string;
  folio: string;
  user_id: string | null;
  contact_email: string;
  right: string;
  description: string;
  status: ArcoStatus;
  received_at: string;
  due_date: string;
  responded_at: string | null;
  response: string | null;
}

export const ARCO_RIGHTS: Record<string, string> = {
  access: 'Acceso',
  rectification: 'Rectificación',
  cancellation: 'Cancelación',
  opposition: 'Oposición',
  revocation: 'Revocación del consentimiento',
};

export const ARCO_STATUS: Record<ArcoStatus, [string, BadgeTone]> = {
  received: ['Recibida', 'amber'],
  info_required: ['Falta información', 'amber'],
  in_review: ['En revisión', 'cyan'],
  approved: ['Procedente', 'cyan'],
  rejected: ['Improcedente', 'pink'],
  resolved: ['Resuelta', 'gray'],
};

const CLOSING: ArcoStatus[] = ['info_required', 'approved', 'rejected', 'resolved'];

const ArcoItem: React.FC<{ req: ArcoRequest; onSaved: (r: ArcoRequest) => void }> = ({ req, onSaved }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ArcoStatus>(req.status);
  const [response, setResponse] = useState(req.response ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const pending = !['resolved', 'rejected', 'approved'].includes(req.status);
  const overdue = pending && req.due_date < today;
  const [label, tone] = ARCO_STATUS[req.status];

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (CLOSING.includes(status) && response.trim().length < 5) {
      setError('Escribe la respuesta que recibirá la persona.');
      return;
    }
    setBusy(true);
    try {
      const updated = await api<ArcoRequest>(`/admin/arco/${req.id}`, {
        method: 'PATCH',
        body: { status, response: response.trim() || undefined },
      });
      onSaved(updated);
      setOpen(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className={`p-5 space-y-3 ${overdue ? 'border-[#FF3366]' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-white">{req.folio}</span>
            <Badge tone={tone}>{label}</Badge>
            <Badge>{ARCO_RIGHTS[req.right] ?? req.right}</Badge>
            {overdue && <Badge tone="pink">Vencida</Badge>}
          </div>
          <p className="text-xs text-[#757575]">
            {req.contact_email} · recibida {formatDate(req.received_at)} · vence {formatDate(req.due_date)}
          </p>
        </div>
        <Button small variant={open ? 'ghost' : 'outline'} onClick={() => setOpen((v) => !v)}>
          {open ? 'Cerrar' : 'Atender'}
        </Button>
      </div>

      <p className="text-sm text-[#D4D4D4] whitespace-pre-line">{req.description}</p>
      {req.response && !open && (
        <div className="bg-[#0B0B0B] border border-[#1E1E1E] rounded-lg p-3 text-xs text-[#A3A3A3]">
          <span className="font-semibold text-white">Respuesta ({formatDate(req.responded_at)}):</span> {req.response}
        </div>
      )}

      {open && (
        <form onSubmit={save} className="space-y-3 pt-2 border-t border-[#1E1E1E]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Estado" htmlFor={`arco-status-${req.id}`}>
              <select
                id={`arco-status-${req.id}`}
                value={status}
                onChange={(e) => setStatus(e.target.value as ArcoStatus)}
                className={inputClass}
              >
                {Object.entries(ARCO_STATUS).map(([value, [text]]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Respuesta para la persona" htmlFor={`arco-response-${req.id}`}>
            <textarea
              id={`arco-response-${req.id}`}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={3}
              className={`${inputClass} h-auto py-2.5`}
              placeholder="Explica qué se hizo o qué información falta."
            />
          </Field>
          {error && <Notice kind="error" text={error} />}
          <div className="flex justify-end">
            <Button type="submit" disabled={busy}>
              {busy ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export const AdminArcoView: React.FC = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState('');
  const { data, error, loading, reload, setData } = useApiData<Paged<ArcoRequest>>(
    `/admin/arco${qs({ status, page, pageSize: 20 })}`,
  );

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Solicitudes ARCO"
        subtitle="Ordenadas por fecha límite: la ley da 20 días hábiles para responder."
        actions={
          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className={`${inputBase} w-52`}
          >
            <option value="">Todas</option>
            {Object.entries(ARCO_STATUS).map(([value, [text]]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        }
      />
      {saved && <Notice kind="ok" text={saved} />}
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data?.items.length ? (
        <EmptyState message="No hay solicitudes con ese estado." />
      ) : (
        <>
          <div className="space-y-4">
            {data.items.map((req) => (
              <ArcoItem
                key={req.id}
                req={req}
                onSaved={(updated) => {
                  setSaved(`Solicitud ${updated.folio} actualizada.`);
                  setData((prev) =>
                    prev ? { ...prev, items: prev.items.map((r) => (r.id === updated.id ? updated : r)) } : prev,
                  );
                }}
              />
            ))}
          </div>
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
};
