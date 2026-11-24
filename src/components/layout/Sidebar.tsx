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
} from 'lucide-react';
import { StudentRoute, TeacherRoute, UserRole } from '@/types/lexcode';
import { LexCodeLogo } from '@/components/brand/LexCodeLogo';

interface SidebarProps {
  role: UserRole;
  studentRoute: StudentRoute;
  teacherRoute: TeacherRoute;
  onSelectStudentRoute: (route: StudentRoute) => void;
  onSelectTeacherRoute: (route: TeacherRoute) => void;
  onSwitchRole: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  studentRoute,
  teacherRoute,
  onSelectStudentRoute,
  onSelectTeacherRoute,
  onSwitchRole,
}) => {
  const studentNav: { id: StudentRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'dilemas', label: 'Dilemas', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'actividades', label: 'Actividades', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'glosario', label: 'Glosario', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'insignias', label: 'Insignias', icon: <Award className="w-4 h-4" /> },
    { id: 'chatbot', label: 'Chatbot', icon: <Bot className="w-4 h-4" /> },
    { id: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> },
  ];

  const teacherNav: { id: TeacherRoute; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'alumnos', label: 'Alumnos', icon: <Users className="w-4 h-4" /> },
    { id: 'modulos', label: 'Módulos', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'configuracion', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-[228px] shrink-0 bg-[#000000] border-r border-[#161616] flex flex-col justify-between min-h-screen py-6">
      <div>
        <div className="px-6 mb-9">
          <LexCodeLogo size="md" />
        </div>

        <nav className="space-y-1.5" aria-label="Navegación principal">
          {role === 'student'
            ? studentNav.map((item) => {
                const isActive = studentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectStudentRoute(item.id)}
                    className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
                      isActive
                        ? 'bg-[#002A28] text-white'
                        : 'text-[#A3A3A3] hover:text-white hover:bg-[#0B0B0B]'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#00FFEF]"
                        aria-hidden="true"
                      />
                    )}
                    <span className={isActive ? 'text-[#00FFEF]' : 'text-[#A3A3A3]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })
            : teacherNav.map((item) => {
                const isActive = teacherRoute === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectTeacherRoute(item.id)}
                    className={`w-full flex items-center gap-3.5 px-6 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
                      isActive
                        ? 'bg-[#002A28] text-white'
                        : 'text-[#A3A3A3] hover:text-white hover:bg-[#0B0B0B]'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#00FFEF]"
                        aria-hidden="true"
                      />
                    )}
                    <span className={isActive ? 'text-[#00FFEF]' : 'text-[#A3A3A3]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
        </nav>
      </div>

      {/* Selector rápido de rol para validar ambos flujos */}
      <div className="px-4 pt-6 border-t border-[#141414]">
        <p className="text-[10px] uppercase tracking-wider text-[#757575] px-2 mb-2">
          Vista activa
        </p>
        <div className="grid grid-cols-2 gap-1.5 bg-[#111111] p-1 rounded-lg border border-[#222222]">
          <button
            type="button"
            onClick={() => onSwitchRole('student')}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              role === 'student'
                ? 'bg-[#00FFEF] text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Alumno
          </button>
          <button
            type="button"
            onClick={() => onSwitchRole('teacher')}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              role === 'teacher'
                ? 'bg-[#00FFEF] text-black'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Docente
          </button>
        </div>
      </div>
    </aside>
  );
};
