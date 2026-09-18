import { BeanControllerBase, IComponentOptions } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerControllerBoundaryProbeInlineProps {
  mode: 'success' | 'failure' | 'serverFailure';
  delayMs?: number;
}

@Controller()
export class ControllerControllerBoundaryProbeInline extends BeanControllerBase {
  static $propsDefault = {
    delayMs: 800,
  };

  static $componentOptions: IComponentOptions = {
    boundary: { loading: { delay: 500 }, renderMode: 'inline', retry: true },
  };

  ready = false;

  protected async __init__() {
    const props = this.$props as ControllerControllerBoundaryProbeInlineProps;
    await new Promise(resolve => setTimeout(resolve, props.delayMs));
    if (props.mode === 'failure' || (props.mode === 'serverFailure' && process.env.SERVER)) {
      throw new Error('Inline Controller boundary probe initialization failed');
    }
    this.ready = true;
  }

  protected render() {
    if (!this.ready) return null;
    return <span>Inline Controller boundary probe ready</span>;
  }
}
