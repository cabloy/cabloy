import type { Constructable } from '../../lib/decorator/type/constructable.ts';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type TypeClassOfClassLike<ClassLike> = ClassLike extends
  | (() => Constructable<infer Result>)
  | Constructable<infer Result>
  ? Result
  : ClassLike extends (() => infer Result) | (infer Result)
    ? Result
    : ClassLike extends () => Constructable<infer Result>
      ? Result
      : ClassLike extends () => infer Result
        ? Result
        : ClassLike extends Constructable<infer Result>
          ? Result
          : ClassLike extends infer Result
            ? Result
            : undefined;

export type TypeRecordValues<TRecord> = TRecord[keyof TRecord];

export type TypeConfirmArray<A> = A extends any[] ? A : A[];

export type TypeOmitStringUnion<Strs, Keys> = Strs extends Keys ? never : Strs;
