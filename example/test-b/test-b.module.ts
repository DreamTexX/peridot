import { TestA } from "../test-a/test-a.module.ts";
import { TestBService } from "./test-b.service.ts";
import { forwardRef, Module } from "../../mod.ts";

@Module({
  providers: [TestBService],
  exports: [TestBService],
  imports: [forwardRef(() => TestA)],
})
export class TestB {}
