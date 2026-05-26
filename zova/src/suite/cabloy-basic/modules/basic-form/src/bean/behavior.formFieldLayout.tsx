import type {
  ControllerFormField,
  IFormFieldRenderContext,
  TypeFormField,
} from 'zova-module-a-form';

import { classes, types } from 'typestyle';
import { VNode } from 'vue';
import { z } from 'zod';
import { Use } from 'zova';
import { invokeProp, TypeRenderComponentJsx } from 'zova-jsx';
import {
  BeanBehaviorBase,
  Behavior,
  IDecoratorBehaviorOptions,
  NextBehavior,
} from 'zova-module-a-behavior';
import { IIconRecord } from 'zova-module-a-icon';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldLayoutOptions extends IBehaviorResourceFormFieldLayoutOptions {}
}

export interface IBehaviorResourceFormFieldLayoutOptions {
  disable?: boolean;
  class?: any;
  style?: types.NestedCSSProperties;
  label?: string | false;
  inline?: boolean;
  bordered?: boolean;
  floating?: boolean;
  iconPrefix?: keyof IIconRecord;
  iconSuffix?: keyof IIconRecord;
  header?: TypeRenderComponentJsx | string;
  footer?: TypeRenderComponentJsx | string;
}

export interface IBehaviorPropsInputFormFieldLayout extends IFormFieldRenderContext {}

export interface IBehaviorPropsOutputFormFieldLayout extends IBehaviorPropsInputFormFieldLayout {}

export interface IBehaviorOptionsFormFieldLayout extends IDecoratorBehaviorOptions {}

@Behavior<IBehaviorOptionsFormFieldLayout>()
export class BehaviorFormFieldLayout extends BeanBehaviorBase<
  IBehaviorOptionsFormFieldLayout,
  IBehaviorPropsInputFormFieldLayout,
  IBehaviorPropsOutputFormFieldLayout
> {
  cFieldRequired: string;

  @Use({ injectionScope: 'host' })
  $$formField: ControllerFormField;

  protected async __init__() {
    this.cFieldRequired = this.$style({
      $nest: {
        '& > .fieldset-legend::after': {
          content: '" *"',
          color: 'var(--color-error)',
          fontSize: '1rem',
        },
      },
    });
  }

  protected render(
    renderContext: IFormFieldRenderContext,
    next: NextBehavior<IBehaviorPropsOutputFormFieldLayout>,
  ): VNode {
    const field = this.$$formField.field;
    const layout = renderContext.propsBucket.layout;
    // needHandleBorder
    renderContext.propsBucket.needHandleBorder = layout?.disable || !layout?.inline;
    const vnode = next(renderContext);
    if (layout?.disable) return vnode;
    const error = field.state.meta.errors[0] as z.ZodError | undefined;
    if (layout?.inline) {
      return this._renderInline(renderContext, vnode, field, error);
    }
    return this._renderBlock(renderContext, vnode, field, error);
  }

  private _renderInline(
    renderContext: IFormFieldRenderContext,
    vnode: VNode,
    field: TypeFormField,
    error: z.ZodError | undefined,
  ): VNode {
    const layout = renderContext.propsBucket.layout;
    const label = layout?.label;
    const className = classes('input', layout?.class, !field.state.meta.isValid && 'input-error');
    return (
      <label class={className}>
        {label}
        {vnode}
        {!field.state.meta.isValid && (
          <div class="label">
            <span class="label-text-alt text-error">{error?.message}</span>
          </div>
        )}
      </label>
    );
  }

  private _renderBlock(
    renderContext: IFormFieldRenderContext,
    vnode: VNode,
    field: TypeFormField,
    error: z.ZodError | undefined,
  ): VNode {
    const { propsBucket } = renderContext;
    const layout = propsBucket.layout;
    const label = layout?.label;
    const classNameContainer = classes(
      'fieldset',
      propsBucket.required && this.cFieldRequired,
      layout?.class,
    );
    return (
      <fieldset class={classNameContainer}>
        {!!label && <legend class="fieldset-legend">{label}</legend>}
        {invokeProp(layout?.header)}
        {vnode}
        {!field.state.meta.isValid && (
          <div class="label">
            <span class="label-text-alt text-error">{error?.message}</span>
          </div>
        )}
        {invokeProp(layout?.footer)}
      </fieldset>
    );
  }
}
