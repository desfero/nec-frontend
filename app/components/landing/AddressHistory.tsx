import * as React from "react";
import { Redirect } from "react-router-dom";
import { branch, compose, renderComponent } from "recompose";
import Web3 from "web3";

import { actions } from "../../modules/actions";
import { selectHistory } from "../../modules/history/selectors";
import { appConnect } from "../../store";
import { EthereumAddress } from "../../types";
import { appRoutes } from "../appRoutes";
import { Money } from "../shared/formatters/Money";
import { ENumberInputFormat, ENumberOutputFormat, EquityToken } from "../shared/formatters/utils";
import { HistoryChart } from "../shared/HistoryChart";
import { EtherscanAddressLink } from "../shared/links/EtherscanLink";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";

import * as styles from "./AddressHistory.module.scss";

type TExternalProps = { address: EthereumAddress };

type TStateProps = {
  necHistory: ReturnType<typeof selectHistory>;
};

type TDispatchProps = {
  loadHistory: (address: EthereumAddress) => void;
};

const AddressHistoryLayout: React.FunctionComponent<
  TExternalProps & TDispatchProps & TStateProps
> = ({ address, loadHistory, necHistory }) => {
  React.useEffect(() => {
    loadHistory(address);
  }, [address]);

  if (necHistory) {
    return (
      <section className="mt-4">
        <p className="mb-0">
          History for <EtherscanAddressLink address={address} />
        </p>
        <p>
          Balance:{" "}
          <Money
            value={necHistory.currentBalance}
            valueType={"NEC" as EquityToken}
            inputFormat={ENumberInputFormat.ULPS}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
          />
        </p>
        {necHistory.history.length > 0 ? (
          <div className={styles.historyChart}>
            <HistoryChart necHistory={necHistory} />
          </div>
        ) : (
          <p>No transactions recorded from last 30 days</p>
        )}
      </section>
    );
  }

  return <LoadingIndicator />;
};

const AddressHistory = compose<TStateProps & TDispatchProps & TExternalProps, TExternalProps>(
  branch<TExternalProps>(
    props => !Web3.utils.isAddress(props.address),
    renderComponent(() => <Redirect to={appRoutes.root} />),
  ),
  appConnect<TStateProps, TDispatchProps, TExternalProps>({
    stateToProps: (state, { address }) => ({
      necHistory: selectHistory(state, address),
    }),
    dispatchToProps: dispatch => ({
      loadHistory: (address: EthereumAddress) => dispatch(actions.history.loadHistory(address)),
    }),
  }),
)(AddressHistoryLayout);

export { AddressHistory };
