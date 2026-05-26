import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

@Controller()
export class ControllerPageLocale extends BeanControllerPageBase {
  protected async __init__() {}

  protected render() {
    return (
      <ZPage>
        <div>
          {this.app.meta.locale.current}:{this.scope.locale.HelloWorld()}
        </div>
        <div>{this.scope.locale.HelloWorld()}</div>
        <button
          class="btn btn-primary"
          onClick={() => {
            if (this.app.meta.locale.current === 'en-us') {
              this.app.meta.locale.current = 'zh-cn';
            } else {
              this.app.meta.locale.current = 'en-us';
            }
          }}
        >
          {this.scope.locale.ChangeLanguage()}
        </button>
      </ZPage>
    );
  }
}
