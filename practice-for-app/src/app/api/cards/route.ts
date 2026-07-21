import { NextRequest, NextResponse } from "next/server";

import prisma from "@/db/prisma";
import { authenticateRequest } from "@/lib/auth";
import {
  internalServerError,
  jsonError,
} from "@/lib/api-response";
import { readSecureJsonObject } from "@/lib/request-security";
import { validateCardInput, validatePositiveIntegerId } from "@/lib/validation";

export const runtime = "nodejs";

const MAX_CARDS_PER_ACCOUNT = 500;

const cardFields = {
  id: true,
  question: true,
  answer: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function GET(request: NextRequest) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) {
      return jsonError(401, "UNAUTHENTICATED", "ログインが必要です。");
    }

    const cards = await prisma.wordCard.findMany({
      where: { ownerId: authentication.account.id },
      orderBy: { createdAt: "desc" },
      take: MAX_CARDS_PER_ACCOUNT,
      select: cardFields,
    });
    return NextResponse.json(cards);
  } catch (error) {
    return internalServerError(error, "cards/get");
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
    const validated = validateCardInput(parsed.body);
    if (!validated.success) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "入力内容を確認してください。",
        validated.errors,
      );
    }

    const card = await prisma.$transaction(async (transaction) => {
      const cardCount = await transaction.wordCard.count({
        where: { ownerId: authentication.account.id },
      });
      if (cardCount >= MAX_CARDS_PER_ACCOUNT) {
        return null;
      }

      return transaction.wordCard.create({
        data: {
          ...validated.data,
          ownerId: authentication.account.id,
        },
        select: cardFields,
      });
    });
    if (!card) {
      return jsonError(
        409,
        "CARD_LIMIT_REACHED",
        `カードは${MAX_CARDS_PER_ACCOUNT}件まで登録できます。`,
      );
    }
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    return internalServerError(error, "cards/post");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) {
      return jsonError(401, "UNAUTHENTICATED", "ログインが必要です。");
    }

    const parsed = await readSecureJsonObject(request);
    if (!parsed.ok) {
      return parsed.response;
    }
    const id = validatePositiveIntegerId(parsed.body.id);
    const card = validateCardInput(parsed.body);
    if (!id.success || !card.success) {
      return jsonError(400, "VALIDATION_ERROR", "入力内容を確認してください。", {
        ...(!id.success ? id.errors : {}),
        ...(!card.success ? card.errors : {}),
      });
    }

    const updated = await prisma.wordCard.updateMany({
      where: { id: id.data, ownerId: authentication.account.id },
      data: card.data,
    });
    if (updated.count === 0) {
      return jsonError(404, "CARD_NOT_FOUND", "カードが見つかりません。");
    }

    const updatedCard = await prisma.wordCard.findFirst({
      where: { id: id.data, ownerId: authentication.account.id },
      select: cardFields,
    });
    if (!updatedCard) {
      return jsonError(404, "CARD_NOT_FOUND", "カードが見つかりません。");
    }
    return NextResponse.json(updatedCard);
  } catch (error) {
    return internalServerError(error, "cards/put");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) {
      return jsonError(401, "UNAUTHENTICATED", "ログインが必要です。");
    }

    const parsed = await readSecureJsonObject(request);
    if (!parsed.ok) {
      return parsed.response;
    }
    const id = validatePositiveIntegerId(parsed.body.id);
    if (!id.success) {
      return jsonError(
        400,
        "VALIDATION_ERROR",
        "入力内容を確認してください。",
        id.errors,
      );
    }

    const deleted = await prisma.wordCard.deleteMany({
      where: { id: id.data, ownerId: authentication.account.id },
    });
    if (deleted.count === 0) {
      return jsonError(404, "CARD_NOT_FOUND", "カードが見つかりません。");
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return internalServerError(error, "cards/delete");
  }
}
