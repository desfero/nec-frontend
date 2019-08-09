import { all, call, Effect, fork, getContext } from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { historySagas } from "./history/sagas";
import { initSagas } from "./init/sagas";
import { routingSagas } from "./routing/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<Effect> {
  yield all([
    // Sagas that should keep running even after logout
    fork(initSagas),

    fork(routingSagas),

    fork(historySagas),
  ]);
}

function* handleRootError(error: Error): Iterator<Effect> {
  const { logger }: TGlobalDependencies = yield getContext("deps");

  logger.error(error);
}

export function* rootSaga(): Iterator<Effect> {
  while (true) {
    try {
      yield call(allSagas);
    } catch (e) {
      yield call(handleRootError, e);
    }
  }
}
