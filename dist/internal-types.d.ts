declare const ___RaiseCustomFailure: unique symbol;
export type __RaiseCustomFailure<T> = T & {
    [key in typeof ___RaiseCustomFailure]?: T;
};
export {};
