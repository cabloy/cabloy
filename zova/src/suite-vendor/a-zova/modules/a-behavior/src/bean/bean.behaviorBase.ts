import type { VNode } from 'vue';

import { BeanBase, Use, Virtual } from 'zova';
import { Bean } from 'zova-module-a-bean';

import type { ServiceComposer } from '../service/composer.js';
import type { IBehaviors, IDecoratorBehaviorOptions, NextBehavior } from '../types/behavior.js';
import type { IBehaviorTag } from '../types/behavior.js';
import type { BeanBehavior } from './bean.behavior.js';

@Bean()
@Virtual()
export class BeanBehaviorBase<
  OPTIONS extends IDecoratorBehaviorOptions = IDecoratorBehaviorOptions,
  PROPS_INPUT = unknown,
  PROPS_OUTPUT = PROPS_INPUT,
> extends BeanBase {
  protected $options: OPTIONS;

  @Use({ injectionScope: 'host' })
  $$beanBehavior: BeanBehavior;

  @Use({ injectionScope: 'host' })
  $$behaviorTag: IBehaviorTag;

  constructor(options: OPTIONS) {
    super();
    this.$options = options;
  }

  protected async onOptionsChange(options: OPTIONS) {
    this.$options = options;
  }

  protected async createComposer(behaviors: IBehaviors): Promise<ServiceComposer> {
    return await this.$$beanBehavior.createComposer(behaviors);
  }

  protected render(_props: PROPS_INPUT, next: NextBehavior<PROPS_OUTPUT>): VNode {
    return next();
  }
}
