import * as React from "react";

import { Layout } from "../layouts/Layout";
import { Balances } from './Balances';

const Landing: React.FunctionComponent = () => (
  <Layout data-test-id="landing-page">
    <Balances />
  </Layout>
);

export { Landing };
