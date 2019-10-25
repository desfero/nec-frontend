import BigNumber from "bignumber.js";
import { FormikContext } from "formik";
import { CSSProperties, ReactElement } from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { ToastOptions } from "react-toastify";

export type Dictionary<T> = Record<string, T>;

// opaque types can provide semantic information to simpler types like strings etc
// read: https://codemix.com/opaque-types-in-javascript/
type Opaque<K, T> = T & { __TYPE__: K };

export type EthereumNetworkId = Opaque<"EthereumNetworkId", string>;
export type EthereumTxHash = Opaque<"EthereumTxHash", string>;
export type EthereumAddress = Opaque<"EthereumAddress", string>;
export type EthereumAddressWithChecksum = Opaque<"EthereumAddressWithChecksum", string>;
export type FunctionWithDeps = Opaque<"FunctionWithDeps", Function>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};

export type TDictionaryValues<T> = T extends Dictionary<infer U> ? U : never;
export type TDictionaryArrayValues<T> = T extends Array<Dictionary<infer U>> ? U : never;

export type Primitive = string | number | boolean | undefined | null;

/**
 * Types allowed to keep as writable
 */
type WhitelistedWritableTypes = Date | BigNumber;
export type DeepReadonly<T> = T extends Primitive | WhitelistedWritableTypes
  ? T
  : T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Function
  ? T
  : DeepReadonlyObject<T>;

export type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type DeepWritable<T> = T extends Primitive | WhitelistedWritableTypes | Function
  ? T
  : T extends (any[] | ReadonlyArray<any>)
  ? IWritableArray<T[number]>
  : DeepWritableObject<T>;
type DeepWritableObject<T> = { -readonly [P in keyof T]: DeepWritable<T[P]> };
interface IWritableArray<T> extends Array<DeepWritable<T>> {}

// we dont use AllHtmlAttributes because they include many more fields which can collide easily with components props (like data)
export type CommonHtmlProps = {
  className?: string;
  style?: CSSProperties;
};

export type TTranslatedString = string | ReactElement<FormattedMessage.Props>;

export type TDataTestId = {
  "data-test-id"?: string;
};

export type ToastWithTestData = ToastOptions & TDataTestId;

/**
 * Allows either T or T[]
 */
export type TSingleOrArray<T> = T | T[];

/**
 * From T, omit a set of properties whose keys are in the union K
 * @example OmitKeys<{ foo: boolean, bar: string }, "foo"> // { bar: string }
 */
export type OmitKeys<T, K> = Pick<T, Exclude<keyof T, K>>;

/**
 * From T, omit a set of properties from K
 * @example OmitKeys<{ foo: boolean, bar: string }, { foo: boolean, }> // { bar: string }
 */
export type Omit<T, K> = OmitKeys<T, keyof K>;

/**
 * From T, select a union of property names which values extends R
 * @example
 * SelectPropertyNames<{ foo: boolean, bar: string, baz: string }, string> // "bar" | "baz"
 */
type SelectPropertyNames<T, R> = { [K in keyof T]: T[K] extends R ? K : never }[keyof T];

/**
 * From T, pick only properties which values extends R
 * @example
 * PickProperties<{ foo: boolean, bar: string, baz: string }, string> // { bar: string, baz: string }
 */
type PickProperties<T, R> = Pick<T, SelectPropertyNames<T, R>>;

/**
 * In T, mark as required properties from K
 * Useful for types narrowing after recompose `branch` method
 * @example
 * RequiredByKeys<{ foo?: boolean, bar?: string }, "foo"> // { foo: boolean, bar?: string }
 */
export type RequiredByKeys<T, K extends keyof T> = Required<Pick<T, K>> & OmitKeys<T, K>;

/**
 * Overwrites properties from T1 with one from T2
 * @example
 * Overwrite<{ foo: boolean, bar: string }, { foo: number }> // { foo: number, bar: string }
 */
export type Overwrite<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] } & T2;

/**
 * Change the type of all properties from T to `never` and `undefined`
 * @example
 * Without<{ foo: boolean, bar: string }, { foo: boolean }> // { foo?: never }
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Makes union exclusive. Useful in situations when only single prop can be provided at the same time
 * @example
 * XOR<{ foo: boolean}, { bar: number }> // { foo: boolean, bar?: never } | { foo?: never, bar: number }
 */
export type XOR<T extends object, U extends object> = (Without<T, U> & U) | (Without<U, T> & T);

export type TFormikConnect = {
  formik: FormikContext<any>;
};

export type TElementRef<T> = null | T;

export type ArrayWithAtLeastOneMember<T> = [T, ...T[]];
