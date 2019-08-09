type StringableActionCreator<R extends string, T extends any[], P extends object> = {
  (...args: T): P;
  toString(): R;
  getType(): R;
};

export function createActionFactory<R extends string>(
  type: R,
): StringableActionCreator<R, [], { type: R }>;
export function createActionFactory<R extends string, T extends any[], P extends object>(
  type: R,
  payloadCreator: (...args: T) => P,
): StringableActionCreator<R, T, { type: R; payload: P }>;
export function createActionFactory<R extends string, T extends any[], P extends object>(
  type: R,
  payloadCreator?: (...args: T) => P,
): StringableActionCreator<R, T, { type: R; payload?: P }> {
  const actionCreator = (...args: T) => {
    if (payloadCreator) {
      const payload = payloadCreator(...args);

      return { type, payload };
    }

    return { type };
  };

  actionCreator.toString = actionCreator.getType = () => type;

  return actionCreator;
}
