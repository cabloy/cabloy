import type { BeanControllerBase } from '../../bean/beanControllerBase.ts';

import { BeanSimple } from '../../bean/beanSimple.ts';
import { BeanControllerIdentifier, BeanRenderIdentifier } from '../../bean/type.ts';
import { cast } from '../../types/utils/cast.ts';

const SymbolTypeSSRRenderOriginal = Symbol('SymbolTypeSSRRenderOriginal');
const SymbolTypeSSRRenderResetCount = Symbol('SymbolTypeSSRRenderResetCount');

export class CtxComponent extends BeanSimple {
  private _bean_render_original: any;
  private _instance_ssrRender_original: any;
  private _renderPatched = false;
  private _ssrRenderReset = false;

  activate() {
    if (this.ctx.disposed) return;
    const renderMethod = 'render';
    const instance = cast(this.ctx.instance);
    this._bean_render_original = instance[renderMethod];
    const self = this;
    instance[renderMethod] = function (this, ...args) {
      if (instance.isUnmounted) return;
      const loadStatus = self.ctx.meta.state.loadStatus;
      if (loadStatus === 'loading') {
        return self.ctx.meta.state.loadLoadingVisible ? self._renderLoading() : null;
      }
      if (loadStatus === 'error') {
        return self._renderError(self.ctx.meta.state.loadError);
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
    this._renderPatched = true;
    const componentType = cast(instance.type);
    const ssrRenderResetCount = componentType[SymbolTypeSSRRenderResetCount] ?? 0;
    if (ssrRenderResetCount === 0) {
      componentType[SymbolTypeSSRRenderOriginal] = componentType.ssrRender;
      componentType.ssrRender = null;
    }
    componentType[SymbolTypeSSRRenderResetCount] = ssrRenderResetCount + 1;
    this._instance_ssrRender_original = instance.ssrRender;
    instance.ssrRender = null;
    this._ssrRenderReset = true;
  }

  /** @internal */
  public dispose() {
    const renderMethod = 'render';
    const instance = cast(this.ctx.instance);
    if (this._renderPatched) {
      instance[renderMethod] = this._bean_render_original;
    }
    if (this._ssrRenderReset) {
      instance.ssrRender = this._instance_ssrRender_original;
      const componentType = cast(instance.type);
      const ssrRenderResetCount = componentType[SymbolTypeSSRRenderResetCount] ?? 0;
      if (ssrRenderResetCount <= 1) {
        componentType.ssrRender = componentType[SymbolTypeSSRRenderOriginal];
        componentType[SymbolTypeSSRRenderOriginal] = undefined;
        componentType[SymbolTypeSSRRenderResetCount] = 0;
      } else {
        componentType[SymbolTypeSSRRenderResetCount] = ssrRenderResetCount - 1;
      }
    }
    this._bean_render_original = null;
    this._instance_ssrRender_original = null;
    this._renderPatched = false;
    this._ssrRenderReset = false;
  }

  private _renderLoading() {
    const renderMode = this.ctx.meta.state.loadRenderMode;
    const controller = this.ctx.meta.state.loadController as any;
    if (controller?.renderLoading) {
      return controller.renderLoading(renderMode);
    }
    const renderLoading = this.sys.config.boundary.renderLoading;
    return renderLoading?.(this.ctx, renderMode) ?? null;
  }

  private _renderError(error: unknown) {
    const renderMode = this.ctx.meta.state.loadRenderMode;
    const retry = this.ctx.meta.state.loadRetry;
    const controller = this.ctx.meta.state.loadController as any;
    if (controller?.renderError) {
      return controller.renderError(error, renderMode, retry);
    }
    const renderError = this.sys.config.boundary.renderError;
    if (renderError) {
      return renderError(this.ctx, error, renderMode, retry);
    }
    return _renderErrorDefault(error);
  }

  private _getRender(): any {
    const render = this.bean._getBeanSyncOnly<BeanControllerBase>(BeanControllerIdentifier);
    if (!render) return;
    render.__updateControllerData?.();
    if ((render as any).render) return render;
    return this.bean._getBeanSyncOnly(BeanRenderIdentifier);
  }
}

function _renderErrorDefault(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
