import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { OmitKeys } from "../../../types";

type TProps = OmitKeys<
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "target" | "rel"
>;

/**
 * Generate anchor tag with target="_blank" and correct rel value to prevent tabnabbing
 * See https://www.owasp.org/index.php/Reverse_Tabnabbing
 */
const ExternalLink: React.FunctionComponent<TProps> = ({ href, children, ...rest }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
    {children || href}
    {/* Hide accessibility improvement on e2e tests as often we get text content of anchor to compare with some pattern */}
    {!process.env.IS_CYPRESS && (
      <span className="sr-only">
        (<FormattedMessage id="links.external-link.opens-in-new-window" />)
      </span>
    )}
  </a>
);

export { ExternalLink };
