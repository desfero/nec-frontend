import * as React from "react";

const TestCriticalError: React.FunctionComponent = () => {
  throw new Error("Test Critical Error");
};

export { TestCriticalError };
