import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";

function databaseUrlFromDotEnv() {
  if (!existsSync(".env")) {
    return undefined;
  }

  const line = readFileSync(".env", "utf8")
    .split(/\r?\n/u)
    .find((candidate) => /^\s*DATABASE_URL\s*=/u.test(candidate));
  if (!line) {
    return undefined;
  }

  const value = line.slice(line.indexOf("=") + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value.split(/\s+#/u, 1)[0];
}

const databaseUrl = process.env.DATABASE_URL ?? databaseUrlFromDotEnv();
if (!databaseUrl?.startsWith("file:")) {
  throw new Error(
    "DATABASE_URL must be set to a file: SQLite URL before running migrations.",
  );
}

const rawPath = decodeURIComponent(databaseUrl.slice("file:".length).split("?", 1)[0]);
if (rawPath !== ":memory:") {
  const databasePath = isAbsolute(rawPath)
    ? rawPath
    : resolve("prisma", rawPath);
  mkdirSync(dirname(databasePath), { recursive: true });
  try {
    writeFileSync(databasePath, "", { flag: "wx" });
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "EEXIST") {
      throw error;
    }
  }
}
