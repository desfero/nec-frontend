import BigNumber from "bignumber.js";
import { compose, entries, groupBy, mapValues, sortBy } from "lodash/fp";

import { ETransferDirection, THistory } from "../lib/web3/types";

type TNormalized = [number, BigNumber];

const normalizeBalanceHistory: (history: THistory[]) => TNormalized[] = compose(
  sortBy(([timestamp]) => timestamp),
  entries,
  mapValues(transactions =>
    transactions.reduce((b, t) => {
      if (t.direction === ETransferDirection.OUTCOMING) {
        return b.minus(t.amount);
      } else {
        return b.plus(t.amount);
      }
    }, new BigNumber(0)),
  ),
  groupBy(transaction => {
    const date = new Date(transaction.at);

    date.setHours(0, 0, 0, 0);

    return date.valueOf();
  }),
);

export { normalizeBalanceHistory };
