import { NextRequest, NextResponse } from "next/server";

import { clearSessionCookie, deleteRequestSession } from "@/lib/auth";
import { internalServerError } from "@/lib/api-response";
import { guardSameOriginMutation } from "@/lib/request-security";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const originError = guardSameOriginMutation(request);
    if (originError) {
      return originError;
    }

    await deleteRequestSession(request);
    const response = new NextResponse(null, { status: 204 });
    clearSessionCookie(response);
    return response;
  } catch (error) {
    return internalServerError(error, "auth/logout");
  }
}
