'use client';

import React, { useState } from 'react';
import {
  StudentRoute,
  TeacherModule,
  TeacherRoute,
  TeacherStudent,
  UserRole,
} from '@/types/lexcode';
import {
  INITIAL_TEACHER_MODULES,
  INITIAL_TEACHER_STUDENTS,
} from '@/data/mockLexCode';
import { LandingView } from '@/components/public/LandingView';
import { AuthView } from '@/components/public/AuthView';
import { OnboardingView } from '@/components/public/OnboardingView';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { DashboardStudent } from '@/components/student/DashboardStudent';
import { DilemasView } from '@/components/student/DilemasView';
import { ActividadesView } from '@/components/student/ActividadesView';
import { GlosarioView } from '@/components/student/GlosarioView';
import { InsigniasView } from '@/components/student/InsigniasView';
import { ChatbotLexisView } from '@/components/student/ChatbotLexisView';
import { PerfilView } from '@/components/student/PerfilView';
import { DashboardTeacher } from '@/components/teacher/DashboardTeacher';
import { AlumnosView } from '@/components/teacher/AlumnosView';
import { ModulosView } from '@/components/teacher/ModulosView';
import { ConfiguracionDocenteView } from '@/components/teacher/ConfiguracionDocenteView';

type Stage = 'landing' | 'auth' | 'onboarding' | 'app';

export default function HomePage() {
  const [stage, setStage] = useState<Stage>('app');
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [role, setRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState<string>('Regina');
  const [profileFullName, setProfileFullName] = useState<string>(
    'Ian Mauricio Morales Montejo'
  );

  const [studentRoute, setStudentRoute] = useState<StudentRoute>('dashboard');
  const [teacherRoute, setTeacherRoute] = useState<TeacherRoute>('dashboard');

  const [xp, setXp] = useState<number>(2450);
  const [streakDays] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chatbotPrompt, setChatbotPrompt] = useState<string>('');

  const [students, setStudents] = useState<TeacherStudent[]>(
    INITIAL_TEACHER_STUDENTS
  );
  const [modules, setModules] = useState<TeacherModule[]>(
    INITIAL_TEACHER_MODULES
  );

  const handleUpdateXp = (delta: number) => {
    setXp((prev) => Math.max(0, prev + delta));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setRole('student');
    setStage('app');
    setStudentRoute('glosario');
  };

  const handleAskLexisFromGlossary = (queryText: string) => {
    setChatbotPrompt(queryText);
    setStudentRoute('chatbot');
  };

  if (stage === 'landing') {
    return (
      <LandingView
        onStartAdventure={() => {
          setAuthMode('register');
          setStage('auth');
        }}
        onLogin={() => {
          setAuthMode('login');
          setStage('auth');
        }}
        onViewModules={() => {
          setRole('student');
          setStudentRoute('actividades');
          setStage('app');
        }}
      />
    );
  }

  if (stage === 'auth') {
    return (
      <AuthView
        initialMode={authMode}
        onBackToLanding={() => setStage('landing')}
        onCompleteAuth={(selectedRole, resolvedName) => {
          setRole(selectedRole);
          setProfileFullName(resolvedName);
          setUserName(resolvedName.split(' ')[0] || 'Ian');
          if (selectedRole === 'student') {
            setStage('onboarding');
          } else {
            setTeacherRoute('dashboard');
            setStage('app');
          }
        }}
      />
    );
  }

  if (stage === 'onboarding') {
    return (
      <OnboardingView
        onFinishOnboarding={() => {
          setStudentRoute('dashboard');
          setStage('app');
        }}
      />
    );
  }

  const topBarTitle =
    role === 'student'
      ? studentRoute === 'dashboard'
        ? 'Dashboard'
        : studentRoute === 'dilemas'
          ? 'Dilemas'
          : studentRoute === 'actividades'
            ? 'Quizzes'
            : studentRoute === 'glosario'
              ? 'Glosario'
              : studentRoute === 'insignias'
                ? 'INsignias'
                : studentRoute === 'chatbot'
                  ? 'Asistente Virtual'
                  : 'Perfil'
      : 'Dashboard';

  return (
    <div className="min-h-screen bg-[#000000] text-white flex relative overflow-x-hidden">
      {/* Patrón de puntos inferior izquierdo característico */}
      <div
        className="pointer-events-none fixed left-[228px] bottom-0 w-[260px] h-[340px] lexcode-dot-pattern opacity-75 z-0"
        aria-hidden="true"
      />

      <Sidebar
        role={role}
        studentRoute={studentRoute}
        teacherRoute={teacherRoute}
        onSelectStudentRoute={(route) => setStudentRoute(route)}
        onSelectTeacherRoute={(route) => setTeacherRoute(route)}
        onSwitchRole={(nextRole) => setRole(nextRole)}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar
          title={topBarTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          onToggleRoleQuick={() =>
            setRole((prev) => (prev === 'student' ? 'teacher' : 'student'))
          }
        />

        <main className="flex-1 px-8 py-7">
          {role === 'student' ? (
            <>
              {studentRoute === 'dashboard' && (
                <DashboardStudent
                  userName={userName}
                  xp={xp}
                  streakDays={streakDays}
                  onNavigate={(r) => setStudentRoute(r)}
                />
              )}
              {studentRoute === 'dilemas' && (
                <DilemasView xp={xp} onUpdateXp={handleUpdateXp} />
              )}
              {studentRoute === 'actividades' && (
                <ActividadesView xp={xp} onUpdateXp={handleUpdateXp} />
              )}
              {studentRoute === 'glosario' && (
                <GlosarioView
                  externalSearch={searchQuery}
                  onAskLexis={handleAskLexisFromGlossary}
                />
              )}
              {studentRoute === 'insignias' && <InsigniasView />}
              {studentRoute === 'chatbot' && (
                <ChatbotLexisView
                  userName={profileFullName}
                  initialPrompt={chatbotPrompt}
                  onNavigateGlossary={(r) => setStudentRoute(r)}
                />
              )}
              {studentRoute === 'perfil' && (
                <PerfilView
                  userName={profileFullName}
                  onUpdateName={(name) => {
                    setProfileFullName(name);
                    setUserName(name.split(' ')[0] || name);
                  }}
                  onLogoutToLanding={() => setStage('landing')}
                />
              )}
            </>
          ) : (
            <>
              {teacherRoute === 'dashboard' && (
                <DashboardTeacher
                  studentsCount={42}
                  modulesCount={modules.length + 3}
                  onNavigateTeacher={(r) => setTeacherRoute(r)}
                />
              )}
              {teacherRoute === 'alumnos' && (
                <AlumnosView
                  students={students}
                  onAddStudent={(newStudent) =>
                    setStudents((prev) => [
                      ...prev,
                      { ...newStudent, id: `s-${Date.now()}` },
                    ])
                  }
                />
              )}
              {teacherRoute === 'modulos' && (
                <ModulosView
                  modules={modules}
                  onAddModule={(mod) => setModules((prev) => [...prev, mod])}
                  onUpdateModule={(updated) =>
                    setModules((prev) =>
                      prev.map((m) => (m.id === updated.id ? updated : m))
                    )
                  }
                  onDeleteModule={(id) =>
                    setModules((prev) => prev.filter((m) => m.id !== id))
                  }
                />
              )}
              {teacherRoute === 'configuracion' && <ConfiguracionDocenteView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
