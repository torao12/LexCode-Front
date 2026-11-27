'use client';

import React, { useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  formatDate,
  inputBase,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  type Paged,
  qs,
  useApiData,
  type BadgeTone,
} from './ui';

type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed';

interface Person {
  id: string;
  username: string;
  full_name: string;
}

interface Report {
  id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
  resolved_at: string | null;
  reporter: Person | null;
  target: Person | null;
}

const STATUS: Record<ReportStatus, [string, BadgeTone]> = {
  open: ['Abierto', 'amber'],
  reviewing: ['En revisión', 'cyan'],
  resolved: ['Resuelto', 'gray'],
  dismissed: ['Descartado', 'gray'],
};

export const AdminReportsView: React.FC = () => {
  const [status, setStatus] = useState('open');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const { data, error, loading, reload, setData } = useApiData<Paged<Report>>(
    `/admin/reports${qs({ status, page, pageSize: 20 })}`,
  );

  const update = async (report: Report, next: ReportStatus) => {
    setBusyId(report.id);
    setNotice(null);
    try {
      await api(`/admin/reports/${report.id}`, { method: 'PATCH', body: { status: next } });
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: status
                ? prev.items.filter((r) => r.id !== report.id)
                : prev.items.map((r) => (r.id === report.id ? { ...r, status: next } : r)),
              total: status ? prev.total - 1 : prev.total,
            }
          : prev,
      );
      setNotice({ kind: 'ok', text: `Reporte marcado como ${STATUS[next][0].toLowerCase()}.` });
    } catch (err) {
      setNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Reportes"
        subtitle="Contenido o conductas reportadas por la comunidad."
        actions={
          <select
            aria-label="Filtrar por estado"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className={`${inputBase} w-44`}
          >
            <option value="">Todos</option>
            {Object.entries(STATUS).map(([value, [text]]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        }
      />
      {notice && <Notice kind={notice.kind} text={notice.text} />}
      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data?.items.length ? (
        <EmptyState message={status === 'open' ? 'No hay reportes abiertos. ¡Todo en orden!' : 'No hay reportes con ese estado.'} />
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((r) => {
              const [label, tone] = STATUS[r.status];
              return (
                <Card key={r.id} className="p-3.5 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#757575]">
                      <Badge tone={tone}>{label}</Badge>
                      <span>{formatDate(r.created_at, true)}</span>
                      {r.reporter && <span>· reportó @{r.reporter.username}</span>}
                      {r.target && (
                        <span>
                          · sobre <span className="text-white">{r.target.full_name}</span> (@{r.target.username})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {r.status === 'open' && (
                        <Button small variant="outline" disabled={busyId === r.id} onClick={() => void update(r, 'reviewing')}>
                          Revisar
                        </Button>
                      )}
                      {(r.status === 'open' || r.status === 'reviewing') && (
                        <>
                          <Button small disabled={busyId === r.id} onClick={() => void update(r, 'resolved')}>
                            Resolver
                          </Button>
                          <Button small variant="ghost" disabled={busyId === r.id} onClick={() => void update(r, 'dismissed')}>
                            Descartar
                          </Button>
                        </>
                      )}
                      {(r.status === 'resolved' || r.status === 'dismissed') && (
                        <Button small variant="ghost" disabled={busyId === r.id} onClick={() => void update(r, 'open')}>
                          Reabrir
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-[#D4D4D4] whitespace-pre-line">{r.reason}</p>
                </Card>
              );
            })}
          </div>
          <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />
        </>
      )}
    </div>
  );
};
