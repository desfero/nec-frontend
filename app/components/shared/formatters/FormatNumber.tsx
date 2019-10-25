import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import {
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatNumber,
  THumanReadableFormat,
} from "./utils";

import * as styles from "./FormatNumber.module.scss";

interface IComponentProps {
  value: string | BigNumber | number | undefined | null;
  defaultValue?: React.ReactChild;
  roundingMode?: ERoundingMode;
  decimalPlaces?: number;
  inputFormat: ENumberInputFormat;
  outputFormat: THumanReadableFormat;
  className?: string;
  "data-test-id"?: string;
}

export const FormatNumber: React.FunctionComponent<IComponentProps> = ({
  value,
  defaultValue = "",
  roundingMode = ERoundingMode.DOWN,
  decimalPlaces = 4,
  inputFormat,
  outputFormat = ENumberOutputFormat.FULL,
  className,
  "data-test-id": dataTestId,
}) => {
  if (value) {
    return (
      <span
        className={cn(styles.noBreak, className)}
        data-test-id={dataTestId ? dataTestId : "value"}
      >
        {formatNumber({ value, inputFormat, outputFormat, roundingMode, decimalPlaces })}
      </span>
    );
  } else {
    return <span data-test-id="value">{defaultValue}</span>;
  }
};
