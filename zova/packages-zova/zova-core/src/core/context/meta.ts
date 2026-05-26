import type { RendererNode } from 'vue';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { CtxComponent } from './component.ts';
import { CtxHooks } from './hooks.ts';
import { CtxState } from './state.ts';

export class CtxMeta extends BeanSimple {
  state: CtxState;
  component: CtxComponent;
  hooks: CtxHooks;

  get el(): RendererNode {
    return this.ctx.instance.vnode.el!;
  }

  /** @internal */
  public initialize() {
    this.state = this.bean._newBeanSimple(CtxState, true);
    this.component = this.bean._newBeanSimple(CtxComponent, false);
    this.hooks = this.bean._newBeanSimple(CtxHooks, false);
  }

  /** @internal */
  public dispose() {
    this.component.dispose();
    this.hooks.dispose();
  }
}
