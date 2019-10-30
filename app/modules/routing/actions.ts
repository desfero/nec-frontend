import { goBack, push } from "connected-react-router";
import { LocationDescriptorObject, Path } from "history";

import { appRoutes } from "../../components/appRoutes";
import { landingRoutes } from "../../components/landing/landingRoutes";
import { EthereumAddress } from "../../types";
import { withParams } from "../../utils/withParams";
import { createActionFactory } from "../actionsUtils";

export const routingActions = {
  // navigation primitives
  goBack,
  push: (location: Path | LocationDescriptorObject) => push(location as any),

  // default routes
  goHome: () => push(appRoutes.root),

  goToAddressHistory: (address: EthereumAddress) =>
    push(withParams(landingRoutes.addressHistory, { address })),

  // external paths
  openInNewWindow: createActionFactory("OPEN_IN_NEW_WINDOW", (path: string) => ({ path })),
};
