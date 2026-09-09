import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage, ZSiteEntryTables } from 'zova-module-home-base';

export const ControllerPageHomeSchemaParams = z.object({
  locale: z.string().optional(),
});

@Controller()
export class ControllerPageHome extends BeanControllerPageBase {
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
