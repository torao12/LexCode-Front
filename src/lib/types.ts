/** Tipos de las respuestas de la API (LexCode-Back). */

export type ApiRole = 'student' | 'teacher' | 'admin';
export type AccountStatus = 'pending_guardian' | 'active' | 'suspended' | 'deleted';

export interface SessionProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: ApiRole;
  status: AccountStatus;
  avatar_url: string | null;
  level: number;
  xp_total: number;
}

export interface FullProfile extends SessionProfile {
  student_number: string | null;
  major: string | null;
  semester: number | null;
  interest_area: string | null;
  current_streak: number;
  longest_streak: number;
  public_ranking: boolean;
  untimed_mode: boolean;
  institution: { id: string; name: string; short_name: string | null } | null;
  created_at: string;
}

export interface GlossaryTermDto {
  id: string;
  slug: string;
  term: string;
  letter: string;
  category: string;
  definition: string;
  legal_citation: string;
  lexis_tip: string | null;
}

export interface LexisReply {
  messageId: number;
  found: boolean;
  expression: 'happy' | 'neutral' | 'sad' | 'angry' | 'book_bulb' | 'wave';
  body: string;
  legalReference: { law: string; article: string | null; url: string | null } | null;
  glossarySlug: string | null;
  suggestions: string[];
}

export interface ConsentState {
  type: string;
  granted: boolean;
  document_version: string;
  updated_at: string;
}

export interface RegisterResult {
  userId: string;
  status: AccountStatus;
  emailConfirmationRequired: boolean;
  session: { accessToken: string; refreshToken: string; expiresAt: number | null } | null;
}

/** Títulos de nivel (tabla public.levels). */
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Aprendiz digital',
  2: 'Explorador legal',
  3: 'Usuario consciente',
  4: 'Analista ético',
  5: 'Auditor junior',
  6: 'Defensor de la privacidad',
  7: 'Guardián de datos',
  8: 'Auditor senior',
  9: 'Experto legal TI',
  10: 'Maestro LexCode',
};
