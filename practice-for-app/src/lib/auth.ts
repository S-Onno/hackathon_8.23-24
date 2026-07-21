import type { Account } from "@prisma/client";
import type { NextRequest, NextResponse } from "next/server";

import prisma from "@/db/prisma";
import {
  createSessionCredential,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifySessionCookie,
} from "@/lib/session-cookie";

export type PublicAccount = Pick<Account, "id" | "email" | "username">;

export type AuthenticatedSession = {
  account: PublicAccount;
  sessionId: number;
};

export function toPublicAccount(account: Account): PublicAccount {
  return {
    id: account.id,
    email: account.email,
    username: account.username,
  };
}

export async function createAccountSession(accountId: number) {
  const credential = await createSessionCredential();
  const now = new Date();

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { expiresAt: { lte: now } } }),
    prisma.session.create({
      data: {
        tokenHash: credential.tokenHash,
        expiresAt: credential.expiresAt,
        accountId,
      },
    }),
  ]);

  return credential;
}

export async function createAccountWithSession(data: {
  email: string;
  username: string;
  passwordHash: string;
}) {
  const credential = await createSessionCredential();
  const now = new Date();

  const account = await prisma.$transaction(async (transaction) => {
    await transaction.session.deleteMany({ where: { expiresAt: { lte: now } } });
    const createdAccount = await transaction.account.create({ data });
    await transaction.session.create({
      data: {
        tokenHash: credential.tokenHash,
        expiresAt: credential.expiresAt,
        accountId: createdAccount.id,
      },
    });
    return createdAccount;
  });

  return { account: toPublicAccount(account), credential };
}

export function setSessionCookie(
  response: NextResponse,
  credential: { cookieValue: string; expiresAt: Date },
) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: credential.cookieValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: credential.expiresAt,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function authenticateRequest(
  request: NextRequest,
): Promise<AuthenticatedSession | null> {
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const credential = await verifySessionCookie(cookieValue);
  if (!credential) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { tokenHash: credential.tokenHash },
    include: { account: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  return {
    account: toPublicAccount(session.account),
    sessionId: session.id,
  };
}

export async function deleteRequestSession(request: NextRequest) {
  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const credential = await verifySessionCookie(cookieValue);
  if (!credential) {
    return;
  }

  await prisma.session.deleteMany({
    where: { tokenHash: credential.tokenHash },
  });
}
