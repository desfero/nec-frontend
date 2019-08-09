import { Middleware } from "redux";

import { ILogger } from "../lib/dependencies/logger";

export const reduxLogger = (logger: ILogger): Middleware => () => next => (action: any) => {
  logger.info(`[redux-action] ${action.type}`);

  return next(action);
};
