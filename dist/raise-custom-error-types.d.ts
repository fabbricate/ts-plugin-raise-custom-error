import { __RaiseCustomFailure } from "./internal-types";
export type RaiseCustomError<T, B extends boolean, M extends string> = B extends true ? T : __RaiseCustomFailure<T>;
export type RaiseCustomWarning<T, B extends boolean, M extends string> = B extends true ? T : __RaiseCustomFailure<T>;
