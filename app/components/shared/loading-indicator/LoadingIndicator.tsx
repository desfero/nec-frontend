import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { assertNever } from "../../../utils/assertNever";

import * as styles from "./LoadingIndicator.module.scss";

export enum ELoadingIndicator {
  PULSE = "pulse",
}

interface ILoadingIndicatorProps {
  light?: boolean;
  type?: ELoadingIndicator;
}

const LoadingIndicator: React.FunctionComponent<ILoadingIndicatorProps & CommonHtmlProps> = ({
  className,
  light,
  type = ELoadingIndicator.PULSE,
}) => {
  switch (type) {
    case ELoadingIndicator.PULSE:
      return (
        <div>
          <div
            data-test-id="loading-indicator-pulse"
            className={cn(className, styles.pulse, { [styles.light]: light })}
          />
        </div>
      );
    default:
      return assertNever(type, `Invalid loading indicator type "${type}"`);
  }
};

export { LoadingIndicator };
