-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Session_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "word_cards" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "word_cards_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudyLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientSessionId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "StudyLog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_accountId_idx" ON "Session"("accountId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "word_cards_ownerId_createdAt_idx" ON "word_cards"("ownerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudyLog_ownerId_clientSessionId_key" ON "StudyLog"("ownerId", "clientSessionId");

-- CreateIndex
CREATE INDEX "StudyLog_ownerId_startedAt_idx" ON "StudyLog"("ownerId", "startedAt");
