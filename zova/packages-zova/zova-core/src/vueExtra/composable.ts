import type { UnwrapNestedRefs } from 'vue';

import type { Functionable } from '../decorator/type/functionable.ts';

export type ReturnTypeComposable<Composable extends Functionable> = Composable extends (
  ...args: any[]
) => infer R
  ? UnwrapNestedRefs<R>
  : any;
