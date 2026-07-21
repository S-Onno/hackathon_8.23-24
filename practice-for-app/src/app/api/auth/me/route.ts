import { NextRequest, NextResponse } from "next/server";

import { authenticateRequest } from "@/lib/auth";
import { internalServerError, jsonError } from "@/lib/api-response";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) {
      return jsonError(401, "UNAUTHENTICATED", "ログインが必要です。");
    }

    return NextResponse.json({ account: authentication.account });
  } catch (error) {
    return internalServerError(error, "auth/me");
  }
}
