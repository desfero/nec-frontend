import BigNumber from "bignumber.js";

import { DEFAULT_DECIMAL_PLACES, MONEY_DECIMALS } from "../../../config/constants";
import { Opaque } from "../../../types";
import { invariant } from "../../../utils/invariant";

export enum ERoundingMode {
  UP = "up",
  DOWN = "down",
  HALF_UP = "half_up",
  HALF_DOWN = "half_down",
}

export enum ENumberInputFormat {
  ULPS = "ulps",
  FLOAT = "float",
}

export enum ECurrency {
  NEU = "neu",
  EUR = "eur",
  EUR_TOKEN = "eur_t",
  ETH = "eth",
}

export enum ENumberFormat {
  PERCENTAGE = "percentage",
}

export enum EPriceFormat {
  EQUITY_TOKEN_PRICE_ETH = "equityTokenPriceEth",
  EQUITY_TOKEN_PRICE_EURO = "equityTokenPriceEuro",
  EQUITY_TOKEN_PRICE_EUR_TOKEN = "equityTokenPriceEuroToken",
  SHARE_PRICE = "sharePrice",
}

export enum ENumberOutputFormat {
  INTEGER = "integer",
  ONLY_NONZERO_DECIMALS = "onlyNonzeroDecimals", // see removeZeroDecimals unit test
  FULL = "full",
  ONLY_NONZERO_DECIMALS_ROUND_UP = "onlyNonzeroDecimalsRoundUp", // see removeZeroDecimals unit test
  FULL_ROUND_UP = "fullRoundUp",
}

export enum EAbbreviatedNumberOutputFormat {
  LONG = "long",
  SHORT = "short",
}

export type THumanReadableFormat = ENumberOutputFormat | EAbbreviatedNumberOutputFormat;

export enum ESpecialNumber {
  UNLIMITED = "unlimited",
}

export type EquityToken = Opaque<"EquityToken", string>;

export type TValueFormat = ECurrency | EPriceFormat | ENumberFormat | EquityToken;

interface IToFixedPrecision {
  value: string | BigNumber | number;
  roundingMode?: ERoundingMode;
  inputFormat?: ENumberInputFormat;
  decimalPlaces: number | undefined;
  isPrice?: boolean;
  outputFormat?: THumanReadableFormat;
}

interface IFormatNumber {
  value: string | BigNumber | number;
  roundingMode?: ERoundingMode;
  inputFormat?: ENumberInputFormat;
  decimalPlaces?: number;
  isPrice?: boolean;
  outputFormat?: THumanReadableFormat;
}

export const selectDecimalPlaces = (
  valueType: TValueFormat,
  outputFormat: THumanReadableFormat = ENumberOutputFormat.FULL,
): number => {
  if (
    outputFormat !== ENumberOutputFormat.FULL &&
    outputFormat !== ENumberOutputFormat.FULL_ROUND_UP &&
    outputFormat !== ENumberOutputFormat.ONLY_NONZERO_DECIMALS &&
    outputFormat !== ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP
  ) {
    return 0;
  } else {
    switch (valueType) {
      case EPriceFormat.SHARE_PRICE:
      case ECurrency.EUR:
      case ECurrency.EUR_TOKEN:
        return 2;
      case EPriceFormat.EQUITY_TOKEN_PRICE_ETH:
      case EPriceFormat.EQUITY_TOKEN_PRICE_EURO:
      case EPriceFormat.EQUITY_TOKEN_PRICE_EUR_TOKEN:
      case ECurrency.ETH:
      case ECurrency.NEU:
      case ENumberFormat.PERCENTAGE:
      default:
        return DEFAULT_DECIMAL_PLACES;
    }
  }
};

export const convertFromUlps = (value: BigNumber, baseFactor: number) =>
  value.div(new BigNumber(10).pow(baseFactor));

