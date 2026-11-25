'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { api, ApiError, downloadFile, errorMessage } from '@/lib/api';
import { useSession } from '@/lib/session';
import { LEVEL_TITLES, type ConsentState, type FullProfile } from '@/lib/types';

interface PerfilViewProps {
  onLogout: () => void;
}

type Notice = { kind: 'ok' | 'error'; text: string } | null;

const inputClass =
  'w-full h-12 px-4 rounded-xl bg-[#0B0B0B] border border-[#242424] text-sm text-white focus:outline-none focus:border-[#00FFEF] disabled:text-[#757575]';

const Message: React.FC<{ notice: Notice }> = ({ notice }) =>
  notice ? (
    <p
      role={notice.kind === 'error' ? 'alert' : 'status'}
      className={`text-xs font-semibold ${notice.kind === 'ok' ? 'text-[#00FFEF]' : 'text-[#FF3366]'}`}
    >
      {notice.kind === 'ok' ? '✓ ' : ''}
      {notice.text}
    </p>
  ) : null;

const Toggle: React.FC<{ checked: boolean; disabled?: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  disabled,
  onChange,
  label,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer disabled:opacity-50 ${
      checked ? 'bg-[#00FFEF]' : 'bg-[#2A2A2A]'
    }`}
  >
    <span
      className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${checked ? 'left-6' : 'left-1'}`}
    />
  </button>
);

