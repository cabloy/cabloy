import type { IComponentOptions } from 'zova';

import { BeanControllerBase, SymbolControllerRefDisable, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import type { IBehaviors, IBehaviorTag } from '../../types/behavior.js';

import { BeanBehaviorsHolder } from '../../bean/bean.behaviorsHolder.js';

export interface ControllerBehaviorProps {
  behaviorTag: IBehaviorTag;
  behaviors: IBehaviors;
}

@Controller()
export class ControllerBehavior extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false };
  protected [SymbolControllerRefDisable]: boolean = true;

  @Use()
  $$beanBehaviorsHolder: BeanBehaviorsHolder;

  protected async __init__() {
    await this.$$beanBehaviorsHolder.initialize({
      behaviorTag: this.$props.behaviorTag,
      behaviors: () => {
        return this.$props.behaviors;
      },
    });
  }

  protected render() {
    return this.$$beanBehaviorsHolder.render();
  }
}
