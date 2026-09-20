import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage, ZSiteEntryTables } from 'zova-module-home-base';

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
  private _timer?: number;
  currentTime = '';

  protected __init__() {
    if (!this.$pageRoute) return;
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.$watch(
        () => this.$pageHost?.active,
        active => {
          if (active) {
            this._startTimer();
          } else {
            this._stopTimer();
          }
        },
        { immediate: true },
      );
    });
    this.$router.setPageMeta(this.$pageRoute, {
      onCustomRenderIsolate: () => (
        <div class="flex w-full items-center justify-center">
          <div class="badge badge-lg gap-2 border border-primary/30 bg-primary/10 px-4 py-3 text-primary shadow-sm">
            <span class="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true"></span>
            <span class="font-mono text-base font-semibold tracking-wide tabular-nums">
              {this.currentTime || '--:--:--'}
            </span>
          </div>
        </div>
      ),
    });
  }

  private _startTimer() {
    if (this._timer !== undefined) return;
    this.currentTime = new Date().toLocaleTimeString();
    this._timer = window.setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
  }

  private _stopTimer() {
    if (this._timer === undefined) return;
    window.clearInterval(this._timer);
    this._timer = undefined;
  }

  protected __dispose__() {
    this._stopTimer();
  }

  protected render() {
    return (
      <ZPage>
        <section class="mx-auto max-w-6xl p-6">
          <ZSiteEntryTables />
        </section>
      </ZPage>
    );
  }
}