export function formatThousands(value?: string): string {
  // todo remove optionality. This function should accept string only. Leave for now for backward compat.
  if (!value) return "";
  const splitByDot = value.split(".");

  invariant(splitByDot.length <= 2, "Can't format this number: " + value);

  const formattedBeforeDot = splitByDot[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  if (splitByDot.length === 2) {
    return `${formattedBeforeDot}.${splitByDot[1]}`;
  }
  return formattedBeforeDot;
}

export const removeZeroDecimals = (value: string): string => {
  const splitByDot = value.split(".");
  invariant(splitByDot.length <= 2, "Can't format this number: " + value);
  if (splitByDot[1] !== undefined && splitByDot[1].match(/^0+$/g)) {
    return splitByDot[0];
  } else {
    return value;
  }
};

function getBigNumberRoundingMode(
  roundingMode: ERoundingMode,
  outputFormat: THumanReadableFormat = ENumberOutputFormat.FULL,
): any {
  if (
    outputFormat === ENumberOutputFormat.FULL_ROUND_UP ||
    outputFormat === ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP
  ) {
    return BigNumber.ROUND_UP;
  } else if (outputFormat === ENumberOutputFormat.INTEGER) {
    return BigNumber.ROUND_HALF_DOWN;
  } else {
    switch (roundingMode) {
      case ERoundingMode.DOWN:
        return BigNumber.ROUND_DOWN;
      case ERoundingMode.HALF_DOWN:
        return BigNumber.ROUND_HALF_DOWN;
      case ERoundingMode.HALF_UP:
        return BigNumber.ROUND_HALF_UP;
      case ERoundingMode.UP:
      default:
        return BigNumber.ROUND_UP;
    }
  }
}

export const toFixedPrecision = ({
  value,
  roundingMode = ERoundingMode.UP,
  inputFormat = ENumberInputFormat.ULPS,
  decimalPlaces = undefined,
  outputFormat = ENumberOutputFormat.FULL,
}: IToFixedPrecision): string => {
  invariant(
    value !== null &&
      (typeof value === "string" || typeof value === "number" || value instanceof BigNumber) &&
      !(typeof value === "string" && value.trim() === "") &&
      !(typeof value === "number" && (Number.isNaN(value) || !Number.isFinite(value))),
    `cannot format this number: ${value} ${typeof value}`,
  );

  const dp = outputFormat === ENumberOutputFormat.INTEGER ? 0 : decimalPlaces;
  const asBigNumber = value instanceof BigNumber ? value : new BigNumber(value.toString());

  const moneyInPrimaryBase =
    inputFormat === ENumberInputFormat.ULPS
      ? convertFromUlps(asBigNumber, MONEY_DECIMALS)
      : asBigNumber;
  return moneyInPrimaryBase.toFixed(dp, getBigNumberRoundingMode(roundingMode, outputFormat));
};

/* formatNumber only formats numbers for display (!).
 * invalid input (null/undefined etc) should be handled before calling this fn, this one will only throw.
 * we don't check for strings in a wrong format here,
 * since 99% of input vals is from the store so it should be in the right format already,
 * and user input should handle this on its own before calling this fn
 * */
/* SHORT and LONG formats are not handled by this fn, it's the job of the FormatShortNumber components */
export const formatNumber = ({
  value,
  roundingMode = ERoundingMode.DOWN,
  inputFormat = ENumberInputFormat.ULPS,
  decimalPlaces,
  outputFormat = ENumberOutputFormat.FULL,
}: IFormatNumber): string => {
  const asFixedPrecisionNumber = toFixedPrecision({
    value,
    roundingMode,
    inputFormat,
    outputFormat,
    decimalPlaces,
  });

  return outputFormat === ENumberOutputFormat.ONLY_NONZERO_DECIMALS ||
    outputFormat === ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP
    ? formatThousands(removeZeroDecimals(asFixedPrecisionNumber))
    : formatThousands(asFixedPrecisionNumber);
};

export const parseInputToNumber = (val: string | undefined): string | null => {
  if (!val || val.trim() === "") {
    return "";
  }

  let value = val.trim().replace(/\s/g, "");

  if (val.match(/^\d+$/)) {
    return value;
  }

  const digits = value.match(/\d|,|\./g);
  if (digits === null || digits.length < value.length) {
    /* there are non-digit and non-separator characters: 123a,123 */
    return null;
  }

  if (value.match(/^(\d+([.,]))+\d+$/) === null) {
    /* 123. | 123, | ,123 | .123 | 123..123 | 123,,123 | 123.,123 */
    return null;
  }

  const periods = value.match(/\./g);
  const commas = value.match(/,/g);
  if (periods && periods.length > 1 && commas && commas.length > 1) {
    /* 213.324.234,43,8 */
    return null;
  }
  if (value.match(/\d+\.\d+,\d+\./g) || value.match(/\d+,\d+\.\d+,/g)) {
    return null; /* 123.123,123.123 || 123,123.123,123 */
  }
  if (periods && commas && (value.match(/(,\d+){2,}$/) || value.match(/(\.\d+){2,}$/))) {
    return null; /*123.123,123,123 | 123,123.123.123 */
  }
  if (periods && periods.length === 1 && commas && commas.length === 1) {
    /* 222.222,22 | 222,222.22 */
    value = value.replace(/([.,])(?=\d+$)/, ".");
    value = value.replace(/(^\d+)([.,])/, "$1");
  }

  if (periods && periods.length > 1) {
    /* 213.213.44 thousands separators */
    value = value.replace(/\./g, "");
  } else if (periods && periods.length === 1) {
    /* 222.22 decimal sep */
    // do nothing
  }

  if (commas && commas.length > 1) {
    /* 213,213,44 thousands separators */
    value = value.replace(/,/g, "");
  } else if (commas && commas.length === 1) {
    /* 222,22 decimal sep */
    value = value.replace(/,/g, ".");
  }

  return value;
};

/* this is only to check if the user input/formik value is empty */
export const isEmptyValue = (val: string | undefined) => val === undefined || val.trim() === "";

export const isValidNumber = (val: string | undefined) => {
  if (!val) {
    return false;
  }
  const value = val.trim().replace(/\s/g, "");

  return value.match(/^\d+([.,]\d+)?$/) !== null;
};

export const stripNumberFormatting = (value: string) => {
  if (isEmptyValue(value)) {
    return "";
  } else if (isValidNumber(value)) {
    // remove whitespaces and trailing zeroes from decimal part if it's there
    const splitValue = value.replace(/ /g, "").split(".");
    invariant(
      splitValue.length === 1 || splitValue.length === 2,
      `stripNumberFormatting: Can't handle this input: " ${value}`,
    );

    if (splitValue.length === 2) {
      const trimmedValue = splitValue[1].replace(/0+$/, "");
      return trimmedValue.length ? `${splitValue[0]}.${trimmedValue}` : splitValue[0];
    } else {
      return splitValue.join(".");
    }
  } else {
    return value;
  }
};

export const selectUnits = (valueType: TValueFormat): string => {
  switch (valueType) {
    case ECurrency.ETH:
    case EPriceFormat.EQUITY_TOKEN_PRICE_ETH:
      return "ETH";
    case ECurrency.NEU:
      return "NEU";
    case ECurrency.EUR:
    case EPriceFormat.EQUITY_TOKEN_PRICE_EURO:
    case EPriceFormat.SHARE_PRICE: //share prices are always in euro
      return "EUR";
    case ECurrency.EUR_TOKEN:
    case EPriceFormat.EQUITY_TOKEN_PRICE_EUR_TOKEN:
      return "nEUR";
    case ENumberFormat.PERCENTAGE:
      return "%";
    default:
      return valueType;
  }
};
