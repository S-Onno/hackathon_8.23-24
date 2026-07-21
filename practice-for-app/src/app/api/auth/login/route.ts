import { NextRequest, NextResponse } from "next/server";

import prisma from "@/db/prisma";
import {
  createAccountSession,
  setSessionCookie,
  toPublicAccount,
} from "@/lib/auth";
import {
  internalServerError,
  jsonError,
} from "@/lib/api-response";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createRateLimitResponse,
  enforceAuthRateLimit,
  readSecureJsonObject,
  tryAcquirePasswordWorkSlot,
} from "@/lib/request-security";
import { validateLoginInput } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const parsed = await readSecureJsonObject(request);
    if (!parsed.ok) {
      return parsed.response;
    }

    const rateLimitResponse = enforceAuthRateLimit(
      request,
      "login",
      parsed.body.email,
    );
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const validated = validateLoginInput(parsed.body);
    if (!validated.success) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "入力内容を確認してください。",
        validated.errors,
      );
    }

    const account = await prisma.account.findUnique({
      where: { email: validated.data.email },
    });
    const releasePasswordWork = tryAcquirePasswordWorkSlot();
    if (!releasePasswordWork) {
      return createRateLimitResponse(1);
    }

    let passwordMatches = false;
    try {
      if (!account) {
        await hashPassword(validated.data.password);
      } else {
        passwordMatches = await verifyPassword(
          validated.data.password,
          account.passwordHash,
        );
      }
    } finally {
      releasePasswordWork();
    }

    if (!account || !passwordMatches) {
      return jsonError(
        401,
        "INVALID_CREDENTIALS",
        "メールアドレスまたはパスワードが正しくありません。",
      );
    }

    const credential = await createAccountSession(account.id);
    const response = NextResponse.json({ account: toPublicAccount(account) });
    setSessionCookie(response, credential);
    return response;
  } catch (error) {
    return internalServerError(error, "auth/login");
  }
}
