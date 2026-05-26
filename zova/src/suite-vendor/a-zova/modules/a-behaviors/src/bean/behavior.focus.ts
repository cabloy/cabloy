import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';

export interface IBehaviorPropsInputFocus {
  ref?: any;
}

export interface IBehaviorPropsOutputFocus extends IBehaviorPropsInputFocus {}

export interface IBehaviorOptionsFocus extends IDecoratorBehaviorOptions {
  always?: boolean;
}

@Behavior<IBehaviorOptionsFocus>()
export class BehaviorFocus extends BeanBehaviorBase<
  IBehaviorOptionsFocus,
  IBehaviorPropsInputFocus,
  IBehaviorPropsOutputFocus
> {
  inputRef?: HTMLElement;

  protected render(
    props: IBehaviorPropsInputFocus,
    next: NextBehavior<IBehaviorPropsOutputFocus>,
  ): VNode {
    const refOuter = props?.ref;
    props = {
      ...props,
      ref: (ref: HTMLElement) => {
        if (this.$options.always || !this.inputRef) {
          ref.focus?.();
        }
        this.inputRef = ref;
        refOuter?.(ref);
      },
    };
    return next(props);
  }
}
