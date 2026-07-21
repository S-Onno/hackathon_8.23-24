export const SESSION_COOKIE_NAME = "universe_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const TOKEN_VERSION = "v1";
const DEV_SESSION_SECRET =
  "development-only-session-secret-do-not-use-in-production";
const textEncoder = new TextEncoder();
let warnedAboutDevelopmentSecret = false;

export type SessionCredential = {
  cookieValue: string;
  tokenHash: string;
  expiresAt: Date;
};

export type VerifiedSessionCredential = {
  token: string;
  tokenHash: string;
  expiresAt: Date;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) {
    return null;
  }

  try {
    const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(base64 + padding);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytesToBase64Url(bytes) === value ? bytes : null;
  } catch {
    return null;
  }
}

export function getSessionSecret(): string {
  const configuredSecret = process.env.SESSION_SECRET?.trim();
  if (configuredSecret) {
    if (configuredSecret.length < 32) {
      throw new Error("SESSION_SECRET must contain at least 32 characters.");
    }
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET is required in production and must contain at least 32 characters.",
    );
  }

  if (!warnedAboutDevelopmentSecret) {
    console.warn(
      "SESSION_SECRET is not set; using the development-only fallback secret.",
    );
    warnedAboutDevelopmentSecret = true;
  }
  return DEV_SESSION_SECRET;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    textEncoder.encode(payload),
  );
  return bytesToBase64Url(new Uint8Array(signature));
}

async function hashSessionToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(token),
  );
  return bytesToBase64Url(new Uint8Array(digest));
}

export async function createSessionCredential(): Promise<SessionCredential> {
  const secret = getSessionSecret();
  const randomToken = new Uint8Array(32);
  crypto.getRandomValues(randomToken);
  const token = bytesToBase64Url(randomToken);
  const expiresAtSeconds =
    Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = `${TOKEN_VERSION}.${expiresAtSeconds}.${token}`;
  const signature = await sign(payload, secret);

  return {
    cookieValue: `${payload}.${signature}`,
    tokenHash: await hashSessionToken(token),
    expiresAt: new Date(expiresAtSeconds * 1000),
  };
}

export async function verifySessionCookie(
  cookieValue: string | undefined,
): Promise<VerifiedSessionCredential | null> {
  if (!cookieValue) {
    return null;
  }

  const secret = getSessionSecret();
  const [version, encodedExpiry, token, encodedSignature, ...rest] =
    cookieValue.split(".");
  const expiresAtSeconds = Number(encodedExpiry);

  if (
    rest.length > 0 ||
    version !== TOKEN_VERSION ||
    !Number.isSafeInteger(expiresAtSeconds) ||
    expiresAtSeconds <= Math.floor(Date.now() / 1000) ||
    !token ||
    base64UrlToBytes(token)?.length !== 32
  ) {
    return null;
  }

  const signature = base64UrlToBytes(encodedSignature ?? "");
  if (!signature) {
    return null;
  }

  const payload = `${version}.${encodedExpiry}.${token}`;
  const key = await getHmacKey(secret);
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    textEncoder.encode(payload),
  );

  if (!isValid) {
    return null;
  }

  return {
    token,
    tokenHash: await hashSessionToken(token),
    expiresAt: new Date(expiresAtSeconds * 1000),
  };
}
