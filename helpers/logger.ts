import { LogLevel } from '../enums/log-level.enum.ts';

const _Logger = new class {
  #logLevel = LogLevel.DEBUG;

  set logLevel(logLevel: LogLevel) {
    this.#logLevel = logLevel;
  }

  #log(level: LogLevel, color: string | undefined, ...args: unknown[]): void {
    if (level < this.#logLevel || this.#logLevel === LogLevel.OFF) {
      return;
    }
    if (!color)
      color = "\x1b[0m";

    const now = new Date();
    const time =
      `${now.toLocaleDateString()} ${now.toLocaleTimeString()}.${now.getMilliseconds()}`;

    console.log(`\x1b[2;37m${time} > ${color}${LogLevel[level].padStart(8, ' ')}\x1b[0m \x1b[2;37m| ${args}`);
  }

  public debug(...args: unknown[]): void {
    this.#log(LogLevel.DEBUG, '\x1b[0;90m', ...args);
  }

  public info(...args: unknown[]): void {
    this.#log(LogLevel.INFO, '\x1b[0;32m', ...args);
  }

  public warning(...args: unknown[]): void {
    this.#log(LogLevel.WARNING, '\x1b[0;33m', ...args);
  }

  public error(...args: unknown[]): void {
    this.#log(LogLevel.ERROR, '\x1b[0;91m', ...args);
  }

  public critical(...args: unknown[]): void {
    this.#log(LogLevel.CRITICAL, '\x1b[0;31m', args);
  }
}();

_Logger.logLevel =
  (await Deno.permissions.query({ name: 'env', variable: 'LOG_LEVEL' }))
      .state === 'granted'
    ? LogLevel[(Deno.env.get('LOG_LEVEL') ?? '') as keyof typeof LogLevel]
    : LogLevel.INFO;

export const Logger = _Logger;
