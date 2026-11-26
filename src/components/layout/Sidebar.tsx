'use client';

import React from 'react';
import {
  LayoutGrid,
  GitBranch,
  ClipboardCheck,
  BookOpen,
  Award,
  Bot,
  User,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Flag,
  FileText,
  ScrollText,
} from 'lucide-react';
import { AdminRoute, StudentRoute, TeacherRoute, UserRole } from '@/types/lexcode';
import { X } from 'lucide-react';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';

interface NavItem<T extends string> {
  id: T;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: UserRole;
  studentRoute: StudentRoute;
  teacherRoute: TeacherRoute;
  adminRoute: AdminRoute;
  onSelectStudentRoute: (route: StudentRoute) => void;
  onSelectTeacherRoute: (route: TeacherRoute) => void;
  onSelectAdminRoute: (route: AdminRoute) => void;
  userName: string;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = { student: 'Alumno', teacher: 'Docente', admin: 'Administrador' };

const studentNav: NavItem<StudentRoute>[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'dilemas', label: 'Dilemas', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'actividades', label: 'Actividades', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'glosario', label: 'Glosario', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'insignias', label: 'Insignias', icon: <Award className="w-4 h-4" /> },
  { id: 'chatbot', label: 'Chatbot', icon: <Bot className="w-4 h-4" /> },
  { id: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> },
];

const teacherNav: NavItem<TeacherRoute>[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'alumnos', label: 'Alumnos', icon: <Users className="w-4 h-4" /> },
  { id: 'modulos', label: 'Módulos', icon: <ClipboardCheck className="w-4 h-4" /> },
  { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
];

const adminNav: NavItem<AdminRoute>[] = [
  { id: 'usuarios', label: 'Usuarios', icon: <Users className="w-4 h-4" /> },
  { id: 'arco', label: 'Solicitudes ARCO', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'reportes', label: 'Reportes', icon: <Flag className="w-4 h-4" /> },
  { id: 'glosario', label: 'Glosario', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'lexis', label: 'Lexis', icon: <Bot className="w-4 h-4" /> },
  { id: 'documentos', label: 'Documentos legales', icon: <FileText className="w-4 h-4" /> },
  { id: 'bitacora', label: 'Bitácora', icon: <ScrollText className="w-4 h-4" /> },
  { id: 'perfil', label: 'Mi perfil', icon: <User className="w-4 h-4" /> },
];

function NavList<T extends string>({
  items,
  active,
  onSelect,
  onAfterSelect,
}: {
  items: NavItem<T>[];
  active: T;
  onSelect: (id: T) => void;
  onAfterSelect?: () => void;
}) {
  return (
    <>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSelect(item.id);
              onAfterSelect?.();
            }}
            aria-current={isActive ? 'page' : undefined}
            className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
              isActive ? 'bg-[#002A28] text-white' : 'text-[#A3A3A3] hover:text-white hover:bg-[#0B0B0B]'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#00FFEF]" aria-hidden="true" />
            )}
            <span className={isActive ? 'text-[#00FFEF]' : 'text-[#A3A3A3]'}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </>
  );
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  studentRoute,
  teacherRoute,
  adminRoute,
  onSelectStudentRoute,
  onSelectTeacherRoute,
  onSelectAdminRoute,
  userName,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const initials =
    userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'LX';

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[228px] shrink-0 bg-[#000000] border-r border-[#161616] flex flex-col justify-between min-h-screen py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="px-6 mb-9 flex items-center justify-between">
            <LexCodeLogo size="md" />
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Cerrar menú"
                className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#141414] lg:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        <nav className="space-y-1.5" aria-label="Navegación principal">
          {role === 'student' && <NavList items={studentNav} active={studentRoute} onSelect={onSelectStudentRoute} onAfterSelect={onCloseMobile} />}
          {role === 'teacher' && <NavList items={teacherNav} active={teacherRoute} onSelect={onSelectTeacherRoute} onAfterSelect={onCloseMobile} />}
          {role === 'admin' && <NavList items={adminNav} active={adminRoute} onSelect={onSelectAdminRoute} onAfterSelect={onCloseMobile} />}
        </nav>
      </div>

      {/* Cuenta activa: el rol lo asigna un administrador, no se cambia desde aquí */}
      <div className="px-4 pt-6 border-t border-[#141414]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-[#0A1E1D] border border-[#00FFEF] flex items-center justify-center text-xs font-bold text-[#00FFEF] shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#757575]">{ROLE_LABELS[role]}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg border border-[#222222] text-[#A3A3A3] hover:text-[#FF3366] hover:border-[#FF3366] transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
