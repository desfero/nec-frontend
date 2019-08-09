import { Container } from "inversify";
import * as React from "react";
import { hot } from "react-hot-loader/root";
import { compose } from "redux";

import { symbols } from "../di/symbols";
import { ILogger } from "../lib/dependencies/logger";
import { actions } from "../modules/actions";
import { EInitType } from "../modules/init/reducer";
import {
  selectInitError,
  selectIsInitDone,
  selectIsInitInProgress,
} from "../modules/init/selectors";
import { appConnect } from "../store";
import { ContainerContext } from "../utils/InversifyProvider";
import { onEnterAction } from "../utils/OnEnterAction";
import { withRootMetaTag } from "../utils/withMetaTags.unsafe";
import { AppRouter } from "./AppRouter";
import { CriticalError } from "./layouts/CriticalError";
import { LoadingIndicator } from "./shared/loading-indicator";
import { ToastContainer } from "./shared/Toast";

interface IState {
  renderingError: Error | null;
}

interface IStateProps {
  inProgress: boolean;
  done: boolean;
  error?: string;
}

class AppComponent extends React.Component<IStateProps, IState> {
  static contextType = ContainerContext;

  logger: ILogger;

  constructor(props: IStateProps, container: Container) {
    super(props);

    this.state = { renderingError: null };

    this.logger = container.get<ILogger>(symbols.logger);
  }

  componentDidCatch(error: Error, errorInfo: object): void {
    this.setState({ renderingError: error });

    this.logger.fatal("Fatal app error", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.props.error) {
      return <CriticalError message={this.props.error} />;
    }

    if (this.state.renderingError) {
      return <CriticalError message={this.state.renderingError.message} />;
    }

    if (this.props.inProgress) {
      return <LoadingIndicator />;
    }

    return (
      <>
        <AppRouter />
        <ToastContainer />
      </>
    );
  }
}

const App = compose<React.ComponentClass>(
  withRootMetaTag(),
  onEnterAction({
    actionCreator: d => d(actions.init.start(EInitType.APP_INIT)),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      inProgress: selectIsInitInProgress(s.init),
      done: selectIsInitDone(s.init),
      error: selectInitError(s.init),
    }),
  }),
)(AppComponent);

const AppHot = hot(App);

export { AppHot as App };
