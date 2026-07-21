import type {
  DailyStudySummary,
  StudyLogSummary,
} from "@/types/study-log";

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_SUBJECT_SERIES = 8;

export type StudyLogForSummary = {
  subject: string;
  durationSeconds: number;
  startedAt: Date;
  endedAt: Date;
};

export type JstSummaryWindow = {
  todayStart: Date;
  tomorrowStart: Date;
  weekStart: Date;
  nextWeekStart: Date;
  monthStart: Date;
  nextMonthStart: Date;
  queryStart: Date;
  queryEnd: Date;
};

function jstDateParts(date: Date) {
  const shifted = new Date(date.getTime() + JST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    date: shifted.getUTCDate(),
    day: shifted.getUTCDay(),
  };
}

function fromJstDateParts(year: number, month: number, date: number) {
  return new Date(Date.UTC(year, month, date) - JST_OFFSET_MS);
}

export function startOfJstDay(date: Date) {
  const parts = jstDateParts(date);
  return fromJstDateParts(parts.year, parts.month, parts.date);
}

export function jstDateKey(date: Date) {
  return new Date(date.getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
}

export function getJstSummaryWindow(now: Date): JstSummaryWindow {
  if (Number.isNaN(now.getTime())) {
    throw new RangeError("now must be a valid Date");
  }

  const parts = jstDateParts(now);
  const todayStart = fromJstDateParts(parts.year, parts.month, parts.date);
  const tomorrowStart = new Date(todayStart.getTime() + DAY_MS);
  const daysSinceMonday = parts.day === 0 ? 6 : parts.day - 1;
  const weekStart = new Date(todayStart.getTime() - daysSinceMonday * DAY_MS);
  const nextWeekStart = new Date(weekStart.getTime() + 7 * DAY_MS);
  const monthStart = fromJstDateParts(parts.year, parts.month, 1);
  const nextMonthStart = fromJstDateParts(parts.year, parts.month + 1, 1);

  return {
    todayStart,
    tomorrowStart,
    weekStart,
    nextWeekStart,
    monthStart,
    nextMonthStart,
    queryStart: new Date(Math.min(weekStart.getTime(), monthStart.getTime())),
    queryEnd: new Date(now),
  };
}

function allocatedSeconds(
  log: StudyLogForSummary,
  periodStart: Date,
  periodEnd: Date,
) {
  const logStart = log.startedAt.getTime();
  const logEnd = log.endedAt.getTime();
  const wallDuration = logEnd - logStart;
  if (
    !Number.isFinite(log.durationSeconds) ||
    log.durationSeconds < 0 ||
    !Number.isFinite(logStart) ||
    !Number.isFinite(logEnd) ||
    wallDuration <= 0 ||
    periodEnd <= periodStart
  ) {
    return 0;
  }

  const overlapStart = Math.max(logStart, periodStart.getTime());
  const overlapEnd = Math.min(logEnd, periodEnd.getTime());
  if (overlapEnd <= overlapStart) {
    return 0;
  }

  return log.durationSeconds * ((overlapEnd - overlapStart) / wallDuration);
}

function totalForPeriod(
  logs: StudyLogForSummary[],
  periodStart: Date,
  periodEnd: Date,
) {
  return Math.round(
    logs.reduce(
      (total, log) => total + allocatedSeconds(log, periodStart, periodEnd),
      0,
    ),
  );
}

function dailySeries(
  logs: StudyLogForSummary[],
  periodStart: Date,
  dayCount: number,
  now: Date,
): DailyStudySummary[] {
  return Array.from({ length: dayCount }, (_, index) => {
    const dayStart = new Date(periodStart.getTime() + index * DAY_MS);
    const dayEnd = new Date(
      Math.min(dayStart.getTime() + DAY_MS, now.getTime()),
    );
    return {
      date: jstDateKey(dayStart),
      durationSeconds: totalForPeriod(logs, dayStart, dayEnd),
    };
  });
}

export function summarizeStudyLogs(
  logs: StudyLogForSummary[],
  now: Date,
): StudyLogSummary {
  const window = getJstSummaryWindow(now);
  const todayEnd = new Date(
    Math.min(now.getTime(), window.tomorrowStart.getTime()),
  );
  const weekEnd = new Date(
    Math.min(now.getTime(), window.nextWeekStart.getTime()),
  );
  const monthEnd = new Date(
    Math.min(now.getTime(), window.nextMonthStart.getTime()),
  );
  const monthDayCount = Math.round(
    (window.nextMonthStart.getTime() - window.monthStart.getTime()) / DAY_MS,
  );

  const subjectSeconds = new Map<string, number>();
  for (const log of logs) {
    const seconds = allocatedSeconds(log, window.monthStart, monthEnd);
    if (seconds > 0) {
      subjectSeconds.set(
        log.subject,
        (subjectSeconds.get(log.subject) ?? 0) + seconds,
      );
    }
  }

  const sortedSubjects = Array.from(
    subjectSeconds,
    ([subject, durationSeconds]) => ({
      subject,
      durationSeconds: Math.round(durationSeconds),
    }),
  ).sort((left, right) => right.durationSeconds - left.durationSeconds);
  const visibleSubjects = sortedSubjects.slice(0, MAX_SUBJECT_SERIES);
  const otherSeconds = sortedSubjects
    .slice(MAX_SUBJECT_SERIES)
    .reduce((total, item) => total + item.durationSeconds, 0);
  if (otherSeconds > 0) {
    visibleSubjects.push({ subject: "その他", durationSeconds: otherSeconds });
  }

  return {
    todaySeconds: totalForPeriod(logs, window.todayStart, todayEnd),
    weekSeconds: totalForPeriod(logs, window.weekStart, weekEnd),
    monthSeconds: totalForPeriod(logs, window.monthStart, monthEnd),
    dailyWeek: dailySeries(logs, window.weekStart, 7, now),
    dailyMonth: dailySeries(logs, window.monthStart, monthDayCount, now),
    bySubject: visibleSubjects,
  };
}
