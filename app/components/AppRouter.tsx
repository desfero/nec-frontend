import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../utils/connectedRouting";
import { appRoutes } from "./appRoutes";
import { Landing } from "./landing/Landing";
import { TestCriticalError } from "./testing/critical-error/TestCriticalError";
import { e2eRoutes } from "./testing/e2eRoutes";

export const AppRouter: React.FunctionComponent = () => (
  <SwitchConnected>
    <Route path={appRoutes.root} component={Landing} />

    {/*Routes used only in E2E tests*/}
    {!!process.env.IS_CYPRESS && [
      <Route key={2} path={e2eRoutes.criticalError} render={() => <TestCriticalError />} exact />,
    ]}

    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);
