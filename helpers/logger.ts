export enum LogLevel {
  OFF,
  CRITICAL,
  ERROR,
  WARNING,
  INFO,
  DEBUG,
}

interface LogLevelData {
  level: number;
  display: string;
  color: string;
  colorOnlyDisplay?: boolean;
}

type LogLevelList = {
  [LogLevel.OFF]: LogLevelData;
  [LogLevel.CRITICAL]: LogLevelData;
  [LogLevel.ERROR]: LogLevelData;
  [LogLevel.WARNING]: LogLevelData;
  [LogLevel.INFO]: LogLevelData;
  [LogLevel.DEBUG]: LogLevelData;
};

const logLevels: LogLevelList = {
  [LogLevel.OFF]: {
    level: -1,
    display: '',
    color: '',
  },
  [LogLevel.CRITICAL]: {
    level: 2,
    display: 'CRITICAL',
    color: '\x1b[1;31m',
  },
  [LogLevel.ERROR]: {
    level: 3,
    display: 'ERROR',
    color: '\x1b[0;31m',
  },
  [LogLevel.WARNING]: {
    level: 4,
    display: 'WARNING',
    color: '\x1b[0;33m',
  },
  [LogLevel.INFO]: {
    level: 6,
    display: 'INFO',
    color: '\x1b[0;32m',
    colorOnlyDisplay: true,
  },
  [LogLevel.DEBUG]: {
    level: 7,
    display: 'DEBUG',
    color: '\x1b[2;37m',
  },
};

export const Logger = {
  level: (await Deno.permissions.query({ name: 'env', variable: 'LOG_LEVEL' }))
      .state === 'granted'
    ? LogLevel[(Deno.env.get('LOG_LEVEL') ?? 'DEBUG') as keyof typeof LogLevel]
    : LogLevel.INFO,
  log: (
    level: LogLevel,
    message: unknown,
    error?: Error,
  ): void => {
    const levelData = logLevels[level];
    if (
      Logger.level === LogLevel.OFF ||
      levelData.level > logLevels[Logger.level].level
    ) {
      return;
    }
    const now = new Date();
    let log = `\x1b[0m%d %t > %c%l\x1b[0m | %c%m ${error ? '\n\n%e\n' : ''}`
      .replace('%d', now.toLocaleDateString())
      .replace('%t', now.toLocaleTimeString())
      .replace('%l', levelData.display.padStart(8))
      .replace('%m', `${message}`)
      .replace('%e', error?.stack ?? '');
    if (levelData.colorOnlyDisplay) {
      log = log.replace('%c', levelData.color).replaceAll('%c', '');
    } else {
      log = log.replaceAll('%c', levelData.color);
    }

    console.log(log);
  },
  critical: (message: unknown, error?: Error) =>
    Logger.log(LogLevel.CRITICAL, message, error),
  error: (message: unknown, error?: Error) =>
    Logger.log(LogLevel.ERROR, message, error),
  warning: (message: unknown, error?: Error) =>
    Logger.log(LogLevel.WARNING, message, error),
  info: (message: unknown, error?: Error) =>
    Logger.log(LogLevel.INFO, message, error),
  debug: (message: unknown, error?: Error) =>
    Logger.log(LogLevel.DEBUG, message, error),
};
