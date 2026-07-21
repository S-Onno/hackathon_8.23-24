export type CreateStudyLogRequest = {
  clientSessionId: string;
  subject: string;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
};

export type StudyLog = {
  id: number;
  clientSessionId: string;
  subject: string;
  durationSeconds: number;
  startedAt: string;
  endedAt: string;
  createdAt: string;
};

export type DailyStudySummary = {
  date: string;
  durationSeconds: number;
};

export type SubjectStudySummary = {
  subject: string;
  durationSeconds: number;
};

export type StudyLogSummary = {
  todaySeconds: number;
  weekSeconds: number;
  monthSeconds: number;
  dailyWeek: DailyStudySummary[];
  dailyMonth: DailyStudySummary[];
  bySubject: SubjectStudySummary[];
};

export type StudyLogsResponse = {
  logs: StudyLog[];
  summary: StudyLogSummary;
};
