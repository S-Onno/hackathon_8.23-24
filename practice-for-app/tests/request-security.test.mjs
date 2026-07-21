import assert from "node:assert/strict";
import test from "node:test";

import {
  createAuthRateLimiter,
  createRateLimitResponse,
  guardSameOriginMutation,
  readSecureJsonObject,
} from "../src/lib/request-security.ts";

const endpoint = "https://app.example/api/auth/login";
const sameOriginHeaders = {
  origin: "https://app.example",
  "sec-fetch-site": "same-origin",
};

test("auth JSON mutations reject text/plain", async () => {
  const result = await readSecureJsonObject(
    new Request(endpoint, {
      method: "POST",
      headers: { ...sameOriginHeaders, "content-type": "text/plain" },
      body: '{"email":"user@example.com"}',
    }),
  );

  assert.equal(result.ok, false);
  assert.equal(result.response.status, 415);
  assert.equal((await result.response.json()).error.code, "UNSUPPORTED_MEDIA_TYPE");
});

test("auth mutations reject mismatched Origin and cross-site fetch metadata", () => {
  const mismatchedOrigin = guardSameOriginMutation(
    new Request(endpoint, {
      method: "POST",
      headers: { origin: "https://evil.example" },
    }),
  );
  assert.equal(mismatchedOrigin?.status, 403);

  const crossSiteFetch = guardSameOriginMutation(
    new Request(endpoint, {
      method: "POST",
      headers: {
        origin: "https://app.example",
        "sec-fetch-site": "cross-site",
      },
    }),
  );
  assert.equal(crossSiteFetch?.status, 403);
});

test("auth JSON mutations enforce declared and actually-read body limits", async () => {
  const declaredOversize = await readSecureJsonObject(
    new Request(endpoint, {
      method: "POST",
      headers: {
        ...sameOriginHeaders,
        "content-type": "application/json",
        "content-length": "17",
      },
      body: "{}",
    }),
    16,
  );
  assert.equal(declaredOversize.ok, false);
  assert.equal(declaredOversize.response.status, 413);

  const actualOversize = await readSecureJsonObject(
    new Request(endpoint, {
      method: "POST",
      headers: {
        ...sameOriginHeaders,
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ value: "x".repeat(32) }),
    }),
    16,
  );
  assert.equal(actualOversize.ok, false);
  assert.equal(actualOversize.response.status, 413);
});

test("rate limits normalized email and IP independently with Retry-After", () => {
  const now = 10_000;
  const emailLimiter = createAuthRateLimiter({
    maxAttempts: 1,
    windowMs: 30_000,
    maxEntries: 8,
  });
  const first = emailLimiter.consume({
    request: new Request(endpoint, {
      headers: { "x-forwarded-for": "192.0.2.1" },
    }),
    scope: "login",
    email: "  USER@Example.COM ",
    now,
  });
  assert.equal(first.allowed, true);

  const sameEmailFromAnotherIp = emailLimiter.consume({
    request: new Request(endpoint, {
      headers: { "x-forwarded-for": "192.0.2.2" },
    }),
    scope: "login",
    email: "user@example.com",
    now,
  });
  assert.equal(sameEmailFromAnotherIp.allowed, false);

  const response = createRateLimitResponse(
    sameEmailFromAnotherIp.retryAfterSeconds,
  );
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "30");

  const ipLimiter = createAuthRateLimiter({
    maxAttempts: 1,
    windowMs: 30_000,
    maxEntries: 8,
  });
  assert.equal(
    ipLimiter.consume({
      request: new Request(endpoint, {
        headers: { "x-forwarded-for": "192.0.2.3" },
      }),
      scope: "signup",
      email: "first@example.com",
      now,
    }).allowed,
    true,
  );
  assert.equal(
    ipLimiter.consume({
      request: new Request(endpoint, {
        headers: { "x-forwarded-for": "192.0.2.3" },
      }),
      scope: "signup",
      email: "second@example.com",
      now,
    }).allowed,
    false,
  );
});

test("rate limiter state remains bounded under high-cardinality input", () => {
  const limiter = createAuthRateLimiter({
    maxAttempts: 100,
    windowMs: 60_000,
    maxEntries: 2,
  });

  for (let index = 1; index <= 20; index += 1) {
    limiter.consume({
      request: new Request(endpoint, {
        headers: { "x-forwarded-for": `192.0.2.${index}` },
      }),
      scope: "login",
      email: `user-${index}@example.com`,
      now: 1_000,
    });
  }

  assert.ok(limiter.size <= 2);
});
