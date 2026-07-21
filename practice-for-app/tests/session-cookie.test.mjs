import assert from "node:assert/strict";
import test from "node:test";

import {
  createSessionCredential,
  verifySessionCookie,
} from "../src/lib/session-cookie.ts";

process.env.SESSION_SECRET = "test-session-secret-0123456789abcdef0123456789abcdef";

test("a newly created session cookie verifies to the stored token hash", async () => {
  const created = await createSessionCredential();
  const verified = await verifySessionCookie(created.cookieValue);

  assert.ok(verified);
  assert.equal(verified.tokenHash, created.tokenHash);
  assert.equal(verified.expiresAt.getTime(), created.expiresAt.getTime());
});

test("tampered and malformed session cookies are rejected", async () => {
  const created = await createSessionCredential();
  const lastCharacter = created.cookieValue.at(-1);
  const replacement = lastCharacter === "a" ? "b" : "a";
  const tampered = `${created.cookieValue.slice(0, -1)}${replacement}`;

  assert.equal(await verifySessionCookie(tampered), null);
  assert.equal(await verifySessionCookie("not.a.valid.cookie"), null);
  assert.equal(await verifySessionCookie(undefined), null);
});
