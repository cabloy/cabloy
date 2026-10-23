import type { VNode } from 'vue';

import { disposeInstance } from 'zova';

import type { ServiceComposer } from '../service/composer.ts';
import type { IBehaviors, IDecoratorBehaviorOptions, NextBehavior } from '../types/behavior.ts';

import { Behavior } from '../lib/behavior.ts';
import { BeanBehaviorBase } from './bean.behaviorBase.ts';

export interface IBehaviorPropsInputRoot {}

export interface IBehaviorPropsOutputRoot {}

export interface IBehaviorOptionsRoot extends IDecoratorBehaviorOptions {
  behaviors: IBehaviors;
}

@Behavior<IBehaviorOptionsRoot>()
export class BehaviorRoot extends BeanBehaviorBase<
  IBehaviorOptionsRoot,
  IBehaviorPropsInputRoot,
  IBehaviorPropsOutputRoot
> {
  private composer: ServiceComposer;

  protected async __init__(options: IBehaviorOptionsRoot) {
    this.composer = await this.createComposer(options.behaviors);
  }

  protected __dispose__() {
    disposeInstance(this.composer);
  }

  protected async onOptionsChange(options: IBehaviorOptionsRoot) {
    await super.onOptionsChange(options);
    await this.composer.load(options.behaviors);
  }

  protected render(
    props: IBehaviorPropsInputRoot,
    next: NextBehavior<IBehaviorPropsOutputRoot>,
  ): VNode {
    return this.composer.render(props, next);
  }
}
