import { ILogger } from ".";
import { ErrorArgs, LogArg } from "./ILogger";

export class DevConsoleLogger implements ILogger {
  info(...args: LogArg[]): void {
    // tslint:disable-next-line
    console.info(...args);
  }

  verbose(...args: LogArg[]): void {
    // tslint:disable-next-line
    console.log(...args);
  }

  debug(...args: LogArg[]): void {
    // tslint:disable-next-line
    console.log(...args);
  }

  warn(...args: ErrorArgs[]): void {
    // tslint:disable-next-line
    console.warn(...args);
  }

  error(...args: ErrorArgs[]): void {
    // tslint:disable-next-line
    console.error(...args);
  }

  fatal(message: string, error: Error, data?: object): void {
    // tslint:disable-next-line
    console.error(message, error, data);
  }
}
