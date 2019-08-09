import { THistory } from "../../lib/web3/types";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

type TTokenHistory = {
  currentBalance: string;
  history: THistory[];
};

export type THistoryState = {
  necToken: Record<string, TTokenHistory | undefined>;
};

export const initialState: THistoryState = {
  necToken: {},
};

export const reducer: AppReducer<THistoryState> = (
  state = initialState,
  action,
): DeepReadonly<THistoryState> => {
  switch (action.type) {
    case actions.history.setHistory.getType():
      return {
        ...state,
        necToken: {
          ...state.necToken,
          [action.payload.address]: {
            currentBalance: action.payload.currentBalance,
            history: action.payload.history,
          },
        },
      };

    default:
      return state;
  }
};
