import { Middleware } from "redux";
import { spy } from "sinon";

export function createSpyMiddleware(): any {
  const dispatchSpy = spy();
  const middleware: Middleware = () => next => (action: any) => {
    dispatchSpy(action);
    // pass every action
    return next(action);
  };

  return {
    middleware,
    dispatchSpy,
  };
}
