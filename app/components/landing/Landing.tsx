import * as React from "react";

import { Layout } from "../layouts/Layout";
import { History } from "./History";

const Landing: React.FunctionComponent = () => (
  <Layout data-test-id="landing-page">
    <History />
  </Layout>
);

export { Landing };
