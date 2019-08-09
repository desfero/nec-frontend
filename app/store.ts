import { connectRouter, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { connect, InferableComponentEnhancerWithProps, Options } from "react-redux";
import { combineReducers, Reducer } from "redux";

import { TAction } from "./modules/actions";
import { appReducers } from "./modules/reducer";
import { DeepReadonly, FunctionWithDeps } from "./types";

export type AppDispatch = (a: AppActionTypes | FunctionWithDeps) => void;

export type AppReducer<S> = Reducer<DeepReadonly<S>, AppActionTypes>;

// add new external actions here
export type AppActionTypes = DeepReadonly<TAction | LocationChangeAction>;

// base on reducers we can infer type of app state
type TReducersMapToReturnTypes<T extends Record<string, (...args: any[]) => any>> = {
  [P in keyof T]: ReturnType<T[P]>
};

export type IAppState = TReducersMapToReturnTypes<typeof appReducers> & {
  router: RouterState;
};

const generateAppReducer = (history: History) =>
  combineReducers<IAppState>({
    ...appReducers,
    router: connectRouter(history),
  });

export const generateRootReducer = (history: History) => generateAppReducer(history);

/**
 * If react-redux connection function receive `undefined` as a `dispatchToProps` method it then pass `dispatch` method to wrapped component.
 * Often it's not needed as it leads to problems when wrapped component spread all props to any dom element
 * @param omitDispatch
 */
const getDispatchToProps = (omitDispatch: boolean) => (omitDispatch ? () => ({}) : undefined);

type TCustomOptions = {
  omitDispatch?: boolean;
};

interface IAppConnectOptions<S, D, O> {
  stateToProps?: (state: IAppState, ownProps: O) => S;
  dispatchToProps?: (dispatch: AppDispatch, ownProps: O) => D;
  options?: Options<IAppState, S, O> & TCustomOptions;
}

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<S = {}, D = {}, O = {}>({
  stateToProps,
  dispatchToProps,
  options = {},
}: IAppConnectOptions<S, D, O>): InferableComponentEnhancerWithProps<S & D, O> {
  const { omitDispatch = false, ...connectOptions } = options;

  return connect<S, D, O, IAppState>(
    stateToProps,
    dispatchToProps || (getDispatchToProps(omitDispatch) as any),
    undefined,
    connectOptions,
  );
}
