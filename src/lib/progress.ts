import { api, ApiError } from './api';

export interface StudentProgressSnapshot {
  xpDelta: number;
  xpTotal?: number;
  completedDilemaIds: string[];
  completedActivities: string[];
}

export const EMPTY_PROGRESS: StudentProgressSnapshot = {
  xpDelta: 0,
  completedDilemaIds: [],
  completedActivities: [],
};

export function getProgressStorageKey(userId: string | number | null | undefined): string {
  return `lexcode_student_progress_v1_${userId ?? 'guest'}`;
}

export function readLocalProgress(userId: string | number | null | undefined): StudentProgressSnapshot {
  try {
    const key = getProgressStorageKey(userId);
    const raw = window.localStorage.getItem(key) ?? window.localStorage.getItem('lexcode_student_progress_v1');
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgressSnapshot>;
    return {
      xpDelta: typeof parsed.xpDelta === 'number' ? parsed.xpDelta : 0,
      xpTotal: typeof parsed.xpTotal === 'number' ? parsed.xpTotal : undefined,
      completedDilemaIds: Array.isArray(parsed.completedDilemaIds) ? parsed.completedDilemaIds : [],
      completedActivities: Array.isArray(parsed.completedActivities) ? parsed.completedActivities : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function writeLocalProgress(
  userId: string | number | null | undefined,
  snapshot: StudentProgressSnapshot,
): void {
  try {
    window.localStorage.setItem(getProgressStorageKey(userId), JSON.stringify(snapshot));
  } catch {
    // Ignora errores de cuota o modo privado
  }
}

function isMissingEndpoint(err: unknown): boolean {
  return err instanceof ApiError && (err.status === 404 || err.status === 405 || err.status === 0);
}

export async function fetchRemoteProgress(): Promise<StudentProgressSnapshot | null> {
  try {
    const data = await api<Partial<StudentProgressSnapshot>>('/progress');
    return {
      xpDelta: typeof data?.xpDelta === 'number' ? data.xpDelta : 0,
      xpTotal: typeof data?.xpTotal === 'number' ? data.xpTotal : undefined,
      completedDilemaIds: Array.isArray(data?.completedDilemaIds) ? data.completedDilemaIds : [],
      completedActivities: Array.isArray(data?.completedActivities) ? data.completedActivities : [],
    };
  } catch (err) {
    if (isMissingEndpoint(err)) return null;
    return null;
  }
}

export async function syncDilemaCompletion(payload: {
  dilemaId: string;
  isCorrect: boolean;
  xpDelta: number;
}): Promise<StudentProgressSnapshot | null> {
  try {
    return await api<StudentProgressSnapshot>('/progress/dilemmas', {
      method: 'POST',
      body: payload,
    });
  } catch (err) {
    if (isMissingEndpoint(err)) return null;
    return null;
  }
}

export async function syncActivityCompletion(payload: {
  activityId: string;
  xpDelta?: number;
}): Promise<StudentProgressSnapshot | null> {
  try {
    return await api<StudentProgressSnapshot>('/progress/activities', {
      method: 'POST',
      body: payload,
    });
  } catch (err) {
    if (isMissingEndpoint(err)) return null;
    return null;
  }
}

export async function syncQuizCompletion(payload: {
  moduleId: string;
  xpDelta?: number;
}): Promise<StudentProgressSnapshot | null> {
  try {
    return await api<StudentProgressSnapshot>('/progress/quizzes', {
      method: 'POST',
      body: payload,
    });
  } catch (err) {
    if (isMissingEndpoint(err)) return null;
    return null;
  }
}
