import { ReactWrapper } from "enzyme";
import * as lolex from "lolex";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { LolexClockAsync } from "../typings/lolex";
import { tid } from "./testUtils";

const defaultTranslations = require("../intl/locales/en-en.json");

export const setupFakeClock = (now?: number) => {
  let wrapper: { fakeClock: LolexClockAsync<any> } = {} as any;

  beforeEach(() => {
    // note: we use custom fork of lolex providing tickAsync function which should be used to await for any async actions triggered by tick. Read more: https://github.com/sinonjs/lolex/pull/105
    // TODO: check why typings are not accurate here
    wrapper.fakeClock = lolex.install(now as any);
  });

  afterEach(() => {
    wrapper.fakeClock.uninstall();
  });

  return wrapper;
};

export function clickFirstTid(component: ReactWrapper, id: string): void {
  component
    .find(tid(id))
    .first()
    .simulate("click");
}

export async function waitForTid(component: ReactWrapper, id: string): Promise<void> {
  // wait until event queue is empty :/ currently we don't have a better way to solve it
  let waitTime = 20;
  while (--waitTime > 0 && component.find(tid(id)).length === 0) {
    await Promise.resolve();
    component.update();
  }

  if (waitTime === 0) {
    throw new Error(`Timeout while waiting for '${id}'`);
  }
}
export async function waitForPredicate(predicate: () => boolean, errorMsg: string): Promise<void> {
  // wait until event queue is empty :/ currently we don't have a better way to solve it
  let waitTime = 20;
  while (--waitTime > 0 && !predicate()) {
    await Promise.resolve();
  }

  if (waitTime === 0) {
    throw new Error(`Timeout while waiting for '${errorMsg}'`);
  }
}

export async function waitUntilDoesntThrow(
  globalFakeClock: LolexClockAsync<any>,
  fn: () => any,
  errorMsg: string,
): Promise<void> {
  // wait until event queue is empty :/ currently we don't have a better way to solve it
  let waitTime = 20;
  let lastError: any;
  while (--waitTime > 0) {
    try {
      fn();
      break;
    } catch (e) {
      await globalFakeClock.tickAsync(1);
      lastError = e;
    }
  }

  if (waitTime === 0) {
    throw new Error(
      `Timeout while waiting for '${errorMsg}'. Original error: ${lastError && lastError.message}`,
    );
  }
}

export function wrapWithIntl(component: React.ReactElement<any>): React.ReactElement<any> {
  return (
    <IntlProvider locale="en-en" messages={defaultTranslations}>
      {component}
    </IntlProvider>
  );
}

const getCurrentSubmitCount = (element: ReactWrapper<any, any>) =>
  element.find(tid("test-form-submit-count")).text();

export const submit = async (element: ReactWrapper<any, any>): Promise<void> => {
  const currentCount = getCurrentSubmitCount(element);

  clickFirstTid(element, "test-form-submit");

  await waitForPredicate(
    () => currentCount !== getCurrentSubmitCount(element),
    "Waiting for form to be submitted",
  );
};
