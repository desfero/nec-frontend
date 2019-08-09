import * as React from "react";

import { TDataTestId } from "../../types";
import { Content } from "./Content";

import * as styles from "./Layout.module.scss";

type TContentExternalProps = React.ComponentProps<typeof Content>;

const Layout: React.FunctionComponent<TContentExternalProps & TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
  ...contentProps
}) => (
  <div className={styles.layout} data-test-id={dataTestId}>
    <Content {...contentProps}>{children}</Content>
  </div>
);

export { Layout };
