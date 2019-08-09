import {
  addBreadcrumb,
  captureException,
  init,
  SentryEvent,
  Severity,
  withScope,
} from "@sentry/browser";

import { ErrorArgs, ILogger, LogArg } from "./ILogger";
import { hashBlacklistedQueryParams } from "./utils";

/**
 * Query params that should never be send to sentry for security reasons.
 */
const BLACKLISTED_QUERY_PARAMS = ["email", "salt"];

export class SentryLogger implements ILogger {
  constructor(dsn: string) {
    init({
      dsn,
      beforeSend(event: SentryEvent): SentryEvent {
        if (event.request && event.request.url) {
          event.request.url = hashBlacklistedQueryParams(
            BLACKLISTED_QUERY_PARAMS,
            event.request.url,
          );
        }

        return event;
      },
    });
  }

  info(...args: LogArg[][]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args },
      level: Severity.Info,
    });
  }

  verbose(...args: LogArg[][]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args },
      level: Severity.Log,
    });
  }

  debug(...args: LogArg[][]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args },
      level: Severity.Debug,
    });
  }

  warn(...args: ErrorArgs[]): void {
    withScope(scope => {
      addBreadcrumb({
        category: "logger",
        data: { ...args.filter(arg => !(arg instanceof Error)) },
        level: Severity.Warning,
      });

      scope.setLevel(Severity.Warning);

      const error = args.find(arg => arg instanceof Error);

      captureException(error);
    });
  }

  error(...args: ErrorArgs[]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args.filter(arg => !(arg instanceof Error)) },
      level: Severity.Error,
    });

    const error = args.find(arg => arg instanceof Error);

    captureException(error);
  }

  fatal(message: string, error: Error, data?: object): void {
    // tslint:disable-next-line
    console.error(message, error, data);

    withScope(scope => {
      addBreadcrumb({
        message,
        data,
        category: "logger",
        level: Severity.Fatal,
      });

      scope.setLevel(Severity.Fatal);

      captureException(error);
    });
  }
}
