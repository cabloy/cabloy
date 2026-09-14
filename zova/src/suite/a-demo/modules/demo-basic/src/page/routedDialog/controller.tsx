import type {
  IModalRoutedDialogPresentationOptions,
  IRoutedDialogHandle,
} from 'zova-module-basic-app';

import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

@Controller()
export class ControllerPageRoutedDialog extends BeanControllerPageBase {
  handleA?: IRoutedDialogHandle;
  handleB?: IRoutedDialogHandle;
  statusA = 'idle';
  statusB = 'idle';
  browserUrl = '-';
  browserUrlAtOpen?: string;
  mainRouteAtOpen?: string;
  events: string[] = [];

  protected async __init__() {
    this.$ssr.handleDirectOrOnHydrated(() => {
      this.browserUrl = window.location.href;
    });
  }

  openA() {
    this._open('A');
  }

  openB() {
    this._open('B');
  }

  openAAndB() {
    this._open('A');
    this._open('B');
  }

  openAWithHandlePush() {
    const handle = this._open('A');
    void this._navigateHandle(handle, 'push');
  }

  openAWithHandleReplace() {
    const handle = this._open('A');
    void this._navigateHandle(handle, 'replace');
  }

  openAWithBackdropClose() {
    this._open('A', true);
  }

  openAAndClose() {
    const handle = this._open('A');
    void this._closeHandleAfterReady(handle);
  }

  openAWithScalarWidth() {
    this._open('A', false, { maxWidth: 720 });
  }

  openAWithPartialResponsiveWidth() {
    this._open('A', false, { maxWidth: { md: 800 } });
  }

  openAWithScalarTopGutter() {
    this._open('A', false, { topGutter: 80 });
  }

  openAWithPartialResponsiveTopGutter() {
    this._open('A', false, { topGutter: { md: 64 } });
  }

  private _open(
    dialog: 'A' | 'B',
    closeOnBackdrop = false,
    dialogOptions?: IModalRoutedDialogPresentationOptions,
  ) {
    const route = this.$router.getPagePath('/demo/basic/routedDialogEntry', {
      query: {
        dialog,
        token: `dialog-${dialog.toLowerCase()}-entry`,
        via: 'open',
        step: 0,
      },
    });
    this.mainRouteAtOpen = this.$pageRoute?.fullPath;
    this.browserUrlAtOpen = typeof window === 'undefined' ? undefined : window.location.href;
    const handle = this.$appModal.routedDialog(
      {
        route,
        title: `Routed Dialog ${dialog}`,
        onClose: () => {
          this._record(`${dialog}: onClose`);
          if (dialog === 'A') {
            this.statusA = 'closed';
            this.handleA = undefined;
          } else {
            this.statusB = 'closed';
            this.handleB = undefined;
          }
        },
      },
      {
        closeOnBackdrop,
        closeOnEscape: true,
        showCloseButton: true,
        ...dialogOptions,
      },
    );
    if (dialog === 'A') {
      this.handleA = handle;
      this.statusA = 'loading';
    } else {
      this.handleB = handle;
      this.statusB = 'loading';
    }
    void this._awaitReady(dialog, handle);
    return handle;
  }

  private async _awaitReady(dialog: 'A' | 'B', handle: IRoutedDialogHandle) {
    try {
      await handle.ready;
      if (dialog === 'A') this.statusA = 'ready';
      else this.statusB = 'ready';
      this._record(`${dialog}: ready`);
    } catch (error) {
      if (dialog === 'A') this.statusA = 'error';
      else this.statusB = 'error';
      this._record(`${dialog}: ${String(error)}`);
    }
  }

  private async _navigateHandle(handle: IRoutedDialogHandle, action: 'push' | 'replace') {
    try {
      await handle.ready;
      const route = this.$router.getPagePath('/demo/basic/routedDialogDetail/:id', {
        params: { id: action === 'push' ? 101 : 202 },
        query: {
          dialog: 'A',
          token: `dialog-a-handle-${action}`,
          via: `handle-${action}`,
          step: action === 'push' ? 1 : 2,
        },
      });
      if (action === 'push') await handle.push(route);
      else await handle.replace(route);
      this._record(`A: handle.${action}`);
    } catch (error) {
      this._record(`A: handle.${action} ${String(error)}`);
    }
  }

