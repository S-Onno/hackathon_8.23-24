import assert from "node:assert/strict";
import test from "node:test";

import {
  validateCardInput,
  validateLoginInput,
  validatePositiveIntegerId,
  validateSignupInput,
  validateStudyLogInput,
} from "../src/lib/validation.ts";

test("signup input is normalized before it is accepted", () => {
  const result = validateSignupInput({
    email: "  USER@Example.COM ",
    username: "  learner  ",
    password: "correct horse battery staple",
  });

  assert.deepEqual(result, {
    success: true,
    data: {
      email: "user@example.com",
      username: "learner",
      password: "correct horse battery staple",
    },
  });
});

test("invalid signup and login input returns field errors", () => {
  const signup = validateSignupInput({
    email: "invalid",
    username: "x",
    password: "short",
  });
  const login = validateLoginInput({ email: "invalid", password: "" });

  assert.equal(signup.success, false);
  assert.deepEqual(Object.keys(signup.errors).sort(), ["email", "password", "username"]);
  assert.equal(login.success, false);
  assert.deepEqual(Object.keys(login.errors).sort(), ["email", "password"]);
});

test("card input is trimmed and bounded", () => {
  assert.deepEqual(validateCardInput({ question: "  Q  ", answer: "  A  " }), {
    success: true,
    data: { question: "Q", answer: "A" },
  });
  assert.equal(validateCardInput({ question: "", answer: "A" }).success, false);
  assert.equal(validateCardInput({ question: "Q", answer: "x".repeat(2001) }).success, false);
});

test("only positive safe integer identifiers are accepted", () => {
  assert.deepEqual(validatePositiveIntegerId(42), { success: true, data: 42 });
  for (const invalidId of [0, -1, 1.5, "1", Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(validatePositiveIntegerId(invalidId).success, false);
  }
});

test("study log input enforces duration and chronological boundaries", () => {
  const valid = validateStudyLogInput({
    clientSessionId: "550E8400-E29B-41D4-A716-446655440000",
    subject: " Next.js ",
    durationSeconds: 600,
    startedAt: "2026-07-21T00:00:00.000Z",
    endedAt: "2026-07-21T00:10:00.000Z",
  });
  assert.equal(valid.success, true);
  assert.equal(valid.data.clientSessionId, "550e8400-e29b-41d4-a716-446655440000");
  assert.equal(valid.data.subject, "Next.js");

  const impossible = validateStudyLogInput({
    clientSessionId: "550e8400-e29b-41d4-a716-446655440001",
    subject: "Next.js",
    durationSeconds: 606,
    startedAt: "2026-07-21T00:00:00.000Z",
    endedAt: "2026-07-21T00:10:00.000Z",
  });
  assert.equal(impossible.success, false);
  assert.ok(impossible.errors.durationSeconds);
});

test("study log input requires a UUID v4 idempotency key", () => {
  const baseInput = {
    subject: "Next.js",
    durationSeconds: 600,
    startedAt: "2026-07-21T00:00:00.000Z",
    endedAt: "2026-07-21T00:10:00.000Z",
  };

  for (const clientSessionId of [undefined, "", "not-a-uuid", "550e8400-e29b-11d4-a716-446655440000"]) {
    const result = validateStudyLogInput({ ...baseInput, clientSessionId });
    assert.equal(result.success, false);
    assert.ok(result.errors.clientSessionId);
  }
});
