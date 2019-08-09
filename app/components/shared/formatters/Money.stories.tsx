import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrencySymbol, EMoneyTransferNew, EThemeNew, Money } from "./Money";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "./utils";

const value = "1234567" + "0".repeat(18);

storiesOf("Money", module)
  .add("default (with token code)", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={value}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.NEU}
        value={value}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR_TOKEN}
        value={value}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.ETH}
        value={value}
      />
    </>
  ))
  .add("with FLOAT input", () => (
    <>
      <Money
        outputFormat={ENumberOutputFormat.FULL}
        inputFormat={ENumberInputFormat.FLOAT}
        valueType={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as Integer", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={ENumberOutputFormat.INTEGER}
        valueType={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as LONG abbrev.", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={EAbbreviatedNumberOutputFormat.LONG}
        valueType={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("output as SHORT abbrev.", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.FLOAT}
        outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
        valueType={ECurrency.EUR}
        value={"1234567"}
      />
    </>
  ))
  .add("with default value", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={undefined}
      />
    </>
  ))
  .add("with custom default value", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={undefined}
        defaultValue={"-- nothing here :) --"}
      />
    </>
  ))
  .add("transfer", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={value}
        transfer={EMoneyTransferNew.INCOME}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={value}
        transfer={EMoneyTransferNew.OUTCOME}
      />
    </>
  ))
  .add("with token code", () => (
    <Money
      inputFormat={ENumberInputFormat.ULPS}
      outputFormat={ENumberOutputFormat.FULL}
      valueType={ECurrency.EUR}
      value={value}
      currencySymbol={ECurrencySymbol.CODE}
    />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={value}
        theme={EThemeNew.GREEN}
      />
      <br />
      <br />
      <p>t-orange</p>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.ETH}
        value={value}
        theme={EThemeNew.ORANGE}
      />
      <br />
      <br />
      <p>big-value</p>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.ETH}
        value={value}
        theme={EThemeNew.GREEN_BIG}
      />
    </>
  ))
  .add("price format", () => (
    <>
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.CODE}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.NONE}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.ETH}
        value={"4212376189" + "0".repeat(10)}
      />
      <br />
      <Money
        inputFormat={ENumberInputFormat.ULPS}
        outputFormat={ENumberOutputFormat.FULL}
        valueType={ECurrency.NEU}
        value={"353212376189" + "0".repeat(10)}
      />
    </>
  ));
