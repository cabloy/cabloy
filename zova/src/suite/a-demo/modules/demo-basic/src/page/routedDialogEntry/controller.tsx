import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

export const ControllerPageRoutedDialogEntrySchemaParams = z.object({});

export const ControllerPageRoutedDialogEntrySchemaQuery = z.object({
  dialog: z.enum(['A', 'B']).optional().default('A'),
  token: z.string().optional().default('entry'),
  via: z.string().optional().default('open'),
  step: z.number().optional().default(0),
});

@Controller()
export class ControllerPageRoutedDialogEntry extends BeanControllerPageBase {
  pushDetail() {
    const route = this.$router.getPagePath('/demo/basic/routedDialogDetail/:id', {
      params: { id: this.$query.step + 1 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-push`,
        via: 'page-push',
        step: this.$query.step + 1,
      },
    });
    this.$router.push(route);
  }

  replaceDetail() {
    const route = this.$router.getPagePath('/demo/basic/routedDialogDetail/:id', {
      params: { id: this.$query.step + 10 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-replace`,
        via: 'page-replace',
        step: this.$query.step + 10,
      },
    });
    this.$router.replace(route);
  }

  protected render() {
    return (
      <ZPage>
        <div class="flex flex-col gap-4 p-1">
          <div>
            <h1 class="text-xl font-bold">Routed Dialog Entry</h1>
            <p class="text-base-content/70">This page is rendered by the dialog-local router.</p>
          </div>

          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$pageRoute.fullPath</td>
                  <td class="break-all">{this.$pageRoute?.fullPath}</td>
                  <td>string</td>
                </tr>
                <tr>
                  <td>$route.fullPath</td>
                  <td class="break-all">{this.$route.fullPath}</td>
                  <td>string</td>
                </tr>
                <tr>
                  <td>$query.dialog</td>
                  <td>{this.$query.dialog}</td>
                  <td>{typeof this.$query.dialog}</td>
                </tr>
                <tr>
                  <td>$query.token</td>
                  <td>{this.$query.token}</td>
                  <td>{typeof this.$query.token}</td>
                </tr>
                <tr>
                  <td>$query.via</td>
                  <td>{this.$query.via}</td>
                  <td>{typeof this.$query.via}</td>
                </tr>
                <tr>
                  <td>$query.step</td>
                  <td>{this.$query.step}</td>
                  <td>{typeof this.$query.step}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn btn-primary" onClick={() => this.pushDetail()}>
              Local push to detail
            </button>
            <button class="btn btn-secondary" onClick={() => this.replaceDetail()}>
              Local replace to detail
            </button>
          </div>
        </div>
      </ZPage>
    );
  }
}
