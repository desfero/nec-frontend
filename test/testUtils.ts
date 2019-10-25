import { AssertionError, expect } from "chai";
import { isFunction, omit } from "lodash";
import { spy } from "sinon";

import { invariant } from "../app/utils/invariant";

// helper to generate quickly selector for data-test-ids
export function tid(id: string, rest?: string): string {
  return `[data-test-id="${id}"]` + (rest ? ` ${rest}` : "");
}

export interface IMockFns<T> {
  // updates provided method mocks
  reMock: (newMock: Partial<T>) => void;
}

export function createMock<T>(
  clazz: new (...args: any[]) => T,
  mockImpl: Partial<T>,
): T & IMockFns<T> {
  const callGuard = (methodName: string) => (...args: any[]) => {
    throw new Error(`Unexpected call to method: '${methodName}' with args: ${args}`);
  };
  // @todo: createMock can wrap whole object in proxy and prevent any access to not defined props

  const methods = clazz.prototype;
  const allMethods = new Set<string>();
  Object.getOwnPropertyNames(methods).forEach(name => allMethods.add(name));
  Object.keys(mockImpl).forEach(name => allMethods.add(name));
  allMethods.delete("constructor");

  let mock: any = {};

  allMethods.forEach(methodName => {
    const userProvidedMock = (mockImpl as any)[methodName];
    if (userProvidedMock && isFunction(userProvidedMock)) {
      mock[methodName] = spy(userProvidedMock);
    } else if ((mock[methodName] = userProvidedMock)) {
      mock[methodName] = userProvidedMock;
    } else {
      mock[methodName] = callGuard(methodName);
    }
  });

  invariant(
    !mock.reMock,
    "Cannot properly attach mock utils. 'reMock' function already exists on mocked object!",
  );
  mock.reMock = (newMock: Partial<T>) => {
    const methodsToReMock = Object.keys(newMock);
    methodsToReMock.forEach(methodName => {
      mock[methodName] = spy((newMock as any)[methodName]);
    });
  };

  return mock;
}

export async function expectToBeRejected(
  functionCallWrapper: () => Promise<any>,
  expectedError: Error,
): Promise<any> {
  let thrown = false;
  try {
    await functionCallWrapper();
  } catch (actualError) {
    thrown = true;
    errorEquality(actualError, expectedError);
  } finally {
    if (!thrown) {
      throw new AssertionError("Expected to throw but it did not.");
    }
  }
}

export function errorEquality(actual: Error, expected: Error): void {
  expect(actual.message).to.be.eq(expected.message);
  expect(omit(actual, ["stack"])).to.be.deep.eq(omit(expected, ["stack"]));
}
