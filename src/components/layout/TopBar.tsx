'use client';

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface TopBarProps {
  title: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  onOpenMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenMenu,
}) => {
  return (
    <header className="min-h-16 border-b border-[#181818] bg-[#000000] px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menú"
            className="p-2 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#141414] lg:hidden cursor-pointer shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="text-sm font-semibold text-white tracking-tight truncate">
          {title}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {onSearchSubmit && (
        <form onSubmit={onSearchSubmit} className="relative w-36 sm:w-56 md:w-72">
          <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar conceptos o misiones"
            aria-label="Buscar conceptos o misiones"
            className="w-full h-9 pl-10 pr-4 rounded-lg bg-[#0D0D0D] border border-[#242424] text-xs text-white placeholder-[#757575] focus:outline-none focus:border-[#00FFEF]"
          />
        </form>
        )}

        <button
          type="button"
          aria-label="Notificaciones"
          className="p-2 text-[#A3A3A3] hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
        </button>

      </div>
    </header>
  );
};
