import type { ControllerFormField, IFormFieldRenderContext } from 'zova-module-a-form';

import { VNode } from 'vue';
import { Use } from 'zova';
import {
  BeanBehaviorBase,
  Behavior,
  IDecoratorBehaviorOptions,
  NextBehavior,
} from 'zova-module-a-behavior';

export interface IBehaviorPropsInputFormField extends IFormFieldRenderContext {}

export interface IBehaviorPropsOutputFormField extends IBehaviorPropsInputFormField {}

export interface IBehaviorOptionsFormField extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsFormField>()
export class BehaviorFormField extends BeanBehaviorBase<
  IBehaviorOptionsFormField,
  IBehaviorPropsInputFormField,
  IBehaviorPropsOutputFormField
> {
  @Use({ injectionScope: 'host' })
  $$formField: ControllerFormField;

  protected render(
    renderContext: IFormFieldRenderContext,
    next: NextBehavior<IBehaviorPropsOutputFormField>,
  ): VNode {
    return next(renderContext);
  }
}
