import assert from "node:assert/strict";
import test from "node:test";

import {
  getJstSummaryWindow,
  summarizeStudyLogs,
} from "../src/lib/study-log-summary.ts";
import { isStudyLogsResponse } from "../src/utils/study-log.ts";

function dailyValue(series, date) {
  return series.find((item) => item.date === date)?.durationSeconds;
}

test("JST day, Monday week, and month boundaries are expressed in UTC correctly", () => {
  const window = getJstSummaryWindow(new Date("2026-07-21T03:00:00.000Z"));

  assert.equal(window.todayStart.toISOString(), "2026-07-20T15:00:00.000Z");
  assert.equal(window.tomorrowStart.toISOString(), "2026-07-21T15:00:00.000Z");
  assert.equal(window.weekStart.toISOString(), "2026-07-19T15:00:00.000Z");
  assert.equal(window.nextWeekStart.toISOString(), "2026-07-26T15:00:00.000Z");
  assert.equal(window.monthStart.toISOString(), "2026-06-30T15:00:00.000Z");
  assert.equal(window.nextMonthStart.toISOString(), "2026-07-31T15:00:00.000Z");
  assert.equal(window.queryStart.toISOString(), "2026-06-30T15:00:00.000Z");
});

test("duration is proportionally allocated across JST day and month boundaries", () => {
  const summary = summarizeStudyLogs(
    [
      {
        subject: "security",
        durationSeconds: 3600,
        startedAt: new Date("2026-07-31T14:30:00.000Z"),
        endedAt: new Date("2026-07-31T15:30:00.000Z"),
      },
      {
        subject: "Next.js",
        durationSeconds: 1200,
        startedAt: new Date("2026-08-01T14:30:00.000Z"),
        endedAt: new Date("2026-08-01T15:30:00.000Z"),
      },
    ],
    new Date("2026-08-01T16:00:00.000Z"),
  );

  assert.equal(summary.todaySeconds, 600);
  assert.equal(summary.weekSeconds, 4800);
  assert.equal(summary.monthSeconds, 3000);
  assert.equal(summary.dailyWeek.length, 7);
  assert.equal(summary.dailyMonth.length, 31);
  assert.equal(dailyValue(summary.dailyMonth, "2026-08-01"), 2400);
  assert.equal(dailyValue(summary.dailyMonth, "2026-08-02"), 600);
  assert.deepEqual(summary.bySubject, [
    { subject: "security", durationSeconds: 1800 },
    { subject: "Next.js", durationSeconds: 1200 },
  ]);
});

test("a session crossing the Monday boundary is split between weekly buckets", () => {
  const summary = summarizeStudyLogs(
    [
      {
        subject: "math",
        durationSeconds: 3600,
        startedAt: new Date("2026-08-02T14:30:00.000Z"),
        endedAt: new Date("2026-08-02T15:30:00.000Z"),
      },
    ],
    new Date("2026-08-02T16:00:00.000Z"),
  );

  assert.equal(summary.todaySeconds, 1800);
  assert.equal(summary.weekSeconds, 1800);
  assert.equal(summary.monthSeconds, 3600);
  assert.equal(dailyValue(summary.dailyWeek, "2026-08-03"), 1800);
  assert.equal(dailyValue(summary.dailyMonth, "2026-08-02"), 1800);
  assert.equal(dailyValue(summary.dailyMonth, "2026-08-03"), 1800);
});

test("subject series is capped and combines the remainder", () => {
  const logs = Array.from({ length: 10 }, (_, index) => ({
    subject: `subject-${index + 1}`,
    durationSeconds: 60,
    startedAt: new Date("2026-07-21T00:00:00.000Z"),
    endedAt: new Date("2026-07-21T00:01:00.000Z"),
  }));
  const summary = summarizeStudyLogs(
    logs,
    new Date("2026-07-21T01:00:00.000Z"),
  );

  assert.equal(summary.bySubject.length, 9);
  assert.deepEqual(summary.bySubject.at(-1), {
    subject: "その他",
    durationSeconds: 120,
  });
});

test("runtime response validation requires the idempotency key and split chart series", () => {
  const response = {
    logs: [
      {
        id: 1,
        clientSessionId: "550e8400-e29b-41d4-a716-446655440000",
        subject: "Next.js",
        durationSeconds: 600,
        startedAt: "2026-07-21T00:00:00.000Z",
        endedAt: "2026-07-21T00:10:00.000Z",
        createdAt: "2026-07-21T00:10:00.000Z",
      },
    ],
    summary: {
      todaySeconds: 600,
      weekSeconds: 600,
      monthSeconds: 600,
      dailyWeek: [{ date: "2026-07-21", durationSeconds: 600 }],
      dailyMonth: [{ date: "2026-07-21", durationSeconds: 600 }],
      bySubject: [{ subject: "Next.js", durationSeconds: 600 }],
    },
  };

  assert.equal(isStudyLogsResponse(response), true);
  assert.equal(
    isStudyLogsResponse({
      ...response,
      summary: { ...response.summary, dailyWeek: undefined },
    }),
    false,
  );
});
