import { BeanSimple } from '../../bean/beanSimple.ts';

export type ZovaHookType = 'created' | 'mounted';

export const SymbolHooksFns = Symbol('SymbolHooksFns');
export const SymbolHooksState = Symbol('SymbolHooksState');

export class CtxHooks extends BeanSimple {
  private [SymbolHooksFns]: Record<ZovaHookType, Array<any> | undefined> = {} as any;
  private [SymbolHooksState]: Record<ZovaHookType, boolean> = {} as any;

  /** @internal */
  public dispose() {
    this[SymbolHooksFns] = undefined as any;
  }

  onCreated(fn: any) {
    this._onHook('created', fn);
  }

  onMounted(fn: any) {
    this._onHook('mounted', fn);
  }

  private _onHook(type: ZovaHookType, fn: any) {
    if (this[SymbolHooksState][type]) {
      this.ctx.util.instanceScope(fn);
    } else {
      if (!this[SymbolHooksFns][type]) {
        this[SymbolHooksFns][type] = [];
      }
      this[SymbolHooksFns][type].push(fn);
    }
  }

  /** @internal */
  public async invokeHook(type: ZovaHookType) {
    this[SymbolHooksState][type] = true;
    const fns = this[SymbolHooksFns][type];
    if (!fns) return;
    this[SymbolHooksFns][type] = undefined;
    for (const fn of fns) {
      await this.ctx.util.instanceScope(fn);
    }
  }
}
