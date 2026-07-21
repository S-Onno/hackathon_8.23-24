import assert from "node:assert/strict";
import test, { afterEach } from "node:test";

import {
  fetchWordCards,
  readWordCardResponse,
} from "../src/utils/word-card.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("fetchWordCards accepts the documented API response", async () => {
  const cards = [
    {
      id: 1,
      question: "Q",
      answer: "A",
      createdAt: "2026-07-21T00:00:00.000Z",
      updatedAt: "2026-07-21T00:00:00.000Z",
    },
  ];
  globalThis.fetch = async () => Response.json(cards);

  assert.deepEqual(await fetchWordCards(), cards);
});

test("fetchWordCards rejects non-success and malformed responses", async () => {
  globalThis.fetch = async () => Response.json({ error: "unauthorized" }, { status: 401 });
  await assert.rejects(fetchWordCards(), /401/);

  globalThis.fetch = async () => Response.json([{ id: "not-a-number" }]);
  await assert.rejects(fetchWordCards(), /不正なデータ/);
});

test("readWordCardResponse accepts a successful card response", async () => {
  const card = {
    id: 2,
    question: "Question",
    answer: "Answer",
    createdAt: "2026-07-21T00:00:00.000Z",
    updatedAt: "2026-07-21T01:00:00.000Z",
  };

  assert.deepEqual(await readWordCardResponse(Response.json(card)), card);
});

test("readWordCardResponse rejects non-success and malformed responses", async () => {
  await assert.rejects(
    readWordCardResponse(Response.json({ error: "invalid" }, { status: 400 })),
    /400/,
  );

  await assert.rejects(
    readWordCardResponse(Response.json({ id: 2, question: "missing fields" })),
    /不正なデータ/,
  );
});
