import type { IModule } from '@cabloy/module-info';

import chalk from 'chalk';

import type {
  TypeModuleResourceLocaleModules,
  TypeModuleResourceLocales,
  VonaConfigEnv,
} from '../../types/index.ts';
import type { IAppMonkey } from '../../types/interface/monkey.ts';
import type { ErrorClass, IBeanScopeConfig, IModuleLocaleText } from '../bean/index.ts';
import type { AppMetadata } from './metadata.ts';
import type { AppResource } from './resource.ts';

import { EnumAppEvent } from '../../types/index.ts';
import { BeanSimple } from '../bean/beanSimple.ts';
import { AppLocale, BeanScopeContainer } from '../bean/index.ts';
import { CtxCounter } from './ctxCounter.ts';
import { AppHmr } from './hmr.ts';
import { AppLogger } from './logger/appLogger.ts';
import { appMetadata } from './metadata.ts';
import { appResource } from './resource.ts';

const SymbolClosePromise = Symbol('SymbolClosePromise');

export class AppMeta extends BeanSimple {
  env: VonaConfigEnv;
  ctxCounter: CtxCounter;
  isProd: boolean;
  isTest: boolean;
  isDev: boolean;
  error: ErrorClass;
  logger: AppLogger;
  locale: AppLocale;
  hmr: AppHmr;
  text: IModuleLocaleText;
  scopeContainer: BeanScopeContainer;
  appMonkey?: IAppMonkey;
  //
  resource: AppResource;
  metadata: AppMetadata;
  //
  modules: Record<string, IModule>;
  modulesArray: IModule[];
  modulesMonkey: IModule[];
  //
  constants: Record<string, any>;
  locales: TypeModuleResourceLocales;
  localeModules: TypeModuleResourceLocaleModules;
  //
  hmrCacheLocaleModules: TypeModuleResourceLocaleModules;
  hmrCacheConfigModules: IBeanScopeConfig;
  //
  appReady: boolean;
  appReadyInstances: Record<string, boolean>;
  //
  appStarted: boolean;
  appStartError: Error;
  //
  appClose: boolean;
  appClosed: boolean;

  protected __init__(env: VonaConfigEnv) {
    // env
    this.env = env;
    this._prepareEnv();

    // ctxCounter
    this.ctxCounter = new CtxCounter();

    // appMonkey
    this.appMonkey = this.app.options.AppMonkey ? new this.app.options.AppMonkey() : undefined;

    // logger
    this.logger = this.bean._newBean(AppLogger);

    // locale
    this.locale = this.bean._newBean(AppLocale);

    // hmr
    this.hmr = this.bean._newBean(AppHmr);

    // text
    this.text = this.locale.createLocaleText();

    // scopeContainer
    this.scopeContainer = this.bean._newBean(BeanScopeContainer);

    // resource
    this.resource = appResource;
    (this.resource as any).app = this.app;

    // metadata
    this.metadata = appMetadata;
  }

  private _prepareEnv() {
    const mode = this.env.META_MODE;
    this.isProd = mode === 'prod';
    this.isTest = mode === 'test';
    this.isDev = mode === 'dev';
  }

  async waitAppStarted() {
    return new Promise((resolve, reject) => {
      // check once
      if (this.appStarted) {
        resolve(true);
      }
      if (this.appStartError) {
        reject(this.appStartError);
      }
      // listen
      this.app.once(EnumAppEvent.AppStarted, () => {
        resolve(true);
      });
      this.app.once(EnumAppEvent.AppStartError, err => {
        reject(err);
      });
    });
  }

  async close() {
    if (!this[SymbolClosePromise]) {
      this[SymbolClosePromise] = this._closeInner();
    }
    return this[SymbolClosePromise];
  }

  private async _closeInner() {
    // should not call disconnect, which will cause channel closed
    // cluster.worker?.disconnect();
    // close server
    if (this.app.server) {
      this.app.server.close();
      // maybe hang up using await
      // await promisify(this.app.server.close).call(this.app.server);
    }
    // appClose
    this.appClose = true;
    // hook: appClose
    await this.app.util.monkeyModule(
      this.app.meta.appMonkey,
      this.app.meta.modulesMonkey,
      false,
      'appClose',
    );
    // ctx counter
    await this.app.meta.ctxCounter.awaitUntilZero();
    // appClosed
    this.appClosed = true;
    // hook: appClosed
    await this.app.util.monkeyModule(
      this.app.meta.appMonkey,
      this.app.meta.modulesMonkey,
      false,
      'appClosed',
    );
    // container dispose
    await this.app.bean.dispose();
    // logger dispose
    await this.app.meta.logger.dispose();
    // log
    if (this.app.meta.env.LOGGER_DUMMY !== 'true') {
      const message = `App shutdown gracefully: ${process.pid}`;
      // eslint-disable-next-line
      console.log(chalk.cyan(message));
    }
    // need not call process.exit
  }
}
