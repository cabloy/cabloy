import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

export const ControllerPageRouteParamsSchemaParams = z.object({
  id: z.number().optional().default(0),
});
export const ControllerPageRouteParamsSchemaQuery = z.object({});

@Controller()
export class ControllerPageRouteParams extends BeanControllerPageBase {
  protected async __init__() {}

  protected render() {
    return (
      <ZPage>
        {this.$pageRoute?.fullPath}
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
                <td>$params.id</td>
                <td>{this.$params.id}</td>
                <td>{typeof this.$params.id}</td>
              </tr>
            </tbody>
          </table>
          <button
            class="btn btn-primary"
            onClick={() => {
              const id = this.$params.id + 1;
              const url = this.$router.getPagePath('/demo/basic/routeParams/:id?', {
                params: { id },
              });
              this.$router.push(url);
            }}
          >
            Go to current page with different params value
          </button>
        </div>
      </ZPage>
    );
  }
}
