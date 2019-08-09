import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ExternalLink } from "./ExternalLink";

storiesOf("links/ExternalLink", module)
  .add("default", () => <ExternalLink href="neufund.org">Neufund</ExternalLink>)
  .add("without child", () => <ExternalLink href="neufund.org" />);
