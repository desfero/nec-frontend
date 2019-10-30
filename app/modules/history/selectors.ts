import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";
import { toChecksumAddress } from "../../utils/toChecksumAddress";

export const selectHistory = (appState: IAppState, address: EthereumAddress) => {
  const checksumAddress = toChecksumAddress(address);
  return appState.history.necToken[checksumAddress];
};
