import type { VNodeChild } from 'vue';
import type { TypeComponentBoundaryRenderMode } from 'zova';

import { BeanControllerBase, IComponentOptions } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerControllerBoundaryProbeOverrideProps {
  mode: 'success' | 'failure';
  delayMs?: number;
}

@Controller()
export class ControllerControllerBoundaryProbeOverride extends BeanControllerBase {
  static $propsDefault = {
    delayMs: 800,
  };

  static $componentOptions: IComponentOptions = {
    boundary: { loading: { delay: 500 }, renderMode: 'inline' },
  };

  ready = false;

  protected async __init__() {
    const props = this.$props as ControllerControllerBoundaryProbeOverrideProps;
    await new Promise(resolve => setTimeout(resolve, props.delayMs));
    if (props.mode === 'failure') {
      throw new Error('Override Controller boundary probe initialization failed');
    }
    this.ready = true;
  }

  protected renderLoading(renderMode: TypeComponentBoundaryRenderMode): VNodeChild {
    return <span role="status">Override loading mode: {renderMode}</span>;
  }

  protected renderError(error: unknown): VNodeChild {
    const message = error instanceof Error ? error.message : String(error);
    return <span role="alert">Override legacy error: {message}</span>;
  }

  protected render() {
    if (!this.ready) return null;
    return <span>Override Controller boundary probe ready</span>;
  }
}
