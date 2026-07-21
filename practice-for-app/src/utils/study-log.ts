import type {
  DailyStudySummary,
  StudyLog,
  StudyLogsResponse,
  SubjectStudySummary,
} from '@/types/study-log';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function isStudyLog(value: unknown): value is StudyLog {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.clientSessionId === 'string' &&
    typeof value.subject === 'string' &&
    isNonNegativeNumber(value.durationSeconds) &&
    typeof value.startedAt === 'string' &&
    typeof value.endedAt === 'string' &&
    typeof value.createdAt === 'string'
  );
}

function isDailySummary(value: unknown): value is DailyStudySummary {
  return (
    isRecord(value) &&
    typeof value.date === 'string' &&
    isNonNegativeNumber(value.durationSeconds)
  );
}

function isSubjectSummary(value: unknown): value is SubjectStudySummary {
  return (
    isRecord(value) &&
    typeof value.subject === 'string' &&
    isNonNegativeNumber(value.durationSeconds)
  );
}

export function isStudyLogsResponse(value: unknown): value is StudyLogsResponse {
  if (!isRecord(value) || !Array.isArray(value.logs) || !isRecord(value.summary)) {
    return false;
  }

  const { summary } = value;
  return (
    value.logs.every(isStudyLog) &&
    isNonNegativeNumber(summary.todaySeconds) &&
    isNonNegativeNumber(summary.weekSeconds) &&
    isNonNegativeNumber(summary.monthSeconds) &&
    Array.isArray(summary.dailyWeek) &&
    summary.dailyWeek.every(isDailySummary) &&
    Array.isArray(summary.dailyMonth) &&
    summary.dailyMonth.every(isDailySummary) &&
    Array.isArray(summary.bySubject) &&
    summary.bySubject.every(isSubjectSummary)
  );
}

export async function fetchStudyLogs(signal?: AbortSignal): Promise<StudyLogsResponse> {
  const response = await fetch('/api/study-logs', { signal });

  if (!response.ok) {
    throw new Error(`学習記録の取得に失敗しました（${response.status}）`);
  }

  const body: unknown = await response.json();
  if (!isStudyLogsResponse(body)) {
    throw new Error('学習記録のデータ形式が正しくありません');
  }

  return body;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
