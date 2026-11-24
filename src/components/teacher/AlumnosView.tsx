'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, UserPlus, X } from 'lucide-react';
import { TeacherStudent } from '@/types/lexcode';

interface AlumnosViewProps {
  students: TeacherStudent[];
  onAddStudent: (student: Omit<TeacherStudent, 'id'>) => void;
}

export const AlumnosView: React.FC<AlumnosViewProps> = ({
  students,
  onAddStudent,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');
  const [page, setPage] = useState<number>(1);
  const [forceEmpty, setForceEmpty] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [newName, setNewName] = useState<string>('');
  const [newMatricula, setNewMatricula] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'Activo' | 'Pendiente'>('Activo');

  const visibleStudents = forceEmpty
    ? []
    : selectedGroup === 'Todos'
      ? students
      : students.filter((s) => s.group === selectedGroup);

  const handleOpenModal = () => {
    setNewName('');
    setNewMatricula('');
    setNewStatus('Activo');
    setIsModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMatricula.trim()) return;

    onAddStudent({
      name: newName.trim(),
      matricula: newMatricula.trim(),
      currentModule: 'Módulo 1: Introducción',
      average: 85.0,
      status: newStatus,
      group: selectedGroup === 'Todos' ? 'TIID-7A' : selectedGroup,
    });
    setForceEmpty(false);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setForceEmpty((prev) => !prev)}
          className="text-[11px] text-[#757575] hover:text-[#00FFEF] transition cursor-pointer"
        >
          {forceEmpty ? 'Restaurar lista de alumnos' : 'Ver estado vacío (sin alumnos)'}
        </button>
      </div>

      <div className="bg-[#0D0D0D] border border-[#1B1B1B] rounded-2xl p-6 space-y-6">
        {/* Barra superior de filtro y botón + Registrar Alumno */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <select
              aria-label="Filtrar por grupo"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="appearance-none bg-[#141414] border border-[#262626] text-xs font-medium text-[#A3A3A3] rounded-lg pl-3.5 pr-9 py-2.5 focus:outline-none focus:border-[#00FFEF] cursor-pointer"
            >
              <option value="Todos">Grupo: Todos</option>
              <option value="TIID-7A">Grupo: TIID-7A</option>
              <option value="TIID-7B">Grupo: TIID-7B</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#757575] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-[#00FFEF] text-black font-bold text-xs px-4 py-2.5 rounded-lg hover:brightness-105 transition cursor-pointer"
          >
            + Registrar Alumno
          </button>
        </div>

        {visibleStudents.length === 0 ? (
          /* Estado vacío (Dashboard docente vacío.png) */
          <div className="py-10 flex flex-col items-center">
            <div className="w-full grid grid-cols-5 text-[11px] font-semibold uppercase tracking-wider text-[#666666] pb-3 border-b border-[#181818]">
              <span>NOMBRE DEL ALUMNO</span>
              <span>MATRÍCULA</span>
              <span>MÓDULO ACTUAL</span>
              <span>PROMEDIO</span>
              <span>ESTATUS</span>
            </div>

            <div className="mt-10 w-full max-w-md bg-[#111111] border border-[#222222] rounded-2xl py-12 px-6 flex flex-col items-center text-center space-y-4">
              <UserPlus className="w-8 h-8 text-[#757575]" />
              <div>
                <h2 className="text-base font-bold text-white">No hay alumnos registrados</h2>
                <p className="text-xs text-[#757575] mt-1">
                  Comienza agregando un estudiante a este grupo.
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenModal}
                className="bg-[#00FFEF] text-black font-bold text-xs px-5 py-2.5 rounded-lg hover:brightness-105 transition cursor-pointer"
              >
                + Registrar Alumno
              </button>
            </div>
          </div>
        ) : (
          /* Tabla de alumnos (Dashboard docente final.png) */
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1B1B1B] text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
                    <th className="py-3 pr-4">NOMBRE DEL ALUMNO</th>
                    <th className="py-3 px-4">MATRÍCULA</th>
                    <th className="py-3 px-4">MÓDULO ACTUAL</th>
                    <th className="py-3 px-4">PROMEDIO</th>
                    <th className="py-3 pl-4">ESTATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171717] text-xs sm:text-sm">
                  {visibleStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#121212] transition">
                      <td className="py-4 pr-4 font-semibold text-white">
                        {student.name}
                      </td>
                      <td className="py-4 px-4 text-[#757575]">{student.matricula}</td>
                      <td className="py-4 px-4 text-[#A3A3A3]">
                        {student.currentModule}
                      </td>
                      <td
                        className={`py-4 px-4 font-bold ${
                          student.average >= 80 ? 'text-[#00FFEF]' : 'text-[#A3A3A3]'
                        }`}
                      >
                        {student.average.toFixed(1)}
                      </td>
                      <td className="py-4 pl-4">
                        {student.status === 'Activo' ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#05291E] text-[#10B981]">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1D05] text-[#D97706]">
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación inferior */}
            <div className="pt-3 flex items-center justify-between gap-4 text-xs text-[#757575]">
              <span>Mostrando {visibleStudents.length} de 42 estudiantes</span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Página anterior"
                  className="w-7 h-7 rounded-md bg-[#141414] border border-[#242424] flex items-center justify-center text-[#A3A3A3] hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  className={`w-7 h-7 rounded-md text-xs font-bold cursor-pointer ${
                    page === 1
                      ? 'bg-[#00FFEF] text-black'
                      : 'bg-[#141414] text-[#A3A3A3]'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setPage(2)}
                  className={`w-7 h-7 rounded-md text-xs font-bold cursor-pointer ${
                    page === 2
                      ? 'bg-[#00FFEF] text-black'
                      : 'bg-[#141414] text-[#A3A3A3]'
                  }`}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(2, p + 1))}
                  aria-label="Página siguiente"
                  className="w-7 h-7 rounded-md bg-[#141414] border border-[#242424] flex items-center justify-center text-[#A3A3A3] hover:text-white cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Registrar Nuevo Alumno (Agregar alumno.png) */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-registrar-alumno-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleSaveStudent}
            className="w-full max-w-2xl bg-[#121212] border border-[#262626] rounded-2xl p-8 space-y-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="modal-registrar-alumno-title"
                  className="text-xl font-bold text-white"
                >
                  Registrar Nuevo Alumno
                </h2>
                <p className="text-xs text-[#757575] mt-1">
                  Ingresa los datos académicos del estudiante.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label
                htmlFor="student-name"
                className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2"
              >
                NOMBRE DEL ALUMNO
              </label>
              <input
                id="student-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej. María Fernanda López"
                className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="student-matricula"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2"
                >
                  MATRÍCULA
                </label>
                <input
                  id="student-matricula"
                  type="text"
                  value={newMatricula}
                  onChange={(e) => setNewMatricula(e.target.value)}
                  placeholder="Ej. UP240350"
                  className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#00FFEF]"
                />
              </div>

              <div>
                <label
                  htmlFor="student-status"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2"
                >
                  ESTATUS INICIAL
                </label>
                <div className="relative">
                  <select
                    id="student-status"
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value as 'Activo' | 'Pendiente')
                    }
                    className="appearance-none w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm font-medium text-[#10B981] focus:outline-none focus:border-[#00FFEF] cursor-pointer"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#757575] pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-12 rounded-xl bg-[#181818] border border-[#2A2A2A] text-sm font-semibold text-white hover:bg-[#202020] transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-12 rounded-xl bg-[#00FFEF] text-black text-sm font-bold hover:brightness-105 transition cursor-pointer"
              >
                Guardar Alumno
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
