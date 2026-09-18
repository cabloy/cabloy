import type { VNode } from 'vue';
import type { IDecoratorBehaviorOptions, NextBehavior } from 'zova-module-a-behavior';

import { isNavigationFailure } from '@cabloy/vue-router';
import { createVNode } from 'vue';
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior';

export interface IBehaviorPropsInputPerform {
  'class'?: unknown;
  'disabled'?: boolean | '' | 'true' | 'false';
  'onClick'?: (e: MouseEvent) => unknown;
  ['aria-busy']?: boolean | 'true' | 'false';
}

export interface IBehaviorPropsOutputPerform extends IBehaviorPropsInputPerform {
  'disabled'?: boolean;
  'onClick'?: (e: MouseEvent) => unknown;
  ['aria-busy']?: boolean | 'true' | 'false';
}

export type TypeBehaviorOnError = (
  error: unknown,
  e: MouseEvent,
) => boolean | void | Promise<boolean | void>;

export interface IBehaviorOptionsPerform extends IDecoratorBehaviorOptions {
  isLoading?: boolean;
  onPerform?: (e: MouseEvent) => Promise<void> | void;
  onError?: TypeBehaviorOnError;
}

@Behavior<IBehaviorOptionsPerform>()
export class BehaviorPerform extends BeanBehaviorBase<
  IBehaviorOptionsPerform,
  IBehaviorPropsInputPerform,
  IBehaviorPropsOutputPerform
> {
  private _isLoading = false;

  protected render(
    props: IBehaviorPropsInputPerform,
    next: NextBehavior<IBehaviorPropsOutputPerform>,
  ): VNode {
    const isLoading = this._isLoading || this.$options.isLoading === true;
    const propsPatch: IBehaviorPropsOutputPerform = {
      ...props,
      'class': isLoading ? [props.class, 'btn-disabled'] : props.class,
      'disabled':
        props.disabled === true || props.disabled === '' || props.disabled === 'true' || isLoading,
      'aria-busy': isLoading || props['aria-busy'],
      'onClick': e => this._handleClick(e, props.onClick),
    };
    const vnode = next(propsPatch);
    if (!isLoading) return vnode;
    const children = vnode.children;
    return createVNode(vnode.type as any, vnode.props as any, [
      createVNode('span', {
        'class': 'loading loading-spinner loading-xs',
        'aria-hidden': 'true',
      }),
      ...(Array.isArray(children)
        ? children
        : children === undefined || children === null
          ? []
          : [children]),
    ]);
  }

  private _handleClick(e: MouseEvent, onClick?: (e: MouseEvent) => unknown) {
    if (this._isLoading || this.$options.isLoading === true) return;
    return this._perform(e, onClick);
  }

  private async _perform(e: MouseEvent, onClick?: (e: MouseEvent) => unknown) {
    try {
      this._isLoading = true;
      await onClick?.(e);
      await this.$options.onPerform?.(e);
    } catch (error) {
      if (isActionControlFlowError(error)) throw error;
      const handled = await this.$options.onError?.(error, e);
      if (handled === true) return;
      await this.$performCommand('basic-commands:alert', {
        type: 'error',
        text: getActionErrorMessage(error),
      });
    } finally {
      this._isLoading = false;
    }
  }
}

export function isActionControlFlowError(error: unknown) {
  return isNavigationFailure(error) || [301, 302, 401, 600].includes(Number((error as any)?.code));
}

export function getActionErrorMessage(error: unknown) {
  if (error && (typeof error === 'object' || typeof error === 'function')) {
    const message = (error as { message?: unknown }).message;
    if (message !== undefined && message !== null) return String(message);
  }
  return String(error);
}
