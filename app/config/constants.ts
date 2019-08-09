import BigNumber from "bignumber.js";

/**
 * We assume common digits for all currencies on our platform.
 */
export const MONEY_DECIMALS = 18;

export const DEFAULT_DECIMAL_PLACES = 4;

/**
 * Useful for money related calculations
 */
export const Q18 = new BigNumber(10).pow(MONEY_DECIMALS);

/**
 * Constants for react components
 */
export const TOAST_COMPONENT_DELAY = 4000;
