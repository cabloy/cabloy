import { RouterLink } from '@cabloy/vue-router';
import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

export const ControllerPageRoutedDialogDetailSchemaParams = z.object({
  id: z.number(),
});

export const ControllerPageRoutedDialogDetailSchemaQuery = z.object({
  dialog: z.enum(['A', 'B']).optional().default('A'),
  token: z.string().optional().default('detail'),
  via: z.string().optional().default('unknown'),
  step: z.number().optional().default(0),
});

@Controller()
export class ControllerPageRoutedDialogDetail extends BeanControllerPageBase {
  get entryRoute() {
    return this.$router.getPagePath('/demo/basic/routedDialogEntry', {
      query: {
        ...this.$query,
        token: `${this.$query.token}-entry`,
        via: 'detail-entry',
        step: this.$query.step + 1,
      },
    });
  }

  pushNextDetail() {
    const route = this.$router.getPagePath('/demo/basic/routedDialogDetail/:id', {
      params: { id: this.$params.id + 1 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-push`,
        via: 'detail-push',
        step: this.$query.step + 1,
      },
    });
    this.$router.push(route);
  }

  replaceNextDetail() {
    const route = this.$router.getPagePath('/demo/basic/routedDialogDetail/:id', {
      params: { id: this.$params.id + 10 },
      query: {
        ...this.$query,
        token: `${this.$query.token}-replace`,
        via: 'detail-replace',
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
            <h1 class="text-xl font-bold">Routed Dialog Detail</h1>
            <p class="text-base-content/70">
              The typed route state below belongs to this routed-dialog instance only.
            </p>
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
                  <td>$params.id</td>
                  <td>{this.$params.id}</td>
                  <td>{typeof this.$params.id}</td>
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
            <button class="btn btn-primary" onClick={() => this.pushNextDetail()}>
              Local push next detail
            </button>
            <button class="btn btn-secondary" onClick={() => this.replaceNextDetail()}>
              Local replace next detail
            </button>
            <button class="btn btn-outline" onClick={() => this.$router.back()}>
              Local router.back
            </button>
            <RouterLink class="btn btn-outline" to={this.entryRoute}>
              RouterLink back to entry
            </RouterLink>
          </div>
        </div>
      </ZPage>
    );
  }
}
