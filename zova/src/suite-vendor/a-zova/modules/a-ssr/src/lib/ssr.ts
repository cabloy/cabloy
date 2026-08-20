import type { ComponentInternalInstance, Ref, VNode } from 'vue';
import type { Functionable, ILocaleRecord, ZovaContext } from 'zova';

import { RouteLocationNormalizedGeneric, RouteLocationResolvedGeneric } from '@cabloy/vue-router';
import { includeBooleanAttr, isBooleanAttr, isString, stringifyStyle } from '@vue/shared';
import { defu } from 'defu';
import { normalizeClass, normalizeStyle, ref, useSSRContext } from 'vue';
import { BeanSimple } from 'zova';

import type { SysSsrState } from '../bean/sys.ssrState.js';
import type {
  ISsrProfileOptions,
  ISsrRouteProfileOptions,
  OnHydratePropHasMismatch,
  OnHydratePropHasMismatchResult,
  SSRContext,
  TypeSsrProfile,
  TypeSsrSitePerformAction,
} from '../types/ssr.js';

import { CtxSSRMetaStore } from './ssrMetaStore.js';
import { resolveSsrProfile, resolveSsrProfileOptions } from './ssrProfile.js';

const SymbolIsRuntimeSsrPreHydration = Symbol('SymbolIsRuntimeSsrPreHydration');
const SymbolSSRContext = Symbol('SymbolSSRContext');
const SymbolSSRState = Symbol('SymbolSSRState');
const SymbolOnHydrateds = Symbol('SymbolOnHydrateds');
const SymbolOnHydratePropHasMismatches = Symbol('SymbolOnHydratePropHasMismatches');
const SymbolInstanceUpdates = Symbol('SymbolInstanceUpdates');
const SymbolHydratingCounter = Symbol('SymbolHydratingCounter');
const SymbolServerContexts = Symbol('SymbolServerContexts');

export class CtxSSR extends BeanSimple {
  private [SymbolIsRuntimeSsrPreHydration]: Ref<boolean> = ref(false);
  private [SymbolSSRContext]: SSRContext;
  private [SymbolSSRState]: SysSsrState;
  private [SymbolOnHydrateds]: Functionable[] = [];
  private [SymbolOnHydratePropHasMismatches]: OnHydratePropHasMismatch[] = [];
  private [SymbolInstanceUpdates]: ComponentInternalInstance[] = [];

  private [SymbolHydratingCounter]: number = 0;
  private [SymbolServerContexts]: Set<ZovaContext> = new Set();

  public metaStore: CtxSSRMetaStore;

  /** @internal */
  public initialize() {
    if (process.env.SERVER) {
      this._serverContextRegister();
    }
    // ssr state
    this[SymbolSSRState] = this.sys.bean._getBeanSyncOnly('a-ssr.sys.ssrState');
    // SymbolIsRuntimeSsrPreHydration
    if (process.env.SERVER) {
      this[SymbolIsRuntimeSsrPreHydration].value = true;
    } else if (process.env.CLIENT && document.body.getAttribute('data-server-rendered') !== null) {
      this[SymbolIsRuntimeSsrPreHydration].value = true;
    }
    // onHydratePropHasMismatch
    if (process.env.CLIENT && this.isRuntimeSsrPreHydration) {
      this.onHydratePropHasMismatch((el, key, clientValue, vnode, instance) => {
        return this._onHydratePropHasMismatchDefault(el, key, clientValue, vnode, instance);
      });
    }
    // metaStore
    this.metaStore = this.bean._newBeanSimple(CtxSSRMetaStore, false);
    // fix: flash on page load
    //    need not check process.env.DEV, because maybe need remove vite-css-module-id on prod
    if (process.env.CLIENT && this.isRuntimeSsrPreHydration) {
      this.onHydrated(() => {
        document.querySelectorAll('style[vite-css-module-id]').forEach(node => node.remove());
      });
    }
  }

  private _serverContextRegister(currentContext: ZovaContext = this.ctx) {
    const serverContexts = this[SymbolServerContexts];
    serverContexts.add(currentContext);
    this.context.onRendered(() => {
      serverContexts.delete(currentContext);
    });
  }

