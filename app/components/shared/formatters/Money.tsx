import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { FormatNumber } from "./FormatNumber";
import { FormatShortNumber } from "./FormatShortNumber";
import {
  EAbbreviatedNumberOutputFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  selectDecimalPlaces,
  selectUnits,
  THumanReadableFormat,
  TValueFormat,
} from "./utils";

import * as styles from "./Money.module.scss";

enum ECurrencySymbol {
  CODE = "code",
  NONE = "none",
}

enum EMoneyTransferNew {
  INCOME = styles.income,
  OUTCOME = styles.outcome,
}

enum EThemeNew {
  GREEN = styles.tGreen,
  ORANGE = styles.tOrange,
  GREEN_BIG = styles.tBigValue,
}

interface IMoneyProps {
  value: string | BigNumber | number | null | undefined;
}

interface IMoneyCommonProps {
  inputFormat: ENumberInputFormat;
  valueType: TValueFormat;
  outputFormat: THumanReadableFormat;
  roundingMode?: ERoundingMode;
  currencySymbol?: ECurrencySymbol;
  currencyClassName?: string;
  transfer?: EMoneyTransferNew;
  theme?: EThemeNew;
  defaultValue?: React.ReactChild;
  className?: string;
  "data-test-id"?: string;
}

const Money: React.FunctionComponent<IMoneyProps & IMoneyCommonProps & CommonHtmlProps> = ({
  value,
  inputFormat,
  outputFormat,
  valueType,
  currencySymbol = ECurrencySymbol.CODE,
  defaultValue = "-",
  currencyClassName,
  transfer,
  theme,
  className,
  "data-test-id": dataTestId,
}) => {
  let formattedValue = null;
  if (value) {
    const decimalPlaces = selectDecimalPlaces(valueType, outputFormat);
    if (
      outputFormat === EAbbreviatedNumberOutputFormat.SHORT ||
      outputFormat === EAbbreviatedNumberOutputFormat.LONG
    ) {
      formattedValue = (
        <FormatShortNumber
          value={value}
          inputFormat={inputFormat}
          defaultValue={defaultValue}
          roundingMode={ERoundingMode.HALF_UP}
          decimalPlaces={decimalPlaces}
          outputFormat={outputFormat}
        />
      );
    } else if (
      Object.values(ENumberOutputFormat).includes(outputFormat) &&
      (outputFormat === ENumberOutputFormat.FULL_ROUND_UP ||
        outputFormat === ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP)
    ) {
      formattedValue = (
        <FormatNumber
          value={value}
          defaultValue={defaultValue}
          roundingMode={ERoundingMode.UP}
          decimalPlaces={decimalPlaces}
          inputFormat={inputFormat}
          outputFormat={outputFormat}
        />
      );
    } else {
      formattedValue = (
        <FormatNumber
          value={value}
          defaultValue={defaultValue}
          roundingMode={ERoundingMode.DOWN}
          decimalPlaces={decimalPlaces}
          inputFormat={inputFormat}
          outputFormat={outputFormat}
        />
      );
    }
  }
  return (
    <span className={cn(styles.money, transfer, className, theme)} data-test-id={dataTestId}>
      <span className={cn(styles.value)}>{formattedValue || defaultValue}</span>
      {currencySymbol === ECurrencySymbol.CODE && formattedValue !== null && (
        <span className={cn(styles.currency, currencyClassName)} data-test-id="units">
          {" "}
          {selectUnits(valueType)}
        </span>
      )}
    </span>
  );
};

export { Money, IMoneyCommonProps, EMoneyTransferNew, ECurrencySymbol, EThemeNew };
