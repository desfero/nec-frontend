import { storiesOf } from "@storybook/react";
import * as React from "react";

import { showErrorToast, showInfoToast, ToastContainer } from "./Toast";

class ErrorToast extends React.Component {
  componentDidMount(): void {
    showErrorToast("The sun fears with death, ransack the seychelles until it stutters.");
  }

  render(): React.ReactNode {
    return <ToastContainer />;
  }
}

class InfoToast extends React.Component {
  componentDidMount(): void {
    showInfoToast("The sun fears with death, ransack the seychelles until it stutters.");
  }

  render(): React.ReactNode {
    return <ToastContainer />;
  }
}

storiesOf("Toast", module)
  .add("error", () => <ErrorToast />)
  .add("info", () => <InfoToast />);