  private _serverContextsDispose() {
    const serverContexts = this[SymbolServerContexts];
    for (const serverContext of serverContexts) {
      if (serverContext.disposed) continue;
      if (serverContext.bean && serverContext.bean !== serverContext.app?.bean) {
        serverContext.bean.dispose();
      }
      serverContext.dispose();
    }
    serverContexts.clear();
  }

  get isRuntimeSsrPreHydration() {
    return this[SymbolIsRuntimeSsrPreHydration].value;
  }

  get isRuntimeSsrHydrated() {
    return process.env.CLIENT && !this.isRuntimeSsrPreHydration;
  }

  set isRuntimeSsrPreHydration(value) {
    this[SymbolIsRuntimeSsrPreHydration].value = value;
  }

  get context() {
    if (process.env.CLIENT) throw new Error('cannot called in client');
    if (!this[SymbolSSRContext]) {
      this.ctx.util.instanceScope(() => {
        this[SymbolSSRContext] = useSSRContext()!;
        this._initContext();
      });
    }
    return this[SymbolSSRContext];
  }

  get state() {
    if (process.env.SERVER) {
      return this.context.state;
    } else {
      return this[SymbolSSRState].state;
    }
  }

  get stateDefer() {
    if (process.env.SERVER) {
      return this.context.stateDefer;
    } else {
      return this[SymbolSSRState].stateDefer;
    }
  }

  get profile(): TypeSsrProfile {
    return resolveSsrProfile(this.state.ssrProfile, this.sys.env.SSR_PROFILE);
  }

  get profileOptions(): Readonly<ISsrProfileOptions> {
    const profileOptions = this.state.ssrProfileOptions;
    if (profileOptions) return profileOptions;
    return resolveSsrProfileOptions(this.profile, this.sys.config.ssr.profiles);
  }

  /** @internal */
  public _setProfile(
    routeProfile: TypeSsrProfile | undefined,
    routeProfileOptions?: Readonly<ISsrRouteProfileOptions>,
  ) {
    const ssrProfile = resolveSsrProfile(routeProfile, this.sys.env.SSR_PROFILE);
    const ssrProfileOptions = resolveSsrProfileOptions(
      ssrProfile,
      this.sys.config.ssr.profiles,
      routeProfileOptions,
    );
    this.state.ssrProfile = ssrProfile;
    this.state.ssrProfileOptions = ssrProfileOptions;
  }

  /** @internal */
  public _setLocale(route: RouteLocationResolvedGeneric | RouteLocationNormalizedGeneric) {
    if (route.meta.locale) {
      this.app.meta.locale.current = route.params?.locale as unknown as keyof ILocaleRecord;
    }
  }

  get cookieDisabledOnServer(): boolean {
    return process.env.SERVER && !this.profileOptions.useCookie;
  }

  get renderSSRError() {
    return this.context._meta.renderError;
  }

  set renderSSRError(err: any) {
    this.context._meta.renderError = err;
  }

  getPerformAction(baseURL?: string): TypeSsrSitePerformAction | undefined {
    if (process.env.SERVER && baseURL === this.sys.env.SSR_API_BASE_URL)
      return this.context.performAction;
    return undefined;
  }

  private _initContext() {
    const ssrContext = this[SymbolSSRContext];
    ssrContext._meta = defu(ssrContext._meta, {
      htmlAttrs: '',
      headTags: '',
      endingHeadTags: '',
      bodyClasses: '',
      bodyAttrs: 'data-server-rendered',
      bodyTags: '',
      endingBodyTags: '',
      baseUrl: this.sys.util.getAbsoluteUrlFromPagePath(undefined, false, true), // not include publicPath
    });
    ssrContext.state = ssrContext.state || {};
    ssrContext.stateDefer = ssrContext.stateDefer || {};
  }

  /**
   * Registers a callback that runs after initial client SSR hydration completes.
   * It does not run for SPA startup or later client navigation.
   */
  onHydrated(fn: Functionable) {
    this[SymbolOnHydrateds].push(fn);
  }

  onHydratePropHasMismatch(fn: OnHydratePropHasMismatch) {
    this[SymbolOnHydratePropHasMismatches].push(fn);
  }

  handleDirectOrOnHydrated(fn: Functionable) {
    if (process.env.CLIENT && this.isRuntimeSsrPreHydration) {
      this.onHydrated(fn);
    } else {
      return fn();
    }
  }

