import type { ButtonHTMLAttributes } from 'vue';
import type { IComponentOptions } from 'zova';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { IBehaviorOptionsPerform, TypeBehaviorOnError } from '../../bean/behavior.perform.jsx';

export interface ControllerButtonProps extends Omit<ButtonHTMLAttributes, 'onError'> {
  loading?: boolean;
  onPerform?: (e: MouseEvent) => Promise<void> | void;
  onError?: TypeBehaviorOnError;
}

@Controller()
export class ControllerButton extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  protected async __init__() {}

  protected render() {
    const { loading, onError, onPerform, ...props } = this.$props as ControllerButtonProps;
    const behaviorPerformOptions: IBehaviorOptionsPerform = {
      isLoading: loading,
      onError,
      onPerform,
    };
    return (
      <button
        {...props}
        type={props.type ?? 'button'}
        bs-basic-button-perform={behaviorPerformOptions}
      >
        {this.$slotDefault?.()}
      </button>
    );
  }
}
