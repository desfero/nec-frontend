import { expect } from "chai";
import { delay } from "redux-saga";

import { setupFakeClock } from "../../test/integrationTestUtils.unsafe";
import { promiseTimeout } from "./promiseTimeout";

describe("promiseTimeout", () => {
  const clock = setupFakeClock();

  it("should return promise value if resolved within time frame", async () => {
    const expectedReturnValue = 2;
    const fastPromise = async () => {
      await delay(500);
      return expectedReturnValue;
    };

    const actualReturnValuePromise = promiseTimeout({
      promise: fastPromise(),
      defaultValue: 5,
      timeout: 1000,
    });

    clock.fakeClock.tick(500);
    const actualReturnValue = await actualReturnValuePromise;
    // this shouldn't do anything
    clock.fakeClock.tick(500);

    expect(actualReturnValue).to.be.eq(expectedReturnValue);
  });

  it("should return default value on timeout", async () => {
    const expectedReturnValue = 2;
    const fastPromise = async () => {
      await delay(1000);
      return 42;
    };

    const actualReturnValuePromise = promiseTimeout({
      promise: fastPromise(),
      defaultValue: expectedReturnValue,
      timeout: 500,
    });

    clock.fakeClock.tick(500);
    const actualReturnValue = await actualReturnValuePromise;
    // this shouldn't do anything
    clock.fakeClock.tick(500);

    expect(actualReturnValue).to.be.eq(expectedReturnValue);
  });
});
