import { injectable } from "inversify";

import { DevConsoleLogger } from "./DevConsoleLogger";
import { ErrorArgs, ILogger, LogArg } from "./ILogger";
import { SentryLogger } from "./SentryLogger";
import { isLevelAllowed } from "./utils";

const noopLogger: ILogger = {
  info: () => {},
  verbose: () => {},
  debug: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
};

const resolveLogger = () => {
  if (process.env.NF_SENTRY_DSN) {
    return new SentryLogger(process.env.NF_SENTRY_DSN);
  }

  if (process.env.NODE_ENV === "production" && process.env.TYPE_OF_DEPLOYMENT !== "commit") {
    // tslint:disable-next-line
    console.info("Error logging is disabled");

    return noopLogger;
  }

  return new DevConsoleLogger();
};

@injectable()
class Logger implements ILogger {
  private logger: ILogger = resolveLogger();

  info(...args: LogArg[]): void {
    if (isLevelAllowed("info")) {
      this.logger.info(...args);
    }
  }

  verbose(...args: LogArg[]): void {
    if (isLevelAllowed("verbose")) {
      this.logger.verbose(...args);
    }
  }

  debug(...args: LogArg[]): void {
    if (isLevelAllowed("debug")) {
      this.logger.debug(...args);
    }
  }

  warn(...args: ErrorArgs[]): void {
    if (isLevelAllowed("warn")) {
      this.logger.warn(...args);
    }
  }

  error(...args: ErrorArgs[]): void {
    if (isLevelAllowed("error")) {
      this.logger.error(...args);
    }
  }

  fatal(message: string, error: Error, data?: object): void {
    if (isLevelAllowed("fatal")) {
      this.logger.fatal(message, error, data);
    }
  }
}

export { ILogger, Logger, noopLogger };
