'use client';

import React, { useState } from 'react';
import {
  AdminRoute,
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
import { BusquedaView } from '@/components/student/BusquedaView';
import { AdminUsersView } from '@/components/admin/AdminUsersView';
import { AdminArcoView } from '@/components/admin/AdminArcoView';
import { AdminReportsView } from '@/components/admin/AdminReportsView';
import { AdminGlossaryView } from '@/components/admin/AdminGlossaryView';
import { AdminLexisView } from '@/components/admin/AdminLexisView';
import { AdminDocumentsView } from '@/components/admin/AdminDocumentsView';
import { AdminAuditView } from '@/components/admin/AdminAuditView';

const STUDENT_TITLES: Record<StudentRoute, string> = {
  dashboard: 'Dashboard',
  dilemas: 'Dilemas',
  actividades: 'Quizzes',
  glosario: 'Glosario',
  insignias: 'Insignias',
  chatbot: 'Asistente Virtual',
  perfil: 'Perfil',
  busqueda: 'Búsqueda',
};

const ADMIN_TITLES: Record<AdminRoute, string> = {
  usuarios: 'Usuarios',
  arco: 'Solicitudes ARCO',
  reportes: 'Reportes',
  glosario: 'Glosario',
  lexis: 'Lexis',
  documentos: 'Documentos legales',
  bitacora: 'Bitácora',
  perfil: 'Mi perfil',
};

type PublicStage = 'landing' | 'auth';

export default function HomePage() {
  const { profile, logout } = useSession();
  const [publicStage, setPublicStage] = useState<PublicStage>('landing');
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [studentRoute, setStudentRoute] = useState<StudentRoute>('dashboard');
  const [teacherRoute, setTeacherRoute] = useState<TeacherRoute>('dashboard');
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('usuarios');

  // XP local de los juegos simulados (se reemplaza cuando exista el backend de Persona B).
  const [xpDelta, setXpDelta] = useState<number>(0);
  const [completedDilemaIds, setCompletedDilemaIds] = useState<string[]>([]);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [progressReady, setProgressReady] = useState<boolean>(false);
  const [streakDays] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Búsqueda enviada desde la barra superior y término abierto en el glosario
  const [submittedSearch, setSubmittedSearch] = useState<string>('');
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [chatbotPrompt, setChatbotPrompt] = useState<string>('');

  const [students, setStudents] = useState<TeacherStudent[]>(
    INITIAL_TEACHER_STUDENTS
  );
  const [modules, setModules] = useState<TeacherModule[]>(
    INITIAL_TEACHER_MODULES
  );

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("lexcode_student_progress_v1");
      if (raw) {
        const data = JSON.parse(raw) as {
          xpDelta?: number;
          completedDilemaIds?: string[];
          completedActivities?: string[];
          studentRoute?: StudentRoute;
        };
        if (typeof data.xpDelta === "number") setXpDelta(data.xpDelta);
        if (Array.isArray(data.completedDilemaIds)) {
          setCompletedDilemaIds(data.completedDilemaIds);
        }
        if (Array.isArray(data.completedActivities)) {
          setCompletedActivities(data.completedActivities);
        }
        if (data.studentRoute) {
          setStudentRoute(data.studentRoute);
        }
        if ((data as { teacherRoute?: TeacherRoute }).teacherRoute) {
          setTeacherRoute((data as { teacherRoute?: TeacherRoute }).teacherRoute!);
        }
        if (Array.isArray((data as { students?: TeacherStudent[] }).students)) {
          setStudents((data as { students?: TeacherStudent[] }).students!);
        }
        if (Array.isArray((data as { modules?: TeacherModule[] }).modules)) {
          setModules((data as { modules?: TeacherModule[] }).modules!);
        }
      }
    } catch {
      // Ignora error de lectura de storage
    } finally {
      setProgressReady(true);
    }
  }, []);

  React.useEffect(() => {
    if (!progressReady) return;
    try {
      window.localStorage.setItem(
        "lexcode_student_progress_v1",
        JSON.stringify({
          xpDelta,
          completedDilemaIds,
          completedActivities,
          studentRoute,
          teacherRoute,
          students,
          modules,
        })
      );
    } catch {
      // Ignora error de escritura en storage
    }
  }, [progressReady, xpDelta, completedDilemaIds, completedActivities, studentRoute, teacherRoute, students, modules]);

  const handleCompleteDilema = (dilemaId: string, isCorrect: boolean) => {
    if (!isCorrect) return;
    setCompletedDilemaIds((prev) => (prev.includes(dilemaId) ? prev : [...prev, dilemaId]));
  };

  const handleCompleteActivity = (activityId: string) => {
    setCompletedActivities((prev) =>
      prev.includes(activityId) ? prev : [...prev, activityId]
    );
  };

  const handleUpdateXp = (delta: number) => {
    setXpDelta((prev) => prev + delta);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSubmittedSearch(searchQuery.trim());
    setStudentRoute('busqueda');
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

  const role: UserRole = profile.role;
  const firstName = profile.full_name.split(' ')[0] || profile.username;
  const xp = Math.max(0, profile.xp_total + xpDelta);

  const handleLogout = async () => {
    await logout();
    setPublicStage('landing');
    setSearchQuery('');
    setSubmittedSearch('');
    setGlossarySearch('');
    setChatbotPrompt('');
    setStudentRoute('dashboard');
    setTeacherRoute('dashboard');
    setAdminRoute('usuarios');
  };

  const openGlossary = (term: string) => {
    setGlossarySearch(term);
    setStudentRoute('glosario');
  };

  const topBarTitle =
    role === 'student' ? STUDENT_TITLES[studentRoute] : role === 'admin' ? ADMIN_TITLES[adminRoute] : 'Dashboard';

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
        adminRoute={adminRoute}
        onSelectStudentRoute={(route) => {
          if (route === 'glosario') setGlossarySearch('');
          setStudentRoute(route);
        }}
        onSelectTeacherRoute={(route) => setTeacherRoute(route)}
        onSelectAdminRoute={(route) => setAdminRoute(route)}
        userName={profile.full_name}
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
                  completedDilemaIds={completedDilemaIds}
                  completedActivities={completedActivities}
                  onNavigate={(r) => setStudentRoute(r)}
                />
              )}
              {studentRoute === 'dilemas' && (
                <DilemasView
                  xp={xp}
                  completedDilemaIds={completedDilemaIds}
                  onUpdateXp={handleUpdateXp}
                  onCompleteDilema={handleCompleteDilema}
                />
              )}
              {studentRoute === 'actividades' && (
                <ActividadesView
                  xp={xp}
                  completedActivities={completedActivities}
                  onUpdateXp={handleUpdateXp}
                  onCompleteActivity={handleCompleteActivity}
                />
              )}
              {studentRoute === 'glosario' && (
                <GlosarioView
                  externalSearch={glossarySearch}
                  onAskLexis={handleAskLexisFromGlossary}
                />
              )}
              {studentRoute === 'insignias' && (
                <InsigniasView
                  xp={xp}
                  completedDilemaIds={completedDilemaIds}
                  completedActivities={completedActivities}
                />
              )}
              {studentRoute === 'chatbot' && (
                <ChatbotLexisView
                  userName={profile.full_name}
                  initialPrompt={chatbotPrompt}
                  onConsumePrompt={() => setChatbotPrompt('')}
                  onOpenGlossary={openGlossary}
                />
              )}
              {studentRoute === 'perfil' && (
                <PerfilView xp={xp} onLogout={handleLogout} />
              )}
              {studentRoute === 'busqueda' && (
                <BusquedaView
                  query={submittedSearch}
                  onOpenGlossary={openGlossary}
                  onAskLexis={handleAskLexisFromGlossary}
                  onNavigate={(r) => setStudentRoute(r)}
                />
              )}
            </>
          ) : role === 'admin' ? (
            <>
              {adminRoute === 'usuarios' && <AdminUsersView />}
              {adminRoute === 'arco' && <AdminArcoView />}
              {adminRoute === 'reportes' && <AdminReportsView />}
              {adminRoute === 'glosario' && <AdminGlossaryView />}
              {adminRoute === 'lexis' && <AdminLexisView />}
              {adminRoute === 'documentos' && <AdminDocumentsView />}
              {adminRoute === 'bitacora' && <AdminAuditView />}
              {adminRoute === 'perfil' && <PerfilView onLogout={handleLogout} />}
            </>
          ) : (
            <>
              {teacherRoute === 'dashboard' && (
                <DashboardTeacher
                  studentsCount={students.length}
                  modulesCount={modules.length}
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
              {teacherRoute === 'configuracion' && <ConfiguracionDocenteView onLogout={handleLogout} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
