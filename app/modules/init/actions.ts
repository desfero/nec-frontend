import { createActionFactory } from "../actionsUtils";
import { EInitType } from "./reducer";

export const initActions = {
  start: createActionFactory("INIT_START", (initType: EInitType) => ({ initType })),
  done: createActionFactory("INIT_DONE", (initType: EInitType) => ({ initType })),
  error: createActionFactory("INIT_ERROR", (initType: EInitType, errorMsg?: string) => ({
    initType,
    errorMsg,
  })),
};
