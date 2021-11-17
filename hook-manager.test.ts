import { HookType } from "./enums/hook.enum.ts";
import { HookManager } from "./hook-manager.ts";

Deno.test("adding hooks", () => {
  const hookManager = new HookManager();
  hookManager.hook(HookType.PreApplicationInit, () => {});
});
