import assert from "node:assert/strict";
import { test } from "node:test";

import { greet } from "../src/index.ts";

test("greets the world by default", () => {
  assert.equal(greet(), "Hello, world!");
});

test("uses the provided name and greeting", () => {
  assert.equal(greet({ name: "Ada", greeting: "Hi" }), "Hi, Ada!");
});
