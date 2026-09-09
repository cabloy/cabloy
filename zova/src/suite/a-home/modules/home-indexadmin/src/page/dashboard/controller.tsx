import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage, ZSiteEntryTables } from 'zova-module-home-base';

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
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
