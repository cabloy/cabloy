import type { ViteHotContext } from 'vite/types/hot.js';

import type { TypeModuleResourceConfig } from '../../types/interface/module.ts';
import type { PluginZovaOptions } from '../../types/interface/pluginZova.ts';
import type { ZovaConfigEnv } from '../../types/utils/env.ts';
import type { ZovaConfig } from './config.ts';
import type { ZovaConstant } from './constant.ts';

import { BeanContainer } from '../../bean/beanContainer.ts';
import { cast } from '../../types/utils/cast.ts';
import { zodEnhanceSys } from '../../utils/zod-enhance.ts';
import { configDefault } from './config.ts';
import { constantDefault } from './constant.ts';
import { SysMeta } from './meta.ts';
import { appResource } from './resource.ts';
import { setSys } from './sysFake.ts';
import { deepExtend, SysUtil } from './util.ts';

const SymbolSysInitializePromise = Symbol('SymbolSysInitializePromise');
const SymbolSysClose = Symbol('SymbolSysClose');

export class ZovaSys {
  private [SymbolSysInitializePromise]: Promise<void> | undefined;
  private [SymbolSysClose]: boolean;
  bean: BeanContainer;
  util: SysUtil;
  meta: SysMeta;
  config: ZovaConfig;
  configOriginal: Partial<ZovaConfig>;
  env: ZovaConfigEnv;
  constant: ZovaConstant;

  constructor() {
    // zod
    zodEnhanceSys();
  }

  /** @internal */

  public async initialize(
    { modulesMeta, locales, config, env, viteHot, SysMonkey, legacyRoutes }: PluginZovaOptions,
    envRuntime?: Partial<ZovaConfigEnv>,
  ) {
    if (!this[SymbolSysInitializePromise]) {
      this[SymbolSysInitializePromise] = this._initializeInner(
        { modulesMeta, locales, config, env, viteHot, SysMonkey, legacyRoutes },
        envRuntime,
      );
    }
    return this[SymbolSysInitializePromise];
  }

  private async _initializeInner(
    { modulesMeta, locales, config, env, viteHot, SysMonkey, legacyRoutes }: PluginZovaOptions,
    envRuntime?: Partial<ZovaConfigEnv>,
  ) {
    // maybe init again
    this[SymbolSysClose] = false;
    // init
    this.bean = BeanContainer.create(this, null!, null);
    this.util = this.bean._newBeanSimple(SysUtil, false);
    this.meta = this.bean._newBeanSimple(SysMeta, false);
    // env
    this.env = this._prepareEnv(env, envRuntime);
    // monkey
    await this.meta.initialize(SysMonkey, legacyRoutes);
    // component
    await this.meta.component.initialize();
    // locales
    await this.meta.locale.initialize(locales);
    // errors
    await this.meta.error.initialize();
    // // config
    this.config = await this._combineConfig(config);
    this.configOriginal = { modules: {} } as any;
    // constant
    this.constant = constantDefault;
    // module
    await this.meta.module.initialize(modulesMeta);
    // monkey: sysInitialize
    await this.meta.module._monkeyModule(true, 'sysInitialize');
    // monkey: sysInitialized
    await this.meta.module._monkeyModule(true, 'sysInitialized');
    // monkey: sysReady
    await this.meta.module._monkeyModule(true, 'sysReady');
    // hookClose
    this._hookClose(viteHot);
  }

  private _hookClose(viteHot: ViteHotContext) {
    if (process.env.DEV && viteHot) {
      const hook = _payload => {
        this.close();
        viteHot.off('vite:beforeFullReload', hook);
      };
      viteHot.on('vite:beforeFullReload', hook);
    }
    if (process.env.CLIENT && typeof window !== 'undefined') {
      const hook = () => {
        this.close();
        window.removeEventListener('beforeunload', hook);
      };
      window.addEventListener('beforeunload', hook);
    }
  }

  public close() {
    if (this[SymbolSysClose]) return;
    this[SymbolSysClose] = true;
    // monkey: sysClose
    this.meta.module._monkeyModuleSync(false, 'sysClose');
    // container dispose
    this.bean.dispose();
    // meta dispose
    this.meta.dispose();
    // appResource
    appResource.dispose();
    // init promise
    this[SymbolSysInitializePromise] = undefined;
  }

  private async _combineConfig(config: TypeModuleResourceConfig[]): Promise<ZovaConfig> {
    const _config = deepExtend({}, configDefault(this.env));
    for (const configFn of config) {
      deepExtend(_config, await configFn(this));
    }
    return _config;
  }

  // eslint-disable-next-line no-undef
  private _prepareEnv(env: NodeJS.ProcessEnv, envRuntime?: Partial<ZovaConfigEnv>): ZovaConfigEnv {
    const env2 = this._prepareEnv_Runtime(env, envRuntime);
    const env3 = this._prepareEnv_Client(env2 as any);
    return env3;
  }

  // eslint-disable-next-line no-undef
  private _prepareEnv_Runtime(
    env: NodeJS.ProcessEnv,
    envRuntime?: Partial<ZovaConfigEnv>,
  ): ZovaConfigEnv {
    return _mergeEnv(env, envRuntime);
  }

  // eslint-disable-next-line no-undef
  private _prepareEnv_Client(env: NodeJS.ProcessEnv): ZovaConfigEnv {
    if (process.env.SERVER || !cast(window).__INITIAL_STATE__)
      return env as unknown as ZovaConfigEnv;
    const ssrState = cast(window).__INITIAL_STATE__;
    return _mergeEnv(env, ssrState.envClient);
  }
}

// eslint-disable-next-line no-undef
function _mergeEnv(env: NodeJS.ProcessEnv, envRuntime?: Partial<ZovaConfigEnv>): ZovaConfigEnv {
  if (!envRuntime) return env as unknown as ZovaConfigEnv;
  const env2 = { ...env };
  for (const key of Object.keys(envRuntime)) {
    if (envRuntime[key] !== undefined) {
      env2[key] = envRuntime[key];
    }
  }
  return env2 as unknown as ZovaConfigEnv;
}

export const sys = new ZovaSys();
setSys(sys);
if (process.env.CLIENT) {
  window.sys = sys;
}
