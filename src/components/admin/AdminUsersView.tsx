'use client';

import React, { useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import { useSession } from '@/lib/session';
import type { AccountStatus, ApiRole } from '@/lib/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  inputBase,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  type Paged,
  qs,
  useApiData,
  formatDate,
  type BadgeTone,
} from './ui';

interface AdminUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: ApiRole;
  status: AccountStatus;
  major: string | null;
  xp_total: number;
  level: number;
  last_activity_date: string | null;
  created_at: string;
}

const ROLE_LABEL: Record<ApiRole, string> = { student: 'Alumno', teacher: 'Docente', admin: 'Administrador' };
const STATUS: Record<AccountStatus, [string, BadgeTone]> = {
  active: ['Activa', 'cyan'],
  pending_guardian: ['Espera tutor', 'amber'],
  suspended: ['Suspendida', 'pink'],
  deleted: ['En eliminación', 'gray'],
};

export const AdminUsersView: React.FC = () => {
  const { profile } = useSession();
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const path = `/admin/users${qs({ q: query, role, status, page, pageSize: 20 })}`;
  const { data, error, loading, reload, setData } = useApiData<Paged<AdminUser>>(path);

  const updateRow = (id: string, patch: Partial<AdminUser>) =>
    setData((prev) => (prev ? { ...prev, items: prev.items.map((u) => (u.id === id ? { ...u, ...patch } : u)) } : prev));

  const changeRole = async (user: AdminUser, next: ApiRole) => {
    if (next === user.role) return;
    setBusyId(user.id);
    setNotice(null);
    try {
      await api(`/admin/users/${user.id}/role`, { method: 'PATCH', body: { role: next } });
      updateRow(user.id, { role: next });
      setNotice({ kind: 'ok', text: `${user.full_name} ahora es ${ROLE_LABEL[next].toLowerCase()}.` });
    } catch (err) {
      setNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  const toggleSuspend = async (user: AdminUser) => {
    const next = user.status === 'suspended' ? 'active' : 'suspended';
    setBusyId(user.id);
    setNotice(null);
    try {
      await api(`/admin/users/${user.id}/status`, { method: 'PATCH', body: { status: next } });
      updateRow(user.id, { status: next });
      setNotice({
        kind: 'ok',
        text: next === 'suspended' ? `Suspendiste la cuenta de ${user.full_name}.` : `Reactivaste la cuenta de ${user.full_name}.`,
      });
    } catch (err) {
      setNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-6xl space-y-6">
      <PageHeader
        title="Usuarios"
        subtitle="Asigna roles de docente o administrador y suspende cuentas. Todo cambio queda en la bitácora."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setQuery(q.trim());
        }}
        className="flex flex-wrap gap-3"
      >
        <input
          aria-label="Buscar por nombre, usuario o correo"
          placeholder="Buscar por nombre, usuario o correo"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={`${inputBase} w-full max-w-sm`}
        />
        <select
          aria-label="Filtrar por rol"
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value);
          }}
          className={`${inputBase} w-44`}
        >
          <option value="">Todos los roles</option>
          <option value="student">Alumnos</option>
          <option value="teacher">Docentes</option>
          <option value="admin">Administradores</option>
        </select>
        <select
          aria-label="Filtrar por estado"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className={`${inputBase} w-48`}
        >
          <option value="">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="pending_guardian">Esperan tutor</option>
          <option value="suspended">Suspendidas</option>
          <option value="deleted">En eliminación</option>
        </select>
        <Button type="submit">Buscar</Button>
      </form>

      {notice && <Notice kind={notice.kind} text={notice.text} />}

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data?.items.length ? (
        <EmptyState message="No hay usuarios con esos filtros." />
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-[#757575] border-b border-[#222222]">
                  <th className="px-5 py-3 font-semibold">Usuario</th>
                  <th className="px-5 py-3 font-semibold">Rol</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 font-semibold">Nivel</th>
                  <th className="px-5 py-3 font-semibold">Alta</th>
                  <th className="px-5 py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((u) => {
                  const isMe = u.id === profile?.id;
                  const [statusLabel, tone] = STATUS[u.status];
                  return (
                    <tr key={u.id} className="border-b border-[#1A1A1A] last:border-0">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-white">
                          {u.full_name} {isMe && <span className="text-[11px] text-[#00FFEF]">(tú)</span>}
                        </p>
                        <p className="text-xs text-[#757575]">
                          @{u.username} · {u.email}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          aria-label={`Rol de ${u.full_name}`}
                          value={u.role}
                          disabled={isMe || busyId === u.id || u.status === 'deleted'}
                          onChange={(e) => void changeRole(u, e.target.value as ApiRole)}
                          className={`${inputBase} h-8 w-36 text-xs`}
                        >
                          <option value="student">Alumno</option>
                          <option value="teacher">Docente</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={tone}>{statusLabel}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-[#D4D4D4]">
                        {u.level} <span className="text-xs text-[#757575]">· {u.xp_total.toLocaleString('es-MX')} XP</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#A3A3A3]">{formatDate(u.created_at)}</td>
                      <td className="px-5 py-3.5 text-right">
                        {!isMe && u.status !== 'deleted' && (
                          <Button
                            small
                            variant={u.status === 'suspended' ? 'outline' : 'danger'}
                            disabled={busyId === u.id}
                            onClick={() => void toggleSuspend(u)}
                          >
                            {u.status === 'suspended' ? 'Reactivar' : 'Suspender'}
                          </Button>
                        )}
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
