import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

const cards = [
  ["公開鍵暗号方式のアルゴリズムを答えよ", "RSA"],
  ["共通鍵暗号方式のアルゴリズムを答えよ", "AES"],
  [
    "ファイルを横断することができ、非公開のフォルダを見れてしまう攻撃は？",
    "ディレクトリトラバーサル",
  ],
  ["ディレクトリトラバーサルと似てる攻撃は？", "パストラバーサル"],
  ["8月24日はなんの日ですか。", "ハッカソンの最終日です"],
];

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64, {
    N: 16_384,
    r: 8,
    p: 1,
    maxmem: 32 * 1024 * 1024,
  });
  return [
    "scrypt",
    16_384,
    8,
    1,
    salt.toString("base64url"),
    derivedKey.toString("base64url"),
  ].join("$");
}

async function main() {
  const email = process.env.SEED_EMAIL?.trim().toLowerCase();
  const username = process.env.SEED_USERNAME?.trim();
  const password = process.env.SEED_PASSWORD;
  const providedValues = [email, username, password].filter(Boolean).length;

  if (providedValues === 0) {
    console.log(
      "Seed skipped. Set SEED_EMAIL, SEED_USERNAME, and SEED_PASSWORD to create a local demo account and the five legacy cards.",
    );
    return;
  }
  if (providedValues !== 3) {
    throw new Error(
      "SEED_EMAIL, SEED_USERNAME, and SEED_PASSWORD must all be set together.",
    );
  }
  if (password.length < 8 || password.length > 128) {
    throw new Error("SEED_PASSWORD must contain 8 to 128 characters.");
  }
  if (!email.includes("@") || email.length > 254) {
    throw new Error("SEED_EMAIL must be a valid email address.");
  }
  if (username.length < 2 || username.length > 50) {
    throw new Error("SEED_USERNAME must contain 2 to 50 characters.");
  }

  const passwordHash = await hashPassword(password);
  const existingAccount = await prisma.account.findUnique({ where: { email } });
  const account = existingAccount
    ? await prisma.account.update({
        where: { id: existingAccount.id },
        data: { username, passwordHash },
      })
    : await prisma.account.create({
        data: {
          email,
          username,
          passwordHash,
        },
      });

  for (const [question, answer] of cards) {
    const existingCard = await prisma.wordCard.findFirst({
      where: { ownerId: account.id, question, answer },
      select: { id: true },
    });
    if (!existingCard) {
      await prisma.wordCard.create({
        data: { ownerId: account.id, question, answer },
      });
    }
  }

  console.log(`Seeded ${cards.length} cards for ${email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
