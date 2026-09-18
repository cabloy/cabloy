import { BeanControllerBase, IComponentOptions } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerControllerBoundaryProbeProps {
  mode: 'success' | 'failure' | 'serverFailure';
  delayMs?: number;
}

@Controller()
export class ControllerControllerBoundaryProbe extends BeanControllerBase {
  static $propsDefault = {
    delayMs: 800,
  };

  static $componentOptions: IComponentOptions = {
    boundary: { loading: { delay: 500 }, retry: true },
  };

  ready = false;

  protected async __init__() {
    await new Promise(resolve => setTimeout(resolve, this.$props.delayMs));
    if (
      this.$props.mode === 'failure' ||
      (this.$props.mode === 'serverFailure' && process.env.SERVER)
    ) {
      throw new Error('Controller boundary probe initialization failed');
    }
    this.ready = true;
  }

  protected render() {
    if (!this.ready) return null;
    return <div>Controller boundary probe ready</div>;
  }
}
