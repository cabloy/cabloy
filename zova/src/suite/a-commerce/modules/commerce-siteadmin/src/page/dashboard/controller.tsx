import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import { ModelOperator } from '../../model/operator.js';

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
  @Use()
  $$modelOperator: ModelOperator;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.queryOperatorContext);
  }

  get queryOperatorContext() {
    return this.$$modelOperator.context();
  }

  protected render() {
    const query = this.queryOperatorContext;
    return (
      <div class="p-6">
        <h1 class="text-2xl font-semibold">{this.scope.locale.CommerceAdministration()}</h1>
        <dl class="mt-4 grid max-w-xl grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <dt>{this.scope.locale.Operator()}</dt>
          <dd>{query.data!.userName}</dd>
          <dt>{this.scope.locale.Instance()}</dt>
          <dd>{query.data!.instanceName || 'default'}</dd>
        </dl>
      </div>
    );
  }
}
