import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { selectHistory } from "../../modules/history/selectors";
import { appConnect } from "../../store";
import { EthereumAddress } from "../../types";
import { Money } from "../shared/formatters/Money";
import { ENumberInputFormat, ENumberOutputFormat, EquityToken } from "../shared/formatters/utils";
import { HistoryChart } from "../shared/HistoryChart";

type TStateProps = {
  necHistory: ReturnType<typeof selectHistory>;
};

type TDispatchProps = {
  loadHistory: (address: EthereumAddress) => void;
};

const BalancesLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  loadHistory,
  necHistory,
}) => (
  <>
    <button
      onClick={() => loadHistory("0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa" as EthereumAddress)}
    >
      Load
    </button>

    {necHistory && (
      <>
        <p>
          Balance:{" "}
          <Money
            value={necHistory.currentBalance}
            valueType={"NEC" as EquityToken}
            inputFormat={ENumberInputFormat.ULPS}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          />
        </p>
        <HistoryChart necHistory={necHistory} />
      </>
    )}
  </>
);

const Balances = compose<TStateProps & TDispatchProps, {}>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      necHistory: selectHistory(state, "0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa"),
    }),
    dispatchToProps: dispatch => ({
      loadHistory: (address: EthereumAddress) => dispatch(actions.history.loadHistory(address)),
    }),
  }),
)(BalancesLayout);

export { Balances };
