# Raise-Custom-Error
ts-plugin-raise-custom-error

## Installation

```shell
npm i ts-plugin-raise-custom-error
```

## Setup - tsconfig.json

```
{
  "compilerOptions": {
    //...,
    "plugins": [
      //...,
      {
        "name": "ts-plugin-raise-custom-error"
      }
    ],
  },
}
```

---

Type-safe compile-time validations for TypeScript using custom error or warning messages.

This utility allows you to raise type errors or warnings during development when certain conditions fail — with custom messages that can be intercepted by a TypeScript transformer (e.g., using `ts-patch`).

## Features

- Custom error and warning messages
- Supports type-level assertions for structure, keys, and value checks
- As a Typescript utility, this has no runtime performance cost, just compile-time.

## Usage

### RaiseCustomError<T, B, Message>

If `B extends true`, returns `T`.  
If `B extends false`, raises an error.

### RaiseCustomWarning<T, B, Message>

Same as above, but intended to emit a warning.

## Examples

### Check Object Structure Uniformity - Success example

```ts
type Animals = {
  cat:  { coat: 'fur', legs: 4, sound: 'meow' },
  dog:  { coat: 'fur', legs: 4, sound: 'woof' },
  cow:  { coat: 'fur', legs: 4, sound: 'moo' },
  bird: { coat: 'feather', legs: 2, sound: 'chirp' },
  fish: { coat: 'scales', legs: 0, sound: 'blub' },
};

type AllAnimalsMatch = RaiseCustomError<
  Animals,
  Animals[keyof Animals] extends { coat: string, legs: number, sound: string }
    ? true : false,
  "One of the animals does not match the required structure"
>;
```

### Error example

```ts
type Animals2 = {
  cat:  { coat: 'fur', legs: 4, sound: 'meow' },
  dog:  { coat: 'fur', legs: 4, sound: 'woof' },
  cow:  { coat: 'fur', legs: 4, sound: 'moo' },
  bird: { coat: 'feather', legs: "2", sound: 'chirp' }, // legs is string
  fish: { coat: 'scales', legs: 0, sound: 'blub' },
};

type AllAnimalsMatch2 = RaiseCustomError<
  Animals2,
  Animals2[keyof Animals2] extends { coat: string, legs: number, sound: string }
    ? true : false,
  "One of the animals does not match the required structure"
>;
```

![image](https://github.com/user-attachments/assets/7c8224c2-8c44-4004-bfa7-718554974df4)


### Warning

```ts
type Animals3 = {
  cat:  { coat: 'fur', legs: 4, sound: 'meow' },
  dog:  { coat: 'fur', legs: 4, sound: 'woof' },
  cow:  { coat: 'fur', legs: 4, sound: 'moo' },
  bird: { coat: 'feather', legs: "2", sound: 'chirp' },
  fish: { coat: 'scales', legs: 0, sound: 'blub' },
};

type AllAnimalsMatch3 = RaiseCustomWarning<
  Animals3,
  Animals3[keyof Animals3] extends { coat: string, legs: number | `${number}`, sound: string }
    ? Animals3[keyof Animals3]['legs'] extends number ? true : false
    : false,
  "One of the animals does not match the required structure"
>;
```

![image](https://github.com/user-attachments/assets/195f0ef1-ecf3-4465-9a8b-32e2b94dcf7d)


---

## Function-Returns

```ts
function isEven<N extends number>(n: N): RaiseCustomError<
  N,
  `${typeof n}` extends `${number | ""}${0 | 2 | 4 | 6 | 8}` ? true : false,
  "That number is not even"
> {
  return n;
}

isEven(0);
isEven(1);
isEven(2);
```

![image](https://github.com/user-attachments/assets/b7aeceba-5efb-47aa-9c28-a77a256084a0)


```ts
function isNotZero<N extends number>(n: N):
    RaiseCustomWarning<
        N, `${N}` extends `${0}` ? false : true, "That number is 0"> {
    return n;
}

isNotZero(0);
isNotZero(1);
isNotZero(2);
```

![image](https://github.com/user-attachments/assets/4a1dca4d-8008-4d7c-9bb3-3ee27dbfc08b)


```ts
function isNotNegative<N extends number>(n: N):
    RaiseCustomWarning<
        N, `${N}` extends `-${infer _N}` ? false : true, "That number is negative"> {
    return n;
}

isNotNegative(-1);
isNotNegative(0);
isNotNegative(1);
```

![image](https://github.com/user-attachments/assets/6831afad-2a91-495c-897a-10d4d0889b74)


```ts
function bothObjectsHaveSameKeys<T extends object, U extends object>(a: T, b: U): RaiseCustomError<
    T & U,
    keyof T extends keyof U ? keyof U extends keyof T ? true : false : false,
    "The objects do not have the same keys"> {
    return a as any;
}

bothObjectsHaveSameKeys({ a: 1, b: 2 }, { a: 1, b: 2 });
bothObjectsHaveSameKeys({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 });
bothObjectsHaveSameKeys({ a: 1, b: 2 }, { a: 1, c: 3 });
```

![image](https://github.com/user-attachments/assets/0d8d38ae-9406-49c2-add4-908522899198)
