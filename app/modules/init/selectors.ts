import { IAppState } from "../../store";
import { IInitState } from "./reducer";

export const selectIsInitInProgress = (initState: IInitState): boolean =>
  initState.appInit.inProgress || initState.smartcontractsInit.inProgress;

export const selectIsInitDone = (initState: IInitState): boolean =>
  initState.appInit.done || initState.smartcontractsInit.done;

export const selectInitError = (initState: IInitState): string | undefined =>
  initState.appInit.error || initState.smartcontractsInit.error;

export const selectIsSmartContractInitDone = (state: IAppState): boolean =>
  state.init.smartcontractsInit.done;
