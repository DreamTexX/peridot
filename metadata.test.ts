import { Metadata } from "./metadata.ts";
import { assertEquals } from "./vendor/https/deno.land/std/testing/asserts.ts";

Deno.test("getting and setting metadata", () => {
  const metadata = new Metadata();
  class A {}
  class B {}

  metadata.defineMetadata(A, "foo", "foo");
  metadata.defineMetadata(B, "bar", "bar");

  assertEquals(metadata.getMetadata(A, "foo"), "foo");
  assertEquals(metadata.getMetadata(B, "bar"), "bar");
  assertEquals(metadata.getMetadata(A, "bar"), undefined);
  assertEquals(metadata.getMetadata(B, "foo"), undefined);
});

Deno.test("clearing metadata", () => {
  const metadata = new Metadata();
  class A {}
  class B {}

  metadata.defineMetadata(A, "foo", "foo");
  metadata.defineMetadata(B, "bar", "bar");
  metadata.clear();

  assertEquals(metadata.getMetadata(A, "foo"), undefined);
  assertEquals(metadata.getMetadata(B, "bar"), undefined);
});
