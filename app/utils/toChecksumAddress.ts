import Web3 from "web3";

import { EthereumAddress, EthereumAddressWithChecksum } from "../types";

const toChecksumAddress = (address: EthereumAddress) =>
  Web3.utils.toChecksumAddress(address) as EthereumAddressWithChecksum;

export { toChecksumAddress };
