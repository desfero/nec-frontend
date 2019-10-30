import Web3 from "web3";
import { string } from "yup";

const ethereumAddress = string().test(
  "is-ethereum-address",
  "Is not a valid ethereum address",
  Web3.utils.isAddress,
);

export { ethereumAddress };
