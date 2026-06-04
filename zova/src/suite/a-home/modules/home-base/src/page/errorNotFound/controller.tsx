import { classes } from 'typestyle';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

@Controller()
export class ControllerPageErrorNotFound extends BeanControllerPageBase {
  cTitle: string;
  cDescription: string;

  protected async __init__() {
    this.cTitle = this.$style({
      fontSize: '30vh',
    });
    this.cDescription = classes(
      'text-3xl',
      this.$style({
        opacity: '0.4',
      }),
    );
  }

  protected render() {
    return (
      <div class="text-center">
        <div>
          <div class={this.cTitle}>404</div>
          <div class={this.cDescription}>Oops. Nothing here...</div>
          <button
            class="btn btn-primary"
            onClick={() => {
              this.app.$gotoHome();
            }}
          >
            {this.scope.locale.GoHome()}
          </button>
        </div>
      </div>
    );
  }
}
