import { THistory } from "../../lib/web3/types";
import { EthereumAddress, EthereumAddressWithChecksum } from "../../types";
import { createActionFactory } from "../actionsUtils";

export const historyActions = {
  loadHistory: createActionFactory("HISTORY_LOAD_HISTORY", (address: EthereumAddress) => ({
    address,
  })),
  setHistory: createActionFactory(
    "HISTORY_SET_HISTORY",
    (address: EthereumAddressWithChecksum, currentBalance: string, history: THistory[]) => ({ address, currentBalance, history }),
  ),
};
