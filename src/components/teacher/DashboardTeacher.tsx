'use client';

import React from 'react';
import { TeacherRoute } from '@/types/lexcode';

interface DashboardTeacherProps {
  studentsCount: number;
  modulesCount: number;
  onNavigateTeacher: (route: TeacherRoute) => void;
}

export const DashboardTeacher: React.FC<DashboardTeacherProps> = ({
  studentsCount,
  modulesCount,
  onNavigateTeacher,
}) => {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigateTeacher('alumnos')}
          className="bg-[#111111] border border-[#1E1E1E] hover:border-[#333333] rounded-2xl p-4 sm:p-6 cursor-pointer transition"
        >
          <div className="text-xs text-[#A3A3A3]">Estudiantes Registrados</div>
          <div className="text-3xl font-bold text-white mt-3">{studentsCount}</div>
          <div className="text-xs text-[#00FFEF] mt-3">Grupo activo</div>
        </div>

        <div
          onClick={() => onNavigateTeacher('modulos')}
          className="bg-[#111111] border border-[#1E1E1E] hover:border-[#333333] rounded-2xl p-4 sm:p-6 cursor-pointer transition"
        >
          <div className="text-xs text-[#A3A3A3]">Módulos Publicados</div>
          <div className="text-3xl font-bold text-white mt-3">{modulesCount}</div>
          <div className="text-xs text-[#757575] mt-3">Unidades de aprendizaje</div>
        </div>

        <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6">
          <div className="text-xs text-[#A3A3A3]">Promedio del Grupo</div>
          <div className="text-3xl font-bold text-[#00FFEF] mt-3">88.4</div>
          <div className="text-xs text-[#00FFEF] mt-3">+4.2% respecto al parcial</div>
        </div>

        <div className="bg-[#111111] border-b-2 border-b-[#00FFEF] border-x border-t border-[#1E1E1E] rounded-2xl p-6">
          <div className="text-xs text-[#A3A3A3]">Simulaciones por Revisar</div>
          <div className="text-3xl font-bold text-white mt-3">5</div>
          <div className="text-xs text-[#757575] mt-3">Entregas recientes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">
            Progreso General por Módulos y Prácticas
          </h2>

          <div className="border border-dashed border-[#2C2C2C] rounded-xl h-72 relative flex items-center justify-center p-4">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M25 168C95 142 145 102 215 112C285 122 335 138 405 92C465 52 525 32 580 12"
                stroke="#00FFEF"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="465" cy="52" r="5" fill="#00FFEF" />
            </svg>
            <span className="text-xs text-[#757575] absolute">
              Gráfica de avance y entregas de los estudiantes
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#111111] border border-[#1E1E1E] rounded-2xl p-4 sm:p-6 space-y-5">
          <h2 className="text-base font-bold text-white">Últimas Entregas</h2>

          <div className="space-y-4 divide-y divide-[#1D1D1D]">
            <div className="pt-1 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Diana Hernández</div>
                <div className="text-xs text-[#757575] mt-0.5">
                  Módulo 3: Simulación de Dilema
                </div>
              </div>
              <span className="text-xs text-[#00FFEF] shrink-0">Hace 10m</span>
            </div>

            <div className="pt-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Kevin Morales</div>
                <div className="text-xs text-[#757575] mt-0.5">
                  Cuestionario de Normativa
                </div>
              </div>
              <span className="text-xs text-[#00FFEF] shrink-0">Hace 25m</span>
            </div>

            <div className="pt-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-white">Sofía Ramírez</div>
                <div className="text-xs text-[#757575] mt-0.5">
                  Módulo 2: Glosario Técnico
                </div>
              </div>
              <span className="text-xs text-[#757575] shrink-0">Hace 1h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
