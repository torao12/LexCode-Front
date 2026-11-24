'use client';

import React, { useState } from 'react';

interface PerfilViewProps {
  userName: string;
  onUpdateName: (name: string) => void;
  onLogoutToLanding: () => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  userName,
  onUpdateName,
  onLogoutToLanding,
}) => {
  const [nameInput, setNameInput] = useState(userName);
  const [email, setEmail] = useState('ian.morales@upchiapas.edu.mx');
  const [password, setPassword] = useState('••••••••••••');
  const [savedToast, setSavedToast] = useState(false);

  const initials =
    nameInput
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'IM';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="relative max-w-5xl space-y-7">
      {/* Cuadrícula superior derecha como en Perfil.png */}
      <div
        className="pointer-events-none hidden lg:block absolute -top-6 -right-8 w-[340px] h-[340px] lexcode-grid-pattern opacity-80"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Configuracion de la Cuenta
        </h1>
      </div>

      {/* Tarjeta de perfil */}
      <div className="relative z-10 bg-[#111111] border border-[#222222] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#0A1E1D] border-2 border-[#00FFEF] flex items-center justify-center text-base font-bold text-[#00FFEF]">
            {initials}
          </div>
          <div>
            <div className="text-lg font-bold text-white">{nameInput}</div>
            <div className="text-xs text-[#A3A3A3] mt-0.5">
              Ingenieria en TI - Nivel 7: Guardian de datos
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const next = prompt('Nuevo nombre de perfil:', nameInput);
            if (next && next.trim()) {
              setNameInput(next.trim());
              onUpdateName(next.trim());
            }
          }}
          className="px-5 py-2.5 rounded-lg bg-[#0A1E1D] border border-[#00FFEF] text-xs font-bold text-[#00FFEF] hover:bg-[#002A28] transition cursor-pointer"
        >
          Editar Foto
        </button>
      </div>

      {/* Credenciales de Acceso */}
      <form onSubmit={handleSave} className="relative z-10 space-y-5">
        <h2 className="text-lg font-bold text-white">Credenciales de Acceso</h2>

        <div>
          <label
            htmlFor="profile-email"
            className="block text-xs font-semibold text-[#A3A3A3] mb-2"
          >
            Correo universitario (.edu)
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-[#0B0B0B] border border-[#242424] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
          />
        </div>

        <div>
          <label
            htmlFor="profile-password"
            className="block text-xs font-semibold text-[#A3A3A3] mb-2"
          >
            Contrasena actual
          </label>
          <div className="relative">
            <input
              id="profile-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-4 pr-28 rounded-xl bg-[#0B0B0B] border border-[#242424] text-sm text-[#757575] focus:outline-none focus:border-[#00FFEF]"
            />
            <button
              type="button"
              onClick={() => setPassword('NuevaClave#2026')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#00FFEF] hover:underline cursor-pointer"
            >
              Actualizar
            </button>
          </div>
        </div>

        {savedToast && (
          <p className="text-xs font-semibold text-[#00FFEF]">
            ✓ Cambios guardados correctamente.
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={onLogoutToLanding}
            className="px-7 py-3 rounded-xl bg-[#1A080C] border border-[#FF3366] text-xs font-bold text-[#FF3366] hover:bg-[#2A0A14] transition cursor-pointer"
          >
            Cerrar Sesion
          </button>

          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 transition cursor-pointer"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};
