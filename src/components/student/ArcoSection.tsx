'use client';

import React, { useState } from 'react';
import { api, ApiError, errorMessage } from '@/lib/api';
import { ARCO_RIGHTS, ARCO_STATUS, type ArcoRequest } from '@/components/admin/AdminArcoView';
import { Badge, Button, formatDate, useApiData } from '@/components/admin/ui';

const RIGHT_HELP: Record<string, string> = {
  access: 'Saber qué datos personales tenemos de ti y cómo los usamos.',
  rectification: 'Corregir datos tuyos que estén mal o incompletos.',
  cancellation: 'Pedir que borremos tus datos.',
  opposition: 'Pedir que dejemos de usar tus datos para algún fin.',
  revocation: 'Retirar un permiso que nos diste antes.',
};

/** Derechos ARCO del alumno: enviar una solicitud y seguir su estado (20 días hábiles). */
export const ArcoSection: React.FC = () => {
  const { data, error, loading, setData } = useApiData<ArcoRequest[]>('/privacy/arco');
  const [open, setOpen] = useState(false);
  const [right, setRight] = useState('access');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (description.trim().length < 10) {
      setFormError('Describe tu solicitud con al menos 10 caracteres.');
      return;
    }
    setBusy(true);
    try {
      const created = await api<ArcoRequest>('/privacy/arco', {
        method: 'POST',
        body: { right, description: description.trim() },
      });
      setData((prev) => [created, ...(prev ?? [])]);
      setSent(`Recibimos tu solicitud con folio ${created.folio}. Te responderemos a más tardar el ${formatDate(created.due_date)}.`);
      setDescription('');
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError && err.fields.description ? err.fields.description : errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="relative z-10 space-y-4" aria-labelledby="arco-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="arco-title" className="text-lg font-bold text-white">
            Mis derechos ARCO
          </h2>
          <p className="text-xs text-[#757575] mt-1">
            Acceso, Rectificación, Cancelación y Oposición sobre tus datos personales (LFPDPPP).
          </p>
        </div>
        {!open && (
          <Button variant="outline" onClick={() => setOpen(true)}>
            Nueva solicitud
          </Button>
        )}
      </div>

      {sent && (
        <p role="status" className="text-xs font-semibold text-[#00FFEF]">
          ✓ {sent}
        </p>
      )}

      {open && (
        <form onSubmit={submit} className="bg-[#111111] border border-[#00FFEF] rounded-2xl p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="arco-right" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              ¿Qué quieres hacer?
            </label>
            <select
              id="arco-right"
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-[#0B0B0B] border border-[#242424] text-sm text-white focus:outline-none focus:border-[#00FFEF] [color-scheme:dark]"
            >
              {Object.entries(ARCO_RIGHTS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#757575] mt-1.5">{RIGHT_HELP[right]}</p>
          </div>
          <div>
            <label htmlFor="arco-description" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Describe tu solicitud
            </label>
            <textarea
              id="arco-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={4000}
              className="w-full px-4 py-3 rounded-xl bg-[#0B0B0B] border border-[#242424] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
              placeholder="Ej. Quiero que corrijan mi nombre: aparece «Hidalgo Garcia» y es «Hidalgo García»."
            />
          </div>
          {formError && (
            <p role="alert" className="text-xs font-semibold text-[#FF3366]">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? 'Enviando…' : 'Enviar solicitud'}
            </Button>
          </div>
        </form>
      )}

      {loading && !data ? null : error ? (
        <p role="alert" className="text-xs text-[#FF3366]">
          {error}
        </p>
      ) : data && data.length > 0 ? (
        <div className="bg-[#111111] border border-[#222222] rounded-2xl divide-y divide-[#1E1E1E]">
          {data.map((r) => {
            const [label, tone] = ARCO_STATUS[r.status];
            return (
              <div key={r.id} className="px-6 py-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">{r.folio}</span>
                  <Badge>{ARCO_RIGHTS[r.right] ?? r.right}</Badge>
                  <Badge tone={tone}>{label}</Badge>
                  <span className="text-[11px] text-[#757575]">
                    Enviada {formatDate(r.received_at)} · respuesta a más tardar {formatDate(r.due_date)}
                  </span>
                </div>
                <p className="text-xs text-[#A3A3A3] line-clamp-2">{r.description}</p>
                {r.response && (
                  <p className="text-xs text-[#D4D4D4] bg-[#0B0B0B] border border-[#1E1E1E] rounded-lg p-3">
                    <span className="font-semibold text-[#00FFEF]">Respuesta:</span> {r.response}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !open && <p className="text-xs text-[#757575]">No has enviado solicitudes.</p>
      )}
    </section>
  );
};
