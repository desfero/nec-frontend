import { LocationChangeAction } from "connected-react-router";
import { StringableActionCreator } from "redux-saga/effects";

import { TDictionaryValues } from "../types";
import { historyActions } from "./history/actions";
import { initActions } from "./init/actions";
import { routingActions } from "./routing/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  init: initActions,
  routing: routingActions,
  history: historyActions,
};

/**
 * Build action union type
 */
type TActions = typeof actions;

type TAllActions = TActions[keyof TActions];
type TActionCreatorsUnionType = TDictionaryValues<TAllActions>;

export type TAction = ReturnType<TActionCreatorsUnionType> | LocationChangeAction;
export type TActionType = TAction["type"];

type ExtractActionTypeFromCreator<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => { type: infer P }
  ? P
  : never;
export type TActionFromCreator<T extends (...args: any[]) => any> = Extract<
  TAction,
  { type: ExtractActionTypeFromCreator<T> }
>;

type ExtractPayload<T extends TAction> = T extends { payload: infer P } ? P : never;

type TActionPayloadFromType<T extends TActionType> = ExtractPayload<Extract<TAction, { type: T }>>;

export type TPattern = TActionType | StringableActionCreator<TAction>;

export type TActionPayload<T extends TPattern> = T extends StringableActionCreator<TAction>
  ? TActionPayloadFromCreator<T>
  : T extends TActionType
  ? TActionPayloadFromType<T>
  : never;

export type TActionPayloadFromCreator<T extends (...args: any[]) => any> = ExtractPayload<
  Extract<TAction, { type: ExtractActionTypeFromCreator<T> }>
>;
