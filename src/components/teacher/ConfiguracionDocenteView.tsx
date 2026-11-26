'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

interface ConfiguracionDocenteViewProps {
  onLogout?: () => void;
}

export const ConfiguracionDocenteView: React.FC<ConfiguracionDocenteViewProps> = ({
  onLogout,
}) => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [savedNote, setSavedNote] = useState(false);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="bg-[#0D0D0D] border border-[#1B1B1B] rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Configuración General</h1>
          <p className="text-xs text-[#757575] mt-1">
            Administra las preferencias de la plataforma, perfiles y avisos de aprendizaje.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#121212] border border-[#222222] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Perfil Institucional</h2>
              <p className="text-xs text-[#757575] mt-1">
                Actualiza tu información de usuario y correo asignado por la universidad.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSavedNote(true);
                setTimeout(() => setSavedNote(false), 2000);
              }}
              className="px-5 py-2.5 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-bold text-white hover:border-[#00FFEF] transition cursor-pointer"
            >
              Editar Perfil
            </button>
          </div>

          <div className="bg-[#121212] border border-[#222222] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Apariencia y Tema</h2>
              <p className="text-xs text-[#757575] mt-1">
                Modo oscuro activo por defecto con acentos en Cyan Neón (#00FFEF).
              </p>
            </div>
            <span className="px-5 py-2.5 rounded-xl bg-[#00FFEF] text-black text-xs font-bold">
              Modo Oscuro
            </span>
          </div>

          <div className="bg-[#121212] border border-[#222222] rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Avisos y Retos de Misiones</h2>
              <p className="text-xs text-[#757575] mt-1">
                Configura notificaciones emergentes cuando Lexis te asigne un nuevo dilema o quiz semanal.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={alertsEnabled}
              aria-label="Alternar avisos y retos de misiones"
              onClick={() => setAlertsEnabled((prev) => !prev)}
              className={`w-14 h-7 rounded-full p-1 transition flex items-center cursor-pointer ${
                alertsEnabled
                  ? 'bg-[#00FFEF] justify-end'
                  : 'bg-[#262626] justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black block" />
            </button>
          </div>

          {onLogout && (
            <div className="bg-[#121212] border border-[#FF3366]/40 rounded-2xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white">Sesión Administrativa</h2>
                <p className="text-xs text-[#757575] mt-1">
                  Cierra tu sesión actual para regresar a la pantalla principal de LexCode.
                </p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A080C] border border-[#FF3366] text-xs font-bold text-[#FF3366] hover:bg-[#2A0A14] transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>

        {savedNote && (
          <p className="text-xs font-semibold text-[#00FFEF]">
            ✓ Preferencia institucional actualizada.
          </p>
        )}
      </div>
    </div>
  );
};
