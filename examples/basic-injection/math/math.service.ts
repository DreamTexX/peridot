import { Hook, Logger } from '../../../mod.ts';

export class MathService {
  public add(a: number, b: number): number {
    return a + b;
  }

  @Hook({
    application: '*',
    container: '*',
    type: MathService,
    scope: 'post',
  })
  public onInit(): void {
    Logger.info('Hello, math service is ready!');
  }

  @Hook({
    application: '*',
    scope: 'post',
  })
  public onApplicationInit(): void {
    Logger.info('Math service was notified, that the application is ready');
  }
}
