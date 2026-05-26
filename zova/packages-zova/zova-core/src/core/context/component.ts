import type { BeanControllerBase } from '../../bean/beanControllerBase.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { BeanControllerIdentifier, BeanRenderIdentifier } from '../../bean/type.ts';
import { cast } from '../../types/utils/cast.ts';

export class CtxComponent extends BeanSimple {
  private _bean_render_original: any;

  activate() {
    if (this.ctx.disposed) return;
    const renderMethod = 'render';
    const self = this;
    const instance = cast(this.ctx.instance);
    this._bean_render_original = instance[renderMethod];
    instance[renderMethod] = function (this, ...args) {
      if (instance.isUnmounted) return;
      if (!self.ctx.meta.state.inited.state) {
        return self._bean_render_original.call(this, ...args);
      }
      const render = self._getRender();
      if (!render) {
        return self._bean_render_original.call(this, ...args);
        // throw new Error('render bean not found');
      }
      return render.render();
      // need not set currentRenderingInstance on server for better performance
      // if (process.env.SERVER) {
      //   return withCtx(() => {
      //     return render.render();
      //   }, instance)();
      // } else {
      //   return render.render();
      // }
    };
    instance.type.ssrRender = null;
    instance.ssrRender = null;
  }

  /** @internal */
  public dispose() {
    const renderMethod = 'render';
    const instance = cast(this.ctx.instance);
    instance[renderMethod] = this._bean_render_original;
    this._bean_render_original = null;
  }

  private _getRender(): any {
    const render = this.bean._getBeanSyncOnly<BeanControllerBase>(BeanControllerIdentifier);
    if (!render) return;
    render.__updateControllerData?.();
    if ((render as any).render) return render;
    return this.bean._getBeanSyncOnly(BeanRenderIdentifier);
  }
}
