import assert from "node:assert/strict";
import test from "node:test";

import { safeRedirectPath } from "../src/utils/safe-redirect.ts";

test("safeRedirectPath keeps valid in-app destinations", () => {
  assert.equal(
    safeRedirectPath("/study?mode=timer#controls"),
    "/study?mode=timer#controls",
  );
  assert.equal(safeRedirectPath("/top"), "/top");
});

test("safeRedirectPath rejects external and ambiguous destinations", () => {
  for (const destination of [
    null,
    "",
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/study\nexample.com",
  ]) {
    assert.equal(safeRedirectPath(destination), "/top");
  }
});
