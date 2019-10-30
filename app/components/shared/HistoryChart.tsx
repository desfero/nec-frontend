import { ResponsiveLine } from "@nivo/line";
import BigNumber from "bignumber.js";
import moment from "moment";
import * as React from "react";

import { TTokenHistory } from "../../modules/history/reducer";
import { DeepReadonlyObject } from "../../types";
import { InvariantError } from "../../utils/invariant";
import { normalizeBalanceHistory } from "../../utils/normalizeHistory";
import { ENumberInputFormat, ENumberOutputFormat, formatNumber } from "./formatters/utils";

type TExternalProps = {
  necHistory: DeepReadonlyObject<TTokenHistory>;
};

const HistoryChart: React.FunctionComponent<TExternalProps> = ({ necHistory }) => {
  const chartData = React.useMemo(
    () =>
      normalizeBalanceHistory(necHistory.history)
        .reduceRight<[string, BigNumber][]>((p, [timestamp, difference]) => {
          if (p.length === 0) {
            return [[timestamp, difference.plus(necHistory.currentBalance)]];
          }

          const [, firstDifference] = p[0];
          return [[timestamp, difference.plus(firstDifference)], ...p];
        }, [])
        .map(([date, amount]) => ({
          y: amount.toString(),
          x: date,
        })),
    [necHistory.history, necHistory.currentBalance],
  );

  return (
    <ResponsiveLine
      data={[
        {
          id: "NEC",
          data: chartData,
        },
      ]}
      margin={{ top: 20, right: 20, bottom: 60, left: 80 }}
      enableSlices="x"
      yFormat={value => {
        if (value instanceof Date) {
          throw new InvariantError("Left axis should not contain date");
        }

        return formatNumber({
          value,
          inputFormat: ENumberInputFormat.ULPS,
          outputFormat: ENumberOutputFormat.INTEGER,
          decimalPlaces: 4,
        });
      }}
      curve="monotoneX"
      useMesh={false}
      axisLeft={{
        format: value => {
          if (value instanceof Date) {
            throw new InvariantError("Left axis should not contain date");
          }

          return formatNumber({
            value,
            inputFormat: ENumberInputFormat.ULPS,
            outputFormat: ENumberOutputFormat.INTEGER,
            decimalPlaces: 4,
          });
        },
      }}
      axisBottom={{
        format: value => moment(Number(value)).format("MMM Do YY"),
      }}
    />
  );
};

export { HistoryChart };