export const PerfilView: React.FC<PerfilViewProps> = ({ onLogout }) => {
  const { patchProfile, reloadProfile } = useSession();
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loadError, setLoadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Datos personales
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [major, setMajor] = useState('');
  const [semester, setSemester] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [profileNotice, setProfileNotice] = useState<Notice>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordNotice, setPasswordNotice] = useState<Notice>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Foto
  const [avatarNotice, setAvatarNotice] = useState<Notice>(null);
  const [uploading, setUploading] = useState(false);

  // Privacidad
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [privacyNotice, setPrivacyNotice] = useState<Notice>(null);
  const [privacyBusy, setPrivacyBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fillForm = (p: FullProfile) => {
    setProfile(p);
    setFullName(p.full_name);
    setUsername(p.username);
    setMajor(p.major ?? '');
    setSemester(p.semester ? String(p.semester) : '');
  };

  useEffect(() => {
    api<FullProfile>('/profile')
      .then(fillForm)
      .catch((err) => setLoadError(errorMessage(err)));
    api<ConsentState[]>('/privacy/consents')
      .then((rows) => setConsents(Object.fromEntries(rows.map((c) => [c.type, c.granted]))))
      .catch(() => setConsents({}));
  }, []);

  if (loadError) {
    return (
      <div className="max-w-5xl space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Configuración de la cuenta</h1>
        <p role="alert" className="text-sm text-[#FF3366]">{loadError}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 flex justify-center" role="status">
        <div className="w-8 h-8 rounded-full border-2 border-[#242424] border-t-[#00FFEF] animate-spin" aria-hidden="true" />
        <span className="sr-only">Cargando perfil…</span>
      </div>
    );
  }

  const initials =
    profile.full_name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'LX';

  const levelText = `Nivel ${profile.level}: ${LEVEL_TITLES[profile.level] ?? ''}`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);
    setFieldErrors({});
    const semesterNumber = semester ? Number(semester) : null;
    setSavingProfile(true);
    try {
      const updated = await api<FullProfile>('/profile', {
        method: 'PATCH',
        body: {
          fullName: fullName.trim(),
          username: username.trim(),
          major: major.trim() || null,
          semester: semesterNumber,
        },
      });
      fillForm(updated);
      patchProfile({ full_name: updated.full_name, username: updated.username });
      setProfileNotice({ kind: 'ok', text: 'Cambios guardados correctamente.' });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'username_taken') setFieldErrors({ username: err.message });
        else if (Object.keys(err.fields).length) setFieldErrors(err.fields);
      }
      setProfileNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);
    if (!currentPassword || !newPassword) {
      setPasswordNotice({ kind: 'error', text: 'Escribe tu contraseña actual y la nueva.' });
      return;
    }
    setSavingPassword(true);
    try {
      await api('/profile/password', { method: 'PATCH', body: { currentPassword, newPassword } });
      setCurrentPassword('');
      setNewPassword('');
      setPasswordNotice({ kind: 'ok', text: 'Contraseña actualizada.' });
    } catch (err) {
      const text =
        err instanceof ApiError && err.fields.newPassword
          ? 'La nueva contraseña debe tener al menos 8 caracteres, con letras y números.'
          : errorMessage(err);
      setPasswordNotice({ kind: 'error', text });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return;
    setAvatarNotice(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const updated = await api<FullProfile>('/profile/avatar', { method: 'POST', form });
      fillForm(updated);
      patchProfile({ avatar_url: updated.avatar_url });
      setAvatarNotice({ kind: 'ok', text: 'Foto actualizada.' });
    } catch (err) {
      setAvatarNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const updated = await api<FullProfile>('/profile/avatar', { method: 'DELETE' });
      fillForm(updated);
      patchProfile({ avatar_url: null });
    } catch (err) {
      setAvatarNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleConsent = async (type: 'public_rankings' | 'secondary_purposes', granted: boolean) => {
    setPrivacyNotice(null);
    setPrivacyBusy(true);
    const previous = consents[type];
    setConsents((c) => ({ ...c, [type]: granted }));
    try {
      await api('/privacy/consents', { method: 'POST', body: { type, granted } });
    } catch (err) {
      setConsents((c) => ({ ...c, [type]: previous }));
      setPrivacyNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setPrivacyBusy(false);
    }
  };

  const handleExport = async () => {
    setPrivacyNotice(null);
    setPrivacyBusy(true);
    try {
      await downloadFile('/privacy/export', 'lexcode-mis-datos.json');
      setPrivacyNotice({ kind: 'ok', text: 'Descargamos un archivo con todos tus datos.' });
    } catch (err) {
      setPrivacyNotice({ kind: 'error', text: errorMessage(err) });
    } finally {
      setPrivacyBusy(false);
    }
  };

  const handleDeleteAccount = async () => {
    setPrivacyBusy(true);
    try {
      await api('/privacy/account', { method: 'DELETE' });
      // La sesión sigue abierta: la app muestra la pantalla para recuperar la cuenta.
      await reloadProfile();
    } catch (err) {
      setPrivacyNotice({ kind: 'error', text: errorMessage(err) });
      setPrivacyBusy(false);
    }
  };

  return (
    <div className="relative max-w-5xl space-y-9">
      {/* Cuadrícula superior derecha como en Perfil.png */}
      <div
        className="pointer-events-none hidden lg:block absolute -top-6 -right-8 w-[340px] h-[340px] lexcode-grid-pattern opacity-80"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Configuración de la cuenta</h1>
      </div>

      {/* Tarjeta de perfil */}
      <div className="relative z-10 bg-[#111111] border border-[#222222] rounded-2xl px-6 py-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Foto de perfil"
                className="w-14 h-14 rounded-full object-cover border-2 border-[#00FFEF]"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#0A1E1D] border-2 border-[#00FFEF] flex items-center justify-center text-base font-bold text-[#00FFEF]">
                {initials}
              </div>
            )}
            <div>
              <div className="text-lg font-bold text-white">{profile.full_name}</div>
              <div className="text-xs text-[#A3A3A3] mt-0.5">
                {profile.major ? `${profile.major} - ` : ''}
                {levelText} · {profile.xp_total.toLocaleString('es-MX')} XP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile.avatar_url && (
              <button
                type="button"
                disabled={uploading}
                onClick={() => void handleRemoveAvatar()}
                className="px-4 py-2.5 rounded-lg border border-[#333333] text-xs font-bold text-[#A3A3A3] hover:text-white transition cursor-pointer disabled:opacity-50"
              >
                Quitar
              </button>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-[#0A1E1D] border border-[#00FFEF] text-xs font-bold text-[#00FFEF] hover:bg-[#002A28] transition cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Subiendo…' : 'Editar Foto'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              aria-label="Elegir foto de perfil"
              onChange={(e) => void handleAvatar(e.target.files?.[0])}
            />
          </div>
        </div>
        <Message notice={avatarNotice} />
      </div>

      {/* Datos personales */}
      <form onSubmit={handleSaveProfile} className="relative z-10 space-y-5">
        <h2 className="text-lg font-bold text-white">Datos personales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="profile-name" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Nombre completo
            </label>
            <input id="profile-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            {fieldErrors.fullName && <p className="text-[11px] text-[#FF3366] mt-1.5">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="profile-username" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Nombre de usuario
            </label>
            <input id="profile-username" value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
            {fieldErrors.username && <p className="text-[11px] text-[#FF3366] mt-1.5">{fieldErrors.username}</p>}
          </div>
          <div>
            <label htmlFor="profile-major" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Carrera
            </label>
            <input
              id="profile-major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="Ej. Ingeniería en Tecnologías de la Información"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profile-semester" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Semestre
            </label>
            <select
              id="profile-semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className={`${inputClass} [color-scheme:dark]`}
            >
              <option value="">Sin especificar</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}°
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="profile-email" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Correo universitario
            </label>
            <input id="profile-email" type="email" value={profile.email} disabled className={inputClass} />
          </div>
        </div>
        <Message notice={profileNotice} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-7 py-3 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 transition cursor-pointer disabled:opacity-60"
          >
            {savingProfile ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* Credenciales de acceso */}
      <form onSubmit={handleChangePassword} className="relative z-10 space-y-5">
        <h2 className="text-lg font-bold text-white">Credenciales de acceso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="profile-current-password" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Contraseña actual
            </label>
            <input
              id="profile-current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="profile-new-password" className="block text-xs font-semibold text-[#A3A3A3] mb-2">
              Nueva contraseña
            </label>
            <input
              id="profile-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <Message notice={passwordNotice} />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword}
            className="px-7 py-3 rounded-xl bg-[#0A1E1D] border border-[#00FFEF] text-[#00FFEF] text-xs font-bold hover:bg-[#002A28] transition cursor-pointer disabled:opacity-60"
          >
            {savingPassword ? 'Actualizando…' : 'Actualizar contraseña'}
          </button>
        </div>
      </form>

      {/* Privacidad */}
      <section className="relative z-10 space-y-4" aria-labelledby="privacy-title">
        <h2 id="privacy-title" className="text-lg font-bold text-white">
          Privacidad y mis datos
        </h2>

        <div className="bg-[#111111] border border-[#222222] rounded-2xl divide-y divide-[#1E1E1E]">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Aparecer en los rankings públicos</p>
              <p className="text-xs text-[#757575] mt-0.5">Si lo desactivas, tu nombre no se muestra en tablas de posiciones.</p>
            </div>
            <Toggle
              label="Aparecer en los rankings públicos"
              checked={consents.public_rankings ?? profile.public_ranking}
              disabled={privacyBusy}
              onChange={(v) => void handleConsent('public_rankings', v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Estadísticas anónimas</p>
              <p className="text-xs text-[#757575] mt-0.5">Usar mis datos, sin identificarme, para mejorar la plataforma.</p>
            </div>
            <Toggle
              label="Estadísticas anónimas"
              checked={consents.secondary_purposes ?? false}
              disabled={privacyBusy}
              onChange={(v) => void handleConsent('secondary_purposes', v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-white">Descargar mis datos</p>
              <p className="text-xs text-[#757575] mt-0.5">Un archivo con todo lo que LexCode guarda de ti.</p>
            </div>
            <button
              type="button"
              disabled={privacyBusy}
              onClick={() => void handleExport()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#00FFEF] text-xs font-bold text-[#00FFEF] hover:bg-[#0A1E1D] cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar
            </button>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Eliminar mi cuenta</p>
                <p className="text-xs text-[#757575] mt-0.5">Tendrás 30 días para recuperarla; después se borra con todos tus datos.</p>
              </div>
              {!confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#FF3366] text-xs font-bold text-[#FF3366] hover:bg-[#1A080C] cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              )}
            </div>
            {confirmDelete && (
              <div className="flex flex-wrap items-center justify-end gap-3 bg-[#1A080C] border border-[#FF3366] rounded-xl px-4 py-3">
                <p className="text-xs text-[#FFB3C4] mr-auto">¿Seguro que quieres eliminar tu cuenta?</p>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-[#A3A3A3] hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={privacyBusy}
                  onClick={() => void handleDeleteAccount()}
                  className="px-4 py-2 rounded-lg bg-[#FF3366] text-xs font-bold text-black cursor-pointer disabled:opacity-50"
                >
                  Sí, eliminar
                </button>
              </div>
            )}
          </div>
        </div>
        <Message notice={privacyNotice} />
      </section>

      <div className="relative z-10 pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="px-7 py-3 rounded-xl bg-[#1A080C] border border-[#FF3366] text-xs font-bold text-[#FF3366] hover:bg-[#2A0A14] transition cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
