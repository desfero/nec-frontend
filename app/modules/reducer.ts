import { reducer as historyReducer } from "./history/reducer";
import { initReducer } from "./init/reducer";

// add new app reducers here. They must be AppReducer<T> type
export const appReducers = {
  init: initReducer,
  history: historyReducer,
};
