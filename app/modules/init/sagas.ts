import { effects } from "redux-saga";
import { fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { IAppState } from "../../store";
import { actions, TActionFromCreator } from "../actions";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { EInitType } from "./reducer";

function* initSmartcontracts({ web3Manager, logger }: TGlobalDependencies): any {
  try {
    yield web3Manager.initialize();

    yield put(actions.init.done(EInitType.START_CONTRACTS_INIT));
  } catch (e) {
    yield put(
      actions.init.error(
        EInitType.START_CONTRACTS_INIT,
        "Error while connecting with Ethereum blockchain",
      ),
    );
    logger.error("Smart Contract Init Error", e);
  }
}

function* initApp({ logger }: TGlobalDependencies): any {
  try {
    yield put(actions.init.done(EInitType.APP_INIT));
  } catch (e) {
    yield put(actions.init.error(EInitType.APP_INIT, e.message || "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initStartSaga(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.init.start>,
): Iterator<any> {
  const { initType } = action.payload;

  switch (initType) {
    case EInitType.APP_INIT:
      return yield neuCall(initApp);
    case EInitType.START_CONTRACTS_INIT:
      return yield neuCall(initSmartcontracts);
    default:
      throw new Error("Unrecognized init type!");
  }
}

export function* checkIfSmartcontractsInitNeeded(): any {
  const isDoneOrInProgress: boolean = yield select(
    (s: IAppState) => s.init.smartcontractsInit.done || s.init.smartcontractsInit.inProgress,
  );

  return !isDoneOrInProgress;
}

export function* initSmartcontractsOnce(): any {
  const isNeeded = yield checkIfSmartcontractsInitNeeded();
  if (!isNeeded) {
    return;
  }

  yield put(actions.init.start(EInitType.START_CONTRACTS_INIT));
}

export const initSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", initStartSaga);
  // Smart Contracts are only initialized once during the whole life cycle of the app
  yield fork(initSmartcontractsOnce);
};
