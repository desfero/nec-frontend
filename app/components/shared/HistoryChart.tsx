import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
import * as React from "react";

import { selectHistory } from "../../modules/history/selectors";
import { InvariantError } from "../../utils/invariant";
import { normalizeBalanceHistory } from "../../utils/normalizeHistory";
import { ENumberInputFormat, ENumberOutputFormat, formatNumber } from "./formatters/utils";

type TExternalProps = {
  necHistory: ReturnType<typeof selectHistory>;
};

const HistoryChart: React.FunctionComponent<TExternalProps> = ({ necHistory }) => {
  const normalizedHistory = normalizeBalanceHistory(necHistory.history);

  const reducedHistory = normalizedHistory.reduceRight((p, [timestamp, difference]) => {
    if (p.length === 0) {
      return [[timestamp, difference.plus(necHistory.currentBalance)]];
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
            y: amount.toString(),
            x: date,
          })),
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
