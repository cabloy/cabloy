import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';
import type { ControllerFormField, IFormFieldRenderContext } from 'zova-module-a-form';

import z from 'zod';
import { Use } from 'zova';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';
import { ZIcon } from 'zova-module-a-icon';

export interface IBehaviorPropsInputFormFieldLayoutLogin extends IFormFieldRenderContext {}

export interface IBehaviorPropsOutputFormFieldLayoutLogin extends IBehaviorPropsInputFormFieldLayoutLogin {}

export interface IBehaviorOptionsFormFieldLayoutLogin extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsFormFieldLayoutLogin>()
export class BehaviorFormFieldLayoutLogin extends BeanBehaviorBase<
  IBehaviorOptionsFormFieldLayoutLogin,
  IBehaviorPropsInputFormFieldLayoutLogin,
  IBehaviorPropsOutputFormFieldLayoutLogin
> {
  @Use({ injectionScope: 'host' })
  $$formField: ControllerFormField;

  protected render(
    renderContext: IBehaviorPropsInputFormFieldLayoutLogin,
    next: NextBehavior<IBehaviorPropsOutputFormFieldLayoutLogin>,
  ): VNode {
    const field = this.$$formField.field;
    const layout = renderContext.propsBucket.layout;
    // needHandleBorder
    // renderContext.propsBucket.needHandleBorder = layout?.disable || !layout?.inline;
    renderContext.propsBucket.needHandleBorder = false;
    const vnode = next(renderContext);
    if (layout?.disable) return vnode;
    const iconPrefix = layout?.iconPrefix;
    const error = field.state.meta.errors[0] as z.ZodError | undefined;
    return (
      <label class="input flex items-center gap-2 w-full">
        <ZIcon class="opacity-70" name={iconPrefix} width={16}></ZIcon>
        {vnode}
        {!field.state.meta.isValid && (
          <div class="label">
            <span class="label-text-alt text-error">{error?.message}</span>
          </div>
        )}
      </label>
    );
  }
}
