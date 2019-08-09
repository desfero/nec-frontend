import { THistory } from "../../lib/web3/types";
import { EthereumAddress } from "../../types";
import { createActionFactory } from "../actionsUtils";

export const historyActions = {
  loadHistory: createActionFactory("HISTORY_LOAD_HISTORY", (address: EthereumAddress) => ({
    address,
  })),
  setHistory: createActionFactory(
    "HISTORY_SET_HISTORY",
    (address: EthereumAddress, currentBalance: string, history: THistory[]) => ({ address, currentBalance, history }),
  ),
};