  private _onHydratePropHasMismatchDefault(
    el: Element,
    key: string,
    clientValue: any,
    _vnode: VNode,
    _instance: ComponentInternalInstance | null,
  ): OnHydratePropHasMismatchResult {
    // expected
    let ignore = false;
    let expected: string | undefined;
    if (key === 'class') {
      ignore = true;
      if (clientValue !== undefined) {
        expected = normalizeClass(clientValue);
        el.setAttribute(key, expected as string);
      }
    } else if (key === 'style') {
      ignore = true;
      if (clientValue !== undefined) {
        expected = isString(clientValue)
          ? clientValue
          : stringifyStyle(normalizeStyle(clientValue));
        el.setAttribute(key, expected as string);
      }
    } else if (['id', 'name', 'for', 'd', 'aria-labelledby', 'aria-controls'].includes(key)) {
      ignore = true;
      if (clientValue !== undefined) {
        expected = String(clientValue);
        el.setAttribute(key, expected as string);
      }
    } else if (key === 'value') {
      ignore = true;
      if (clientValue !== undefined) {
        expected = String(clientValue);
        if (el.tagName === 'TEXTAREA') {
          (<any>el).value = expected;
        } else {
          el.setAttribute(key, expected as string);
        }
      }
    } else if (isBooleanAttr(key)) {
      ignore = true;
      if (clientValue !== undefined) {
        const expected = includeBooleanAttr(clientValue);
        if (expected) {
          el.setAttribute(key, '');
        } else {
          el.removeAttribute(key);
        }
      }
    } else if (el.getAttribute(`data-hydrate-ignore-${key}`) !== null) {
      ignore = true;
      if (clientValue !== undefined) {
        expected = String(clientValue);
        el.setAttribute(key, expected as string);
      }
    }
    if (!ignore) return { clientValue };
    return { ignore: true };
  }

  private _hydrated() {
    if (!this.isRuntimeSsrPreHydration) return;
    // should be first
    this.isRuntimeSsrPreHydration = false;
    //
    this[SymbolInstanceUpdates].forEach(instance => {
      if (!instance.isUnmounted && instance.zova) {
        try {
          instance.update();
        } catch (err: any) {
          if (!err.message.includes("'insertBefore'")) {
            throw err;
          }
        }
      }
    });
    this[SymbolInstanceUpdates] = [];
    //
    this[SymbolOnHydrateds].forEach(fn => fn());
    this[SymbolOnHydrateds] = [];
    //
    this[SymbolOnHydratePropHasMismatches] = [];
  }

  /** @internal */
  public _hydratePropHasMismatch(
    el: Element,
    key: string,
    clientValue: any,
    vnode: VNode,
    instance: ComponentInternalInstance | null,
  ): OnHydratePropHasMismatchResult {
    for (const fn of this[SymbolOnHydratePropHasMismatches]) {
      const res = fn(el, key, clientValue, vnode, instance);
      if (res.ignore) return res;
      clientValue = res.clientValue;
    }
    return { ignore: false, clientValue };
  }

  /** @internal */
  public _hydratingRootInc() {
    if (process.env.CLIENT && this.isRuntimeSsrPreHydration) {
      this._hydratingInc();
    }
  }

  /** @internal */
  public _hydratingRootDec() {
    if (process.env.CLIENT && this.isRuntimeSsrPreHydration) {
      this._hydratingDec();
    }
  }

  /** @internal */
  public _hydratingInc() {
    ++this[SymbolHydratingCounter];
  }

  /** @internal */
  public _hydratingDec() {
    if (--this[SymbolHydratingCounter] === 0) {
      this._hydrated();
    }
  }

  /** @internal */
  public _hydratingInstanceRecord(instance: ComponentInternalInstance) {
    if (!this[SymbolInstanceUpdates].includes(instance)) {
      this[SymbolInstanceUpdates].push(instance);
      return true;
    }
    return false;
  }

  /** @internal */
  public _registerServerContext(currentContext: ZovaContext) {
    this._serverContextRegister(currentContext);
  }

  /** @internal */
  public _disposeServerContexts() {
    this._serverContextsDispose();
  }
}
