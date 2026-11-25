export type UserRole = 'student' | 'teacher' | 'admin';

export type LexisExpression =
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'angry'
  | 'book_bulb'
  | 'wave';

export type StudentRoute =
  | 'dashboard'
  | 'dilemas'
  | 'actividades'
  | 'glosario'
  | 'insignias'
  | 'chatbot'
  | 'perfil'
  | 'busqueda';

export type AdminRoute =
  | 'usuarios'
  | 'arco'
  | 'reportes'
  | 'glosario'
  | 'lexis'
  | 'documentos'
  | 'bitacora'
  | 'perfil';

export type TeacherRoute =
  | 'dashboard'
  | 'alumnos'
  | 'modulos'
  | 'configuracion';

export interface DilemaOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
  xpDelta: number;
  feedbackTitle: string;
  feedbackText: string;
}

export interface DilemaCase {
  id: string;
  number: number;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  lawQuote: string;
  status: 'active' | 'locked' | 'completed';
  options: DilemaOption[];
}

export interface QuizQuestion {
  id: string;
  moduleTag: string;
  question: string;
  options: {
    id: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctId: 'A' | 'B' | 'C' | 'D';
  xpCorrect: number;
  xpWrong: number;
  explanation: string;
}

export interface QuizModuleCard {
  id: string;
  title: string;
  questionsCount: number;
  description: string;
  xpReward: string;
  accent: 'cyan' | 'pink' | 'muted';
  completedBadge?: string;
}

export interface MemoramaCardItem {
  id: string;
  pairId: string;
  side: 'concept' | 'definition';
  content: string;
}

export interface ClozeItem {
  id: string;
  ruleTitle: string;
  prefix: string;
  suffix: string;
  answer: string;
  options: string[];
}

export interface GlossaryTerm {
  id: string;
  letter: string;
  category: string;
  term: string;
  definition: string;
  legalRef: string;
  lexisTip: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  earned: boolean;
  variant: 'check_ribbon' | 'star_laurel' | 'flame_lock' | 'doc_lock';
  meta?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
}

export interface TeacherStudent {
  id: string;
  name: string;
  matricula: string;
  currentModule: string;
  average: number;
  status: 'Activo' | 'Pendiente';
  group: string;
}

export type ModuleInteractionType =
  | 'Opción Múltiple (Reactivos Teóricos)'
  | 'Completar Palabras (Espacios en Blanco)'
  | 'Memorama (Conexiones Legales)';

export interface TeacherModule {
  id: string;
  order: string;
  name: string;
  standard: string;
  enrolledCount: number;
  interactionType: ModuleInteractionType;
  clozeItems: { id: string; template: string }[];
  memoramaPairs: { id: string; concept: string; definition: string }[];
  quizQuestions: {
    id: string;
    question: string;
    correctAnswer: string;
    distractors: string[];
  }[];
}