  private async _closeHandleAfterReady(handle: IRoutedDialogHandle) {
    try {
      await handle.ready;
      this._record('A: ready for delayed handle.close');
      setTimeout(() => {
        handle.close();
        this._record('A: handle.close');
      }, 1500);
    } catch (error) {
      this._record(`A: delayed close ${String(error)}`);
    }
  }

  private _record(event: string) {
    this.events = [...this.events, event];
  }

  private async openStudentList() {
    const route = this.$router.getPagePath('/rest/resource/:resource', {
      params: {
        resource: 'training-student:student',
      },
    });
    this.$appModal.routedDialog({
      route,
      title: 'Student List',
    });
  }

  protected render() {
    return (
      <ZPage>
        <div class="mx-auto flex max-w-4xl flex-col gap-6">
          <div>
            <h1 class="text-2xl font-bold">Routed Dialog Manual Validation</h1>
            <p class="mt-2 text-base-content/70">
              Open a memory-history dialog and verify that every dialog route stays separate from
              this browser route.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="card bg-base-200">
              <div class="card-body gap-2">
                <h2 class="card-title text-base">Main route sentinel</h2>
                <code class="break-all">{this.$pageRoute?.fullPath ?? '-'}</code>
                <code class="break-all">{this.browserUrl}</code>
              </div>
            </div>
            <div class="card bg-base-200">
              <div class="card-body gap-2">
                <h2 class="card-title text-base">Route at latest open</h2>
                <code class="break-all">{this.mainRouteAtOpen ?? '-'}</code>
                <code class="break-all">{this.browserUrlAtOpen ?? '-'}</code>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn btn-primary" onClick={() => this.openA()}>
              Open A
            </button>
            <button class="btn btn-secondary" onClick={() => this.openB()}>
              Open B
            </button>
            <button class="btn btn-outline" onClick={() => this.openAAndB()}>
              Open A and B
            </button>
            <button class="btn btn-outline" onClick={() => this.openAWithHandlePush()}>
              Open A with handle.push
            </button>
            <button class="btn btn-outline" onClick={() => this.openAWithHandleReplace()}>
              Open A with handle.replace
            </button>
            <button class="btn btn-outline" onClick={() => this.openAWithBackdropClose()}>
              Open A (backdrop close)
            </button>
            <button class="btn btn-outline" onClick={() => this.openAAndClose()}>
              Open A then handle.close
            </button>
            <button class="btn btn-outline" onClick={() => this.openAWithScalarWidth()}>
              Open A (720px width)
            </button>
            <button class="btn btn-outline" onClick={() => this.openAWithPartialResponsiveWidth()}>
              Open A (md 800px width)
            </button>
            <button class="btn btn-outline" onClick={() => this.openAWithScalarTopGutter()}>
              Open A (80px top gutter)
            </button>
            <button
              class="btn btn-outline"
              onClick={() => this.openAWithPartialResponsiveTopGutter()}
            >
              Open A (md 64px top gutter)
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Dialog</th>
                  <th>Status</th>
                  <th>Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>A</td>
                  <td>{this.statusA}</td>
                  <td>{this.handleA ? 'active' : '-'}</td>
                </tr>
                <tr>
                  <td>B</td>
                  <td>{this.statusB}</td>
                  <td>{this.handleB ? 'active' : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="card bg-base-200">
            <div class="card-body">
              <h2 class="card-title text-base">Lifecycle log</h2>
              <ol class="list-inside list-decimal font-mono text-sm">
                {this.events.map((event, index) => (
                  <li key={`${index}-${event}`}>{event}</li>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <button
              class="btn btn-outline"
              onClick={() => {
                this.openStudentList();
              }}
            >
              Student List
            </button>
          </div>
        </div>
      </ZPage>
    );
  }
}
