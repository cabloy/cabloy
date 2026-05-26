import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerPageProps {}

@Controller()
export class ControllerPage extends BeanControllerBase {
  static $propsDefault = {};

  cPage: string;

  protected async __init__() {
    this.cPage = this.$style({
      padding: '16px',
    });
  }

  protected render() {
    return <div class={this.cPage}>{this.$slotDefault?.()}</div>;
  }
}
