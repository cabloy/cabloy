import type { ControllerFormField, IFormFieldRenderContext } from 'zova-module-a-form';

import { VNode } from 'vue';
import { Use } from 'zova';
import {
  BeanBehaviorBase,
  Behavior,
  IDecoratorBehaviorOptions,
  NextBehavior,
} from 'zova-module-a-behavior';

export interface IBehaviorPropsInputFormFieldLayout {}

export interface IBehaviorPropsOutputFormFieldLayout {}

export interface IBehaviorOptionsFormFieldLayout extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsFormFieldLayout>()
export class BehaviorFormFieldLayout extends BeanBehaviorBase<
  IBehaviorOptionsFormFieldLayout,
  IBehaviorPropsInputFormFieldLayout,
  IBehaviorPropsOutputFormFieldLayout
> {
  @Use({ injectionScope: 'host' })
  $$formField: ControllerFormField;

  protected render(
    renderContext: IFormFieldRenderContext,
    next: NextBehavior<IBehaviorPropsOutputFormFieldLayout>,
  ): VNode {
    const field = this.$$formField.field;
    const layout = renderContext.propsBucket.layout;
    const vnode = next();
    return (
      <>
        <label htmlFor={field.api.name}>{layout?.label}</label>
        {vnode}
      </>
    );
  }
}
