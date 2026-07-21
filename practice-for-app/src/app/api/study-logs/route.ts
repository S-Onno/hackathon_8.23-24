import { NextRequest, NextResponse } from "next/server";

import prisma from "@/db/prisma";
import { authenticateRequest } from "@/lib/auth";
import {
  internalServerError,
  jsonError,
} from "@/lib/api-response";
import { readSecureJsonObject } from "@/lib/request-security";
import { validateStudyLogInput } from "@/lib/validation";
import {
  getJstSummaryWindow,
  summarizeStudyLogs,
} from "@/lib/study-log-summary";

export const runtime = "nodejs";

const MAX_STUDY_LOGS_PER_ACCOUNT = 10_000;

const studyLogFields = {
  id: true,
  clientSessionId: true,
  subject: true,
  durationSeconds: true,
  startedAt: true,
  endedAt: true,
  createdAt: true,
} as const;

export async function GET(request: NextRequest) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) {
      return jsonError(401, "UNAUTHENTICATED", "ログインが必要です。");
    }

    const rawLimit = request.nextUrl.searchParams.get("limit");
    const limit = rawLimit === null ? 50 : Number(rawLimit);
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "limitは1〜100の整数で指定してください。",
        { limit: ["limitは1〜100の整数で指定してください。"] },
      );
    }

    const now = new Date();
    const summaryWindow = getJstSummaryWindow(now);

    const [logs, summaryLogs] = await prisma.$transaction([
      prisma.studyLog.findMany({
        where: { ownerId: authentication.account.id },
        orderBy: { startedAt: "desc" },
        take: limit,
        select: studyLogFields,
      }),
      prisma.studyLog.findMany({
        where: {
          ownerId: authentication.account.id,
          startedAt: { lt: summaryWindow.queryEnd },
          endedAt: { gt: summaryWindow.queryStart },
        },
        select: {
          subject: true,
          durationSeconds: true,
          startedAt: true,
          endedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      logs,
      summary: summarizeStudyLogs(summaryLogs, now),
    });
  } catch (error) {
    return internalServerError(error, "study-logs/get");
  }
}

export async function POST(request: NextRequest) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) {
      return jsonError(401, "UNAUTHENTICATED", "ログインが必要です。");
    }

    const parsed = await readSecureJsonObject(request);
    if (!parsed.ok) {
      return parsed.response;
    }
    const validated = validateStudyLogInput(parsed.body);
    if (!validated.success) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "入力内容を確認してください。",
        validated.errors,
      );
    }

    const uniqueSession = {
      ownerId: authentication.account.id,
      clientSessionId: validated.data.clientSessionId,
    };
    const existingStudyLog = await prisma.studyLog.findUnique({
      where: { ownerId_clientSessionId: uniqueSession },
      select: studyLogFields,
    });
    if (existingStudyLog) {
      return NextResponse.json(existingStudyLog);
    }

    const studyLogCount = await prisma.studyLog.count({
      where: { ownerId: authentication.account.id },
    });
    if (studyLogCount >= MAX_STUDY_LOGS_PER_ACCOUNT) {
      return jsonError(
        409,
        "STUDY_LOG_LIMIT_REACHED",
        `学習記録は${MAX_STUDY_LOGS_PER_ACCOUNT}件まで保存できます。`,
      );
    }

    const studyLog = await prisma.studyLog.upsert({
      where: { ownerId_clientSessionId: uniqueSession },
      update: {},
      create: {
        ...validated.data,
        ownerId: authentication.account.id,
      },
      select: studyLogFields,
    });
    return NextResponse.json(studyLog, { status: 201 });
  } catch (error) {
    return internalServerError(error, "study-logs/post");
  }
}
