import { Inject, Logger, OnModuleInit } from "../../../mod.ts";
import { MathService } from "../math/math.service.ts";

export class BConsumer implements OnModuleInit {
    @Inject(MathService)
    mathService!: MathService;

    public onModuleInit(): void {
        Logger.info("Now at consumer b");
        this.mathService.countUp();
        this.mathService.printCount();
    }
}