import { Hook, Logger } from '../../../mod.ts';

export class MathService {
  public add(a: number, b: number): number {
    return a + b;
  }

  @Hook({ type: MathService, scope: 'post' })
  public onInit(): void {
    Logger.info('Hello, math service is ready!');
  }
}
