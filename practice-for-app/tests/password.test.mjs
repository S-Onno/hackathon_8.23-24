import assert from "node:assert/strict";
import test from "node:test";

import { hashPassword, verifyPassword } from "../src/lib/password.ts";

test("password hashes are salted and verifiable", async () => {
  const firstHash = await hashPassword("correct horse battery staple");
  const secondHash = await hashPassword("correct horse battery staple");

  assert.notEqual(firstHash, secondHash);
  assert.equal(await verifyPassword("correct horse battery staple", firstHash), true);
  assert.equal(await verifyPassword("wrong password", firstHash), false);
});

test("malformed password hashes are rejected without throwing", async () => {
  assert.equal(await verifyPassword("password", "not-a-valid-hash"), false);
  assert.equal(await verifyPassword("password", "scrypt$1$2$3$bad$bad"), false);
});
