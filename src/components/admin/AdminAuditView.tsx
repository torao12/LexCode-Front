'use client';

import React, { useState } from 'react';
import { Badge, Card, EmptyState, ErrorState, formatDate, inputBase, Loading, PageHeader, Pagination, type Paged, qs, useApiData, type BadgeTone } from './ui';

interface AuditEntry {
  id: number;
  actor_id: string | null;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'ADMIN_READ' | 'EXPORT';
  table_name: string;
  record_id: string | null;
  changes: Record<string, unknown> | null;
  created_at: string;
  actor: { full_name: string; username: string } | null;
}

const ACTIONS: Record<AuditEntry['action'], [string, BadgeTone]> = {
  INSERT: ['Alta', 'cyan'],
  UPDATE: ['Cambio', 'amber'],
  DELETE: ['Baja', 'pink'],
  ADMIN_READ: ['Consulta', 'gray'],
  EXPORT: ['Exportación', 'gray'],
};

const TABLES: Record<string, string> = {
  profiles: 'Perfiles',
  consents: 'Consentimientos',
  arco_requests: 'Solicitudes ARCO',
};

/** Muestra los cambios { campo: { old, new } } de forma legible. */
const Changes: React.FC<{ changes: Record<string, unknown> | null }> = ({ changes }) => {
  if (!changes || !Object.keys(changes).length) return <span className="text-[#555555]">—</span>;
  return (
    <ul className="space-y-0.5">
      {Object.entries(changes).map(([field, value]) => {
        const diff = value as { old?: unknown; new?: unknown } | null;
        const isDiff = diff && typeof diff === 'object' && ('old' in diff || 'new' in diff);
        return (
          <li key={field} className="text-[11px]">
            <span className="text-[#A3A3A3]">{field}</span>
            {isDiff ? (
              <>
                : <span className="text-[#FF3366] line-through">{String(diff.old ?? '∅')}</span> →{' '}
                <span className="text-[#00FFEF]">{String(diff.new ?? '∅')}</span>
              </>
            ) : (
              <>: {typeof value === 'object' ? JSON.stringify(value) : String(value)}</>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const AdminAuditView: React.FC = () => {
  const [table, setTable] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useApiData<Paged<AuditEntry>>(
    `/admin/audit${qs({ table, action, page, pageSize: 30 })}`,
  );

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Bitácora"
        subtitle="Registro inalterable de cambios a perfiles, consentimientos y solicitudes ARCO (se conserva 12 meses)."
        actions={
          <>
            <select
              aria-label="Filtrar por tabla"
              value={table}
              onChange={(e) => {
                setPage(1);
                setTable(e.target.value);
              }}
              className={`${inputBase} w-48`}
            >
              <option value="">Todas las tablas</option>
              {Object.entries(TABLES).map(([v, t]) => (
                <option key={v} value={v}>
                  {t}
                </option>
              ))}
            </select>
            <select
              aria-label="Filtrar por acción"
              value={action}
              onChange={(e) => {
                setPage(1);
                setAction(e.target.value);
              }}
              className={`${inputBase} w-40`}
            >
              <option value="">Todas</option>
              {Object.entries(ACTIONS).map(([v, [t]]) => (
                <option key={v} value={v}>
                  {t}
                </option>
              ))}
            </select>
          </>
        }
      />
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data?.items.length ? (
        <EmptyState message="No hay registros con esos filtros." />
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[#757575] border-b border-[#222222]">
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Acción</th>
                  <th className="px-5 py-3 font-semibold">Tabla</th>
                  <th className="px-5 py-3 font-semibold">Registro</th>
                  <th className="px-5 py-3 font-semibold">Quién</th>
                  <th className="px-5 py-3 font-semibold">Cambios</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((e) => {
                  const [label, tone] = ACTIONS[e.action] ?? [e.action, 'gray' as BadgeTone];
                  return (
                    <tr key={e.id} className="border-b border-[#1A1A1A] last:border-0 align-top">
                      <td className="px-5 py-3 text-xs text-[#A3A3A3] whitespace-nowrap">{formatDate(e.created_at, true)}</td>
                      <td className="px-5 py-3">
                        <Badge tone={tone}>{label}</Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#D4D4D4]">{TABLES[e.table_name] ?? e.table_name}</td>
                      <td className="px-5 py-3 font-mono text-[11px] text-[#757575]">{e.record_id?.slice(0, 8) ?? '—'}</td>
                      <td className="px-5 py-3 text-xs">
                        {e.actor ? (
                          <span className="text-[#D4D4D4]" title={e.actor_id ?? undefined}>
                            {e.actor.full_name}
                            <span className="block text-[11px] text-[#757575]">@{e.actor.username}</span>
                          </span>
                        ) : e.actor_id ? (
                          <span className="font-mono text-[11px] text-[#757575]">{e.actor_id.slice(0, 8)}</span>
                        ) : (
                          <span className="text-[#757575]">Sistema</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <Changes changes={e.changes} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
};
