import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Layout } from "./Layout";

const FakeContent = () => <div style={{ height: "20rem", backgroundColor: "gray" }} />;

storiesOf("Layouts", module).add("default", () => (
  <Layout>
    <FakeContent />
  </Layout>
));
