import { all, Effect, fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TActionFromCreator } from "../actions";
import { neuTakeEvery } from "../sagasUtils";

function* loadHistory(
  { web3Manager, logger, notificationCenter }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.history.loadHistory>,
): Iterator<any> {
  try {
    const { history, currentBalance } = yield all({
      history: web3Manager.getNECHistory(action.payload.address),
      currentBalance: web3Manager.getNECCurrentBalance(action.payload.address),
    });

    yield put(actions.history.setHistory(action.payload.address, currentBalance, history));
  } catch (e) {
    notificationCenter.error("Failed to load history");
    logger.error("Failed to load history", e);
  }
}

export function* historySagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.history.loadHistory, loadHistory);
}
