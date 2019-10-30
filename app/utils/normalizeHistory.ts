import BigNumber from "bignumber.js";
import { compose, entries, groupBy, mapValues, sortBy } from "lodash/fp";
import moment from "moment";

import { ETransferDirection, THistory } from "../lib/web3/types";

const normalizeBalanceHistory = compose(
  sortBy<[string, BigNumber]>(([timestamp]) => timestamp),
  entries,
  mapValues<THistory[], BigNumber>(transactions =>
    transactions.reduce((b, t) => {
      if (t.direction === ETransferDirection.OUTCOMING) {
        return b.minus(t.amount);
      } else {
        return b.plus(t.amount);
      }
    }, new BigNumber(0)),
  ),
  groupBy<THistory>(transaction =>
    moment(transaction.at)
      .startOf("day")
      .valueOf()
      .toString(),
  ),
);

export { normalizeBalanceHistory };
