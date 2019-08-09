import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { ExternalLink } from "./ExternalLink";

interface IEtherscanTxLink {
  txHash: string;
}

const trimEthereumHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-4)}`;

const EtherscanTxLink: React.FunctionComponent<IEtherscanTxLink & CommonHtmlProps> = ({
  txHash,
  children,
  ...props
}) => (
  <ExternalLink href={`https://etherscan.io/tx/${txHash}`} {...props}>
    {children || trimEthereumHash(txHash)}
  </ExternalLink>
);

interface IEtherscanAddressLink {
  address: string;
}

const EtherscanAddressLink: React.FunctionComponent<IEtherscanAddressLink & CommonHtmlProps> = ({
  address,
  children,
  ...props
}) => (
  <ExternalLink href={`https://etherscan.io/address/${address}`} {...props}>
    {children || trimEthereumHash(address)}
  </ExternalLink>
);

export { EtherscanTxLink, EtherscanAddressLink };
