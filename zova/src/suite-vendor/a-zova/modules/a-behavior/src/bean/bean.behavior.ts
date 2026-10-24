import { BeanBase } from 'zova';
import { Bean } from 'zova-module-a-bean';

import type { IBehaviors } from '../types/behavior.ts';

import { ServiceComposer } from '../service/composer.ts';

@Bean()
export class BeanBehavior extends BeanBase {
  public async createComposer(behaviors: IBehaviors): Promise<ServiceComposer> {
    return await this.bean._newBean(ServiceComposer, true, behaviors);
  }
}
