export type LogArg = string | object;
export type ErrorArgs = LogArg | Error;

export interface ILogger {
  info(...args: LogArg[]): void;
  verbose(...args: LogArg[]): void;
  debug(...args: LogArg[]): void;
  warn(...args: ErrorArgs[]): void;
  error(...args: ErrorArgs[]): void;
  fatal(message: string, error: Error, data?: object): void;
}

export type TLogLevels = Exclude<keyof ILogger, "setUser">;
