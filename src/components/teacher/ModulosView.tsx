'use client';

import React, { useState } from 'react';
import { Plus, Trash2, X, UserPlus, ChevronDown } from 'lucide-react';
import { ModuleInteractionType, TeacherModule } from '@/types/lexcode';

interface ModulosViewProps {
  modules: TeacherModule[];
  onAddModule: (mod: TeacherModule) => void;
  onUpdateModule: (mod: TeacherModule) => void;
  onDeleteModule: (id: string) => void;
}

type ActiveModal =
  | null
  | { type: 'create' }
  | { type: 'configure'; moduleId: string }
  | { type: 'add_cloze'; moduleId: string }
  | { type: 'add_pair'; moduleId: string }
  | { type: 'add_question'; moduleId: string };

export const ModulosView: React.FC<ModulosViewProps> = ({
  modules,
  onAddModule,
  onUpdateModule,
  onDeleteModule,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string>('mod-3');
  const [forceEmpty, setForceEmpty] = useState<boolean>(false);
  const [modal, setModal] = useState<ActiveModal>(null);
  const [configureTab, setConfigureTab] = useState<'datos' | 'contenido'>('contenido');

  const [modName, setModName] = useState('Módulo 5: Auditoría y Ciberseguridad');
  const [modStandard, setModStandard] = useState('ISO/IEC 27001');
  const [modInteraction, setModInteraction] = useState<ModuleInteractionType>(
    'Opción Múltiple (Reactivos Teóricos)'
  );

  const [editName, setEditName] = useState('');
  const [editStandard, setEditStandard] = useState('');

  const [clozeTemplate, setClozeTemplate] = useState(
    'El responsable deberá implementar medidas de seguridad administrativas, técnicas y [físicas] para proteger los datos.'
  );

  const [pairConcept, setPairConcept] = useState('Artículo 101 Bis (LFDA)');
  const [pairDefinition, setPairDefinition] = useState(
    'Protección legal de software y compilados'
  );

  const [qText, setQText] = useState(
    '¿Cuál es el protocolo cifrado estándar recomendado para conexiones seguras web?'
  );
  const [qCorrect, setQCorrect] = useState('HTTPS / TLS 1.3');
  const [qDistractor1, setQDistractor1] = useState('HTTP 1.0');
  const [qDistractor2, setQDistractor2] = useState('FTP / Telnet');

  const visibleModules = forceEmpty ? [] : modules;
  const targetModule =
    modal && 'moduleId' in modal
      ? modules.find((m) => m.id === modal.moduleId) || null
      : null;

  const openConfigureModal = (
    mod: TeacherModule,
    initialTab: 'datos' | 'contenido' = 'contenido'
  ) => {
    setEditName(mod.name);
    setEditStandard(mod.standard);
    setConfigureTab(initialTab);
    setModal({ type: 'configure', moduleId: mod.id });
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    const nextOrder = String(modules.length + 1).padStart(2, '0');
    const created: TeacherModule = {
      id: `mod-${Date.now()}`,
      order: nextOrder,
      name: modName.trim() || `Módulo ${nextOrder}`,
      standard: modStandard.trim() || 'Marco Normativo',
      enrolledCount: 30,
      interactionType: modInteraction,
      clozeItems: [],
      memoramaPairs: [],
      quizQuestions: [],
    };
    onAddModule(created);
    setForceEmpty(false);
    setModal(null);
  };

  const handleSaveModuleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModule) return;
    onUpdateModule({
      ...targetModule,
      name: editName.trim() || targetModule.name,
      standard: editStandard.trim() || targetModule.standard,
    });
    setModal(null);
  };

  const handleAddClozeItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModule || !clozeTemplate.trim()) return;
    onUpdateModule({
      ...targetModule,
      clozeItems: [
        ...targetModule.clozeItems,
        { id: `cl-${Date.now()}`, template: clozeTemplate.trim() },
      ],
    });
    setModal({ type: 'configure', moduleId: targetModule.id });
  };

  const handleAddMemoramaPair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModule || !pairConcept.trim() || !pairDefinition.trim()) return;
    onUpdateModule({
      ...targetModule,
      memoramaPairs: [
        ...targetModule.memoramaPairs,
        {
          id: `mp-${Date.now()}`,
          concept: pairConcept.trim(),
          definition: pairDefinition.trim(),
        },
      ],
    });
    setModal({ type: 'configure', moduleId: targetModule.id });
  };

  const handleAddQuizQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModule || !qText.trim() || !qCorrect.trim()) return;
    onUpdateModule({
      ...targetModule,
      quizQuestions: [
        ...targetModule.quizQuestions,
        {
          id: `qq-${Date.now()}`,
          question: qText.trim(),
          correctAnswer: qCorrect.trim(),
          distractors: [qDistractor1.trim(), qDistractor2.trim()].filter(Boolean),
        },
      ],
    });
    setModal({ type: 'configure', moduleId: targetModule.id });
  };

  return (
    <div className="max-w-6xl space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setForceEmpty((prev) => !prev)}
          className="text-[11px] text-[#757575] hover:text-[#00FFEF] transition cursor-pointer"
        >
          {forceEmpty ? 'Restaurar módulos' : 'Ver estado vacío (sin módulos)'}
        </button>
      </div>

      <div className="bg-[#0D0D0D] border border-[#1B1B1B] rounded-2xl p-4 sm:p-7 space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Configuración de Módulos
            </h1>
            <p className="text-xs text-[#757575] mt-1">
              Gestiona el orden, contenido y normativas evaluadas en cada módulo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModal({ type: 'create' })}
            className="bg-[#00FFEF] text-black font-bold text-xs px-4 py-2.5 rounded-lg hover:brightness-105 transition cursor-pointer"
          >
            + Nuevo Módulo
          </button>
        </div>

        {visibleModules.length === 0 ? (
          <div className="pt-2">
            <div className="w-full overflow-x-auto"><div className="min-w-[640px] grid grid-cols-5 text-[11px] font-semibold uppercase tracking-wider text-[#666666] pb-3 border-b border-[#181818]">
              <span>ORDEN</span>
              <span>NOMBRE DEL MÓDULO</span>
              <span>NORMATIVA / ESTÁNDAR</span>
              <span>ESTUDIANTES INSCRITOS</span>
              <span>ACCIONES</span>
            </div></div>

            <div className="mt-5 sm:mt-10 mx-auto max-w-md bg-[#111111] border border-[#222222] rounded-2xl py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center text-center space-y-4">
              <UserPlus className="w-8 h-8 text-[#757575]" />
              <div>
                <h2 className="text-base font-bold text-white">
                  No hay módulos configurados
                </h2>
                <p className="text-xs text-[#757575] mt-1">
                  Comienza agregando el primer módulo académico.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal({ type: 'create' })}
                className="bg-[#00FFEF] text-black font-bold text-xs px-5 py-2.5 rounded-lg hover:brightness-105 transition cursor-pointer"
              >
                + Nuevo Módulo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1A1A1A] text-[11px] font-semibold uppercase tracking-wider text-[#666666]">
                    <th className="py-3 pr-4">ORDEN</th>
                    <th className="py-3 px-4">NOMBRE DEL MÓDULO</th>
                    <th className="py-3 px-4">NORMATIVA / ESTÁNDAR</th>
                    <th className="py-3 px-4">ESTUDIANTES INSCRITOS</th>
                    <th className="py-3 pl-4 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171717] text-xs sm:text-sm">
                  {visibleModules.map((mod) => {
                    const isSelected = selectedRowId === mod.id;
                    return (
                      <tr
                        key={mod.id}
                        onClick={() => setSelectedRowId(mod.id)}
                        className={`transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#051F1E]/60 border border-[#00FFEF]'
                            : 'hover:bg-[#121212]'
                        }`}
                      >
                        <td
                          className={`py-2.5 sm:py-4 px-2.5 sm:px-4 font-bold ${
                            isSelected ? 'text-[#00FFEF]' : 'text-white'
                          }`}
                        >
                          {mod.order}
                        </td>
                        <td className="py-2.5 sm:py-4 px-2.5 sm:px-4 font-bold text-white">{mod.name}</td>
                        <td className="py-2.5 sm:py-4 px-2.5 sm:px-4 text-[#757575]">{mod.standard}</td>
                        <td className="py-2.5 sm:py-4 px-2.5 sm:px-4 text-[#A3A3A3]">
                          {mod.enrolledCount} alumnos
                        </td>
                        <td className="py-2.5 sm:py-4 px-2.5 sm:px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openConfigureModal(mod, 'contenido');
                            }}
                            aria-label={`Configurar ${mod.name}`}
                            className={`w-8 h-8 rounded-full inline-flex items-center justify-center transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#00FFEF] text-black'
                                : 'bg-[#181818] border border-[#2A2A2A] text-white hover:border-[#00FFEF]'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-xs text-[#757575]">
              Mostrando {visibleModules.length} de {visibleModules.length} módulos configurados
            </div>
          </>
        )}
      </div>

      {modal?.type === 'create' && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleCreateModule}
            className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Paso 1: Crear Nuevo Módulo</h2>
                <p className="text-xs text-[#757575] mt-1">
                  Define el nombre base y el tipo de dinámica para habilitar el contenido.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#0B0B0B] border border-[#242424] rounded-xl p-1 text-xs">
              <span className="bg-[#00FFEF] text-black font-bold px-4 py-1.5 rounded-lg">
                1. Datos y Dinámica
              </span>
              <span className="text-[#757575] px-4 py-1.5 font-semibold">
                2. Contenido
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                NOMBRE DEL MÓDULO
              </label>
              <input
                type="text"
                value={modName}
                onChange={(e) => setModName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                NORMATIVA / ESTÁNDAR EVALUADO
              </label>
              <input
                type="text"
                value={modStandard}
                onChange={(e) => setModStandard(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                DINÁMICA PRINCIPAL DE INTERACCIÓN
              </label>
              <div className="relative">
                <select
                  value={modInteraction}
                  onChange={(e) =>
                    setModInteraction(e.target.value as ModuleInteractionType)
                  }
                  className="appearance-none w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none focus:border-[#00FFEF] cursor-pointer"
                >
                  <option value="Opción Múltiple (Reactivos Teóricos)">
                    Opción Múltiple (Reactivos Teóricos)
                  </option>
                  <option value="Completar Palabras (Espacios en Blanco)">
                    Completar Palabras (Espacios en Blanco)
                  </option>
                  <option value="Memorama (Conexiones Legales)">
                    Memorama (Conexiones Legales)
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#757575] pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E1E1E]">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="h-11 px-6 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-semibold text-white hover:bg-[#202020] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#00FFEF] text-black text-xs font-bold hover:brightness-105 cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
      )}

      {modal?.type === 'configure' && targetModule && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {configureTab === 'datos'
                    ? 'Configurar Módulo'
                    : targetModule.id === 'mod-2'
                      ? 'Configurar Módulo: Completar Palabras'
                      : targetModule.id === 'mod-3'
                        ? 'Configurar Módulo: Memorama'
                        : 'Configurar Módulo: Opción Múltiple'}
                </h2>
                <p className="text-xs text-[#757575] mt-1">
                  {configureTab === 'datos'
                    ? `Modifica los detalles normativos de ${targetModule.name}.`
                    : targetModule.id === 'mod-2'
                      ? 'Módulo 2: LFPDPPP — Gestión de Enunciados'
                      : targetModule.id === 'mod-3'
                        ? 'Módulo 3: Dilemas Éticos — Gestión de Parejas'
                        : `${targetModule.name} — Banco de Preguntas`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Cerrar modal"
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
              <div className="inline-flex items-center gap-1 bg-[#0B0B0B] border border-[#242424] rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setConfigureTab('datos')}
                  className={`px-4 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    configureTab === 'datos'
                      ? 'bg-[#00FFEF] text-black'
                      : 'text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  1. Datos
                </button>
                <button
                  type="button"
                  onClick={() => setConfigureTab('contenido')}
                  className={`px-4 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    configureTab === 'contenido'
                      ? 'bg-[#00FFEF] text-black'
                      : 'text-[#A3A3A3] hover:text-white'
                  }`}
                >
                  {targetModule.id === 'mod-2'
                    ? `2. Enunciados (${targetModule.clozeItems.length} de 5)`
                    : targetModule.id === 'mod-3'
                      ? `2. Parejas (${targetModule.memoramaPairs.length} de 8)`
                      : `2. Preguntas (${targetModule.quizQuestions.length} de 10)`}
                </button>
              </div>

              {configureTab === 'contenido' && (
                <button
                  type="button"
                  onClick={() => {
                    if (targetModule.id === 'mod-2') {
                      setModal({ type: 'add_cloze', moduleId: targetModule.id });
                    } else if (targetModule.id === 'mod-3') {
                      setModal({ type: 'add_pair', moduleId: targetModule.id });
                    } else {
                      setModal({ type: 'add_question', moduleId: targetModule.id });
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-[#051F1E] border border-[#00FFEF] text-xs font-bold text-[#00FFEF] hover:bg-[#002A28] cursor-pointer"
                >
                  {targetModule.id === 'mod-2'
                    ? '+ Agregar Enunciado'
                    : targetModule.id === 'mod-3'
                      ? '+ Agregar Pareja'
                      : '+ Agregar Pregunta'}
                </button>
              )}
            </div>

            {configureTab === 'datos' ? (
              <form onSubmit={handleSaveModuleEdit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                    NOMBRE DEL MÓDULO
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                    NORMATIVA / ESTÁNDAR EVALUADO
                  </label>
                  <input
                    type="text"
                    value={editStandard}
                    onChange={(e) => setEditStandard(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
                  />
                </div>

                <div className="bg-[#240B0E] border border-[#5C1922] rounded-xl px-4 sm:px-5 py-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#FF3366]">
                  <span>Eliminar este módulo permanentemente</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteModule(targetModule.id);
                      setModal(null);
                    }}
                    aria-label="Eliminar módulo"
                    className="hover:scale-105 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="h-12 rounded-xl bg-[#181818] border border-[#2A2A2A] text-sm font-semibold text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="h-12 rounded-xl bg-[#00FFEF] text-black text-sm font-bold cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {targetModule.id === 'mod-2' &&
                  targetModule.clozeItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-4"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-[#757575] mb-1.5">
                        {idx === 0
                          ? 'TEXTO CON BLANCOS (USA [ ] PARA LAS PALABRAS)'
                          : 'TEXTO CON BLANCOS'}
                      </div>
                      <p className="text-xs sm:text-sm text-[#D4D4D4]">{item.template}</p>
                    </div>
                  ))}

                {targetModule.id === 'mod-3' &&
                  targetModule.memoramaPairs.map((pair) => (
                    <div
                      key={pair.id}
                      className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#757575] mb-1">
                          TARJETA 1 (CONCEPTO)
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {pair.concept}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#757575] mb-1">
                          TARJETA 2 (DEFINICIÓN / MATCH)
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-[#00FFEF]">
                          {pair.definition}
                        </div>
                      </div>
                    </div>
                  ))}

                {targetModule.id !== 'mod-2' && targetModule.id !== 'mod-3' && (
                  <div className="space-y-3">
                    {targetModule.quizQuestions.length === 0 ? (
                      <div className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-5 text-xs text-[#A3A3A3]">
                        P1: ¿Cuál es el protocolo cifrado estándar recomendado para conexiones seguras web?
                        <div className="text-[#00FFEF] mt-1">
                          Opción Correcta: HTTPS / TLS 1.3 — Opciones registradas: 4
                        </div>
                      </div>
                    ) : (
                      targetModule.quizQuestions.map((qq, i) => (
                        <div
                          key={qq.id}
                          className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-4"
                        >
                          <div className="text-xs sm:text-sm font-bold text-white">
                            P{i + 1}: {qq.question}
                          </div>
                          <div className="text-xs text-[#00FFEF] mt-1">
                            Opción Correcta: {qq.correctAnswer} — Opciones registradas:{' '}
                            {1 + qq.distractors.length}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E1E1E]">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="h-11 px-6 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-semibold text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="h-11 px-6 rounded-xl bg-[#00FFEF] text-black text-xs font-bold cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {modal?.type === 'add_cloze' && targetModule && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleAddClozeItem}
            className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 md:p-8 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Agregar Nuevo Enunciado</h2>
                <p className="text-xs text-[#757575] mt-1">
                  Módulo 2: LFPDPPP — Espacios en Blanco
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                TEXTO CON BLANCOS (USA [ ] PARA LAS PALABRAS)
              </label>
              <textarea
                rows={3}
                value={clozeTemplate}
                onChange={(e) => setClozeTemplate(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0D0D0D] border border-[#00FFEF] text-sm text-white focus:outline-none"
              />
              <p className="text-[11px] text-[#757575] mt-2">
                Nota: Lo que encierres entre corchetes se convertirá automáticamente en el espacio interactivo.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E1E1E]">
              <button
                type="button"
                onClick={() => setModal({ type: 'configure', moduleId: targetModule.id })}
                className="h-11 px-6 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-semibold text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#00FFEF] text-black text-xs font-bold cursor-pointer"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}

      {modal?.type === 'add_pair' && targetModule && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleAddMemoramaPair}
            className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 md:p-8 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Agregar Nueva Pareja</h2>
                <p className="text-xs text-[#757575] mt-1">
                  Módulo 3: Dilemas Éticos — Tarjetas de Memoria
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                TARJETA 1 (CONCEPTO / TÉRMINO)
              </label>
              <input
                type="text"
                value={pairConcept}
                onChange={(e) => setPairConcept(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#00FFEF] text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                TARJETA 2 (DEFINICIÓN / MATCH)
              </label>
              <textarea
                rows={3}
                value={pairDefinition}
                onChange={(e) => setPairDefinition(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none focus:border-[#00FFEF]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E1E1E]">
              <button
                type="button"
                onClick={() => setModal({ type: 'configure', moduleId: targetModule.id })}
                className="h-11 px-6 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-semibold text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#00FFEF] text-black text-xs font-bold cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {modal?.type === 'add_question' && targetModule && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleAddQuizQuestion}
            className="w-full max-w-2xl max-h-[90dvh] overflow-y-auto bg-[#121212] border border-[#262626] rounded-2xl p-4 sm:p-6 md:p-8 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Agregar Nueva Pregunta</h2>
                <p className="text-xs text-[#757575] mt-1">
                  {targetModule.name} — Banco de Preguntas
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#A3A3A3] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                TEXTO DE LA PREGUNTA
              </label>
              <input
                type="text"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#00FFEF] text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] mb-2">
                OPCIÓN CORRECTA
              </label>
              <input
                type="text"
                value={qCorrect}
                onChange={(e) => setQCorrect(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm font-semibold text-[#00FFEF] focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3]">
                OPCIONES DISTRACTORAS (INCORRECTAS)
              </label>
              <input
                type="text"
                value={qDistractor1}
                onChange={(e) => setQDistractor1(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none"
              />
              <input
                type="text"
                value={qDistractor2}
                onChange={(e) => setQDistractor2(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-[#0D0D0D] border border-[#262626] text-sm text-white focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E1E1E]">
              <button
                type="button"
                onClick={() => setModal({ type: 'configure', moduleId: targetModule.id })}
                className="h-11 px-6 rounded-xl bg-[#181818] border border-[#2A2A2A] text-xs font-semibold text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#00FFEF] text-black text-xs font-bold cursor-pointer"
              >
                Añadir Reactivo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
