import { Logger } from '../../../mod.ts';

export class MathService {
  #counter = 0;

  public countUp(): void {
    this.#counter += 1;
  }

  public printCount(): void {
    Logger.info('Counter:', this.#counter);
  }
}
