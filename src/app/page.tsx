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
import { useSession } from '@/lib/session';
import { LandingView } from '@/components/public/LandingView';
import { AuthView } from '@/components/public/AuthView';
import { OnboardingView } from '@/components/public/OnboardingView';
import { AccountStatusView } from '@/components/public/AccountStatusView';
import { LoadingScreen } from '@/components/public/LoadingScreen';
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

type PublicStage = 'landing' | 'auth';

export default function HomePage() {
  const { profile, logout } = useSession();
  const [publicStage, setPublicStage] = useState<PublicStage>('landing');
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [studentRoute, setStudentRoute] = useState<StudentRoute>('dashboard');
  const [teacherRoute, setTeacherRoute] = useState<TeacherRoute>('dashboard');

  // XP local de los juegos simulados (se reemplaza cuando exista el backend de Persona B).
  const [xpDelta, setXpDelta] = useState<number>(0);
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
    setXpDelta((prev) => prev + delta);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setStudentRoute('glosario');
  };

  const handleAskLexisFromGlossary = (queryText: string) => {
    setChatbotPrompt(queryText);
    setStudentRoute('chatbot');
  };

  if (profile === undefined) return <LoadingScreen />;

  if (profile === null) {
    if (publicStage === 'landing') {
      return (
        <LandingView
          onStartAdventure={() => {
            setAuthMode('register');
            setPublicStage('auth');
          }}
          onLogin={() => {
            setAuthMode('login');
            setPublicStage('auth');
          }}
          onViewModules={() => {
            setAuthMode('register');
            setPublicStage('auth');
          }}
        />
      );
    }
    return (
      <AuthView
        initialMode={authMode}
        onBackToLanding={() => setPublicStage('landing')}
        onCompleteAuth={(isNewAccount) => {
          setStudentRoute('dashboard');
          setTeacherRoute('dashboard');
          setShowOnboarding(isNewAccount);
        }}
      />
    );
  }

  if (profile.status !== 'active') {
    return <AccountStatusView />;
  }

  if (showOnboarding && profile.role === 'student') {
    return (
      <OnboardingView
        onFinishOnboarding={() => {
          setStudentRoute('dashboard');
          setShowOnboarding(false);
        }}
      />
    );
  }

  // El administrador usa por ahora la vista docente (su panel aún no tiene pantallas).
  const role: UserRole = profile.role === 'student' ? 'student' : 'teacher';
  const firstName = profile.full_name.split(' ')[0] || profile.username;
  const xp = Math.max(0, profile.xp_total + xpDelta);

  const handleLogout = async () => {
    await logout();
    setPublicStage('landing');
    setSearchQuery('');
    setChatbotPrompt('');
  };

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
        userName={profile.full_name}
        accountRole={profile.role}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar
          title={topBarTitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={role === 'student' ? handleSearchSubmit : undefined}
        />

        <main className="flex-1 px-8 py-7">
          {role === 'student' ? (
            <>
              {studentRoute === 'dashboard' && (
                <DashboardStudent
                  userName={firstName}
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
                  userName={profile.full_name}
                  initialPrompt={chatbotPrompt}
                  onConsumePrompt={() => setChatbotPrompt('')}
                  onOpenGlossary={(term) => {
                    setSearchQuery(term);
                    setStudentRoute('glosario');
                  }}
                />
              )}
              {studentRoute === 'perfil' && (
                <PerfilView onLogout={handleLogout} />
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
