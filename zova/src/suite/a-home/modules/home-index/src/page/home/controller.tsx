import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

@Controller()
export class ControllerPageHome extends BeanControllerPageBase {
  public message: string;

  protected async __init__() {
    this.message = 'Hello Zova';
  }

  protected render() {
    return (
      <div style="text-align: center;">
        <div>
          <div style="font-size: 36px;">{this.message}</div>
          <div style="font-size: 24px;opacity:.4;">Less is more, while more is less</div>
        </div>
      </div>
    );
  }
}
