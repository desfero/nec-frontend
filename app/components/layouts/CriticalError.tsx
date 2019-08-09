import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { RollingSadFace } from "../shared/RollingSadFace";

import * as styles from "./CriticalError.module.scss";

type TExternalProps = {
  message?: string;
};

const CriticalError: React.FunctionComponent<TExternalProps> = ({ message }) => (
  <section className={styles.section} data-test-id="critical-error-page">
    <RollingSadFace />
    <h1 className={styles.header}>
      <FormattedMessage id="critical-error.heading" />
    </h1>
    {message && (
      <p className={styles.errorDetail} data-test-id="critical-error-page-error-detail">
        <FormattedMessage id="critical-error.error-detail" values={{ message }} />
      </p>
    )}
    <p className={styles.description}>
      <FormattedHTMLMessage tagName="span" id="critical-error.paragraph" />
    </p>
  </section>
);

export { CriticalError };
