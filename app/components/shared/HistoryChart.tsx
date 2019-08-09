import { ResponsiveLine } from "@nivo/line";
import BigNumber from "bignumber.js";
import * as React from "react";

import { Q18 } from "../../config/constants";
import { selectHistory } from "../../modules/history/selectors";
import { normalizeBalanceHistory } from "../../utils/normalizeHistory";

type TExternalProps = {
  necHistory: ReturnType<typeof selectHistory>;
};

const HistoryChart: React.FunctionComponent<TExternalProps> = ({ necHistory }) => {
  const normalizedHistory = normalizeBalanceHistory(necHistory.history);

  const reducedHistory = normalizedHistory.reduceRight((p, [timestamp, difference]) => {
    if (p.length === 0) {
      return [
        [timestamp, difference.plus(necHistory.currentBalance)],
        [Date.now(), new BigNumber(necHistory.currentBalance)],
      ];
    }

    const first = p[0];

    return [[timestamp, difference.plus(first[1])], ...p];
  }, []);

  return (
    <ResponsiveLine
      data={[
        {
          id: "NEC",
          data: reducedHistory.map(([date, amount]) => ({
            y: new BigNumber(amount).div(Q18).toString(),
            x: date,
          })),
        },
      ]}
      margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
      enableSlices={"x"}
      height={400}
      curve="monotoneX"
      useMesh={false}
    />
  );
};

export { HistoryChart };
