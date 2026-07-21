import { NextResponse } from "next/server";

type ValidationErrors = Record<string, string[]>;

export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: ValidationErrors,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status },
  );
}

export function internalServerError(error: unknown, context: string) {
  console.error(`[${context}]`, error);

  if (
    error instanceof Error &&
    (error.message.includes("SESSION_SECRET is required") ||
      error.message.includes("SESSION_SECRET must contain"))
  ) {
    return jsonError(
      500,
      "SERVER_CONFIGURATION_ERROR",
      error.message,
    );
  }

  return jsonError(
    500,
    "INTERNAL_ERROR",
    "サーバーでエラーが発生しました。時間をおいて再度お試しください。",
  );
}
