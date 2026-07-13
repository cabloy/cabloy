import { classes } from 'typestyle';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

@Controller()
export class ControllerPageErrorAccessDenied extends BeanControllerPageBase {
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
          <div class={this.cTitle}>403</div>
          <div class={this.cDescription}>Access denied.</div>
          <button
            class="btn btn-primary"
            onClick={() => {
              this.app.$gotoHome();
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
}
