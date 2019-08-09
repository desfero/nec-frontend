import { isMatch } from "lodash/fp";
import {
  call,
  Effect,
  fork,
  getContext,
  race,
  spawn,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { TSingleOrArray } from "../types";
import { TActionPayload, TPattern } from "./actions";

type TSagaWithDeps = (deps: TGlobalDependencies, ...args: any[]) => any;

type TType = TSingleOrArray<TPattern>;

export function* neuTakeLatest(type: TType, saga: TSagaWithDeps): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeLatest(type, saga, deps);
}

export function* neuTakeEvery(type: TType, saga: TSagaWithDeps): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeEvery(type, saga, deps);
}

export function* neuFork(saga: TSagaWithDeps, ...args: any[]): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield fork(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

export function* neuSpawn(saga: TSagaWithDeps, ...args: any[]): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield spawn(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

export function* neuCall(saga: TSagaWithDeps, ...args: any[]): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield call(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(startAction: TType, stopAction: TType, saga: TSagaWithDeps): any {
  while (true) {
    const action = yield take(startAction);
    // No direct concurrent requests like `fork` or `spawn` should be in the loop
    yield race({
      task: neuCall(saga, action),
      cancel: take(stopAction),
    });
  }
}

/**
 *  Awaits an Action with specific payload.
 *  You can pass only a part of the payload that you want to match.
 */
export function* neuTakeOnly<T extends TPattern>(
  type: T,
  payload: Partial<TActionPayload<T>>,
): any {
  while (true) {
    const takenAction = yield take(type);
    if (isMatch(payload, takenAction.payload)) {
      return takenAction;
    }
  }
}

/**
 *  Executes the generator and repeats if repeatAction was dispatched. Exits when endAction
 *  is dispatched.
 */
export function* neuRepeatIf(
  repeatAction: TType,
  endAction: TType,
  generator: TSagaWithDeps,
  ...args: any[]
): any {
  while (true) {
    yield neuCall(generator, ...args);

    const { repeat, end } = yield race({
      repeat: take(repeatAction),
      end: take(endAction),
    });
    if (repeat) {
      continue;
    }
    if (end) {
      return;
    }
  }
}

/**
 *  Executes the generator and restarts running job if a specific actions is fired
 */
export function* neuRestartIf(cancelAction: TType, saga: TSagaWithDeps, ...args: any[]): any {
  while (true) {
    yield race({
      task: neuCall(saga, ...args),
      cancel: take(cancelAction),
    });
  }
}
