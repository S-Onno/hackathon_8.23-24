import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  createAccountWithSession,
  setSessionCookie,
} from "@/lib/auth";
import {
  internalServerError,
  jsonError,
} from "@/lib/api-response";
import { hashPassword } from "@/lib/password";
import {
  createRateLimitResponse,
  enforceAuthRateLimit,
  readSecureJsonObject,
  tryAcquirePasswordWorkSlot,
} from "@/lib/request-security";
import { validateSignupInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const parsed = await readSecureJsonObject(request);
    if (!parsed.ok) {
      return parsed.response;
    }

    const rateLimitResponse = enforceAuthRateLimit(
      request,
      "signup",
      parsed.body.email,
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const validated = validateSignupInput(parsed.body);
    if (!validated.success) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "入力内容を確認してください。",
        validated.errors,
      );
    }

    const releasePasswordWork = tryAcquirePasswordWorkSlot();
    if (!releasePasswordWork) {
      return createRateLimitResponse(1);
    }

    let passwordHash: string;
    try {
      passwordHash = await hashPassword(validated.data.password);
    } finally {
      releasePasswordWork();
    }
    const { account, credential } = await createAccountWithSession({
      email: validated.data.email,
      username: validated.data.username,
      passwordHash,
    });
    const response = NextResponse.json({ account }, { status: 201 });
    setSessionCookie(response, credential);
    return response;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError(
        409,
        "EMAIL_ALREADY_EXISTS",
        "このメールアドレスは既に登録されています。",
      );
    }
    return internalServerError(error, "auth/signup");
  }
}
