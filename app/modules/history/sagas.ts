import moment from "moment";
import { all, Effect, fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { toChecksumAddress } from "../../utils/toChecksumAddress";
import { actions, TActionFromCreator } from "../actions";
import { neuTakeEvery } from "../sagasUtils";

function* loadHistory(
  { web3Manager, logger, notificationCenter }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.history.loadHistory>,
): Iterator<any> {
  try {
    const checksumAddress = toChecksumAddress(action.payload.address);

    // Get only last full 30 days
    const last30Days = moment()
      .subtract(30, "days")
      .startOf("day");

    const { history, currentBalance } = yield all({
      history: web3Manager.getNECHistory(checksumAddress, last30Days),
      currentBalance: web3Manager.getNECCurrentBalance(checksumAddress),
    });

    yield put(actions.history.setHistory(checksumAddress, currentBalance, history));
  } catch (e) {
    notificationCenter.error("Failed to load history");
    logger.error("Failed to load history", e);
  }
}

export function* historySagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.history.loadHistory, loadHistory);
}
