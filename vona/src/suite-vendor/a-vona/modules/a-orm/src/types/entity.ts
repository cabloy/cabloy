import type { PickString } from 'vona';

export type TypeEntityMeta<T, N = string> = Required<{
  [key in keyof T]: key;
}> & {
  $table: N;
  $comment: Required<{ [key in keyof T]: string }> & { $table: string };
  $default: Required<{ [key in keyof T]: any }>;
};

export const SymbolKeyFieldsMore = Symbol('$fieldsMore');
export type TypeSymbolKeyFieldsMore = typeof SymbolKeyFieldsMore;

export type TypeEntityMetaFields<T> = Omit<T, '$table' | '$comment' | '$default'>;
export type TypeEntityMetaFieldKeys<T> = PickString<keyof TypeEntityMetaFields<T>>;
