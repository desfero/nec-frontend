import { IAppState } from "../../store";
import { EthereumAddress } from "../../types";

export const selectHistory = (appState: IAppState, address: EthereumAddress) => appState.history.necToken[address];
