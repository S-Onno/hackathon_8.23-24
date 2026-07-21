import { createHash } from "node:crypto";
import { isIP } from "node:net";

export const DEFAULT_JSON_BODY_MAX_BYTES = 8 * 1024;

const AUTH_RATE_LIMIT_ATTEMPTS = 8;
const AUTH_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const AUTH_RATE_LIMIT_MAX_ENTRIES = 4_096;
const AUTH_PASSWORD_WORK_CONCURRENCY = 4;

type JsonObject = Record<string, unknown>;

export type SecureJsonResult =
  | { ok: true; body: JsonObject }
  | { ok: false; response: Response };

type RateLimitBucket = {
  attempts: number;
  resetAt: number;
};

export type AuthRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

type AuthRateLimiterOptions = {
  maxAttempts?: number;
  windowMs?: number;
  maxEntries?: number;
};

type AuthRateLimitAttempt = {
  request: Request;
  scope: "login" | "signup";
  email: unknown;
  now?: number;
};

function securityError(
  status: number,
  code: string,
  message: string,
  headers?: HeadersInit,
) {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...headers,
      },
    },
  );
}

function crossSiteError() {
  return securityError(
    403,
    "CROSS_SITE_REQUEST",
    "異なるオリジンからのリクエストは受け付けられません。",
  );
}

/**
 * Reject browser mutation requests that identify themselves as cross-origin.
 * Origin-less requests are allowed for non-browser clients, but a supplied
 * Origin or Sec-Fetch-Site value must describe the request as same-origin.
 */
export function guardSameOriginMutation(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (origin !== null) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return crossSiteError();
      }
    } catch {
      return crossSiteError();
    }
  }

  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return crossSiteError();
  }

  return null;
}

function validateContentLength(
  request: Request,
  maxBytes: number,
): Response | null {
  const contentLength = request.headers.get("content-length");
  if (contentLength === null) {
    return null;
  }

  const normalizedLength = contentLength.trim();
  if (!/^\d+$/.test(normalizedLength)) {
    return securityError(
      400,
      "INVALID_CONTENT_LENGTH",
      "Content-Lengthが不正です。",
    );
  }

  if (BigInt(normalizedLength) > BigInt(maxBytes)) {
    return securityError(
      413,
      "PAYLOAD_TOO_LARGE",
      "リクエスト本文が大きすぎます。",
    );
  }

  return null;
}

async function readBodyWithinLimit(
  request: Request,
  maxBytes: number,
): Promise<{ ok: true; text: string } | { ok: false; response: Response }> {
  if (!request.body) {
    return { ok: true, text: "" };
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let byteLength = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      byteLength += value.byteLength;
      if (byteLength > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          // The response below is authoritative even if stream cancellation fails.
        }
        return {
          ok: false,
          response: securityError(
            413,
            "PAYLOAD_TOO_LARGE",
            "リクエスト本文が大きすぎます。",
          ),
        };
      }

      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return { ok: true, text };
  } catch {
    return {
      ok: false,
      response: securityError(
        400,
        "INVALID_JSON",
        "JSON形式のリクエストが必要です。",
      ),
    };
  } finally {
    reader.releaseLock();
  }
}

/**
 * Read a same-origin JSON mutation body without buffering an unbounded payload.
 */
export async function readSecureJsonObject(
  request: Request,
  maxBytes = DEFAULT_JSON_BODY_MAX_BYTES,
): Promise<SecureJsonResult> {
  const originError = guardSameOriginMutation(request);
  if (originError) {
    return { ok: false, response: originError };
  }

  const mediaType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (mediaType !== "application/json") {
    return {
      ok: false,
      response: securityError(
        415,
        "UNSUPPORTED_MEDIA_TYPE",
        "Content-Typeにはapplication/jsonを指定してください。",
      ),
    };
  }

  const contentLengthError = validateContentLength(request, maxBytes);
  if (contentLengthError) {
    return { ok: false, response: contentLengthError };
  }

  const body = await readBodyWithinLimit(request, maxBytes);
  if (!body.ok) {
    return { ok: false, response: body.response };
  }

  try {
    const parsed: unknown = JSON.parse(body.text);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TypeError("Expected a JSON object");
    }
    return { ok: true, body: parsed as JsonObject };
  } catch {
    return {
      ok: false,
      response: securityError(
        400,
        "INVALID_JSON",
        "JSON形式のリクエストが必要です。",
      ),
    };
  }
}

function normalizeEmailForRateLimit(email: unknown) {
  if (typeof email !== "string") {
    return "<invalid>";
  }

  const normalized = email.trim().toLowerCase();
  return normalized ? normalized.slice(0, 254) : "<invalid>";
}

function clientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  const candidate = forwardedFor?.trim() || request.headers.get("x-real-ip")?.trim();
  return candidate && isIP(candidate) ? candidate.toLowerCase() : "unknown";
}

function fingerprint(value: string) {
  return createHash("sha256").update(value).digest("base64url");
}

export function createAuthRateLimiter(options: AuthRateLimiterOptions = {}) {
  const maxAttempts = options.maxAttempts ?? AUTH_RATE_LIMIT_ATTEMPTS;
  const windowMs = options.windowMs ?? AUTH_RATE_LIMIT_WINDOW_MS;
  const maxEntries = options.maxEntries ?? AUTH_RATE_LIMIT_MAX_ENTRIES;

  if (
    !Number.isSafeInteger(maxAttempts) ||
    maxAttempts < 1 ||
    !Number.isSafeInteger(windowMs) ||
    windowMs < 1 ||
    !Number.isSafeInteger(maxEntries) ||
    maxEntries < 1
  ) {
    throw new TypeError("Rate limiter options must be positive integers");
  }

  const buckets = new Map<string, RateLimitBucket>();
  let overflowBucket: RateLimitBucket | null = null;

  function activeBucket(key: string, now: number) {
    const bucket = buckets.get(key);
    if (!bucket) {
      return null;
    }
    if (bucket.resetAt <= now) {
      buckets.delete(key);
      return null;
    }
    return bucket;
  }

  function bucketFor(key: string, now: number) {
    const existing = activeBucket(key, now);
    if (existing) {
      return existing;
    }

    if (
      buckets.size >= maxEntries &&
      (!overflowBucket || overflowBucket.resetAt <= now)
    ) {
      for (const [storedKey, bucket] of buckets) {
        if (bucket.resetAt <= now) {
          buckets.delete(storedKey);
        }
      }
    }

    if (buckets.size < maxEntries) {
      const created = { attempts: 0, resetAt: now + windowMs };
      buckets.set(key, created);
      return created;
    }

    if (!overflowBucket || overflowBucket.resetAt <= now) {
      overflowBucket = { attempts: 0, resetAt: now + windowMs };
    }
    return overflowBucket;
  }

  return {
    consume(attempt: AuthRateLimitAttempt): AuthRateLimitResult {
      const now = attempt.now ?? Date.now();
      const normalizedEmail = normalizeEmailForRateLimit(attempt.email);
      const keys = [
        `${attempt.scope}:ip:${fingerprint(clientIp(attempt.request))}`,
        `${attempt.scope}:email:${fingerprint(normalizedEmail)}`,
      ];
      const uniqueBuckets = [...new Set(keys.map((key) => bucketFor(key, now)))];
      const blocked = uniqueBuckets.filter(
        (bucket) => bucket.attempts >= maxAttempts,
      );

      if (blocked.length > 0) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(
            1,
            Math.ceil(
              Math.max(...blocked.map((bucket) => bucket.resetAt - now)) / 1000,
            ),
          ),
        };
      }

      for (const bucket of uniqueBuckets) {
        bucket.attempts += 1;
      }
      return { allowed: true };
    },
    get size() {
      return buckets.size;
    },
  };
}

const globalSecurityState = globalThis as typeof globalThis & {
  authRateLimiter?: ReturnType<typeof createAuthRateLimiter>;
  activePasswordWork?: number;
};

const authRateLimiter =
  globalSecurityState.authRateLimiter ?? createAuthRateLimiter();
globalSecurityState.authRateLimiter = authRateLimiter;
globalSecurityState.activePasswordWork ??= 0;

export function enforceAuthRateLimit(
  request: Request,
  scope: "login" | "signup",
  email: unknown,
): Response | null {
  const result = authRateLimiter.consume({ request, scope, email });
  if (result.allowed) {
    return null;
  }
  return createRateLimitResponse(result.retryAfterSeconds);
}

export function createRateLimitResponse(retryAfterSeconds: number) {
  return securityError(
    429,
    "RATE_LIMITED",
    "試行回数が多すぎます。しばらく待ってから再度お試しください。",
    { "Retry-After": String(Math.max(1, Math.ceil(retryAfterSeconds))) },
  );
}

/**
 * Limit expensive scrypt work to the default libuv worker-pool capacity.
 */
export function tryAcquirePasswordWorkSlot(): (() => void) | null {
  const active = globalSecurityState.activePasswordWork ?? 0;
  if (active >= AUTH_PASSWORD_WORK_CONCURRENCY) {
    return null;
  }

  globalSecurityState.activePasswordWork = active + 1;
  let released = false;
  return () => {
    if (released) {
      return;
    }
    released = true;
    globalSecurityState.activePasswordWork = Math.max(
      0,
      (globalSecurityState.activePasswordWork ?? 1) - 1,
    );
  };
}
